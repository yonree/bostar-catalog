import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductCard } from '@/components/product/ProductCard';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getProductCategories, getProducts } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '产品中心', en: 'Products' },
    description: {
      'zh-CN': '围绕粉末、液体、旋杯/DISK 与自动化配套建立可选型、可比较的产品中心。',
      en: 'A product hub for powder, liquid, rotary atomizer/DISK, and automation-ready equipment families.',
    },
  });
}

export default async function ProductsPage() {
  const [productCategories, products, siteSettings, { locale }] = await Promise.all([
    getProductCategories(),
    getProducts(),
    getSiteSettings(),
    getRequestContext(),
  ]);
  const isEnglish = locale === 'en';

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '产品中心', en: 'Products' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '产品中心', en: 'Products' })}
          description={
            isEnglish
              ? 'Browse the current verified equipment families and compare detail pages by application, craft, and model.'
              : siteSettings.productCenterDescription
          }
        />
        <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {productCategories.map((category) => (
            <LocalizedLink
              key={category.id}
              href={`/products/${category.slug}`}
              className="rounded-[24px] border border-line bg-white p-5 shadow-card"
            >
              <h2 className="font-black text-ink">{category.name}</h2>
              <p className="mt-3 text-sm leading-7 text-steel">{category.summary}</p>
            </LocalizedLink>
          ))}
        </div>
        <div className="mb-10 flex justify-end">
          <LocalizedLink
            href="/products/compare"
            className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink"
          >
            {isEnglish ? 'Compare Core Models' : '对比核心型号'}
          </LocalizedLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '产品中心', en: 'Products' }), path: '/products' },
        ]}
      />
    </section>
  );
}
