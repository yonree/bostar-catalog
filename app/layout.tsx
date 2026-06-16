import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { OrganizationJsonLd } from '@/components/schema/OrganizationJsonLd';
import { WebSiteJsonLd } from '@/components/schema/WebSiteJsonLd';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.defaultTitle,
      template: `%s | ${site.brandEn}`,
    },
    description: site.description,
    keywords: ['BOSTAR', '博士达', '静电喷枪', '粉末喷涂设备', 'DISK 静电旋碟', '自动喷涂系统'],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: site.defaultTitle,
      description: site.description,
      url: site.url,
      siteName: site.brandEn,
      locale: 'zh_CN',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
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
