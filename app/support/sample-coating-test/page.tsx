import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { localizeHref, pickLocaleValue } from '@/lib/i18n';

const steps = {
  'zh-CN': [
    '提交工件、材质、当前问题与目标膜厚',
    '应用工程师评估可行性与测试重点',
    '确认是否寄样、样件数量与时效要求',
    '安排喷涂测试并记录参数与结果',
    '返回设备配置建议与测试结论',
  ],
  en: [
    'Submit part, material, current issue, and target film thickness',
    'Application engineers review feasibility and test priorities',
    'Confirm sample quantity, shipping, and timing requirements',
    'Run the coating test and record parameters and results',
    'Return equipment recommendations and test conclusions',
  ],
} as const;

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '预约寄样喷涂测试', en: 'Request a Sample Coating Test' },
    description: {
      'zh-CN': '通过结构化表单提交工件、工艺与目标要求，进入博士达寄样喷涂测试流程。',
      en: 'Submit part, process, and target requirements through a structured form to start the BOSTAR sample coating test workflow.',
    },
  });
}

export default async function SampleCoatingTestPage() {
  const { locale } = await getRequestContext();

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '预约寄样喷涂测试', en: 'Sample Coating Test' }) }]} />
          <SectionHeader
            headingLevel="h1"
            title={pickLocaleValue(locale, { 'zh-CN': '预约寄样喷涂测试', en: 'Request a Sample Coating Test' })}
            description={pickLocaleValue(locale, {
              'zh-CN': '这不是普通联系表单，而是进入寄样评估、测试安排和配置建议工作流的入口。',
              en: 'This is not a generic contact form. It starts the sample evaluation, test scheduling, and equipment recommendation workflow.',
            })}
          />
          <div className="grid gap-3">
            {steps[locale].map((item, index) => (
              <div key={item} className="rounded-[24px] border border-line bg-white p-5 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Step {index + 1}</p>
                <p className="mt-2 text-sm leading-7 text-steel">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <LeadForm
            locale={locale}
            sourcePage={localizeHref('/support/sample-coating-test', locale)}
            sourceType="sample-test"
            defaultDemandType={pickLocaleValue(locale, {
              'zh-CN': '预约寄样喷涂测试',
              en: 'Request a Sample Coating Test',
            })}
          />
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service & Support' }), path: '/support' },
          { name: pickLocaleValue(locale, { 'zh-CN': '预约寄样喷涂测试', en: 'Sample Coating Test' }), path: '/support/sample-coating-test' },
        ]}
      />
    </section>
  );
}
