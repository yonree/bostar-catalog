import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getArticleCategories, getArticles } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '知识中心',
  description: '静电喷枪选型、粉末喷涂工艺、故障排查、操作维护和安全规范知识库。',
};

export default async function KnowledgePage() {
  const [articleCategories, articles] = await Promise.all([getArticleCategories(), getArticles()]);
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '知识中心' }]} />
        <BreadcrumbJsonLd
          items={[
            { name: '首页', path: '/' },
            { name: '知识中心', path: '/knowledge' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title="知识中心"
          description="围绕静电喷涂选型、工艺调试、故障排查、安全规范和行业标准组织知识库。"
        />
        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {articleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/knowledge/${category.slug}`}
              className="rounded border border-line bg-dark-soft p-5 font-bold card-hover"
            >
              {category.name}
            </Link>
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
