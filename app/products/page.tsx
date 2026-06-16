import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductCard } from '@/components/product/ProductCard';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
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
      'zh-CN': '博士达粉末静电喷枪、喷涂控制器、DISK 静电旋碟系统、供粉回收与涂装自动化设备。',
      en: 'BOSTAR product overview for electrostatic spray guns, controllers, rotary bell systems, powder supply, and coating automation equipment.',
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
              ? 'Browse product families, core configurations, and published equipment entries from the current verified catalog.'
              : siteSettings.productCenterDescription || undefined
          }
        />
        {isEnglish ? <TranslationNotice className="mb-8" /> : null}
        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {productCategories.map((category) => (
            <LocalizedLink
              key={category.id}
              href={`/products/${category.slug}`}
              className="rounded border border-line bg-dark-soft p-5 card-hover"
            >
              <h2 className="font-black">{category.name}</h2>
              <p className="mt-2 text-sm text-white-soft/50">{category.summary}</p>
            </LocalizedLink>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
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
