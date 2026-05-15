'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { RoleSlug } from '@/lib/constants';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: RoleSlug[];
}

const navItems: NavItem[] = [
  { label: '仪表盘', href: '/admin', icon: '📊' },
  { label: '产品管理', href: '/admin/products', icon: '📦', roles: ['super_admin', 'product_manager'] },
  { label: '分类管理', href: '/admin/categories', icon: '📁', roles: ['super_admin', 'product_manager'] },
  { label: '询盘管理', href: '/admin/inquiries', icon: '💬', roles: ['super_admin', 'boss', 'salesperson', 'foreign_trade'] },
  { label: '数据分析', href: '/admin/analytics', icon: '📈', roles: ['super_admin', 'boss'] },
  { label: '业务员管理', href: '/admin/salespersons', icon: '👥', roles: ['super_admin', 'boss'] },
  { label: '用户管理', href: '/admin/users', icon: '⚙', roles: ['super_admin'] },
  { label: '系统设置', href: '/admin/settings', icon: '🔧', roles: ['super_admin'] },
];

interface AdminSidebarProps {
  userRole?: string;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole as RoleSlug);
  });

  return (
    <aside className="w-60 bg-white border-r border-neutral-200 min-h-screen hidden lg:block">
      <div className="p-4 border-b border-neutral-100">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-600">BOSTAR</span>
          <span className="text-xs text-neutral-400">管理后台</span>
        </Link>
      </div>
      <nav className="p-3 space-y-0.5">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 w-60 p-3 border-t border-neutral-100">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 rounded-lg">
          <span>&larr;</span> 返回前台
        </Link>
      </div>
    </aside>
  );
}
