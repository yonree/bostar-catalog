'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    productCode: '',
    model: '',
    name: '',
    nameEn: '',
    categoryId: '',
    productType: 'single',
    tagline: '',
    description: '',
    slug: '',
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    fetch('/api/categories?includeHidden=true')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); });
  }, []);

  const update = (field: string, value: any) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.error?.message || '创建失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">新增产品</h2>
      <div className="bg-white rounded-xl border border-neutral-100 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="产品编码 *" value={form.productCode} onChange={(e) => update('productCode', e.target.value)} required />
            <Input label="产品型号" value={form.model} onChange={(e) => update('model', e.target.value)} />
          </div>
          <Input label="中文产品名称 *" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <Input label="英文产品名称" value={form.nameEn} onChange={(e) => update('nameEn', e.target.value)} />
          <Select
            label="所属分类 *"
            value={form.categoryId}
            onChange={(e) => update('categoryId', e.target.value)}
            options={[{ value: '', label: '请选择分类' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
          <Select
            label="产品类型"
            value={form.productType}
            onChange={(e) => update('productType', e.target.value)}
            options={[
              { value: 'single', label: '单品' },
              { value: 'system', label: '系统方案' },
              { value: 'accessory', label: '配件耗材' },
              { value: 'test_device', label: '检测设备' },
            ]}
          />
          <Input label="一句话定位" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-1">产品简介</label>
            <textarea
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => update('isPublished', e.target.checked)} />
              上架发布
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />
              重点推荐
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" loading={loading}>创建产品</Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>取消</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
