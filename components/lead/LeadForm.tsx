'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleCopy } from '@/lib/locale-copy';
import { getLocaleFromPathname } from '@/lib/i18n';

type LeadState = 'idle' | 'submitting' | 'success' | 'error';

export function LeadForm({
  sourcePage = '',
  interestedProduct = '',
}: {
  sourcePage?: string;
  interestedProduct?: string;
}) {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPathname(pathname);
  const copy = getLocaleCopy(locale).leadForm;
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
    setMessage(result.message || copy.success);
    setState(response.ok ? 'success' : 'error');
  }

  return (
    <form
      action={submit}
      className="grid gap-4 rounded border border-line bg-dark-soft p-6 shadow-card"
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="sourcePage" value={sourcePage || pathname} />
      <input type="hidden" name="interestedProduct" value={interestedProduct} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.name}
          <input
            name="name"
            required
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.name}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.company}
          <input
            name="company"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.company}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.phone}
          <input
            name="phone"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.phone}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.email}
          <input
            name="email"
            type="email"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="example@example.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.region}
          <input
            name="region"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.region}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.demandType}
          <select
            name="demandType"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            defaultValue={copy.demandOptions[0]}
          >
            {copy.demandOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-white-soft">
        {copy.message}
        <textarea
          name="message"
          rows={5}
          maxLength={2000}
          className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          placeholder={copy.placeholders.message}
        />
      </label>

      <button
        disabled={state === 'submitting'}
        className="rounded bg-primary px-5 py-3 text-sm font-semibold tracking-wider text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {state === 'submitting' ? copy.submitting : copy.submit}
      </button>

      {message ? (
        <p className={state === 'error' ? 'text-sm text-red-400' : 'text-sm text-primary'}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
