import Image from 'next/image';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileNav } from '@/components/layout/MobileNav';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { CTAButton } from '@/components/ui/CTAButton';
import { getLocaleCopy } from '@/lib/locale-copy';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function SiteHeader() {
  const [site, requestContext] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const copy = getLocaleCopy(requestContext.locale);
  const isEnglish = requestContext.locale === 'en';

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/94 backdrop-blur-xl">
      <div className="border-b border-line/70 bg-dark text-white">
        <div className="container flex min-h-[40px] items-center justify-between gap-4 py-2 text-[11px] font-medium tracking-[0.08em]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 uppercase">
            <span>{site.responsePromise}</span>
            <span>{site.workHours}</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <a href={`tel:${site.phone}`} className="transition-colors hover:text-white/80">
              {isEnglish ? `${copy.topbar.phone}: ${site.phone}` : `${copy.topbar.phone}：${site.phone}`}
            </a>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-white/80">
              {isEnglish ? `${copy.topbar.email}: ${site.email}` : `${copy.topbar.email}：${site.email}`}
            </a>
            <LocalizedLink href="/search" className="transition-colors hover:text-white/80">
              {copy.topbar.search}
            </LocalizedLink>
          </div>
        </div>
      </div>

      <div className="container flex h-[72px] items-center justify-between gap-6">
        <LocalizedLink href="/" className="flex shrink-0 items-center gap-3">
          {site.logoUrl ? (
            <span className="relative h-11 w-11 overflow-hidden rounded-full border border-line bg-white">
              <Image src={site.logoUrl} alt={site.brandCn} fill className="object-contain p-1.5" unoptimized />
            </span>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              B
            </span>
          )}
          <span className="hidden sm:block">
            <span className="block text-base font-bold leading-tight text-ink">{site.brandCn}</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-steel">{site.brandEn}</span>
          </span>
        </LocalizedLink>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-steel lg:flex">
          {copy.navItems.map((item) => (
            <LocalizedLink key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </LocalizedLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher />
          <CTAButton href="/support/sample-coating-test" variant="secondary" size="md">
            {copy.secondaryCtaLabel}
          </CTAButton>
          <CTAButton href="/contact" variant="primary" size="md">
            {copy.primaryCtaLabel}
          </CTAButton>
        </div>

        <MobileNav
          items={copy.navItems}
          primaryCtaLabel={copy.primaryCtaLabel}
          secondaryCtaLabel={copy.secondaryCtaLabel}
          locale={requestContext.locale}
        />
      </div>
    </header>
  );
}
