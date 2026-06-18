import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

const blocks = {
  'zh-CN': [
    '围绕工件、材料、线速、膜厚和自动化接口，判断设备边界与配置方向。',
    '针对复杂工件、绝缘粉末、液体防腐和自动化联动场景给出测试与参数建议。',
    '把已验证的工艺要点沉淀到产品页、方案页、案例页与知识页。',
  ],
  en: [
    'Judge equipment boundaries and configuration direction from part geometry, material, line speed, film target, and automation interface requirements.',
    'Provide test and parameter guidance for complex parts, insulation powders, liquid corrosion protection, and automation-linked coating cells.',
    'Turn validated process knowledge into reusable product, application, case-study, and knowledge-center content.',
  ],
} as const;

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': '应用工程支持', en: 'Application Engineering' },
    description: {
      'zh-CN': '围绕设备选型、参数判断、测试安排和边界条件提供应用工程支持。',
      en: 'Application engineering support for equipment selection, parameter decisions, testing, and process boundaries.',
    },
  });
}

export default async function ApplicationEngineeringPage() {
  const { locale } = await getRequestContext();

  return (
    <section className="section section-alt border-y border-line">
      <div className="container">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': '应用工程支持', en: 'Application Engineering' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': '应用工程支持', en: 'Application Engineering' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '把“设备能不能用、该怎么配、哪些条件要额外评估”说清楚，而不是只给模糊推荐。',
            en: 'Clarify whether equipment fits, how it should be configured, and which boundary conditions require extra evaluation.',
          })}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {blocks[locale].map((item) => (
            <div key={item} className="rounded-[24px] border border-line bg-white p-6 shadow-card">
              <p className="text-sm leading-7 text-steel">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': '服务与支持', en: 'Service & Support' }), path: '/support' },
          { name: pickLocaleValue(locale, { 'zh-CN': '应用工程支持', en: 'Application Engineering' }), path: '/support/application-engineering' },
        ]}
      />
    </section>
  );
}
