import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { FaqSection } from '@/components/ui/FaqSection';
import { Markdown } from '@/components/ui/Markdown';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getFaqs, getSolution } from '@/lib/cms-data';
import { isEnglishLocale, localizeHref } from '@/lib/i18n';
import { createResolvedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

const panelClass = 'rounded-[24px] border border-line bg-white p-6 shadow-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const solution = await getSolution(slug);
  const isEnglish = isEnglishLocale(locale);

  return createResolvedPageMetadata({
    title: solution?.title || (isEnglish ? 'Application Detail' : '解决方案详情'),
    description:
      solution?.aiSummary ||
      (isEnglish ? 'Application detail, process logic, and engineering inquiry entry point.' : '解决方案详情、工艺判断与工程咨询入口。'),
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const [solution, faqs] = await Promise.all([getSolution(slug), getFaqs(4)]);

  if (!solution) notFound();

  const isEnglish = isEnglishLocale(locale);
  const solutionsLabel = isEnglish ? 'Applications' : '行业解决方案';

  return (
    <>
      {!isEnglish && <FAQJsonLd faqs={faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: isEnglish ? 'Home' : '首页', path: '/' },
          { name: solutionsLabel, path: '/solutions' },
          { name: solution.title, path: `/solutions/${solution.slug}` },
        ]}
      />
      <section className="section">
        <div className="container">
          <Breadcrumb items={[{ label: solutionsLabel, href: '/solutions' }, { label: solution.title }]} />
          <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr]">
            <div>
              {solution.coverImage ? (
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-card">
                  <Image src={solution.coverImage} alt={solution.title} fill className="object-cover" unoptimized />
                </div>
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {solution.industry} · {solution.scene}
              </p>
              <h1 className="mt-3 max-w-3xl text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
                {solution.title}
              </h1>
              <div className="mt-6 rounded-[24px] border border-primary/20 bg-primary-light/35 p-6">
                <Markdown className="leading-8 text-ink">{solution.aiSummary}</Markdown>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {[
                  { title: isEnglish ? 'Pain Points' : '常见问题', items: solution.painPoints },
                  { title: isEnglish ? 'Recommended Equipment' : '推荐设备组合', items: solution.equipment },
                  { title: isEnglish ? 'Advantages' : '方案优势', items: solution.advantages },
                ].map((group) => (
                  <div key={group.title} className={panelClass}>
                    <h2 className="text-lg font-black text-ink">{group.title}</h2>
                    <div className="mt-4 grid gap-3">
                      {group.items.map((item) => (
                        <p key={item} className="text-sm leading-7 text-steel">{item}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {solution.recommendedPlan && (
                <div className="mt-8">
                  <SectionHeader title={isEnglish ? 'Recommended Plan' : '推荐工艺路线'} />
                  <div className={panelClass}>
                    <Markdown className="leading-8 text-steel">{solution.recommendedPlan}</Markdown>
                  </div>
                </div>
              )}
              {solution.content && (
                <div className="mt-8">
                  <SectionHeader title={isEnglish ? 'Solution Detail' : '方案详情'} />
                  <div className={panelClass}>
                    <Markdown className="leading-8 text-steel">{solution.content}</Markdown>
                  </div>
                </div>
              )}
            </div>
            <div>
              <SectionHeader
                title={isEnglish ? 'Consult This Application' : '咨询该方案'}
                description={isEnglish ? 'Submit part, line constraints, and target result for a more relevant recommendation.' : '提交工件、现有产线约束和目标结果，获取更贴近场景的设备与工艺建议。'}
              />
              <LeadForm
                locale={locale}
                sourcePage={localizeHref(`/solutions/${solution.slug}`, locale)}
                sourceType="solution"
                interestedSolution={solution.title}
                defaultDemandType={isEnglish ? 'Selection Support' : '获取设备配置建议'}
              />
            </div>
          </div>
        </div>
      </section>
      <FaqSection
        faqs={faqs}
        title={isEnglish ? 'Frequently Asked Questions' : '常见问题'}
        description={isEnglish ? 'Reusable answers related to the application workflow.' : '与该方案相关的常见问题和说明。'}
      />
    </>
  );
}
