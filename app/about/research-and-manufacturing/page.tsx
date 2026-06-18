import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '研发制造与测试', en: 'Manufacturing & Testing' },
    description: {
      'zh-CN': '围绕产品研发、装配、电气测试与出口包装展示博士达制造能力。',
      en: 'BOSTAR manufacturing capability across product development, assembly, electrical testing, and export packaging.',
    },
  });
}

export default async function ResearchAndManufacturingPage() {
  const { locale } = await getRequestContext();
  const items =
    locale === 'en'
      ? [
          'Product design and iteration',
          'Assembly and commissioning discipline',
          'High-voltage and control verification',
          'Export-ready packaging and delivery preparation',
        ]
      : ['产品研发与迭代', '装配与调试流程', '高压与控制系统验证', '出口包装与交付准备'];

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '研发制造与测试', en: 'Manufacturing & Testing' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '研发制造与测试', en: 'Manufacturing & Testing' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '通过研发、装配、测试和交付链路证明“设备可信”，而不是只靠口号。',
            en: 'Prove equipment credibility through engineering, assembly, testing, and delivery discipline rather than broad claims.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item} className="rounded-[24px] border border-line bg-white p-6 shadow-card">
              <p className="text-sm leading-7 text-steel">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '关于博士达', en: 'About BOSTAR' }), path: '/about' },
          { name: pickLocaleValue(locale, { 'zh-CN': '研发制造与测试', en: 'Manufacturing & Testing' }), path: '/about/research-and-manufacturing' },
        ]}
      />
    </section>
  );
}
