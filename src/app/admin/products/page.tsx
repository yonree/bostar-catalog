'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', includeHidden: 'true' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
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
        <h2 className="text-xl font-semibold text-neutral-800">产品管理</h2>
        <Link href="/admin/products/new">
          <Button>新增产品</Button>
        </Link>
      </div>

      <div className="mb-4 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="搜索产品..."
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500">产品名称</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden sm:table-cell">型号</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden md:table-cell">分类</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">加载中...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">暂无产品数据</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.mainImage && <img src={p.mainImage} alt={p.name} className="w-10 h-10 rounded object-cover" />}
                        <div>
                          <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                          <p className="text-xs text-neutral-400">{p.productCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{p.model || '-'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{p.category?.name || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={p.isPublished ? 'success' : 'default'}>
                        {p.isPublished ? '已上架' : '草稿'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-sm text-brand-600 hover:text-brand-700 mr-3">
                        编辑
                      </Link>
                      <Link href={`/products/${p.slug}`} target="_blank" className="text-sm text-neutral-400 hover:text-neutral-600">
                        预览
                      </Link>
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
