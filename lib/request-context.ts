import 'server-only';

import { headers } from 'next/headers';
import {
  buildLocaleAlternates,
  getLocaleConfig,
  getLocaleFromPathname,
  localizeHref,
  stripLocalePrefix,
} from '@/lib/i18n';

export async function getRequestContext() {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-bostar-pathname') || '/';
  const locale = getLocaleFromPathname(pathname);
  const contentPathname = stripLocalePrefix(pathname);

  return {
    pathname,
    contentPathname,
    locale,
    localeConfig: getLocaleConfig(locale),
  };
}

export async function getLocalizedHref(href: string) {
  const { locale } = await getRequestContext();
  return localizeHref(href, locale);
}

export async function getAlternateLanguagePaths() {
  const { contentPathname } = await getRequestContext();
  return buildLocaleAlternates(contentPathname);
}
