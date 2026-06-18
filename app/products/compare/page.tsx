import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getFeaturedProducts, type ProductView } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

type CompareRow = {
  label: string;
  valueGetter: (item: ProductView) => string;
};

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '产品对比', en: 'Product Compare' },
    description: {
      'zh-CN': '对比核心型号的关键参数、适用场景与产品线定位。',
      en: 'Compare key parameters, application fit, and product-line positioning across core models.',
    },
  });
}

export default async function ProductComparePage() {
  const [{ locale }, products] = await Promise.all([getRequestContext(), getFeaturedProducts(4)]);
  const rows: CompareRow[] = [
    {
      label: pickLocaleValue(locale, { 'zh-CN': '产品名称', en: 'Product Name' }),
      valueGetter: (item) => item.name,
    },
    {
      label: pickLocaleValue(locale, { 'zh-CN': '所属分类', en: 'Category' }),
      valueGetter: (item) => item.categoryName,
    },
    {
      label: pickLocaleValue(locale, { 'zh-CN': '适用工艺', en: 'Applicable Craft' }),
      valueGetter: (item) => item.applicableCraft || '-',
    },
    {
      label: pickLocaleValue(locale, { 'zh-CN': '适用场景', en: 'Application' }),
      valueGetter: (item) => item.applications.slice(0, 2).join(' / ') || '-',
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '产品对比', en: 'Product Compare' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '产品对比', en: 'Product Compare' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '首期提供静态对比表，帮助采购与工程团队快速判断型号差异。',
            en: 'The first release provides a static comparison matrix to help sourcing and engineering teams review model differences quickly.',
          })}
        />
        <div className="overflow-x-auto rounded-[24px] border border-line bg-white shadow-card">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-bg-soft">
                <th className="px-6 py-4 text-sm font-semibold text-ink">
                  {pickLocaleValue(locale, { 'zh-CN': '对比项', en: 'Field' })}
                </th>
                {products.map((product) => (
                  <th key={product.id} className="px-6 py-4 text-sm font-semibold text-ink">
                    {product.model || product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <th className="bg-bg-soft px-6 py-4 text-sm font-semibold text-ink">{row.label}</th>
                  {products.map((product) => (
                    <td key={`${product.id}-${row.label}`} className="px-6 py-4 text-sm text-steel">
                      {row.valueGetter(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '产品中心', en: 'Products' }), path: '/products' },
          { name: pickLocaleValue(locale, { 'zh-CN': '产品对比', en: 'Product Compare' }), path: '/products/compare' },
        ]}
      />
    </section>
  );
}
