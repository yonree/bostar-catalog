'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-line bg-white/80"
        aria-label={open ? '关闭菜单' : '打开菜单'}
      >
        <span
          className={`block h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? 'translate-y-1 -rotate-45' : ''}`}
        />
        <span className={`block h-0.5 w-5 bg-ink transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
        <span
          className={`block h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? '-translate-y-3 rotate-45' : ''}`}
        />
      </button>
      <nav className={`mobile-menu absolute left-0 right-0 top-[72px] border-b border-line bg-white/95 shadow-[0_20px_40px_rgba(15,23,42,0.08)] ${open ? 'open' : ''}`}>
        <div className="container flex flex-col gap-1 py-5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-primary-light"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold tracking-[0.08em] text-white"
          >
            获取技术方案
          </Link>
        </div>
      </nav>
    </div>
  );
}
