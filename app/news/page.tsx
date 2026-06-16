import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '新闻动态', en: 'News' },
    description: {
      'zh-CN': '博士达品牌新闻、产品更新和行业动态。',
      en: 'BOSTAR brand news, product updates, and industry activity.',
    },
    robots: {
      index: false,
      follow: false,
    },
  });
}

export default async function NewsPage() {
  const { locale } = await getRequestContext();
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '新闻动态', en: 'News' }) }]} />
        <BreadcrumbJsonLd
          items={[
            { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
            { name: pickLocaleValue(locale, { 'zh-CN': '新闻', en: 'News' }), path: '/news' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '新闻动态', en: 'News and Updates' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '预留品牌新闻、产品更新和行业活动内容入口。',
            en: 'Reserved entry point for brand updates, product releases, and industry events.',
          })}
        />
      </div>
    </section>
  );
}
