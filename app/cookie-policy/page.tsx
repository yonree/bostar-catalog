import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/schema/BreadcrumbJsonLd';
import { Markdown } from '@/components/ui/Markdown';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createLocalizedPageMetadata } from '@/lib/page-metadata';
import { getRequestContext } from '@/lib/request-context';
import { pickLocaleValue } from '@/lib/i18n';

const body = {
  'zh-CN': `
## 必要 Cookie

本站默认只启用必要 Cookie，用于语言偏好、登录会话连续性与表单安全。

## 可选 Cookie

若未来启用第三方视频、地图或即时通讯嵌入，相关 Cookie 将在用户明确同意后再加载。

## 偏好管理

用户可以通过页面底部的 Cookie 偏好弹层选择仅保留必要 Cookie，或允许未来的可选嵌入服务。
`,
  en: `
## Necessary Cookies

This website enables only necessary cookies by default for language preference, session continuity, and form security.

## Optional Cookies

If third-party video, map, or instant messaging embeds are added in the future, the related cookies will only load after explicit user consent.

## Managing Preferences

Users can choose necessary-only cookies or enable future optional embedded services through the cookie preference panel.
`,
} as const;

export async function generateMetadata() {
  return createLocalizedPageMetadata({
    title: { 'zh-CN': 'Cookie 政策', en: 'Cookie Policy' },
    description: {
      'zh-CN': '说明本站默认启用的必要 Cookie，以及可选 Cookie 的管理方式。',
      en: 'How necessary cookies are used on this website and how optional cookie preferences are managed.',
    },
  });
}

export default async function CookiePolicyPage() {
  const { locale } = await getRequestContext();
  return (
    <section className="section section-alt border-y border-line">
      <div className="container max-w-4xl">
        <Breadcrumb items={[{ label: pickLocaleValue(locale, { 'zh-CN': 'Cookie 政策', en: 'Cookie Policy' }) }]} />
        <SectionHeader
          headingLevel="h1"
          title={pickLocaleValue(locale, { 'zh-CN': 'Cookie 政策', en: 'Cookie Policy' })}
          description={pickLocaleValue(locale, {
            'zh-CN': '说明哪些 Cookie 默认开启，哪些第三方服务必须在同意后才会启用。',
            en: 'Which cookies stay on by default and which third-party services require consent before activation.',
          })}
        />
        <div className="rounded-[28px] border border-line bg-white p-8 shadow-card">
          <Markdown className="prose-site">{body[locale]}</Markdown>
        </div>
      </div>
      <BreadcrumbJsonLd
        items={[
          { name: pickLocaleValue(locale, { 'zh-CN': '首页', en: 'Home' }), path: '/' },
          { name: pickLocaleValue(locale, { 'zh-CN': 'Cookie 政策', en: 'Cookie Policy' }), path: '/cookie-policy' },
        ]}
      />
    </section>
  );
}
