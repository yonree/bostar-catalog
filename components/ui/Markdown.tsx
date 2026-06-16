function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(text: string): string {
  const codeStore: string[] = [];
  let escaped = escapeHtml(text);

  escaped = escaped.replace(/`([^`]+)`/g, (_match, code) => {
    const token = `__INLINE_CODE_${codeStore.length}__`;
    codeStore.push(`<code>${code}</code>`);
    return token;
  });

  escaped = escaped.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (_match, alt, src) => {
    return `<img src="${src}" alt="${alt}" class="my-4 rounded" />`;
  });

  escaped = escaped.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (_match, label, href) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/__(.+?)__/g, '<strong>$1</strong>');
  escaped = escaped.replace(/~~(.+?)~~/g, '<del>$1</del>');
  escaped = escaped.replace(/(^|[^\*])\*([^\*].*?[^\*])\*(?!\*)/g, '$1<em>$2</em>');
  escaped = escaped.replace(/(^|[^_])_([^_].*?[^_])_(?!_)/g, '$1<em>$2</em>');

  escaped = escaped.replace(/&lt;(u|sub|sup)&gt;([\s\S]*?)&lt;\/\1&gt;/g, '<$1>$2</$1>');

  return codeStore.reduce(
    (result, codeHtml, index) => result.replace(`__INLINE_CODE_${index}__`, codeHtml),
    escaped
  );
}

function isTableSeparator(line: string) {
  const trimmed = line.trim();
  return /^\|?[\s:-]+(?:\|[\s:-]+)+\|?$/.test(trimmed);
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function renderMarkdownHtml(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(escapeHtml(lines[index]));
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(`<pre><code>${codeLines.join('\n')}</code></pre>`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push('<hr />');
      index += 1;
      continue;
    }

    if (index + 1 < lines.length && rawLine.includes('|') && isTableSeparator(lines[index + 1])) {
      const header = splitTableRow(rawLine);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      blocks.push(
        `<div class="my-4 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr>${header
          .map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`)
          .join('')}</tr></thead><tbody>${rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`).join('')}</tr>`
          )
          .join('')}</tbody></table></div>`
      );
      continue;
    }

    const unorderedMatch = rawLine.match(/^\s*[-*]\s+(.+)$/);
    if (unorderedMatch) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*[-*]\s+(.+)$/);
        if (!match) break;
        items.push(`<li>${renderInlineMarkdown(match[1])}</li>`);
        index += 1;
      }
      blocks.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const orderedMatch = rawLine.match(/^\s*\d+\.\s+(.+)$/);
    if (orderedMatch) {
      const items: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*\d+\.\s+(.+)$/);
        if (!match) break;
        items.push(`<li>${renderInlineMarkdown(match[1])}</li>`);
        index += 1;
      }
      blocks.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    const quoteMatch = rawLine.match(/^\s*>\s?(.+)$/);
    if (quoteMatch) {
      const quoted: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*>\s?(.+)$/);
        if (!match) break;
        quoted.push(renderInlineMarkdown(match[1]));
        index += 1;
      }
      blocks.push(`<blockquote>${quoted.join('<br />')}</blockquote>`);
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && lines[index].trim()) {
      const current = lines[index].trim();
      const startsNewBlock =
        current.startsWith('```') ||
        /^(#{1,6})\s+/.test(current) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(current) ||
        /^\s*[-*]\s+/.test(lines[index]) ||
        /^\s*\d+\.\s+/.test(lines[index]) ||
        /^\s*>\s?/.test(lines[index]) ||
        (index + 1 < lines.length && lines[index].includes('|') && isTableSeparator(lines[index + 1]));
      if (paragraphLines.length > 0 && startsNewBlock) break;
      paragraphLines.push(renderInlineMarkdown(current));
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push(`<p>${paragraphLines.join('<br />')}</p>`);
      continue;
    }

    index += 1;
  }

  return blocks.join('\n');
}

export function markdownToPlainText(md: string): string {
  return renderMarkdownHtml(md)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function Markdown({
  children,
  className = '',
  inline = false,
}: {
  children: string;
  className?: string;
  inline?: boolean;
}) {
  if (!children) return null;

  let __html = renderMarkdownHtml(children);
  if (inline) {
    __html = __html
      .replace(/<\/?p>/g, '')
      .replace(/<\/?(ul|ol|li|blockquote|h[1-6]|pre)>/g, '')
      .replace(/<br \/>/g, ' ');
  }

  const Tag = inline ? 'span' : 'div';
  return <Tag className={`prose max-w-none ${className}`} dangerouslySetInnerHTML={{ __html }} />;
}
