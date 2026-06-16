import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TechFaqSection } from '@/components/ui/TechFaqSection';
import { TranslationNotice } from '@/components/ui/TranslationNotice';
import { getFaqs } from '@/lib/cms-data';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { isEnglishLocale, pickLocaleValue } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': 'FAQ \u5e38\u89c1\u95ee\u9898', en: 'FAQ' },
    description: {
      'zh-CN': '\u9759\u7535\u55b7\u67aa\u9009\u578b\u3001\u5de5\u827a\u8c03\u8bd5\u3001\u7ef4\u62a4\u548c\u8d44\u6599\u4e0b\u8f7d\u5e38\u89c1\u95ee\u9898\u3002',
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
          { name: pickLocaleValue(locale, { 'zh-CN': '\u9996\u9875', en: 'Home' }), path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
      />
      <section className="section">
        <div className="container max-w-4xl">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
          <SectionHeader
            headingLevel="h1"
            title={pickLocaleValue(locale, {
              'zh-CN': '\u5e38\u89c1\u95ee\u9898',
              en: 'Frequently Asked Questions',
            })}
            description={pickLocaleValue(locale, {
              'zh-CN': '\u6574\u7406\u55b7\u67aa\u9009\u578b\u3001\u5de5\u827a\u8c03\u8bd5\u3001\u64cd\u4f5c\u7ef4\u62a4\u548c\u73af\u5883\u914d\u7f6e\u7b49\u9ad8\u9891\u95ee\u7b54\uff0c\u65b9\u4fbf\u5feb\u901f\u67e5\u9605\u3002',
              en: 'High-frequency answers on equipment selection, process tuning, operation, maintenance, and environment setup.',
            })}
          />
          {isEnglish ? <TranslationNotice className="mb-8" /> : null}
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
      {!isEnglish && <TechFaqSection locale={locale} />}
    </>
  );
}
