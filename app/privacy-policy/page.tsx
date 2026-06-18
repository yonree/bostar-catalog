import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { Markdown } from '@/components/ui/Markdown';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

const body = {
  'zh-CN': `
## 数据收集范围

我们在询盘、寄样测试、下载和售后支持流程中收集联系人、公司、联系方式、国家或地区、工件信息、材料、附件和沟通记录。

## 使用目的

- 判断设备选型与工艺边界
- 安排报价、寄样测试、售后与备件支持
- 记录首次响应时间和内部分配状态
- 在用户主动请求时提供后续联系

## 数据保存与删除

表单数据仅用于业务沟通和服务交付。若用户要求删除或更正，可通过官网联系方式提出申请。

## 第三方服务

若使用 WhatsApp、企业微信、飞书或邮箱通知，相关数据会按对应服务商的处理方式传输。未经同意，我们不默认加载非必要第三方嵌入内容。
`,
  en: `
## Data We Collect

We collect contact details, company name, region, part information, coating material, attachments, and communication notes during inquiry, sample test, download, and after-sales workflows.

## Why We Use It

- Evaluate equipment selection and process boundaries
- Arrange quotations, sample coating tests, service, and spare-parts support
- Record first-response timing and internal assignment status
- Continue communication only when the user has requested it

## Retention and Deletion

Form data is used for business communication and service delivery. Users may request deletion or correction through the contact channels shown on this website.

## Third-party Services

If WhatsApp, WeCom, Feishu, or email notification channels are used, the relevant data may pass through those services. Non-essential third-party embeds stay disabled until consent is given.
`,
} as const;

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '隐私政策', en: 'Privacy Policy' },
    description: {
      'zh-CN': '说明询盘、寄样测试和支持流程中的个人与业务数据处理方式。',
      en: 'How inquiry, sample test, and support data is processed on the BOSTAR website.',
    },
  });
}

export default async function PrivacyPolicyPage() {
  const { locale } = await getRequestContext();
  return (
    <section className="section">
      <div className="container max-w-4xl">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '隐私政策', en: 'Privacy Policy' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '隐私政策', en: 'Privacy Policy' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '说明我们如何收集、使用、保存与删除询盘和支持流程中的数据。',
            en: 'How we collect, use, retain, and remove data from inquiry and support workflows.',
          })}
        />
        <div className="rounded-[28px] border border-line bg-white p-8 shadow-card">
          <Markdown className="prose-site">{body[locale]}</Markdown>
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '隐私政策', en: 'Privacy Policy' }), path: '/privacy-policy' },
        ]}
      />
    </section>
  );
}
