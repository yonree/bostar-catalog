import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getArticlesByCategory } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const { category } = await getArticlesByCategory(categorySlug);
  return {
    title: category?.name || '知识分类',
    description: `${category?.name || '知识'}文章列表`,
  };
}

export default async function ArticleCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const { category, articles } = await getArticlesByCategory(categorySlug);
  if (!category) notFound();
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '知识中心', href: '/knowledge' }, { label: category.name }]} />
        <BreadcrumbJsonLd
          items={[
            { name: '首页', path: '/' },
            { name: '知识中心', path: '/knowledge' },
            { name: category.name, path: `/knowledge/${category.slug}` },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={category.name}
          description="围绕真实喷涂问题组织文章，优先输出结论、原因、排查方法和适用产品。"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
