import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { getLocaleCopy } from '@/lib/locale-copy';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function MobileActionBar() {
  const [site, { locale }] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const copy = getLocaleCopy(locale);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/96 backdrop-blur md:hidden">
      <div className="grid grid-cols-3">
        <a
          href={locale === 'en' ? `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}` : `tel:${site.phone}`}
          className="flex min-h-[60px] items-center justify-center px-3 text-center text-xs font-semibold text-ink"
        >
          {locale === 'en' ? copy.topbar.whatsapp : copy.topbar.phone}
        </a>
        <LocalizedLink
          href="/support/sample-coating-test"
          className="flex min-h-[60px] items-center justify-center border-x border-line px-3 text-center text-xs font-semibold text-ink"
        >
          {copy.secondaryCtaLabel}
        </LocalizedLink>
        <LocalizedLink
          href="/contact"
          className="flex min-h-[60px] items-center justify-center px-3 text-center text-xs font-semibold text-primary"
        >
          {copy.primaryCtaLabel}
        </LocalizedLink>
      </div>
    </div>
  );
}
