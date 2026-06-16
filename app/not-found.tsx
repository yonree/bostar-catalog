import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { pickLocaleValue } from '@/lib/i18n';
import { getRequestContext } from '@/lib/request-context';

export default async function NotFound() {
  const { locale } = await getRequestContext();
  const title = pickLocaleValue(locale, {
    'zh-CN': '\u9875\u9762\u672a\u627e\u5230',
    en: 'Page Not Found',
  });
  const description = pickLocaleValue(locale, {
    'zh-CN': '\u8bf7\u68c0\u67e5\u94fe\u63a5\u5730\u5740\uff0c\u6216\u8fd4\u56de\u9996\u9875\u7ee7\u7eed\u6d4f\u89c8\u3002',
    en: 'Check the address or return to the homepage to continue browsing.',
  });
  const backHome = pickLocaleValue(locale, {
    'zh-CN': '\u8fd4\u56de\u9996\u9875',
    en: 'Back to Home',
  });

  return (
    <section className="section">
      <div className="container max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-4 text-[42px] font-black leading-[1.06] text-ink md:text-[56px]">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-steel">{description}</p>
        <LocalizedLink
          href="/"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold tracking-[0.08em] text-white transition-colors hover:bg-primary-dark"
        >
          {backHome}
        </LocalizedLink>
      </div>
    </section>
  );
}
