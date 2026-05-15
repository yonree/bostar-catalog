'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';

const statusLabels: Record<string, { label: string; variant: 'warning' | 'info' | 'brand' | 'success' | 'danger' }> = {
  new: { label: '未跟进', variant: 'warning' },
  contacted: { label: '已联系', variant: 'info' },
  quoting: { label: '报价中', variant: 'brand' },
  closed_won: { label: '成交', variant: 'success' },
  closed_lost: { label: '无效', variant: 'danger' },
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [page, statusFilter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/inquiries?${params}`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">询盘管理</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setStatusFilter('')} className={`px-3 py-1.5 text-sm rounded-full ${!statusFilter ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}>全部</button>
        {Object.entries(statusLabels).map(([key, { label }]) => (
          <button key={key} onClick={() => setStatusFilter(key)} className={`px-3 py-1.5 text-sm rounded-full ${statusFilter === key ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500">客户</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden sm:table-cell">公司</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden md:table-cell">感兴趣产品</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">加载中...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">暂无询盘数据</td></tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/inquiries/${inq.id}`} className="hover:text-brand-600">
                        <p className="text-sm font-medium text-neutral-800">{inq.customerName}</p>
                        <p className="text-xs text-neutral-400">{inq.phone || inq.email || '-'}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{inq.company || '-'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{inq.product?.name || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={statusLabels[inq.followStatus]?.variant || 'default'}>
                        {statusLabels[inq.followStatus]?.label || inq.followStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-neutral-400">
                      {new Date(inq.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
