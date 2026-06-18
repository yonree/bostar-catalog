import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '测试与验证能力', en: 'Testing Capabilities' },
    description: {
      'zh-CN': '围绕喷涂测试、参数验证、工件边界和结果记录展示博士达测试能力。',
      en: 'BOSTAR testing capability across coating trials, parameter validation, boundary checks, and result recording.',
    },
  });
}

export default async function TestingCapabilitiesPage() {
  const { locale } = await getRequestContext();
  const items =
    locale === 'en'
      ? [
          'Sample coating tests with recorded settings',
          'Boundary checks for part geometry and coating materials',
          'Result notes tied to conditions and engineering comments',
          'Reusable evidence for product, application, and case pages',
        ]
      : ['寄样喷涂测试与参数记录', '工件形状与涂料边界验证', '结果与条件绑定的工程结论', '可沉淀到产品、方案、案例页的证据资产'];

  return (
    <section className="section section-alt border-y border-line">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '测试与验证能力', en: 'Testing Capabilities' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '测试与验证能力', en: 'Testing Capabilities' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '让参数、结果和适用边界可记录、可引用、可复核。',
            en: 'Make parameters, results, and application boundaries recordable, citeable, and reviewable.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-2">
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
          { name: pickLocaleValue(locale, { 'zh-CN': '测试与验证能力', en: 'Testing Capabilities' }), path: '/about/testing-capabilities' },
        ]}
      />
    </section>
  );
}
