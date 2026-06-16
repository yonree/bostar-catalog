import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '服务与支持', en: 'Service and Support' },
    description: {
      'zh-CN': '博士达提供设备选型、安装调试、操作培训、维护与故障排查支持。',
      en: 'BOSTAR provides selection, commissioning, training, maintenance, and troubleshooting support.',
    },
  });
}

const serviceCards = {
  'zh-CN': [
    { title: '选型咨询', desc: '根据工件、产量、材料类型和现场条件，推荐喷枪、控制器和供粉系统配置。' },
    { title: '安装调试', desc: '设备到场后执行安装、接线、通气和参数调试，验证上粉率和膜厚目标。' },
    { title: '操作培训', desc: '为操作员提供设备使用、参数设置、日常点检和安全规范培训。' },
    { title: '维护排查', desc: '提供故障排查路径、易损件周期建议和远程诊断支持。' },
  ],
  en: [
    { title: 'Selection Consulting', desc: 'Recommend spray guns, controllers, and supply systems from parts, output, material, and site conditions.' },
    { title: 'Commissioning', desc: 'Handle installation, wiring, air setup, and parameter tuning after equipment arrival to validate transfer efficiency and film targets.' },
    { title: 'Operator Training', desc: 'Train operators on use, parameter setup, daily inspection, and safety requirements.' },
    { title: 'Maintenance Support', desc: 'Provide troubleshooting paths, wear-part cycle guidance, and remote diagnosis support.' },
  ],
} as const;

export default async function ServicePage() {
  const { locale } = await getRequestContext();
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service and Support' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service and Support' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '围绕售前选型、交付实施和售后维护建立清晰服务链路。',
            en: 'A clear support chain from pre-sales selection through delivery and after-sales maintenance.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-4">
          {serviceCards[locale].map((item) => (
            <div key={item.title} className="rounded border border-line bg-dark-soft p-6 shadow-card">
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white-soft/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '服务支持', en: 'Service and Support' }), path: '/service' },
        ]}
      />
    </section>
  );
}
