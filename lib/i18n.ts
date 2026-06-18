export const localeRegistry = [
  {
    code: 'zh-CN',
    htmlLang: 'zh-CN',
    label: '中文',
    pathPrefix: '',
    isDefault: true,
    isIndexable: true,
    fallbackLocale: 'zh-CN',
    xDefaultCandidate: true,
  },
  {
    code: 'en',
    htmlLang: 'en',
    label: 'English',
    pathPrefix: '/en',
    isDefault: false,
    isIndexable: true,
    fallbackLocale: 'zh-CN',
    xDefaultCandidate: false,
  },
] as const;

export type Locale = (typeof localeRegistry)[number]['code'];

export const defaultLocale: Locale = 'zh-CN';

const externalHrefPattern = /^(?:[a-z]+:)?\/\//i;

type RouteRule = {
  internalPrefix: string;
  localized: Record<Locale, string>;
};

const routeRegistry: RouteRule[] = [
  { internalPrefix: '/support/sample-coating-test', localized: { 'zh-CN': '/support/sample-coating-test', en: '/support/sample-coating-test' } },
  { internalPrefix: '/support/application-engineering', localized: { 'zh-CN': '/support/application-engineering', en: '/support/application-engineering' } },
  { internalPrefix: '/support/after-sales', localized: { 'zh-CN': '/support/after-sales', en: '/support/after-sales' } },
  { internalPrefix: '/support/downloads', localized: { 'zh-CN': '/support/downloads', en: '/support/downloads' } },
  { internalPrefix: '/support/faq', localized: { 'zh-CN': '/support/faq', en: '/support/faq' } },
  { internalPrefix: '/about/research-and-manufacturing', localized: { 'zh-CN': '/about/research-and-manufacturing', en: '/about/manufacturing-and-testing' } },
  { internalPrefix: '/about/testing-capabilities', localized: { 'zh-CN': '/about/testing-capabilities', en: '/about/testing-capabilities' } },
  { internalPrefix: '/about/global-business', localized: { 'zh-CN': '/about/global-business', en: '/about/global-support' } },
  { internalPrefix: '/products/compare', localized: { 'zh-CN': '/products/compare', en: '/products/compare' } },
  { internalPrefix: '/solutions', localized: { 'zh-CN': '/solutions', en: '/applications' } },
  { internalPrefix: '/cases', localized: { 'zh-CN': '/cases', en: '/case-studies' } },
  { internalPrefix: '/knowledge', localized: { 'zh-CN': '/knowledge', en: '/resources' } },
  { internalPrefix: '/support', localized: { 'zh-CN': '/support', en: '/support' } },
  { internalPrefix: '/products', localized: { 'zh-CN': '/products', en: '/products' } },
  { internalPrefix: '/about', localized: { 'zh-CN': '/about', en: '/about' } },
  { internalPrefix: '/contact', localized: { 'zh-CN': '/contact', en: '/contact' } },
  { internalPrefix: '/search', localized: { 'zh-CN': '/search', en: '/search' } },
  { internalPrefix: '/thank-you', localized: { 'zh-CN': '/thank-you', en: '/thank-you' } },
  { internalPrefix: '/privacy-policy', localized: { 'zh-CN': '/privacy-policy', en: '/privacy-policy' } },
  { internalPrefix: '/cookie-policy', localized: { 'zh-CN': '/cookie-policy', en: '/cookie-policy' } },
  { internalPrefix: '/news', localized: { 'zh-CN': '/news', en: '/news' } },
  { internalPrefix: '/videos', localized: { 'zh-CN': '/videos', en: '/videos' } },
  { internalPrefix: '/', localized: { 'zh-CN': '/', en: '/' } },
];

const legacyRouteAliases: Array<{ source: string; target: string; locale?: Locale }> = [
  { source: '/service', target: '/support' },
  { source: '/downloads', target: '/support/downloads' },
  { source: '/faq', target: '/support/faq' },
  { source: '/en/solutions', target: '/en/applications', locale: 'en' },
  { source: '/en/solutions/', target: '/en/applications/', locale: 'en' },
  { source: '/en/cases', target: '/en/case-studies', locale: 'en' },
  { source: '/en/knowledge', target: '/en/resources', locale: 'en' },
];

const sortedRouteRegistry = [...routeRegistry].sort(
  (left, right) => right.internalPrefix.length - left.internalPrefix.length
);

function normalizePathname(pathname: string) {
  if (!pathname) return '/';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized !== '/' && normalized.endsWith('/')) {
    return normalized.slice(0, -1);
  }
  return normalized;
}

function isPathMatch(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function translatePath(pathname: string, fromPrefix: string, toPrefix: string) {
  if (!isPathMatch(pathname, fromPrefix)) return null;
  if (pathname === fromPrefix) return toPrefix;
  if (toPrefix === '/') return pathname.slice(fromPrefix.length) || '/';
  return `${toPrefix}${pathname.slice(fromPrefix.length)}`;
}

function toLocalePath(pathname: string, locale: Locale) {
  return locale === defaultLocale ? pathname : pathname === '/' ? '/en' : `/en${pathname}`;
}

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return localeRegistry.some((locale) => locale.code === value);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isSupportedLocale(value) ? value : defaultLocale;
}

export function getLocaleConfig(locale: string | null | undefined) {
  const normalized = normalizeLocale(locale);
  return localeRegistry.find((item) => item.code === normalized) || localeRegistry[0];
}

export function getLocaleFromPathname(pathname: string): Locale {
  const normalized = normalizePathname(pathname);
  return normalized === '/en' || normalized.startsWith('/en/') ? 'en' : defaultLocale;
}

export function stripLocalePrefix(pathname: string) {
  const normalized = normalizePathname(pathname);
  if (normalized === '/en') return '/';
  if (normalized.startsWith('/en/')) return normalized.slice(3) || '/';
  return normalized;
}

export function publicPathToInternalPath(pathname: string, locale: Locale) {
  const normalized = normalizePathname(pathname);

  for (const alias of legacyRouteAliases) {
    if (alias.locale && alias.locale !== locale) continue;
    const translatedAlias = translatePath(normalized, alias.source, alias.target);
    if (translatedAlias) {
      return publicPathToInternalPath(stripLocalePrefix(translatedAlias), getLocaleFromPathname(translatedAlias));
    }
  }

  for (const rule of sortedRouteRegistry) {
    const localizedPrefix = rule.localized[locale];
    const translated = translatePath(normalized, localizedPrefix, rule.internalPrefix);
    if (translated) {
      return normalizePathname(translated);
    }
  }

  return normalized;
}

export function internalPathToPublicPath(pathname: string, locale: Locale) {
  const normalized = normalizePathname(pathname);

  for (const rule of sortedRouteRegistry) {
    const translated = translatePath(normalized, rule.internalPrefix, rule.localized[locale]);
    if (translated) {
      return normalizePathname(translated);
    }
  }

  return normalized;
}

export function resolvePathRouting(pathname: string) {
  const locale = getLocaleFromPathname(pathname);
  const publicPathname = normalizePathname(pathname);
  const strippedPathname = stripLocalePrefix(publicPathname);
  const internalPathname = publicPathToInternalPath(strippedPathname, locale);
  const canonicalPublicPath = toLocalePath(internalPathToPublicPath(internalPathname, locale), locale);

  return {
    locale,
    publicPathname,
    internalPathname,
    canonicalPublicPath,
  };
}

export function localizeHref(href: string, locale: Locale) {
  if (!href) return href;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  if (externalHrefPattern.test(href)) return href;
  if (href.startsWith('/api') || href.startsWith('/admin')) return href;

  const normalizedHref = normalizePathname(href);
  const hrefLocale = getLocaleFromPathname(normalizedHref);
  const strippedHref = stripLocalePrefix(normalizedHref);
  const internalPathname = publicPathToInternalPath(strippedHref, hrefLocale);
  const localizedPath = internalPathToPublicPath(internalPathname, locale);

  return toLocalePath(localizedPath, locale);
}

export function buildLocaleAlternates(contentPathname: string) {
  const internalPathname = normalizePathname(contentPathname || '/');

  return localeRegistry.reduce<Record<string, string>>((acc, locale) => {
    acc[locale.code] = localizeHref(internalPathname, locale.code);
    if (locale.xDefaultCandidate) {
      acc['x-default'] = localizeHref(internalPathname, locale.code);
    }
    return acc;
  }, {});
}

export function pickLocaleValue<T>(locale: Locale, values: { 'zh-CN': T; en: T }) {
  return locale === 'en' ? values.en : values['zh-CN'];
}

export function isEnglishLocale(locale: Locale) {
  return locale === 'en';
}
