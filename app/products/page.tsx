import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductCard } from '@/components/product/ProductCard';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getProductCategories, getProducts } from '@/lib/cms-data';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '产品中心',
  description: '博士达粉末静电喷枪、喷涂控制器、DISK 静电旋碟系统、供粉回收与涂装自动化设备。',
};

export default async function ProductsPage() {
  const [productCategories, products, siteSettings] = await Promise.all([
    getProductCategories(),
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '产品中心' }]} />
        <SectionHeader
          headingLevel="h1"
          title="产品中心"
          description={siteSettings.productCenterDescription || undefined}
        />
        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {productCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="rounded border border-line bg-dark-soft p-5 card-hover"
            >
              <h2 className="font-black">{category.name}</h2>
              <p className="mt-2 text-sm text-white-soft/50">{category.summary}</p>
            </Link>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
        <BreadcrumbJsonLd items={[{ name: '首页', path: '/' }, { name: '产品中心', path: '/products' }]} />
    </section>
  );
}
