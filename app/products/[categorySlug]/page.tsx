import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductCard } from '@/components/product/ProductCard';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getProductsByCategory } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const { category } = await getProductsByCategory(categorySlug);
  return { title: category?.name || '产品分类', description: category?.summary || '' };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const { category, products } = await getProductsByCategory(categorySlug);
  if (!category) notFound();
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '产品中心', href: '/products' }, { label: category.name }]} />
        <SectionHeader headingLevel="h1" title={category.name} description={category.summary} />
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
        <BreadcrumbJsonLd items={[{ name: '首页', path: '/' }, { name: '产品中心', path: '/products' }, { name: category.name, path: `/products/${category.slug}` }]} />
    </section>
  );
}
