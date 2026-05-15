'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { label: '首页', href: '/', icon: '🏠' },
  { label: '产品', href: '/products', icon: '📦' },
  { label: '方案', href: '/solutions', icon: '🔧' },
  { label: 'AI', href: '/ai', icon: '🤖' },
  { label: '咨询', href: '/inquiry', icon: '💬' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-30 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full text-xs gap-0.5 transition-colors',
                isActive ? 'text-brand-600' : 'text-neutral-500'
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
