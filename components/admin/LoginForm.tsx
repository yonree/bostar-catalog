'use client';

import { useState } from 'react';

export function LoginForm() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.message || '登录失败。');
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <input
        name="email"
        type="email"
        className="w-full rounded border border-line bg-white px-4 py-3 text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        placeholder="管理员邮箱"
        autoComplete="username"
        required
      />
      <input
        name="password"
        type="password"
        className="w-full rounded border border-line bg-white px-4 py-3 text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        placeholder="密码"
        autoComplete="current-password"
        required
      />
      <button
        disabled={loading}
        className="rounded bg-primary px-5 py-3 font-bold text-white disabled:opacity-60"
      >
        {loading ? '登录中...' : '登录'}
      </button>
      {message ? <p className="text-sm text-red-400">{message}</p> : null}
    </form>
  );
}
