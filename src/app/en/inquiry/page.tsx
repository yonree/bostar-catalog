'use client';
import { useState } from 'react';

export default function EnInquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    company: '',
    phone: '',
    email: '',
    region: '',
    requirement: '',
    needQuote: false,
    needSample: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">{'✅'}</p>
        <h1 className="text-xl font-semibold text-neutral-800 mb-2">Thank You!</h1>
        <p className="text-sm text-neutral-500">Your inquiry has been submitted. Our sales team will contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">Request a Quote</h1>
      <p className="text-sm text-neutral-500 mb-8">Fill in the form below and we will get back to you shortly</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
          <input required className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
          <input className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone *</label>
            <input required className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Region</label>
          <input className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Requirements *</label>
          <textarea required rows={4} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" checked={form.needQuote} onChange={(e) => setForm({ ...form, needQuote: e.target.checked })} className="rounded" />
            Need a quote
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" checked={form.needSample} onChange={(e) => setForm({ ...form, needSample: e.target.checked })} className="rounded" />
            Need a sample
          </label>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors">
          {loading ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}
