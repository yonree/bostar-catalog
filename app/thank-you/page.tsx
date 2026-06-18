import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '提交成功', en: 'Inquiry Submitted' },
    description: {
      'zh-CN': '博士达已收到您的询盘或寄样测试需求。',
      en: 'BOSTAR has received your inquiry or sample coating test request.',
    },
    robots: {
      index: false,
      follow: false,
    },
  });
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ inquiry?: string }>;
}) {
  const [{ locale }, { inquiry }] = await Promise.all([getRequestContext(), searchParams]);

  return (
    <section className="section">
      <div className="container max-w-3xl text-center">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '提交成功', en: 'Inquiry Submitted' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '需求已提交', en: 'Inquiry Submitted' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '工作时间内，销售或应用工程团队将在 30 分钟内响应；非工作时间提交的需求将在下一个工作时段优先处理。',
            en: 'During business hours, our sales or application team responds within 30 minutes. Requests submitted outside business hours are prioritized in the next working session.',
          })}
        />
        <div className="rounded-[28px] border border-line bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.16em] text-primary">
            {pickLocaleValue(locale, { 'zh-CN': '询盘编号', en: 'Inquiry Number' })}
          </p>
          <p className="mt-3 text-3xl font-black text-ink">{inquiry || 'Pending'}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LocalizedLink href="/contact" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
              {pickLocaleValue(locale, { 'zh-CN': '返回联系页', en: 'Back to Contact' })}
            </LocalizedLink>
            <LocalizedLink href="/support" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink">
              {pickLocaleValue(locale, { 'zh-CN': '查看支持中心', en: 'View Support Hub' })}
            </LocalizedLink>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '提交成功', en: 'Inquiry Submitted' }), path: '/thank-you' },
        ]}
      />
    </section>
  );
}
