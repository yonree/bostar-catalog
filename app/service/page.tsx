import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: '服务与支持',
  description: '博士达提供设备选型、安装调试、操作培训、维护与故障排查支持。',
};

export default function ServicePage() {
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: '服务与支持' }]} />
        <SectionHeader
          headingLevel="h1"
          title="服务与支持"
          description="围绕售前选型、售中交付和售后维护建立清晰服务链路。"
        />
        <div className="grid gap-5 md:grid-cols-4">
          {[
            { title: '选型咨询', desc: '根据工件、产量、粉末类型和现场条件，推荐合适的喷枪型号、控制器和供粉系统配置方案。' },
            { title: '安装调试', desc: '设备到场后由工程师现场安装、接线、通气调试，确保上粉率和膜厚达到工艺要求。' },
            { title: '操作培训', desc: '对产线操作员进行设备使用、参数设置、日常点检和安全规范培训，直到独立上岗。' },
            { title: '维护排查', desc: '提供常见故障排查指南、易损件更换周期建议和远程视频诊断支持的售后服务体系。' },
          ].map((item) => (
            <div key={item.title} className="rounded border border-line bg-dark-soft p-6 shadow-card">
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
        <BreadcrumbJsonLd items={[{ name: '首页', path: '/' }, { name: '服务支持', path: '/service' }]} />
    </section>
  );
}
