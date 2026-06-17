const defaultBaseUrl = process.env.BASE_URL || process.argv[2];

if (!defaultBaseUrl) {
  console.error('Usage: node scripts/smoke-legacy-routes.mjs <baseUrl>');
  process.exit(1);
}

const baseUrl = defaultBaseUrl.replace(/\/+$/, '');
const approvedRoutes = [
  {
    label: 'manual-category-zh',
    path: '/products/Manual-Electrostatic-Liquid-Spray-Gun',
    locale: 'zh-CN',
    expectedStatus: 200,
    canonicalPath: '/products/Manual-Electrostatic-Liquid-Spray-Gun',
    hreflangPath: '/en/products/Manual-Electrostatic-Liquid-Spray-Gun',
  },
  {
    label: 'manual-category-en',
    path: '/en/products/Manual-Electrostatic-Liquid-Spray-Gun',
    locale: 'en',
    expectedStatus: 200,
    canonicalPath: '/en/products/Manual-Electrostatic-Liquid-Spray-Gun',
    hreflangPath: '/products/Manual-Electrostatic-Liquid-Spray-Gun',
  },
  {
    label: 'manual-detail-zh',
    path: '/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
    locale: 'zh-CN',
    expectedStatus: 200,
    canonicalPath:
      '/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
    hreflangPath:
      '/en/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
  },
  {
    label: 'manual-detail-en',
    path: '/en/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
    locale: 'en',
    expectedStatus: 200,
    canonicalPath:
      '/en/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
    hreflangPath:
      '/products/Manual-Electrostatic-Liquid-Spray-Gun/bsd-3009a-manual-liquid-electrostatic-spray-gun',
  },
  {
    label: 'unknown-slug-404',
    path: '/products/Manual-Electrostatic-Liquid-Spray-Gun/not-a-real-product-slug',
    locale: 'zh-CN',
    expectedStatus: 404,
  },
];

function extractTagValue(html, regex) {
  return regex.exec(html)?.[1]?.trim() || '';
}

function extractHref(html, pattern) {
  return pattern.exec(html)?.[1]?.trim() || '';
}

async function fetchWithSingleRedirect(url) {
  const response = await fetch(url, { redirect: 'manual' });

  if (
    response.status >= 300 &&
    response.status < 400 &&
    response.headers.get('location')
  ) {
    const redirectTarget = new URL(response.headers.get('location'), url).toString();
    const follow = await fetch(redirectTarget, { redirect: 'manual' });
    return { response: follow, redirectCount: 1, finalUrl: redirectTarget };
  }

  return { response, redirectCount: 0, finalUrl: url };
}

async function verifyRoute(route) {
  const url = `${baseUrl}${route.path}`;
  const { response, redirectCount, finalUrl } = await fetchWithSingleRedirect(url);
  const html = await response.text();
  const canonical = extractHref(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const alternateEn = extractHref(
    html,
    /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']en["'][^>]+href=["']([^"']+)["']/i
  );
  const alternateZh = extractHref(
    html,
    /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']zh-CN["'][^>]+href=["']([^"']+)["']/i
  );
  const htmlLang = extractTagValue(html, /<html[^>]+lang=["']([^"']+)["']/i);
  const title = extractTagValue(html, /<title>(.*?)<\/title>/is);

  if (response.status !== route.expectedStatus) {
    throw new Error(`${route.label}: expected ${route.expectedStatus}, got ${response.status}`);
  }

  if (redirectCount > 1) {
    throw new Error(`${route.label}: redirect count exceeded 1`);
  }

  if (route.expectedStatus === 404) {
    return {
      label: route.label,
      status: response.status,
      finalUrl,
      redirectCount,
    };
  }

  if (!canonical) {
    throw new Error(`${route.label}: missing canonical`);
  }

  const canonicalPathname = new URL(canonical, baseUrl).pathname;
  if (canonicalPathname !== route.canonicalPath) {
    throw new Error(
      `${route.label}: canonical mismatch (${canonicalPathname} !== ${route.canonicalPath})`
    );
  }

  const expectedLang = route.locale === 'en' ? 'en' : 'zh-CN';
  if (htmlLang !== expectedLang) {
    throw new Error(`${route.label}: html lang mismatch (${htmlLang} !== ${expectedLang})`);
  }

  if (!title) {
    throw new Error(`${route.label}: missing title`);
  }

  const actualAlternate = route.locale === 'en' ? alternateZh : alternateEn;
  if (!actualAlternate) {
    throw new Error(`${route.label}: missing hreflang alternate`);
  }

  const alternatePathname = new URL(actualAlternate, baseUrl).pathname;
  if (alternatePathname !== route.hreflangPath) {
    throw new Error(
      `${route.label}: hreflang mismatch (${alternatePathname} !== ${route.hreflangPath})`
    );
  }

  return {
    label: route.label,
    status: response.status,
    finalUrl,
    redirectCount,
    htmlLang,
    canonical,
    alternate: actualAlternate,
    title,
  };
}

const results = [];

for (const route of approvedRoutes) {
  results.push(await verifyRoute(route));
}

console.log(JSON.stringify({ baseUrl, results }, null, 2));
