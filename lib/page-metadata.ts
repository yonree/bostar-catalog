import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/site-settings';

type PageMetadataInput = {
  title: string;
  description: string;
  robots?: Metadata['robots'];
};

type LocalizedPageMetadataInput = {
  title: { 'zh-CN': string; en: string };
  description: { 'zh-CN': string; en: string };
  robots?: Metadata['robots'];
};

export async function createLocalizedPageMetadata(
  input: LocalizedPageMetadataInput
): Promise<Metadata> {
  const { locale } = await getRequestContext();
  return createResolvedPageMetadata({
    title: pickLocaleValue(locale, input.title),
    description: pickLocaleValue(locale, input.description),
    robots: input.robots,
  });
}

export async function createResolvedPageMetadata(input: PageMetadataInput): Promise<Metadata> {
  const [site, requestContext] = await Promise.all([getSiteSettings(), getRequestContext()]);
  return buildResolvedPageMetadata(
    {
      locale: requestContext.locale,
      pathname: requestContext.pathname,
      siteUrl: site.url,
      siteName: site.brandEn,
    },
    input
  );
}

export function buildLocalizedPageMetadata(
  locale: Locale,
  input: LocalizedPageMetadataInput
): Metadata {
  return buildResolvedPageMetadata(
    {
      locale,
      pathname: '/',
      siteUrl: '',
      siteName: 'BOSTAR GEO',
    },
    {
      title: pickLocaleValue(locale, input.title),
      description: pickLocaleValue(locale, input.description),
      robots: input.robots,
    }
  );
}

function buildResolvedPageMetadata(
  context: {
    locale: Locale;
    pathname: string;
    siteUrl: string;
    siteName: string;
  },
  input: PageMetadataInput
): Metadata {
  const pageUrl = context.siteUrl ? `${context.siteUrl}${context.pathname}` : undefined;

  return {
    title: input.title,
    description: input.description,
    openGraph: {
      title: input.title,
      description: input.description,
      ...(pageUrl ? { url: pageUrl } : {}),
      siteName: context.siteName,
      locale: context.locale === 'en' ? 'en_US' : 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: input.title,
      description: input.description,
    },
    ...(input.robots ? { robots: input.robots } : {}),
  };
}
