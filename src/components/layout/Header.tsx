'use client';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-600">BOSTAR</span>
            <span className="hidden sm:inline text-xs text-neutral-400 border-l border-neutral-200 pl-2">
              智能电子画册
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">首页</NavLink>
            <NavLink href="/products">产品中心</NavLink>
            <NavLink href="/solutions">系统方案</NavLink>
            <NavLink href="/videos">视频中心</NavLink>
            <NavLink href="/downloads">资料下载</NavLink>
            <NavLink href="/ai">AI顾问</NavLink>
            <NavLink href="/contact">联系我们</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/inquiry" className="hidden sm:inline-flex bg-brand-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
              在线询盘
            </Link>
            <button
              className="md:hidden p-2 text-neutral-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 animate-fade-in">
          <nav className="px-4 py-2 space-y-1">
            <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>首页</MobileNavLink>
            <MobileNavLink href="/products" onClick={() => setMenuOpen(false)}>产品中心</MobileNavLink>
            <MobileNavLink href="/solutions" onClick={() => setMenuOpen(false)}>系统方案</MobileNavLink>
            <MobileNavLink href="/videos" onClick={() => setMenuOpen(false)}>视频中心</MobileNavLink>
            <MobileNavLink href="/downloads" onClick={() => setMenuOpen(false)}>资料下载</MobileNavLink>
            <MobileNavLink href="/ai" onClick={() => setMenuOpen(false)}>AI顾问</MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setMenuOpen(false)}>联系我们</MobileNavLink>
            <MobileNavLink href="/inquiry" onClick={() => setMenuOpen(false)}>在线询盘</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm text-neutral-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2.5 text-sm text-neutral-700 hover:bg-brand-50 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
