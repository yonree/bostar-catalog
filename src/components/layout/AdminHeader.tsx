'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  user?: { name?: string; email?: string } | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button className="lg:hidden text-neutral-600 text-xl">&equiv;</button>
        <h1 className="text-lg font-semibold text-neutral-800 hidden sm:block">BOSTAR 管理后台</h1>
      </div>

      <div className="flex items-center gap-3 relative">
        <span className="text-sm text-neutral-600 hidden sm:inline">{user?.name}</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            'w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-medium',
            'hover:bg-brand-200 transition-colors'
          )}
        >
          {user?.name?.charAt(0) || 'U'}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 z-30 animate-fade-in">
            <div className="px-3 py-2 border-b border-neutral-100">
              <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
              <p className="text-xs text-neutral-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
