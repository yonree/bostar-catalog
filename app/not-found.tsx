import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { pickLocaleValue } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';

export default async function NotFound() {
  const { locale } = await getRequestContext();

  return (
    <section className="section">
      <div className="container max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-4 text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">
          {pickLocaleValue(locale, { 'zh-CN': '页面未找到', en: 'Page Not Found' })}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-steel">
          {pickLocaleValue(locale, {
            'zh-CN': '请检查链接地址，或从产品中心、解决方案和支持中心继续浏览。',
            en: 'Check the address or continue from Products, Applications, or the Support hub.',
          })}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LocalizedLink
            href="/"
            className="rounded-full bg-primary px-6 py-3 font-semibold tracking-[0.08em] text-white"
          >
            {pickLocaleValue(locale, { 'zh-CN': '返回首页', en: 'Back to Home' })}
          </LocalizedLink>
          <LocalizedLink
            href="/search"
            className="rounded-full border border-line px-6 py-3 font-semibold tracking-[0.08em] text-ink"
          >
            {pickLocaleValue(locale, { 'zh-CN': '站内搜索', en: 'Search the Site' })}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
