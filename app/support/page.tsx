import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

const cards = {
  'zh-CN': [
    {
      title: '预约寄样喷涂测试',
      desc: '提交工件、粉末或涂料、目标膜厚与当前问题，进入寄样测试评估流程。',
      href: '/support/sample-coating-test',
    },
    {
      title: '应用工程支持',
      desc: '围绕选型、参数判断、边界条件和工艺稳定性提供工程支持。',
      href: '/support/application-engineering',
    },
    {
      title: '售后与维护',
      desc: '获取安装调试、备件、维护周期和远程支持说明。',
      href: '/support/after-sales',
    },
    {
      title: '资料下载',
      desc: '查看产品概览、参数表、维护指南和安装资料。',
      href: '/support/downloads',
    },
  ],
  en: [
    {
      title: 'Sample Coating Test',
      desc: 'Submit parts, powder or paint type, film target, and current issue for the sample test workflow.',
      href: '/support/sample-coating-test',
    },
    {
      title: 'Application Engineering',
      desc: 'Get engineering support on selection, parameter decisions, process boundaries, and repeatability.',
      href: '/support/application-engineering',
    },
    {
      title: 'After-sales & Service',
      desc: 'Review commissioning, spare parts, maintenance intervals, and remote support coverage.',
      href: '/support/after-sales',
    },
    {
      title: 'Downloads',
      desc: 'Access product overviews, data sheets, maintenance guides, and installation references.',
      href: '/support/downloads',
    },
  ],
} as const;

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '服务与支持', en: 'Service & Support' },
    description: {
      'zh-CN': '围绕寄样测试、应用工程、售后与资料下载建立统一支持入口。',
      en: 'Unified support entry for sample tests, application engineering, after-sales service, and downloads.',
    },
  });
}

export default async function SupportPage() {
  const { locale } = await getRequestContext();

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service & Support' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service & Support' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '把寄样测试、应用工程、售后与资料下载组织成统一入口，帮助客户更快进入下一步。',
            en: 'Organize sample testing, application engineering, after-sales coverage, and downloads into one support hub.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards[locale].map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="rounded-[24px] border border-line bg-white p-6 shadow-card transition-transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-steel">{item.desc}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service & Support' }), path: '/support' },
        ]}
      />
    </section>
  );
}
