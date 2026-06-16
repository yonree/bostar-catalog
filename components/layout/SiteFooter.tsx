import Link from 'next/link';
import { getProductCategories } from '@/lib/cms-data';
import { navItems } from '@/lib/site';
import { getSiteSettings } from '@/lib/site-settings';

export async function SiteFooter() {
  const [site, productCategories] = await Promise.all([getSiteSettings(), getProductCategories()]);

  return (
    <footer className="border-t border-line bg-white">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.2fr_0.85fr_0.95fr]">
        <div>
          <p className="text-2xl font-black text-ink">{site.brandCn}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-steel">{site.brandEn}</p>
          <p className="mt-6 max-w-md text-sm leading-7 text-steel">{site.description}</p>
          <div className="mt-6 space-y-2 text-sm text-steel">
            <p>电话：{site.phone}</p>
            <p>邮箱：{site.email}</p>
            <p>地址：{site.address}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">网站导航</p>
          <div className="mt-6 grid gap-3 text-sm text-steel">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">核心设备</p>
          <div className="mt-6 grid gap-3 text-sm text-steel">
            {productCategories.slice(0, 6).map((item) => (
              <Link key={item.slug} href={`/products/${item.slug}`} className="transition-colors hover:text-ink">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-steel">
        © {new Date().getFullYear()} {site.company}. All rights reserved.
      </div>
    </footer>
  );
}
