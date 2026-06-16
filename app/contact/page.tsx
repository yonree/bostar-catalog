import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LeadForm } from '@/components/lead/LeadForm';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { JsonLd } from '@/components/schema/JsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: '联系我们',
  description: '提交静电喷涂设备选型、报价、资料下载和售后维护需求。',
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${siteConfig.url}/contact#localbusiness`,
          name: siteConfig.company,
          parentOrganization: { '@type': 'IndustrialManufacturer', '@id': `${siteConfig.url}/#corporation`, name: siteConfig.company },
          address: {
            '@type': 'PostalAddress',
            addressLocality: '深圳市',
            addressRegion: '广东省',
            addressCountry: 'CN',
          },
          telephone: siteConfig.phone,
          email: siteConfig.email,
          url: siteConfig.url,
          areaServed: { '@type': 'Country', name: 'CN' },
        }}
      />
      <BreadcrumbJsonLd items={[{ name: '首页', path: '/' }, { name: '联系我们', path: '/contact' }]} />
      <section className="section">
      <div className="container grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Breadcrumb items={[{ label: '联系我们' }]} />
          <SectionHeader
            headingLevel="h1"
            title="联系博士达"
            description="请填写工件、产量、粉末、现场问题或关注产品，便于快速判断设备配置。"
          />
          <div className="rounded border border-line bg-dark-soft p-6 leading-8 text-white-soft/80">
            <p><span className="mr-2 text-primary">&#9679;</span>公司：{siteConfig.company}</p>
            <p><span className="mr-2 text-primary">&#9742;</span>电话：{siteConfig.phone}</p>
            <p><span className="mr-2 text-primary">&#9993;</span>邮箱：{siteConfig.email}</p>
            <p><span className="mr-2 text-primary">&#9873;</span>地址：{siteConfig.address}</p>
          </div>
        </div>
        <LeadForm sourcePage="/contact" />
      </div>
    </section>
    </>
  );
}
