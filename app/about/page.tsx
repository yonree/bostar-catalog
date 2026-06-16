import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { pickLocaleValue } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: {
      'zh-CN': '关于博士达',
      en: 'About BOSTAR',
    },
    description: {
      'zh-CN': '了解博士达在工业喷涂设备、静电喷枪、自动化涂装系统和工程交付方面的能力。',
      en: 'Learn about BOSTAR capabilities in industrial coating equipment, electrostatic spray systems, and engineering delivery.',
    },
  });
}

const capabilities = {
  'zh-CN': [
    {
      title: '设备选型',
      desc: '根据工件材质、尺寸、产量和喷涂质量要求，推荐喷枪、控制器和供粉回收系统配置。',
    },
    {
      title: '工艺支持',
      desc: '覆盖上粉率优化、静电参数调试、膜厚均匀性控制和现场工艺稳定化支持。',
    },
    {
      title: '资料沉淀',
      desc: '把画册、操作手册、故障排查清单和维护指南组织为可检索的知识资产。',
    },
  ],
  en: [
    {
      title: 'Equipment Selection',
      desc: 'Recommend spray guns, controllers, and powder supply or recovery configurations from part material, size, output, and finish targets.',
    },
    {
      title: 'Process Support',
      desc: 'Support transfer-efficiency optimization, electrostatic parameter tuning, film-thickness consistency, and on-site process stabilization.',
    },
    {
      title: 'Knowledge Assets',
      desc: 'Organize catalogs, manuals, troubleshooting checklists, and maintenance guides into searchable technical assets.',
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
            <div key={item.title} className="rounded-[24px] border border-line bg-white p-6 shadow-card">
              <h2 className="text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-3 leading-7 text-steel">{item.desc}</p>
            </div>
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
