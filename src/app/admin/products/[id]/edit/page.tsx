'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${params.id}`).then(r => r.json()),
      fetch('/api/categories?includeHidden=true').then(r => r.json()),
    ]).then(([productData, catData]) => {
      if (productData.success) setForm(productData.data);
      if (catData.success) setCategories(catData.data);
    }).finally(() => setLoading(false));
  }, [params.id]);

  const update = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.error?.message || '更新失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-neutral-400">加载中...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">编辑产品</h2>
      <div className="bg-white rounded-xl border border-neutral-100 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="产品编码" value={form.productCode || ''} onChange={(e) => update('productCode', e.target.value)} />
            <Input label="产品型号" value={form.model || ''} onChange={(e) => update('model', e.target.value)} />
          </div>
          <Input label="中文产品名称" value={form.name || ''} onChange={(e) => update('name', e.target.value)} />
          <Input label="英文产品名称" value={form.nameEn || ''} onChange={(e) => update('nameEn', e.target.value)} />
          <Select
            label="所属分类"
            value={form.categoryId || ''}
            onChange={(e) => update('categoryId', e.target.value)}
            options={[{ value: '', label: '请选择分类' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
          <Select
            label="产品类型"
            value={form.productType || 'single'}
            onChange={(e) => update('productType', e.target.value)}
            options={[
              { value: 'single', label: '单品' },
              { value: 'system', label: '系统方案' },
              { value: 'accessory', label: '配件耗材' },
              { value: 'test_device', label: '检测设备' },
            ]}
          />
          <Input label="一句话定位" value={form.tagline || ''} onChange={(e) => update('tagline', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-1">产品简介</label>
            <textarea
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              rows={3}
              value={form.description || ''}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublished || false} onChange={(e) => update('isPublished', e.target.checked)} />
              上架发布
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured || false} onChange={(e) => update('isFeatured', e.target.checked)} />
              重点推荐
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" loading={saving}>保存更改</Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>取消</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
