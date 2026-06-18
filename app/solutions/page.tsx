import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getSolutions } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '行业解决方案', en: 'Applications' },
    description: {
      'zh-CN': '按行业与问题组织解决方案，让客户先理解工艺判断，再进入设备配置。',
      en: 'Application pages organized by industry and coating problem so users can review process logic before equipment configuration.',
    },
  });
}

export default async function SolutionsPage() {
  const [solutions, { locale }] = await Promise.all([getSolutions(), getRequestContext()]);
  const isEnglish = locale === 'en';
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '行业解决方案', en: 'Applications' }) }]} />
        <BreadcrumbJsonLd
          items={[
            { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
            { name: pickLocaleValue(locale, { 'zh-CN': '行业解决方案', en: 'Applications' }), path: '/solutions' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '行业解决方案', en: 'Applications' })}
          description={isEnglish ? 'Start from industry constraints, coating problems, and process targets instead of generic equipment promotion.' : '先明确工件、问题、工艺约束和结果目标，再进入设备和参数配置。'}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((solution) => (
            <LocalizedLink
              key={solution.id}
              href={`/solutions/${solution.slug}`}
              className="rounded-[24px] border border-line bg-white p-6 shadow-card"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{solution.industry}</p>
              <h2 className="mt-3 text-xl font-black text-ink">{solution.title}</h2>
              <p className="mt-3 text-sm leading-7 text-steel">{solution.aiSummary}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
