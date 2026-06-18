import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { pickLocaleValue } from '@/lib/i18n';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: {
      'zh-CN': '关于博士达',
      en: 'About BOSTAR',
    },
    description: {
      'zh-CN': '了解博士达在工业喷涂设备、静电喷枪、旋杯系统与工程交付方面的能力。',
      en: 'Learn about BOSTAR capabilities in industrial coating equipment, electrostatic spray systems, and engineering delivery.',
    },
  });
}

const capabilities = {
  'zh-CN': [
    {
      title: '设备选型与工艺判断',
      desc: '根据工件材质、尺寸、产量和喷涂质量要求，判断喷枪、控制器、供粉或供漆系统的配置方向。',
      href: '/support/application-engineering',
    },
    {
      title: '制造与测试能力',
      desc: '围绕研发、装配、样件喷涂和测试记录，建立可验证的制造与交付能力。',
      href: '/about/research-and-manufacturing',
    },
    {
      title: '海外业务与支持',
      desc: '覆盖英文询盘、出口包装、远程支持和海外备件协同的业务链路。',
      href: '/about/global-business',
    },
  ],
  en: [
    {
      title: 'Selection & Process Decisions',
      desc: 'Evaluate spray guns, controllers, and powder or liquid supply configurations from part material, dimensions, throughput, and finish targets.',
      href: '/support/application-engineering',
    },
    {
      title: 'Manufacturing & Testing',
      desc: 'Support credibility through engineering, assembly, sample coating tests, and documented verification steps.',
      href: '/about/research-and-manufacturing',
    },
    {
      title: 'Global Support',
      desc: 'Handle English inquiries, export packaging, remote support, and overseas spare-parts coordination.',
      href: '/about/global-business',
    },
  ],
} as const;

export default async function AboutPage() {
  const [siteSettings, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const title = pickLocaleValue(locale, {
    'zh-CN': siteSettings.aboutTitle,
    en: `About ${siteSettings.brandEn}`,
  });
  const description = pickLocaleValue(locale, {
    'zh-CN': siteSettings.aboutDescription,
    en: 'Industrial coating equipment expertise, project delivery capability, and knowledge infrastructure for BOSTAR customers.',
  });
  const breadcrumbLabel = pickLocaleValue(locale, { 'zh-CN': '关于博士达', en: 'About' });

  return (
    <section className="section section-alt border-y border-line">
      <div className="container">
        <Breadcrumb items={[{ label: breadcrumbLabel }]} />
        <SectionHeader headingLevel="h1" title={title} description={description} />
        <div className="grid gap-6 md:grid-cols-3">
          {capabilities[locale].map((item) => (
            <LocalizedLink
              key={item.title}
              href={item.href}
              className="rounded-[24px] border border-line bg-white p-6 shadow-card transition-transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-3 leading-7 text-steel">{item.desc}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: breadcrumbLabel, path: '/about' },
        ]}
      />
    </section>
  );
}
