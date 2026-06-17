import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const manifestPath = path.join(repoRoot, 'planning', 'gate1a', 'url', 'url-decision-manifest.csv');
const urlResultsPath = path.join(repoRoot, 'GATE7_PRODUCTION_URL_RESULTS.csv');
const seoResultsPath = path.join(repoRoot, 'GATE7_SEO_RESULTS.csv');

const productionBaseUrl = process.env.GATE7_BASE_URL || 'https://www.bostarcoating.com';
const deploymentId = process.env.GATE7_DEPLOYMENT_ID || 'dpl_EGAsdvJjcZqgE9tHCdNkV85SoPYC';
const sitemapUrl = `${productionBaseUrl.replace(/\/+$/, '')}/sitemap.xml`;
const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36';

const requestHeaders = {
  'user-agent': userAgent,
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (char === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.replace(/\r$/, ''));
    rows.push(row);
  }

  const [header, ...body] = rows.filter((candidate) => candidate.some((value) => value !== ''));
  const normalizedHeader = header.map((value) => value.replace(/^\uFEFF/, '').trim());
  return body.map((values) =>
    Object.fromEntries(normalizedHeader.map((key, index) => [key, values[index] || '']))
  );
}

function escapeCsv(value) {
  const stringValue = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function writeCsv(filePath, rows, headers) {
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(','));
  }
  return fs.writeFile(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function normalizeComparableUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    url.hash = '';
    url.search = '';
    const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
    return `${url.protocol}//${url.host.toLowerCase()}${pathname || '/'}`;
  } catch {
    return String(value).trim();
  }
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFirst(text, pattern) {
  return decodeHtml(pattern.exec(text)?.[1] || '');
}

function extractAlternates(html) {
  const alternates = {};
  const pattern =
    /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*>/gi;

  for (const match of html.matchAll(pattern)) {
    alternates[match[1]] = match[2];
  }

  return alternates;
}

function collectSchemaTypes(value, bucket = new Set()) {
  if (!value || typeof value !== 'object') return bucket;

  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, bucket);
    return bucket;
  }

  if (typeof value['@type'] === 'string') bucket.add(value['@type']);
  if (Array.isArray(value['@type'])) {
    for (const item of value['@type']) {
      if (typeof item === 'string') bucket.add(item);
    }
  }

  for (const nested of Object.values(value)) {
    collectSchemaTypes(nested, bucket);
  }

  return bucket;
}

function extractSchemaTypes(html) {
  const types = new Set();
  const pattern =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  for (const match of html.matchAll(pattern)) {
    const raw = match[1]?.trim();
    if (!raw) continue;

    try {
      collectSchemaTypes(JSON.parse(raw), types);
    } catch {
      // Ignore invalid blocks in audit output; runtime remains source of truth.
    }
  }

  return [...types].sort().join(' | ');
}

async function fetchSitemapSet() {
  const response = await fetch(sitemapUrl, {
    headers: requestHeaders,
    redirect: 'follow',
  });
  const xml = await response.text();
  const urls = new Set();

  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/gi)) {
    urls.add(match[1].trim());
  }

  return {
    status: response.status,
    urlSet: urls,
  };
}

async function fetchWithTrace(url) {
  const hops = [];
  let currentUrl = url;
  let redirectCount = 0;

  while (redirectCount <= 5) {
    const response = await fetch(currentUrl, {
      headers: requestHeaders,
      redirect: 'manual',
    });
    const body = await response.text();
    const location = response.headers.get('location');
    const snapshot = {
      url: currentUrl,
      status: response.status,
      location: location ? new URL(location, currentUrl).toString() : '',
      contentType: response.headers.get('content-type') || '',
      headers: Object.fromEntries(response.headers.entries()),
      body,
    };

    hops.push(snapshot);

    if (response.status >= 300 && response.status < 400 && snapshot.location) {
      redirectCount += 1;
      currentUrl = snapshot.location;
      continue;
    }

    return {
      initialStatus: hops[0]?.status || response.status,
      finalStatus: snapshot.status,
      finalUrl: currentUrl,
      redirectCount,
      hops,
      final: snapshot,
    };
  }

  return {
    initialStatus: hops[0]?.status || 0,
    finalStatus: hops[hops.length - 1]?.status || 0,
    finalUrl: currentUrl,
    redirectCount,
    hops,
    final: hops[hops.length - 1],
  };
}

function deriveAlternateExpectations(url) {
  const target = new URL(url);
  if (target.pathname === '/sitemap.xml' || target.pathname === '/robots.txt') {
    return { zh: '', en: '', xDefault: '' };
  }

  if (target.pathname === '/en') {
    return {
      zh: `${target.origin}/`,
      en: `${target.origin}/en`,
      xDefault: `${target.origin}/`,
    };
  }

  if (target.pathname.startsWith('/en/')) {
    const zhPath = target.pathname.replace(/^\/en/, '') || '/';
    return {
      zh: `${target.origin}${zhPath}`,
      en: `${target.origin}${target.pathname}`,
      xDefault: `${target.origin}${zhPath}`,
    };
  }

  return {
    zh: `${target.origin}${target.pathname}`,
    en: `${target.origin}${target.pathname === '/' ? '/en' : `/en${target.pathname}`}`,
    xDefault: `${target.origin}${target.pathname}`,
  };
}

function isExecutionPolicyNoindex(url, pageType) {
  const pathname = new URL(url).pathname;
  return (
    pageType === 'news' ||
    pageType === 'news-detail' ||
    pathname === '/news' ||
    pathname === '/en/news' ||
    pathname === '/search' ||
    pathname === '/en/search'
  );
}

function classifyUrlResult(row, trace, htmlSignals, targetDecisionStatus) {
  const checkpoint =
    trace.initialStatus === 403 &&
    /Security Checkpoint/i.test(trace.final?.body || '');

  if (checkpoint) return 'LOCAL_SECURITY_CHECKPOINT';
  if (row.action === 'REQUIRES_BUSINESS_DECISION') return 'BUSINESS_REVIEW_REQUIRED';

  if (row.target_status === '301') {
    if (
      targetDecisionStatus === 'BUSINESS_DECISION' &&
      trace.initialStatus === 301 &&
      normalizeComparableUrl(trace.finalUrl) === normalizeComparableUrl(row.target_url) &&
      trace.finalStatus === 404
    ) {
      return 'BUSINESS_REVIEW_REQUIRED';
    }

    if (
      trace.initialStatus === 301 &&
      normalizeComparableUrl(trace.finalUrl) === normalizeComparableUrl(row.target_url) &&
      trace.redirectCount === 1 &&
      trace.finalStatus === 200
    ) {
      return 'PASS_301';
    }

    if (trace.initialStatus === 404) return 'UNEXPECTED_404';
    return 'UNEXPECTED_REDIRECT';
  }

  if (trace.initialStatus === 404) return 'UNEXPECTED_404';

  if (trace.initialStatus >= 500 || trace.finalStatus >= 500) return 'RUNTIME_ERROR';
  if (trace.initialStatus !== 200) return 'RUNTIME_ERROR';

  const expectsNoindex = isExecutionPolicyNoindex(row.target_url, row.page_type);
  const normalizedCanonical = normalizeComparableUrl(htmlSignals.canonical);
  const expectedCanonical = normalizeComparableUrl(row.target_url);

  if (expectsNoindex && htmlSignals.robots.includes('noindex')) return 'EXPECTED_NOINDEX';
  if (expectsNoindex && !htmlSignals.robots.includes('noindex')) return 'UNEXPECTED_NOINDEX';
  if (!expectsNoindex && htmlSignals.robots.includes('noindex')) return 'UNEXPECTED_NOINDEX';
  if (normalizedCanonical && normalizedCanonical !== expectedCanonical) return 'CANONICAL_ERROR';
  if (htmlSignals.hreflangStatus === 'ERROR') return 'HREFLANG_ERROR';

  return 'PASS_200';
}

function buildSeoResult(row, trace, htmlSignals, sitemapSet) {
  const expectedAlternates = deriveAlternateExpectations(row.target_url);
  const expectedCanonical = normalizeComparableUrl(row.target_url);
  const actualCanonical = normalizeComparableUrl(htmlSignals.canonical);
  const expectsNoindex = isExecutionPolicyNoindex(row.target_url, row.page_type);
  const sitemapStatus = sitemapSet.has(row.target_url) ? 'IN_SITEMAP' : 'NOT_IN_SITEMAP';

  const hreflangStatus =
    !expectedAlternates.en || !expectedAlternates.zh
      ? 'N/A'
      : normalizeComparableUrl(htmlSignals.alternates['zh-CN']) ===
            normalizeComparableUrl(expectedAlternates.zh) &&
          normalizeComparableUrl(htmlSignals.alternates.en) ===
            normalizeComparableUrl(expectedAlternates.en)
        ? 'PASS'
        : 'ERROR';

  const schemaTypes = extractSchemaTypes(trace.final?.body || '');
  const robots = htmlSignals.robots || '(absent)';
  const result =
    trace.finalStatus === 404
      ? 'UNEXPECTED_404'
      : trace.initialStatus !== 200
      ? trace.initialStatus === 403 && /Security Checkpoint/i.test(trace.final?.body || '')
        ? 'LOCAL_SECURITY_CHECKPOINT'
        : 'RUNTIME_ERROR'
      : actualCanonical !== expectedCanonical
        ? 'CANONICAL_ERROR'
        : hreflangStatus === 'ERROR'
          ? 'HREFLANG_ERROR'
          : expectsNoindex && !robots.includes('noindex')
            ? 'UNEXPECTED_NOINDEX'
            : expectsNoindex
                ? 'EXPECTED_NOINDEX'
                : robots.includes('noindex')
                  ? 'UNEXPECTED_NOINDEX'
                : 'PASS';

  return {
    url: row.target_url,
    status: trace.finalStatus,
    page_type: row.page_type,
    title: htmlSignals.title,
    meta_description: htmlSignals.description,
    h1: htmlSignals.h1,
    canonical: htmlSignals.canonical,
    canonical_status: actualCanonical === expectedCanonical ? 'PASS' : 'ERROR',
    robots,
    html_lang: htmlSignals.htmlLang,
    hreflang_zh: htmlSignals.alternates['zh-CN'] || '',
    hreflang_en: htmlSignals.alternates.en || '',
    x_default: htmlSignals.alternates['x-default'] || '',
    hreflang_status: hreflangStatus,
    sitemap_status: sitemapStatus,
    schema_types: schemaTypes,
    schema_status: schemaTypes ? 'PRESENT' : 'ABSENT',
    og_url: htmlSignals.ogUrl,
    result,
    notes: '',
  };
}

function extractHtmlSignals(body) {
  const alternates = extractAlternates(body);
  return {
    title: extractFirst(body, /<title>([\s\S]*?)<\/title>/i),
    description: extractFirst(
      body,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i
    ),
    h1: extractFirst(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ''),
    canonical: extractFirst(
      body,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
    ),
    robots: extractFirst(
      body,
      /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i
    ).toLowerCase(),
    htmlLang: extractFirst(body, /<html[^>]+lang=["']([^"']+)["']/i),
    ogUrl: extractFirst(
      body,
      /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["'][^>]*>/i
    ),
    alternates,
    hreflangStatus: 'PENDING',
  };
}

async function main() {
  const manifestText = await fs.readFile(manifestPath, 'utf8');
  const manifestAllRows = parseCsv(manifestText);
  const targetDecisionMap = new Map(
    manifestAllRows
      .filter((row) => row.target_url && row.target_status)
      .map((row) => [normalizeComparableUrl(row.target_url), row.target_status])
  );
  const manifestRows = manifestAllRows.filter(
    (row) =>
      row.current_url &&
      row.target_url &&
      row.target_status &&
      row.target_status !== 'BUSINESS_DECISION'
  );
  const sitemap = await fetchSitemapSet();
  const urlRows = [];
  const seoMap = new Map();

  for (const row of manifestRows) {
    const trace = await fetchWithTrace(row.current_url);
    const htmlSignals = extractHtmlSignals(trace.final?.body || '');
    const expectedAlternates = deriveAlternateExpectations(row.target_url);
    const targetDecisionStatus = targetDecisionMap.get(normalizeComparableUrl(row.target_url)) || '';

    htmlSignals.hreflangStatus =
      !expectedAlternates.en || !expectedAlternates.zh
        ? 'N/A'
        : normalizeComparableUrl(htmlSignals.alternates['zh-CN']) ===
              normalizeComparableUrl(expectedAlternates.zh) &&
            normalizeComparableUrl(htmlSignals.alternates.en) ===
              normalizeComparableUrl(expectedAlternates.en)
          ? 'PASS'
          : 'ERROR';

    const result = classifyUrlResult(row, trace, htmlSignals, targetDecisionStatus);
    const finalContentType = trace.final?.contentType || '';

    urlRows.push({
      url: row.current_url,
      target_url: row.target_url,
      action: row.action,
      expected_status: row.target_status,
      actual_status: trace.initialStatus,
      final_status: trace.finalStatus,
      final_url: trace.finalUrl,
      redirect_count: trace.redirectCount,
      deployment: deploymentId,
      title: htmlSignals.title,
      canonical: htmlSignals.canonical,
      robots: htmlSignals.robots,
      html_lang: htmlSignals.htmlLang,
      hreflang_status: htmlSignals.hreflangStatus,
      content_type: finalContentType,
      result,
      evidence_source: `manifest:${row.evidence_source}; deployment:${deploymentId}`,
      notes:
        row.current_url === row.target_url
          ? ''
          : `redirect-chain:${trace.hops
              .map((hop) => `${hop.status}:${new URL(hop.url).pathname}`)
              .join(' -> ')}`,
    });

    if (row.target_status !== '200') continue;
    if (seoMap.has(row.target_url)) continue;

    seoMap.set(row.target_url, buildSeoResult(row, trace, htmlSignals, sitemap.urlSet));
  }

  const seoRows = [...seoMap.values()].sort((left, right) => left.url.localeCompare(right.url));
  const sortedUrlRows = urlRows.sort((left, right) => left.url.localeCompare(right.url));

  await writeCsv(
    urlResultsPath,
    sortedUrlRows,
    [
      'url',
      'target_url',
      'action',
      'expected_status',
      'actual_status',
      'final_status',
      'final_url',
      'redirect_count',
      'deployment',
      'title',
      'canonical',
      'robots',
      'html_lang',
      'hreflang_status',
      'content_type',
      'result',
      'evidence_source',
      'notes',
    ]
  );

  await writeCsv(
    seoResultsPath,
    seoRows,
    [
      'url',
      'status',
      'page_type',
      'title',
      'meta_description',
      'h1',
      'canonical',
      'canonical_status',
      'robots',
      'html_lang',
      'hreflang_zh',
      'hreflang_en',
      'x_default',
      'hreflang_status',
      'sitemap_status',
      'schema_types',
      'schema_status',
      'og_url',
      'result',
      'notes',
    ]
  );

  const summary = sortedUrlRows.reduce((bucket, row) => {
    bucket[row.result] = (bucket[row.result] || 0) + 1;
    return bucket;
  }, {});

  summary.SITEMAP_STATUS = sitemap.status;
  summary.URL_ROWS = sortedUrlRows.length;
  summary.SEO_ROWS = seoRows.length;

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
