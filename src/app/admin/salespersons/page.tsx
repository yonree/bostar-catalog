'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminSalespersonsPage() {
  const [salespersons, setSalespersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/salespersons')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSalespersons(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">业务员管理</h2>
        <Button>新增业务员</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500">姓名</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden sm:table-cell">部门</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden md:table-cell">联系方式</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500">状态</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">加载中...</td></tr>
            ) : salespersons.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">暂无业务员数据</td></tr>
            ) : salespersons.map((sp) => (
              <tr key={sp.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-neutral-800">{sp.name}</p>
                  <p className="text-xs text-neutral-400">{sp.title || '-'}</p>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{sp.department === 'foreign_trade' ? '外贸' : sp.department === 'after_sales' ? '售后' : '国内销售'}</td>
                <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{sp.phone || sp.email || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={sp.isActive ? 'success' : 'default'}>{sp.isActive ? '启用' : '禁用'}</Badge>
                </td>
                <td className="px-4 py-3 text-right text-sm text-brand-600">编辑</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
