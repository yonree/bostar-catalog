import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { Markdown } from '@/components/ui/Markdown';
import { ArticleJsonLd } from '@/components/schema/ArticleJsonLd';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { FaqSection } from '@/components/ui/FaqSection';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import { getArticle, getArticlesByCategory, getFaqs, getProducts } from '@/lib/cms-data';
import { isEnglishLocale } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }>;
}): Promise<Metadata> {
  const [{ categorySlug, slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const article = await getArticle(categorySlug, slug);
  const isEnglish = isEnglishLocale(locale);
  const articleLabel = article?.title || 'BOSTAR';

  return {
    title:
      article?.title && isEnglish
        ? `${article.title} Knowledge Article`
        : article?.title || (isEnglish ? 'Knowledge Article' : '知识文章'),
    description:
      (isEnglish
        ? `${articleLabel} article detail, source-language technical summary, and related inquiry entry point.`
        : article?.excerpt) ||
      (isEnglish ? 'Technical article detail and related inquiry entry point.' : '知识文章详情。'),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }>;
}) {
  const [{ categorySlug, slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const [article, faqs, products, { category }] = await Promise.all([
    getArticle(categorySlug, slug),
    getFaqs(4),
    getProducts(3),
    getArticlesByCategory(categorySlug),
  ]);

  if (!article) notFound();

  const isEnglish = isEnglishLocale(locale);
  const knowledgeLabel = isEnglish ? 'Knowledge Center' : '知识中心';

  return (
    <>
      <ArticleJsonLd article={article} />
      {!isEnglish && <FAQJsonLd faqs={faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: isEnglish ? 'Home' : '首页', path: '/' },
          { name: knowledgeLabel, path: '/knowledge' },
          { name: category?.name || article.categorySlug, path: `/knowledge/${article.categorySlug}` },
          { name: article.title, path: `/knowledge/${article.categorySlug}/${article.slug}` },
        ]}
      />
      <section className="section">
        <div className="container max-w-4xl">
          <Breadcrumb items={[{ label: knowledgeLabel, href: '/knowledge' }, { label: article.title }]} />
          {article.coverImage ? (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-card">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}
          <h1 className="text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">{article.title}</h1>
          {isEnglish ? <TranslationNotice className="mt-6 max-w-3xl" /> : null}
          <div className="mt-6 rounded-[22px] border border-primary/20 bg-primary-light/35 p-6">
            <Markdown className="leading-8 text-ink">{article.aiSummary}</Markdown>
          </div>
          <article className="prose-site mt-10 rounded-[24px] border border-line bg-white p-7 shadow-card md:p-12">
            <Markdown>{article.content.join('\n\n')}</Markdown>
            <h2>{isEnglish ? 'Applicable Products' : '适用产品'}</h2>
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  {product.name}: {product.summary}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
      <FaqSection
        faqs={faqs}
        title={isEnglish ? 'Frequently Asked Questions' : '常见问题'}
        description={
          isEnglish
            ? 'Common questions and answers related to this knowledge topic.'
            : '关于本知识主题的常见疑问与解答。'
        }
      />
      <section className="section section-alt border-y border-line">
        <div className="container max-w-4xl">
          <h2 className="mb-6 text-2xl font-black text-ink">
            {isEnglish ? 'Discuss a Related Process Question' : '咨询相关工艺问题'}
          </h2>
          <LeadForm sourcePage={`/knowledge/${article.categorySlug}/${article.slug}`} />
        </div>
      </section>
    </>
  );
}
