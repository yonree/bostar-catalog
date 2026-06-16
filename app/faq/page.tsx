import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { FAQJsonLd } from '@/components/schema/FAQJsonLd';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TechFaqSection } from '@/components/ui/TechFaqSection';
import { getFaqs } from '@/lib/cms-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FAQ 常见问题',
  description: '静电喷枪选型、工艺调试、故障排查、维护和资料下载常见问题。',
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <>
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[{ name: '首页', path: '/' }, { name: 'FAQ', path: '/faq' }]} />
      <section className="section">
        <div className="container max-w-4xl">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
          <SectionHeader headingLevel="h1" title="常见问题" description="整理喷枪选型、工艺调试、操作维护和环境配置等高频问答，方便快速查阅。" />
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
      <TechFaqSection />
    </>
  );
}
