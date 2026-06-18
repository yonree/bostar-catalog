import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TechFaqSection } from '@/components/ui/TechFaqSection';
import { getFaqs } from '@/lib/cms-data';
import { isEnglishLocale, pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': 'FAQ 常见问题', en: 'FAQ' },
    description: {
      'zh-CN': '静电喷枪选型、工艺调试、维护和资料下载常见问题。',
      en: 'Frequently asked questions on electrostatic spray-gun selection, process tuning, maintenance, and downloads.',
    },
  });
}

export default async function FaqPage() {
  const [faqs, { locale }] = await Promise.all([getFaqs(), getRequestContext()]);
  const isEnglish = isEnglishLocale(locale);

  return (
    <>
      {!isEnglish && <FAQJsonLd faqs={faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: 'FAQ', path: '/support/faq' },
        ]}
      />
      <section className="section">
        <div className="container max-w-4xl">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
          <SectionHeader
            headingLevel="h1"
            title={pickLocaleValue(locale, {
              'zh-CN': '常见问题',
              en: 'Frequently Asked Questions',
            })}
            description={pickLocaleValue(locale, {
              'zh-CN': '整理喷枪选型、工艺调试、操作维护和环境配置等高频问答，方便快速查阅。',
              en: 'High-frequency answers on equipment selection, process tuning, operation, maintenance, and environment setup.',
            })}
          />
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
      {!isEnglish && <TechFaqSection locale={locale} />}
    </>
  );
}
