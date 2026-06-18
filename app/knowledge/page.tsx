import type { Metadata } from 'next';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getArticleCategories, getArticles } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '知识中心', en: 'Knowledge Center' },
    description: {
      'zh-CN': '围绕设备选型、喷涂工艺、故障排查、维护和安全规范组织的技术知识库。',
      en: 'Technical knowledge entries covering equipment selection, powder-coating process control, troubleshooting, operation, and safety.',
    },
  });
}

export default async function KnowledgePage() {
  const [articleCategories, articles, { locale }] = await Promise.all([
    getArticleCategories(),
    getArticles(),
    getRequestContext(),
  ]);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '知识中心', en: 'Knowledge Center' }) }]} />
        <BreadcrumbJsonLd
          items={[
            { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
            { name: pickLocaleValue(locale, { 'zh-CN': '知识中心', en: 'Knowledge Center' }), path: '/knowledge' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '知识中心', en: 'Knowledge Center' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '围绕静电喷涂选型、工艺调试、故障排查、安全规范和行业标准组织知识库。',
            en: 'A knowledge base organized around electrostatic coating selection, process tuning, troubleshooting, safety rules, and industry standards.',
          })}
        />
        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {articleCategories.map((category) => (
            <LocalizedLink
              key={category.id}
              href={`/knowledge/${category.slug}`}
              className="rounded border border-line bg-dark-soft p-5 font-bold card-hover"
            >
              {category.name}
            </LocalizedLink>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
