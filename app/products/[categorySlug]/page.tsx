import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductCard } from '@/components/product/ProductCard';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import { getProductsByCategory } from '@/lib/cms-data';
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
  const { category } = await getProductsByCategory(categorySlug);
  const isEnglish = isEnglishLocale(locale);

  return createResolvedPageMetadata({
    title: category?.name || (isEnglish ? 'Product Category' : '产品分类'),
    description: isEnglish
      ? 'Product category overview and related product list.'
      : category?.summary || '产品分类与产品列表。',
  });
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const [{ categorySlug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const { category, products } = await getProductsByCategory(categorySlug);
  if (!category) notFound();

  const isEnglish = isEnglishLocale(locale);
  const productsLabel = isEnglish ? 'Products' : '产品中心';
  const description = isEnglish
    ? 'Products filed under this category. Source-language specifications may still appear below.'
    : category.summary;

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: productsLabel, href: '/products' }, { label: category.name }]} />
        <BreadcrumbJsonLd
          items={[
            { name: isEnglish ? 'Home' : '首页', path: '/' },
            { name: productsLabel, path: '/products' },
            { name: category.name, path: `/products/${category.slug}` },
          ]}
        />
        <SectionHeader headingLevel="h1" title={category.name} description={description} />
        {isEnglish ? <TranslationNotice className="mb-8" /> : null}
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
