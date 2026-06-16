'use client';

import { useState } from 'react';

type LeadState = 'idle' | 'submitting' | 'success' | 'error';

export function LeadForm({
  sourcePage = '',
  interestedProduct = '',
}: {
  sourcePage?: string;
  interestedProduct?: string;
}) {
  const [state, setState] = useState<LeadState>('idle');
  const [message, setMessage] = useState('');

  async function submit(formData: FormData) {
    setState('submitting');
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setMessage(result.message || '提交完成');
    setState(response.ok ? 'success' : 'error');
  }

  return (
    <form
      action={submit}
      className="grid gap-4 rounded border border-line bg-dark-soft p-6 shadow-card"
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <input type="hidden" name="interestedProduct" value={interestedProduct} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          姓名 *
          <input
            name="name"
            required
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="请输入姓名"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          公司
          <input
            name="company"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="公司名称"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          电话
          <input
            name="phone"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="手机或座机"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          邮箱
          <input
            name="email"
            type="email"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="example@example.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          地区
          <input
            name="region"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="如：广东佛山"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          需求类型
          <select name="demandType" className="rounded border border-line bg-white px-3 py-3 font-normal text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10">
            <option>设备选型</option>
            <option>获取报价</option>
            <option>资料下载</option>
            <option>售后与维护</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-white-soft">
        当前问题或工件信息
        <textarea
          name="message"
          rows={5}
          maxLength={2000}
          className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          placeholder="请描述工件、粉末、产量、现有问题，或希望了解的设备信息。"
        />
      </label>

      <button
        disabled={state === 'submitting'}
        className="rounded bg-primary px-5 py-3 text-sm font-semibold tracking-wider text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {state === 'submitting' ? '提交中...' : '提交询盘'}
      </button>

      {message ? (
        <p className={state === 'error' ? 'text-sm text-red-400' : 'text-sm text-primary'}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
