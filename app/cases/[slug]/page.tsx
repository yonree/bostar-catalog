import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { Markdown } from '@/components/ui/Markdown';
import { getCase } from '@/lib/cms-data';
import { isEnglishLocale, localizeHref } from '@/lib/i18n';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const item = await getCase(slug);
  const isEnglish = isEnglishLocale(locale);
  const caseLabel = item?.title || 'BOSTAR';

  return createResolvedPageMetadata({
    title:
      item?.title && isEnglish
        ? `${item.title} Case Study`
        : item?.title || (isEnglish ? 'Case Study' : '案例详情'),
    description:
      (isEnglish
        ? `${caseLabel} case study, source-language project summary, and inquiry entry point.`
        : item?.summary) ||
      (isEnglish ? 'Industrial coating case study and inquiry entry point.' : '工业喷涂案例详情与询盘入口。'),
  });
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const item = await getCase(slug);

  if (!item) notFound();

  const isEnglish = isEnglishLocale(locale);
  const casesLabel = isEnglish ? 'Case Studies' : '案例中心';

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Breadcrumb items={[{ label: casesLabel, href: '/cases' }, { label: item.title }]} />
          <BreadcrumbJsonLd
            items={[
              { name: isEnglish ? 'Home' : '首页', path: '/' },
              { name: casesLabel, path: '/cases' },
              { name: item.title, path: `/cases/${item.slug}` },
            ]}
          />
          {item.industry ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {item.industry}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
            {item.title}
          </h1>
          <div className="mt-6 rounded-[22px] border border-primary/20 bg-primary-light/35 p-6">
            <Markdown className="text-lg leading-8 text-ink">{item.summary}</Markdown>
          </div>
          {item.coverImage ? (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-card">
              <Image src={item.coverImage} alt={item.title} fill className="object-cover" unoptimized />
            </div>
          ) : null}
        </div>
        <div>
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-card">
            <LeadForm
              locale={locale}
              sourcePage={localizeHref(`/cases/${item.slug}`, locale)}
              sourceType="case"
              defaultDemandType={isEnglish ? 'Selection Support' : '获取设备配置建议'}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
