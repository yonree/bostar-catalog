'use client';

import { useCallback } from 'react';

// ============================================================================
// Word / WPS 冗余 HTML 预清洗
// ============================================================================

function stripWordCruft(html: string): string {
  return html
    // 移除 Word 条件注释 <!--[if ...]>...[endif]-->
    .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/g, '')
    // 移除 HTML 注释
    .replace(/<!--[\s\S]*?-->/g, '')
    // 移除 <o:p> Office 命名空间标签
    .replace(/<\/?o:p[^>]*>/gi, '')
    // 移除 XML 声明和处理指令
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    // 移除 Word 嵌入的样式块
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // 移除 class 和非 style 的外观属性（保留 style 供后续 span 检测用）
    .replace(/\s+(?:class|width|height|align|valign|bgcolor|border|cellpadding|cellspacing|frame|rules|lang|dir|data-[\w-]+|aria-[\w-]+)=["'][^"']*["']/gi, '')
    // 移除 mso-* 相关属性
    .replace(/\s+mso-[\w-]+=["'][^"']*["']/gi, '')
    // 折叠连续空白（减小体积，加速解析）
    .replace(/>\s+</g, '><')
    .trim();
}

// ============================================================================
// HTML → Markdown 转换规则
//
// 块级元素（前后换行）：
//   <h1>~<h6>  →  # ~ ######
//   <p>/<div>   →  段落（双换行分隔）
//   <br>        →  单换行
//   <hr>        →  ---
//   <blockquote> →  > 前缀
//   <pre>       →  ``` 代码块 ```
//   <ul>/<ol>   →  - / 1. 列表
//   <table>     →  GFM 表格 | col | col |
//   <li>        →  列表项（由父容器决定前缀）
//
// 内联元素（不换行）：
//   <b>/<strong> →  **text**
//   <i>/<em>    →  *text*
//   <u>         →  <u>text</u>（无标准 MD 语法）
//   <s>/<del>   →  ~~text~~
//   <code>      →  `text`
//   <a>         →  [text](href)
//   <img>       →  ![alt](src)
//   <sub>/<sup> →  <sub>/<sup>（保留 HTML）
//
// 过滤规则：
//   - SCRIPT/STYLE/META/LINK/HEAD/TITLE 及其内容全部丢弃
//   - 空段落自动压缩
//   - file:// 协议的图片跳过
//   - 无 href 的 <a> 标签退化为纯文本
//   - 连续 3 个以上空行压缩为 2 个
// ============================================================================

const INLINE_TAGS: Record<string, [string, string] | null> = {
  b: ['**', '**'],
  strong: ['**', '**'],
  i: ['*', '*'],
  em: ['*', '*'],
  u: ['<u>', '</u>'],
  s: ['~~', '~~'],
  del: ['~~', '~~'],
  strike: ['~~', '~~'],
  sub: ['<sub>', '</sub>'],
  sup: ['<sup>', '</sup>'],
  code: ['`', '`'],
  a: null,
  img: null,
};

const BLOCK_PREFIX: Record<string, string> = {
  h1: '# ',
  h2: '## ',
  h3: '### ',
  h4: '#### ',
  h5: '##### ',
  h6: '###### ',
};

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'META', 'LINK', 'NOSCRIPT', 'TEMPLATE',
  'HEAD', 'TITLE', 'IFRAME', 'OBJECT', 'EMBED', 'APPLET',
]);

function walkNodes(nodes: NodeList | Node[], indent = ''): string {
  let result = '';
  const children = Array.from(nodes as Iterable<Node>);

  for (const node of children) {
    const tag = (node as Element).nodeName || '';

    if (SKIP_TAGS.has(tag)) continue;

    // 文本节点
    if (node.nodeType === Node.TEXT_NODE) {
      result += (node as Text).textContent || '';
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const el = node as HTMLElement;

    // Word/WPS 常用 <span style="font-weight:bold"> 代替 <b>/<strong>
    if (tag === 'SPAN') {
      if (!el.textContent || !el.textContent.trim()) continue;

      const style = el.getAttribute('style') || '';
      let spanWrapper: [string, string] | null = null;

      if (/\bfont-weight\s*:\s*(bold|[67]\d{2})\b/i.test(style)) {
        spanWrapper = ['**', '**'];
      } else if (/\bfont-style\s*:\s*italic\b/i.test(style)) {
        spanWrapper = ['*', '*'];
      } else if (/\btext-decoration\s*:\s*underline\b/i.test(style)) {
        spanWrapper = ['<u>', '</u>'];
      } else if (/\btext-decoration\s*:\s*line-through\b/i.test(style)) {
        spanWrapper = ['~~', '~~'];
      }

      if (spanWrapper) {
        result += spanWrapper[0] + walkNodes(el.childNodes, indent) + spanWrapper[1];
        continue;
      }

      // 普通 span（无格式语义），仅递归子节点
      result += walkNodes(el.childNodes, indent);
      continue;
    }

    // ---- 列表 ----
    if (tag === 'UL' || tag === 'OL') {
      const items = el.querySelectorAll(':scope > li');
      let idx = 0;
      items.forEach((li) => {
        const prefix = tag === 'OL' ? `${++idx}. ` : '- ';
        const body = walkNodes(li.childNodes, indent + '  ')
          .trim()
          .split('\n')
          .map((line, li) => (li === 0 ? '' : indent + '  ') + line)
          .join('\n');
        result += `\n${indent}${prefix}${body}`;
      });
      result += '\n';
      continue;
    }

    // ---- 表格 ----
    if (tag === 'TABLE') {
      const rows = el.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tr');
      const rowData: string[][] = [];
      rows.forEach((tr) => {
        const cells = tr.querySelectorAll(':scope > th, :scope > td');
        rowData.push(Array.from(cells).map((cell) => cell.textContent?.trim() || ''));
      });
      if (rowData.length > 0) {
        const colCount = Math.max(...rowData.map((r) => r.length));
        result += '\n| ' + rowData[0].map((c) => c || ' ').join(' | ') + ' |\n';
        result += '| ' + Array(colCount).fill('---').join(' | ') + ' |\n';
        for (let r = 1; r < rowData.length; r++) {
          const padded = [...rowData[r]];
          while (padded.length < colCount) padded.push(' ');
          result += '| ' + padded.map((c) => c || ' ').join(' | ') + ' |\n';
        }
        result += '\n';
      }
      continue;
    }

    // ---- 标题 ----
    const prefix = BLOCK_PREFIX[tag.toLowerCase()];
    if (prefix) {
      result += `\n${prefix}${el.textContent?.trim() || ''}\n`;
      continue;
    }

    // ---- 引用 ----
    if (tag === 'BLOCKQUOTE') {
      const body = walkNodes(el.childNodes, indent).trim();
      result += '\n' + body.split('\n').map((line) => `> ${line}`).join('\n') + '\n';
      continue;
    }

    // ---- 代码块 ----
    if (tag === 'PRE') {
      result += `\n\`\`\`\n${el.textContent || ''}\n\`\`\`\n`;
      continue;
    }

    // ---- 水平线 ----
    if (tag === 'HR') {
      result += '\n---\n';
      continue;
    }

    // ---- 图片 ----
    if (tag === 'IMG') {
      const src = (el as HTMLImageElement).src || '';
      const alt = (el as HTMLImageElement).alt || 'image';
      if (src && !src.startsWith('file://') && !src.startsWith('blob:')) {
        result += `![${alt}](${src})`;
      }
      continue;
    }

    // ---- 链接 ----
    if (tag === 'A') {
      const href = (el as HTMLAnchorElement).href || '';
      const text = el.textContent?.trim() || href;
      result += href && !href.startsWith('javascript:') ? `[${text}](${href})` : text;
      continue;
    }

    // ---- 段落和块级 div ----
    if (tag === 'P' || tag === 'DIV') {
      const body = walkNodes(el.childNodes, indent).trim();
      if (body) result += `\n${body}\n`;
      continue;
    }

    // ---- 换行 ----
    if (tag === 'BR') {
      result += '\n';
      continue;
    }

    // ---- 内联格式 ----
    const wrapper = INLINE_TAGS[tag.toLowerCase()];
    if (wrapper) {
      result += wrapper[0] + walkNodes(el.childNodes, indent) + wrapper[1];
      continue;
    }

    // ---- 递归处理未知元素 ----
    result += walkNodes(el.childNodes, indent);
  }

  return result;
}

function polishMarkdown(raw: string): string {
  return raw
    .replace(/\n{3,}/g, '\n\n')       // 压缩连续空行
    .replace(/[ \t]+$/gm, '')          // 去行尾空格
    .replace(/^\n+/, '')               // 去开头空行
    .replace(/\n+$/, '')               // 去结尾空行
    .trim();
}

// ============================================================================
// 公共 API
// ============================================================================

/** 从 HTML 字符串提取并转换为 Markdown（无 DOM 副作用，纯函数） */
export function htmlToMarkdown(html: string): string {
  try {
    const clean = stripWordCruft(html);
    const doc = new DOMParser().parseFromString(clean, 'text/html');
    const root = doc.body || doc;
    return polishMarkdown(walkNodes(root.childNodes));
  } catch {
    return '';
  }
}

/**
 * React Hook：监听 textarea / input 粘贴事件，自动将 HTML 格式转为 Markdown。
 *
 * 使用方式：
 *   const onPaste = useMarkdownPaste();
 *   <textarea onPaste={onPaste} />
 *   <input onPaste={onPaste} />
 *
 * 行为：
 *   - 剪贴板含 HTML → 转 Markdown 插入光标位置，阻止默认粘贴
 *   - 剪贴板仅纯文本 → 不干预，走浏览器默认行为
 *   - 转换后触发 'input' 事件，确保 React 受控/非受控表单同步
 */
export function useMarkdownPaste(): (
  event: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>
) => void {
  return useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const clipboard = event.clipboardData;
      if (!clipboard) return;

      const html = clipboard.getData('text/html');
      if (!html) return; // 纯文本粘贴，不干预

      const markdown = htmlToMarkdown(html);
      if (!markdown) return;

      event.preventDefault();

      const el = event.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const before = el.value.slice(0, start);
      const after = el.value.slice(end);

      el.value = before + markdown + after;

      const newPos = start + markdown.length;
      el.setSelectionRange(newPos, newPos);

      // 派发 input 事件以同步 React 状态（受控组件）和浏览器撤销栈
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    []
  );
}
