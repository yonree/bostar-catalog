import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getCases } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '案例中心', en: 'Case Studies' },
    description: {
      'zh-CN': '博士达静电喷涂设备在粉末、液体、旋杯和自动化喷涂场景中的应用案例。',
      en: 'Published industrial application cases for BOSTAR coating equipment.',
    },
  });
}

export default async function CasesPage() {
  const [cases, { locale }] = await Promise.all([getCases(), getRequestContext()]);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '案例中心', en: 'Case Studies' }) }]} />
        <BreadcrumbJsonLd
          items={[
            { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
            { name: pickLocaleValue(locale, { 'zh-CN': '案例中心', en: 'Case Studies' }), path: '/cases' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '案例中心', en: 'Case Studies' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '聚焦真实工厂应用案例，覆盖粉末喷涂、旋杯系统和自动化喷涂产线。',
            en: 'Factory application cases covering powder coating, rotary-bell systems, and automated coating lines.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((item) => (
            <LocalizedLink
              href={`/cases/${item.slug}`}
              key={item.id}
              className="rounded border border-line bg-dark-soft p-6 shadow-card card-hover"
            >
              {item.industry ? <p className="text-sm font-bold text-primary">{item.industry}</p> : null}
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{item.summary}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
