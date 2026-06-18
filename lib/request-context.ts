import 'server-only';

import { headers } from 'next/headers';
import {
  buildLocaleAlternates,
  getLocaleConfig,
  localizeHref,
  resolvePathRouting,
} from '@/lib/i18n';

export async function getRequestContext() {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-bostar-pathname') || '/';
  const internalPathname =
    requestHeaders.get('x-bostar-internal-pathname') || resolvePathRouting(pathname).internalPathname;
  const routing = resolvePathRouting(pathname);

  return {
    pathname: routing.canonicalPublicPath,
    contentPathname: internalPathname,
    locale: routing.locale,
    localeConfig: getLocaleConfig(routing.locale),
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
