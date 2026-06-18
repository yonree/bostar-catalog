import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { JsonLd } from '@/components/schema/JsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { localizeHref, pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '联系博士达', en: 'Contact BOSTAR' },
    description: {
      'zh-CN': '提交静电喷涂设备选型、报价、资料下载和售后维护需求。',
      en: 'Submit equipment selection, quotation, resource, and support requests for BOSTAR coating systems.',
    },
  });
}

export default async function ContactPage() {
  const [site, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const isEnglish = locale === 'en';

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${site.url}${localizeHref('/contact', locale)}#localbusiness`,
          name: site.company,
          parentOrganization: {
            '@type': 'IndustrialManufacturer',
            '@id': `${site.url}/#corporation`,
            name: site.company,
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'CN',
          },
          telephone: site.phone,
          email: site.email,
          url: `${site.url}${localizeHref('/contact', locale)}`,
          areaServed: { '@type': 'Country', name: 'CN' },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '联系博士达', en: 'Contact' }), path: '/contact' },
        ]}
      />
      <section className="section">
        <div className="container grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '联系博士达', en: 'Contact' }) }]} />
            <SectionHeader
              headingLevel="h1"
              title={pickLocaleValue(locale, { 'zh-CN': '联系博士达', en: 'Contact BOSTAR' })}
              description={pickLocaleValue(locale, {
                'zh-CN': '请填写工件、产量、材料、当前问题或关注产品，便于工程团队快速判断配置方向。',
                en: 'Share parts, output, material, current issues, or target products so the engineering team can evaluate the right configuration quickly.',
              })}
            />
            <div className="rounded border border-line bg-dark-soft p-6 leading-8 text-white-soft/80">
              <p><span className="mr-2 text-primary">&#9679;</span>{isEnglish ? 'Company' : '公司'}: {site.company}</p>
              <p><span className="mr-2 text-primary">&#9742;</span>{isEnglish ? 'Phone' : '电话'}: {site.phone}</p>
              <p><span className="mr-2 text-primary">&#9993;</span>{isEnglish ? 'Email' : '邮箱'}: {site.email}</p>
              <p><span className="mr-2 text-primary">&#9873;</span>{isEnglish ? 'Address' : '地址'}: {site.address}</p>
            </div>
          </div>
          <LeadForm
            locale={locale}
            sourcePage={localizeHref('/contact', locale)}
            sourceType="contact"
            defaultDemandType={pickLocaleValue(locale, {
              'zh-CN': '获取设备配置建议',
              en: 'Request a Quotation',
            })}
          />
        </div>
      </section>
    </>
  );
}
