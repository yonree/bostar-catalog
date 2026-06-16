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
import { TranslationNotice } from '@/components/ui/TranslationNotice';
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
  const solutionLabel = solution?.title || 'BOSTAR';

  return createResolvedPageMetadata({
    title:
      solution?.title && isEnglish
        ? `${solution.title} Solution`
        : solution?.title || (isEnglish ? 'Solution Detail' : '解决方案'),
    description:
      (isEnglish
        ? `${solutionLabel} solution detail, source-language summary, and inquiry entry point.`
        : solution?.aiSummary) ||
      (isEnglish ? 'Industrial coating solution detail and inquiry entry point.' : '解决方案详情。'),
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { locale }] = await Promise.all([params, getRequestContext()]);
  const solution = await getSolution(slug);
  const faqs = await getFaqs(4);

  if (!solution) notFound();

  const isEnglish = isEnglishLocale(locale);
  const solutionsLabel = isEnglish ? 'Solutions' : '解决方案';

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
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              {solution.coverImage ? (
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[24px] border border-line bg-bg-soft shadow-card">
                  <Image
                    src={solution.coverImage}
                    alt={solution.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
              <div className="flex items-center gap-3 text-sm text-steel">
                <span>{solution.industry}</span>
                <span>/</span>
                <span>{solution.scene}</span>
              </div>
              <h1 className="mt-3 max-w-3xl text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
                {solution.title}
              </h1>
              {isEnglish ? <TranslationNotice className="mt-6 max-w-3xl" /> : null}
              <div className="mt-6 rounded-[22px] border border-primary/20 bg-primary-light/35 p-6">
                <Markdown className="leading-8 text-ink">{solution.aiSummary}</Markdown>
              </div>
              <div className="mt-10 grid gap-8">
                <InfoBlock title={isEnglish ? 'Common Customer Pain Points' : '客户常见痛点'} items={solution.painPoints} />
                <InfoBlock title={isEnglish ? 'Recommended Equipment Combination' : '推荐设备组合'} items={solution.equipment} />
                <InfoBlock title={isEnglish ? 'Solution Advantages' : '方案优势'} items={solution.advantages} />
              </div>
              {solution.recommendedPlan && (
                <div className="mt-8">
                  <h2 className="text-2xl font-black text-ink">{isEnglish ? 'Recommended Plan' : '推荐方案'}</h2>
                  <div className={`${panelClass} mt-4`}>
                    <Markdown className="leading-8 text-steel">{solution.recommendedPlan}</Markdown>
                  </div>
                </div>
              )}
              {solution.processFlow.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-black text-ink">{isEnglish ? 'Process Flow' : '工艺流程'}</h2>
                  <div className="mt-4 space-y-3">
                    {solution.processFlow.map((step, index) => (
                      <div key={step} className={`${panelClass} flex items-center gap-4`}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="text-steel">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {solution.keyControls.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-black text-ink">{isEnglish ? 'Key Control Points' : '关键控制点'}</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {solution.keyControls.map((item) => (
                      <div key={item} className={`${panelClass} text-sm text-steel`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {solution.content && (
                <div className="mt-8">
                  <h2 className="text-2xl font-black text-ink">{isEnglish ? 'Solution Detail' : '方案详情'}</h2>
                  <div className={`${panelClass} mt-4`}>
                    <Markdown className="leading-8 text-steel">{solution.content}</Markdown>
                  </div>
                </div>
              )}
            </div>
            <div>
              <SectionHeader
                title={isEnglish ? 'Consult This Solution' : '咨询方案'}
                description={
                  isEnglish
                    ? 'Submit parts, takt time, quality targets, and current line constraints for a more relevant equipment recommendation.'
                    : '提交现场工件、节拍、质量问题和现有设备配置。'
                }
              />
              <LeadForm
                locale={locale}
                sourcePage={localizeHref(`/solutions/${solution.slug}`, locale)}
              />
            </div>
          </div>
        </div>
      </section>
      <FaqSection
        faqs={faqs}
        title={isEnglish ? 'Frequently Asked Questions' : '常见问题'}
        description={isEnglish ? 'Common questions and answers related to this solution.' : '关于本方案的常见疑问与解答。'}
      />
    </>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className={`${panelClass} text-steel`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
