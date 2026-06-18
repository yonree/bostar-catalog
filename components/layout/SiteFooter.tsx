import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { getProductCategories } from '@/lib/cms-data';
import { getLocaleCopy } from '@/lib/locale-copy';
import { getRequestContext } from '@/lib/request-context';
import { getLocalizedSiteDescription } from '@/lib/site-copy';
import { getSiteSettings } from '@/lib/site-settings';

const supportLinks = [
  '/support',
  '/support/sample-coating-test',
  '/support/downloads',
  '/privacy-policy',
  '/cookie-policy',
];

const supportLabels = {
  'zh-CN': ['服务与支持', '寄样喷涂测试', '资料下载', '隐私政策', 'Cookie 政策'],
  en: ['Service & Support', 'Sample Coating Test', 'Downloads', 'Privacy Policy', 'Cookie Policy'],
} as const;

export async function SiteFooter() {
  const [site, productCategories, requestContext] = await Promise.all([
    getSiteSettings(),
    getProductCategories(),
    getRequestContext(),
  ]);
  const copy = getLocaleCopy(requestContext.locale);
  const description = getLocalizedSiteDescription(requestContext.locale, site);

  return (
    <footer className="border-t border-line bg-white">
      <div className="container grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr_0.9fr_0.8fr]">
        <div>
          <p className="text-2xl font-black text-ink">{site.brandCn}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-steel">{site.brandEn}</p>
          <p className="mt-6 max-w-md text-sm leading-7 text-steel">{description}</p>
          <div className="mt-6 space-y-2 text-sm text-steel">
            <p>{copy.footerContactLabels.phone}: {site.phone}</p>
            <p>{copy.footerContactLabels.email}: {site.email}</p>
            <p>{copy.footerContactLabels.address}: {site.address}</p>
            <p>{site.responsePromise}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">{copy.footerNavTitle}</p>
          <div className="mt-6 grid gap-3 text-sm text-steel">
            {copy.navItems.map((item) => (
              <LocalizedLink key={item.href} href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </LocalizedLink>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">{copy.footerProductsTitle}</p>
          <div className="mt-6 grid gap-3 text-sm text-steel">
            {productCategories.slice(0, 6).map((item) => (
              <LocalizedLink key={item.slug} href={`/products/${item.slug}`} className="transition-colors hover:text-ink">
                {item.name}
              </LocalizedLink>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            {requestContext.locale === 'en' ? 'Policies & Support' : '支持与合规'}
          </p>
          <div className="mt-6 grid gap-3 text-sm text-steel">
            {supportLinks.map((href, index) => (
              <LocalizedLink key={href} href={href} className="transition-colors hover:text-ink">
                {supportLabels[requestContext.locale][index]}
              </LocalizedLink>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-steel">
        Copyright {new Date().getFullYear()} {site.company}. {copy.copyrightSuffix}.
      </div>
    </footer>
  );
}
