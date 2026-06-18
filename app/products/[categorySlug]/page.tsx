import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductCard } from '@/components/product/ProductCard';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
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
      ? 'Category overview, equipment list, and comparison entry for this product family.'
      : category?.summary || '该产品族的分类说明、设备列表与对比入口。',
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
        <SectionHeader
          headingLevel="h1"
          title={category.name}
          description={
            isEnglish
              ? 'Review the current published models, then enter detail pages to compare parameters, application fit, and inquiry paths.'
              : category.summary
          }
        />
        <div className="mb-10 rounded-[24px] border border-line bg-white p-6 shadow-card">
          <p className="text-sm leading-7 text-steel">
            {isEnglish
              ? 'This category keeps the decision path focused on use case, process, and model-level comparison instead of forcing all details into one listing page.'
              : '该分类页先帮助客户判断工艺与场景，再进入具体型号页完成参数、边界与询盘判断。'}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
