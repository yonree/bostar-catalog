'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface InquiryFormProps {
  productId?: string;
  productName?: string;
  salespersonId?: string;
  onSuccess?: () => void;
}

export function InquiryForm({ productId, productName, salespersonId, onSuccess }: InquiryFormProps) {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          productId: productId || null,
          sourceType: salespersonId ? 'salesperson' : 'public',
          salespersonId: salespersonId || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(data.error?.message || '提交失败，请重试');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-lg font-semibold text-green-700">提交成功！</h3>
        <p className="text-sm text-neutral-500 mt-2">我们将尽快与您联系。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {productName && (
        <div className="bg-brand-50 text-brand-700 text-sm px-3 py-2 rounded-lg">
          咨询产品：{productName}
        </div>
      )}

      <Input
        label="客户姓名 *"
        value={form.customerName}
        onChange={(e) => updateField('customerName', e.target.value)}
        placeholder="请输入姓名"
        required
      />

      <Input
        label="公司名称"
        value={form.company}
        onChange={(e) => updateField('company', e.target.value)}
        placeholder="请输入公司名称（选填）"
      />

      <Input
        label="手机/WhatsApp *"
        value={form.phone}
        onChange={(e) => updateField('phone', e.target.value)}
        placeholder="请输入手机号码"
        required
      />

      <Input
        label="邮箱"
        type="email"
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="请输入邮箱（选填）"
      />

      <Input
        label="所在地区"
        value={form.region}
        onChange={(e) => updateField('region', e.target.value)}
        placeholder="请输入所在地区（选填）"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-800 mb-1">需求描述 *</label>
        <textarea
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          rows={4}
          value={form.requirement}
          onChange={(e) => updateField('requirement', e.target.value)}
          placeholder="请描述您的需求，例如：喷涂工件类型、生产量、涂料类型等"
          required
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={form.needQuote}
            onChange={(e) => updateField('needQuote', e.target.checked)}
            className="rounded border-neutral-300"
          />
          是否需要报价
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={form.needSample}
            onChange={(e) => updateField('needSample', e.target.checked)}
            className="rounded border-neutral-300"
          />
          是否需要样品测试
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        提交询盘
      </Button>
    </form>
  );
}
