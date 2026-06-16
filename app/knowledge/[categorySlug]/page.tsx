import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import { getArticlesByCategory } from '@/lib/cms-data';
import { isEnglishLocale } from '@/lib/i18n';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const [{ categorySlug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const { category } = await getArticlesByCategory(categorySlug);
  const isEnglish = isEnglishLocale(locale);

  return createResolvedPageMetadata({
    title: category?.name || (isEnglish ? 'Knowledge Category' : '知识分类'),
    description: isEnglish
      ? 'Technical articles organized by category.'
      : `${category?.name || '知识'}文章列表`,
  });
}

export default async function ArticleCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const [{ categorySlug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const { category, articles } = await getArticlesByCategory(categorySlug);
  if (!category) notFound();

  const isEnglish = isEnglishLocale(locale);
  const knowledgeLabel = isEnglish ? 'Knowledge Center' : '知识中心';

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: knowledgeLabel, href: '/knowledge' }, { label: category.name }]} />
        <BreadcrumbJsonLd
          items={[
            { name: isEnglish ? 'Home' : '首页', path: '/' },
            { name: knowledgeLabel, path: '/knowledge' },
            { name: category.name, path: `/knowledge/${category.slug}` },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={category.name}
          description={
            isEnglish
              ? 'Technical articles grouped by this topic. Source-language article content may still appear below.'
              : '围绕真实喷涂问题组织文章，优先输出结论、原因、排查方法和适用产品。'
          }
        />
        {isEnglish ? <TranslationNotice className="mb-8" /> : null}
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
