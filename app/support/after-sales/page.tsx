import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

const lists = {
  'zh-CN': [
    '安装调试与基础操作培训',
    '易损件与备件建议清单',
    '远程问题排查与参数复核',
    '维护周期与停机前检查建议',
  ],
  en: [
    'Commissioning and basic operator training',
    'Wear-part and spare-parts guidance',
    'Remote troubleshooting and parameter review',
    'Maintenance intervals and shutdown checklist guidance',
  ],
} as const;

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '售后与维护', en: 'After-sales & Service' },
    description: {
      'zh-CN': '提供安装调试、易损件、维护与远程支持说明。',
      en: 'After-sales coverage for commissioning, wear parts, maintenance, and remote support.',
    },
  });
}

export default async function AfterSalesPage() {
  const { locale } = await getRequestContext();

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '售后与维护', en: 'After-sales & Service' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '售后与维护', en: 'After-sales & Service' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '明确交付后谁来响应、备件如何准备、远程支持如何触发。',
            en: 'Clarify who responds after delivery, how spare parts should be prepared, and how remote support is triggered.',
          })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {lists[locale].map((item) => (
            <div key={item} className="rounded-[24px] border border-line bg-dark-soft p-6 shadow-card">
              <p className="text-sm leading-7 text-white-soft/80">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service & Support' }), path: '/support' },
          { name: pickLocaleValue(locale, { 'zh-CN': '售后与维护', en: 'After-sales & Service' }), path: '/support/after-sales' },
        ]}
      />
    </section>
  );
}
