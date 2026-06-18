'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocaleCopy } from '@/lib/locale-copy';
import type { Locale } from '@/lib/i18n';

type LeadState = 'idle' | 'submitting' | 'success' | 'error';

type LeadFormProps = {
  locale: Locale;
  sourcePage?: string;
  sourceType?: string;
  interestedProduct?: string;
  interestedSolution?: string;
  defaultDemandType?: string;
};

type AttachmentUploadResult = {
  success: boolean;
  attachmentToken?: string;
  message?: string;
};

export function LeadForm({
  locale,
  sourcePage = '',
  sourceType = 'general',
  interestedProduct = '',
  interestedSolution = '',
  defaultDemandType = '',
}: LeadFormProps) {
  const router = useRouter();
  const copy = getLocaleCopy(locale).leadForm;
  const [state, setState] = useState<LeadState>('idle');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [attachmentToken, setAttachmentToken] = useState('');

  async function uploadAttachment(file: File | null): Promise<AttachmentUploadResult> {
    if (!file) {
      return { success: true };
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/lead-attachments', {
      method: 'POST',
      body: formData,
    });

    const result = (await response.json()) as AttachmentUploadResult;
    setUploading(false);

    if (!response.ok) {
      return {
        success: false,
        message: result.message || copy.uploadFailed,
      };
    }

    return result;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('');
    setAttachmentToken('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const attachment = formData.get('attachment');
    const uploadResult = await uploadAttachment(attachment instanceof File ? attachment : null);

    if (!uploadResult.success) {
      setState('error');
      setMessage(uploadResult.message || copy.uploadFailed);
      return;
    }

    setAttachmentToken(uploadResult.attachmentToken || '');

    const searchParams = new URLSearchParams(window.location.search);
    const payload = {
      name: formData.get('name'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      whatsapp: formData.get('whatsapp'),
      wechat: formData.get('wechat'),
      country: formData.get('country'),
      workpiece: formData.get('workpiece'),
      workpieceMaterial: formData.get('workpieceMaterial'),
      coatingMaterial: formData.get('coatingMaterial'),
      target: formData.get('target'),
      capacity: formData.get('capacity'),
      demandType: formData.get('demandType'),
      currentIssue: formData.get('message'),
      message: formData.get('message'),
      privacyConsent: formData.get('privacyConsent') === 'on',
      sourcePage,
      sourceType,
      referrer: document.referrer,
      interestedProduct,
      interestedSolution,
      locale,
      attachmentTokens: uploadResult.attachmentToken ? [uploadResult.attachmentToken] : [],
      utmSource: searchParams.get('utm_source') || '',
      utmMedium: searchParams.get('utm_medium') || '',
      utmCampaign: searchParams.get('utm_campaign') || '',
      utmTerm: searchParams.get('utm_term') || '',
      utmContent: searchParams.get('utm_content') || '',
    };

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setState('error');
      setMessage(result.message || copy.success);
      return;
    }

    setState('success');
    setMessage(result.message || copy.success);
    form.reset();
    setAttachmentToken('');

    if (result.redirectUrl) {
      const redirectUrl = `${result.redirectUrl}?inquiry=${encodeURIComponent(result.inquiryNumber || '')}`;
      router.push(redirectUrl);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[28px] border border-line bg-dark-soft p-6 shadow-card">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

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
            required
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
            placeholder={copy.placeholders.email}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.whatsapp}
          <input
            name="whatsapp"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.whatsapp}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.wechat}
          <input
            name="wechat"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.wechat}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.country}
          <input
            name="country"
            required
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.country}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.demandType}
          <select
            name="demandType"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            defaultValue={defaultDemandType || copy.demandOptions[0]}
          >
            {copy.demandOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.workpiece}
          <input
            name="workpiece"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.workpiece}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.workpieceMaterial}
          <input
            name="workpieceMaterial"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.workpieceMaterial}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.coatingMaterial}
          <input
            name="coatingMaterial"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.coatingMaterial}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.target}
          <input
            name="target"
            required
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.target}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-white-soft">
          {copy.capacity}
          <input
            name="capacity"
            className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder={copy.placeholders.capacity}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-white-soft">
        {copy.message}
        <textarea
          name="message"
          rows={5}
          maxLength={4000}
          className="rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          placeholder={copy.placeholders.message}
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-white-soft">
        {copy.attachment}
        <input
          name="attachment"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="rounded border border-dashed border-line bg-white px-3 py-3 font-normal text-ink file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
      </label>

      {attachmentToken ? <input type="hidden" name="attachmentToken" value={attachmentToken} /> : null}

      <label className="flex items-start gap-3 text-sm text-white-soft">
        <input
          name="privacyConsent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-line"
        />
        <span>{copy.privacyConsent}</span>
      </label>

      <button
        disabled={state === 'submitting' || uploading}
        className="rounded-full bg-primary px-5 py-3 text-sm font-semibold tracking-wider text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {state === 'submitting' || uploading ? copy.submitting : copy.submit}
      </button>

      {message ? (
        <p className={state === 'error' ? 'text-sm text-red-300' : 'text-sm text-primary-light'}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
