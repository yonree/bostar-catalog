import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import { getSolutions } from '@/lib/cms-data';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '解决方案', en: 'Solutions' },
    description: {
      'zh-CN': '博士达面向五金件、铝型材、机箱机柜、家具五金、汽车零部件和自动化喷涂线的解决方案。',
      en: 'Solution entries for hardware, aluminum profiles, cabinets, furniture hardware, auto parts, and automated coating lines.',
    },
  });
}

export default async function SolutionsPage() {
  const [solutions, { locale }] = await Promise.all([getSolutions(), getRequestContext()]);
  const isEnglish = locale === 'en';
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '解决方案', en: 'Solutions' }) }]} />
        <BreadcrumbJsonLd
          items={[
            { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
            { name: pickLocaleValue(locale, { 'zh-CN': '解决方案', en: 'Solutions' }), path: '/solutions' },
          ]}
        />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '解决方案', en: 'Solutions' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '按行业与应用场景分类，提供从选型到量产的可复制喷涂解决方案。',
            en: 'Solution entries organized by application and industry, from equipment selection to repeatable production delivery.',
          })}
        />
        {isEnglish ? <TranslationNotice className="mb-8" /> : null}
        <div className="grid gap-5 md:grid-cols-3">
          {solutions.map((solution) => (
            <LocalizedLink
              key={solution.id}
              href={`/solutions/${solution.slug}`}
              className="rounded border border-line bg-dark-soft p-6 shadow-card card-hover"
            >
              <p className="text-sm font-bold text-primary">{solution.industry}</p>
              <h2 className="mt-2 text-xl font-black">{solution.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{solution.aiSummary}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
