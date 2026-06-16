import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { OrganizationJsonLd } from '@/components/schema/OrganizationJsonLd';
import { WebSiteJsonLd } from '@/components/schema/WebSiteJsonLd';
import { buildLocaleAlternates } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { getEnglishSiteDescription } from '@/lib/site-copy';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata(): Promise<Metadata> {
  const [site, requestContext] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const alternates = buildLocaleAlternates(requestContext.contentPathname);
  const canonicalPath = requestContext.pathname;
  const isIndexable =
    !requestContext.contentPathname.startsWith('/admin') &&
    !requestContext.contentPathname.startsWith('/search');
  const defaultTitle =
    requestContext.locale === 'en'
      ? `${site.brandEn} Industrial Coating Equipment`
      : site.defaultTitle;
  const description =
    requestContext.locale === 'en'
      ? getEnglishSiteDescription()
      : site.description;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: defaultTitle,
      template: `%s | ${site.brandEn}`,
    },
    description,
    keywords: ['BOSTAR', '静电喷枪', '粉末喷涂设备', 'DISK 静电旋碟', '自动喷涂系统'],
    alternates: {
      canonical: canonicalPath,
      languages: alternates,
    },
    openGraph: {
      title: defaultTitle,
      description,
      url: `${site.url}${canonicalPath}`,
      siteName: site.brandEn,
      locale: requestContext.locale === 'en' ? 'en_US' : 'zh_CN',
      type: 'website',
    },
    robots: {
      index: isIndexable,
      follow: isIndexable,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { localeConfig } = await getRequestContext();

  return (
    <html lang={localeConfig.htmlLang}>
      <body>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
