#!/usr/bin/env node

/**
 * BOSTAR GEO 自动化回归测试脚本
 *
 * 用法:
 *   node scripts/smoke-regression.mjs                          # 测试 localhost:3000
 *   node scripts/smoke-regression.mjs http://localhost:3004     # 指定端口
 *   node scripts/smoke-regression.mjs https://www.fjbosd.com  # 测试生产环境
 *   node scripts/smoke-regression.mjs --ci                      # CI 模式（紧凑输出）
 */

const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:3000';
const IS_CI = process.argv.includes('--ci');

let passed = 0;
let failed = 0;
let skipped = 0;
const failures = [];

function color(code, text) {
  if (IS_CI) return text;
  return `\x1b[${code}m${text}\x1b[0m`;
}
const green = (t) => color(32, t);
const red = (t) => color(31, t);
const yellow = (t) => color(33, t);
const cyan = (t) => color(36, t);
const bold = (t) => color(1, t);

async function fetchUrl(path, opts = {}) {
  const { method = 'GET', body, expectedStatus = 200, label } = opts;
  const url = `${BASE}${path}`;
  const start = Date.now();
  try {
    const fetchOpts = { method, redirect: 'manual' };
    if (body) {
      fetchOpts.headers = { 'Content-Type': 'application/json' };
      fetchOpts.body = JSON.stringify(body);
    }
    const res = await fetch(url, fetchOpts);
    const ms = Date.now() - start;
    const status = res.status;
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = null; }

    if (status === expectedStatus) {
      passed++;
      if (!IS_CI) console.log(`  ${green('✓')} ${label || path} → ${green(String(status))} ${ms}ms`);
      return { ok: true, status, json, text };
    } else {
      failed++;
      failures.push({ path, expectedStatus, actualStatus: status, label });
      console.log(`  ${red('✗')} ${label || path} → ${red(String(status))} (expected ${expectedStatus}) ${ms}ms`);
      if (json?.message) console.log(`     body: ${json.message}`);
      return { ok: false, status, json, text };
    }
  } catch (err) {
    failed++;
    failures.push({ path, error: err.message, label });
    console.log(`  ${red('✗')} ${label || path} → ${red('ERR')} ${err.message}`);
    return { ok: false, status: 0, json: null, text: '' };
  }
}

async function assertContains(path, expectedSubstring, opts = {}) {
  const { label } = opts;
  const result = await fetchUrl(path, { ...opts, label });
  if (result.ok && !result.text.includes(expectedSubstring)) {
    failed++;
    passed--; // undo the +1 from fetchUrl
    failures.push({ path, issue: 'content mismatch', expected: expectedSubstring, label });
    console.log(`  ${red('✗')} ${label || path} → content missing "${expectedSubstring.slice(0, 40)}"`);
  }
}

// ─── 测试计划 ──────────────────────────────────────────────

const TESTS = {

  // ── 公开页面（全部应返回 200） ──
  pages: [
    { path: '/', label: '首页' },
    { path: '/about', label: '关于我们' },
    { path: '/contact', label: '联系我们' },
    { path: '/products', label: '产品中心' },
    { path: '/solutions', label: '解决方案' },
    { path: '/knowledge', label: '知识中心' },
    { path: '/faq', label: 'FAQ' },
    { path: '/cases', label: '案例列表' },
    { path: '/downloads', label: '资料下载' },
    { path: '/videos', label: '视频中心' },
    { path: '/service', label: '服务与支持' },
    { path: '/news', label: '新闻动态' },
    { path: '/search', label: '搜索页' },
    { path: '/admin/login', label: '管理后台登录页' },
  ],

  // ── SEO 路由 ──
  seo: [
    { path: '/robots.txt', label: 'robots.txt' },
    { path: '/sitemap.xml', label: 'sitemap.xml' },
  ],

  // ── 404 页面（应返回 404）──
  notFound: [
    { path: '/products/nonexistent/not-real', expectedStatus: 404, label: '不存在产品 → 404' },
    { path: '/knowledge/ghost/fake-article', expectedStatus: 404, label: '不存在文章 → 404' },
    { path: '/_nonexistent_page_', expectedStatus: 404, label: '不存在页面 → 404' },
  ],

  // ── API 接口 ──
  api: [
    { path: '/api/search?q=%E5%96%B7%E6%9E%AA', label: '搜索 API GET' },
    {
      path: '/api/leads',
      method: 'POST',
      body: { name: '回归测试', phone: '13800138000', sourcePage: '/smoke-test' },
      label: '询盘提交 POST',
    },
  ],

  // ── SEO 内容验证 ──
  content: [
    { path: '/robots.txt', substring: 'User-Agent', label: 'robots.txt 含 User-Agent' },
    { path: '/robots.txt', substring: 'Disallow: /admin/', label: 'robots.txt 禁止后台' },
    { path: '/sitemap.xml', substring: '<urlset', label: 'sitemap.xml 结构正确' },
    { path: '/sitemap.xml', substring: '<loc>', label: 'sitemap.xml 含路由' },
  ],
};

// ─── 主流程 ──────────────────────────────────────────────

async function main() {
  console.log(`\n${bold('BOSTAR GEO 回归测试')}`);
  console.log(`目标: ${cyan(BASE)}`);
  console.log(`时间: ${new Date().toISOString()}\n`);

  // 1. 公开页面
  console.log(bold('── 公开页面 ──'));
  for (const t of TESTS.pages) await fetchUrl(t.path, t);

  // 2. SEO 路由
  console.log(bold('\n── SEO 路由 ──'));
  for (const t of TESTS.seo) await fetchUrl(t.path, t);

  // 3. 404 验证
  console.log(bold('\n── 404 页面验证 ──'));
  for (const t of TESTS.notFound) await fetchUrl(t.path, t);

  // 4. API 接口
  console.log(bold('\n── API 接口 ──'));
  for (const t of TESTS.api) await fetchUrl(t.path, t);

  // 5. 内容验证
  console.log(bold('\n── SEO 内容验证 ──'));
  for (const t of TESTS.content) await assertContains(t.path, t.substring, t);

  // ─── 汇总 ────────────────────────────────────────────
  const total = passed + failed;
  console.log(`\n${bold('════════════════════════════════')}`);
  console.log(`${bold('结果汇总')}`);
  console.log(`  通过: ${green(String(passed))}/${total}`);
  if (skipped > 0) console.log(`  跳过: ${yellow(String(skipped))}`);
  if (failed > 0) {
    console.log(`  失败: ${red(String(failed))}/${total}`);
    console.log(`\n${red('失败详情:')}`);
    for (const f of failures) {
      console.log(
        `  - ${red(f.label || f.path)}: ${f.issue || `状态码 ${f.actualStatus} (期望 ${f.expectedStatus})`}`
      );
    }
  }
  console.log('════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(red(`\n脚本异常: ${err.message}`));
  process.exit(2);
});
