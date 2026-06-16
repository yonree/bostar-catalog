'use client';

export function LogoutButton() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <button
      onClick={logout}
      className="mt-4 rounded border border-line px-3 py-2 text-sm font-bold hover:bg-white/5"
    >
      退出登录
    </button>
  );
}
