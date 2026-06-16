import Image from 'next/image';
import Link from 'next/link';
import { navItems } from '@/lib/site';
import { getSiteSettings } from '@/lib/site-settings';
import { MobileNav } from '@/components/layout/MobileNav';
import { CTAButton } from '@/components/ui/CTAButton';

export async function SiteHeader() {
  const site = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-line/90 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="container flex h-[72px] items-center justify-between gap-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
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
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-steel md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <CTAButton href="/contact" variant="primary" size="md">
            获取技术方案
          </CTAButton>
        </div>

        <MobileNav items={navItems} />
      </div>
    </header>
  );
}
