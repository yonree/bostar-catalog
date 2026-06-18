import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '海外业务与支持', en: 'Global Support' },
    description: {
      'zh-CN': '展示英文询盘、出口包装、远程支持与备件协同能力。',
      en: 'Global support coverage for English inquiry handling, export packaging, remote support, and spare parts.',
    },
  });
}

export default async function GlobalBusinessPage() {
  const { locale } = await getRequestContext();
  const cards =
    locale === 'en'
      ? [
          'English inquiry intake with unified foreign-trade handling',
          'Export packaging and delivery coordination',
          'Remote technical support for commissioning and troubleshooting',
          'Spare-parts follow-up for overseas projects',
        ]
      : ['英文询盘统一进入外贸团队', '出口包装与交付协调', '远程技术支持与调试协助', '海外项目备件与后续跟进'];

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '海外业务与支持', en: 'Global Support' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '海外业务与支持', en: 'Global Support' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '第一阶段不做多国家站，但要把英文询盘、出口支持和海外案例链路先做扎实。',
            en: 'Phase one does not add country sites, but it does require a reliable chain for English inquiries, export support, and overseas case references.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((item) => (
            <div key={item} className="rounded-[24px] border border-line bg-dark-soft p-6 shadow-card">
              <p className="text-sm leading-7 text-white-soft/80">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '关于博士达', en: 'About BOSTAR' }), path: '/about' },
          { name: pickLocaleValue(locale, { 'zh-CN': '海外业务与支持', en: 'Global Support' }), path: '/about/global-business' },
        ]}
      />
    </section>
  );
}
