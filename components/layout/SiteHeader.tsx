import Image from 'next/image';
import { MobileNav } from '@/components/layout/MobileNav';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { LocalizedLink } from '@/components/routing/LocalizedLink';
import { CTAButton } from '@/components/ui/CTAButton';
import { getLocaleCopy } from '@/lib/locale-copy';
import { getRequestContext } from '@/lib/request-context';
import { getSiteSettings } from '@/lib/site-settings';

export async function SiteHeader() {
  const [site, requestContext] = await Promise.all([getSiteSettings(), getRequestContext()]);
  const copy = getLocaleCopy(requestContext.locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line/90 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <LocalizedLink href="/" className="flex shrink-0 items-center gap-3">
          {site.logoUrl ? (
            <span className="relative h-10 w-10 overflow-hidden rounded-full border border-line bg-white">
              <Image src={site.logoUrl} alt={site.brandCn} fill className="object-contain p-1.5" unoptimized />
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              B
            </span>
          )}
          <span className="hidden sm:block">
            <span className="block text-base font-bold leading-tight text-ink">{site.brandCn}</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-steel">{site.brandEn}</span>
          </span>
        </LocalizedLink>

        <nav className="hidden items-center gap-7 text-sm font-medium text-steel md:flex">
          {copy.navItems.map((item) => (
            <LocalizedLink key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </LocalizedLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher />
          <CTAButton href="/contact" variant="primary" size="md">
            {copy.primaryCtaLabel}
          </CTAButton>
        </div>

        <MobileNav items={copy.navItems} primaryCtaLabel={copy.primaryCtaLabel} locale={requestContext.locale} />
      </div>
    </header>
  );
}
