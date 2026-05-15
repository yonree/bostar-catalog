'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories?includeHidden=true')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">分类管理</h2>
        <Button>新增分类</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500">分类名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500">Slug</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500">产品数</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500">排序</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">加载中...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm font-medium text-neutral-800">{cat.name}</td>
                <td className="px-4 py-3 text-sm text-neutral-400">{cat.slug}</td>
                <td className="px-4 py-3 text-sm text-neutral-600 text-center">{cat.productCount}</td>
                <td className="px-4 py-3 text-sm text-neutral-600 text-center">{cat.sortOrder}</td>
                <td className="px-4 py-3 text-right text-sm text-brand-600">编辑</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
