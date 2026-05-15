'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [remark, setRemark] = useState('');
  const [followStatus, setFollowStatus] = useState('');

  useEffect(() => {
    fetch(`/api/inquiries/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setInquiry(data.data);
          setRemark(data.data.remark || '');
          setFollowStatus(data.data.followStatus);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/inquiries/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followStatus, remark }),
      });
      alert('已保存');
    } catch {
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-neutral-400">加载中...</div>;
  if (!inquiry) return <div className="text-center py-12 text-neutral-400">询盘不存在</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">询盘详情</h2>
        <Button variant="ghost" onClick={() => router.back()}>返回</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-100 p-4">
            <h3 className="text-sm font-medium text-neutral-600 mb-3">需求描述</h3>
            <p className="text-sm text-neutral-800 whitespace-pre-wrap">{inquiry.requirement}</p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-4">
            <h3 className="text-sm font-medium text-neutral-600 mb-3">销售备注</h3>
            <textarea
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="添加跟进备注..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-100 p-4">
            <h3 className="text-sm font-medium text-neutral-600 mb-3">客户信息</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-neutral-400">姓名：</span><span className="text-neutral-800">{inquiry.customerName}</span></div>
              {inquiry.company && <div><span className="text-neutral-400">公司：</span><span className="text-neutral-800">{inquiry.company}</span></div>}
              {inquiry.phone && <div><span className="text-neutral-400">手机：</span><span className="text-neutral-800">{inquiry.phone}</span></div>}
              {inquiry.email && <div><span className="text-neutral-400">邮箱：</span><span className="text-neutral-800">{inquiry.email}</span></div>}
              {inquiry.region && <div><span className="text-neutral-400">地区：</span><span className="text-neutral-800">{inquiry.region}</span></div>}
              {inquiry.product && <div><span className="text-neutral-400">感兴趣产品：</span><span className="text-neutral-800">{inquiry.product.name}</span></div>}
              {inquiry.salesperson && <div><span className="text-neutral-400">来源业务员：</span><span className="text-neutral-800">{inquiry.salesperson.name}</span></div>}
              {inquiry.needQuote && <Badge variant="brand">需要报价</Badge>}
              {inquiry.needSample && <Badge variant="info">需要样品测试</Badge>}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-4">
            <h3 className="text-sm font-medium text-neutral-600 mb-3">跟进状态</h3>
            <Select
              value={followStatus}
              onChange={(e) => setFollowStatus(e.target.value)}
              options={[
                { value: 'new', label: '未跟进' },
                { value: 'contacted', label: '已联系' },
                { value: 'quoting', label: '报价中' },
                { value: 'closed_won', label: '成交' },
                { value: 'closed_lost', label: '无效' },
              ]}
            />
            <Button onClick={handleSave} loading={saving} className="w-full mt-3">
              保存
            </Button>
          </div>

          <div className="text-xs text-neutral-400">
            创建时间：{new Date(inquiry.createdAt).toLocaleString('zh-CN')}
            <br />
            更新时间：{new Date(inquiry.updatedAt).toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
}
