import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = {
  title: '关于博士达',
  description: '了解博士达在工业喷涂设备、粉末与液体涂装系统和自动化产线方面的服务能力。',
};

const aboutCapabilities = [
  {
    title: '设备选型',
    desc: '根据工件材质、尺寸、产量和喷涂质量要求，推荐喷枪、控制器和供粉回收系统的合理配置。',
  },
  {
    title: '工艺支持',
    desc: '提供上粉率优化、电压电流参数调试、膜厚均匀性控制和粉末回收效率提升的现场指导。',
  },
  {
    title: '资料沉淀',
    desc: '整理产品画册、操作手册、故障排查清单和维护保养指南，形成可检索的技术知识资产。',
  },
];

export default async function AboutPage() {
  const siteSettings = await getSiteSettings();

  return (
    <section className="section section-alt border-y border-line">
      <div className="container">
        <Breadcrumb items={[{ label: '关于博士达' }]} />
        <SectionHeader
          headingLevel="h1"
          title={siteSettings.aboutTitle}
          description={siteSettings.aboutDescription}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {aboutCapabilities.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-line bg-white p-6 shadow-card"
            >
              <h2 className="text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-3 leading-7 text-steel">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
          { name: '关于博士达', path: '/about' },
        ]}
      />
    </section>
  );
}
