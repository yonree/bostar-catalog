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
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : defaultLocale;
}

export function stripLocalePrefix(pathname: string) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  return pathname || '/';
}

export function localizeHref(href: string, locale: Locale) {
  if (!href) return href;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  if (externalHrefPattern.test(href)) return href;

  const normalizedHref = href.startsWith('/') ? href : `/${href}`;
  const contentPath = stripLocalePrefix(normalizedHref);

  if (locale === defaultLocale) {
    return contentPath;
  }

  return contentPath === '/' ? '/en' : `/en${contentPath}`;
}

export function buildLocaleAlternates(contentPathname: string) {
  const normalizedPath = contentPathname || '/';

  return localeRegistry.reduce<Record<string, string>>((acc, locale) => {
    acc[locale.code] = localizeHref(normalizedPath, locale.code);
    if (locale.xDefaultCandidate) {
      acc['x-default'] = localizeHref(normalizedPath, locale.code);
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
