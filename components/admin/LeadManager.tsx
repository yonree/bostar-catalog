'use client';

import { useEffect, useState } from 'react';

type Lead = {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  interestedProduct?: string;
  demandType?: string;
  message?: string;
  status: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  new: '新线索',
  contacted: '已联系',
  quoted: '已报价',
  won: '已成交',
  lost: '已丢失',
  invalid: '无效',
};

export function LeadManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch('/api/admin/leads', { cache: 'no-store' });
    const result = await response.json();
    setLeads(result.leads || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    setMessage(result.message || '已更新。');
    if (response.ok) {
      await load();
    }
  }

  return (
    <div className="grid gap-4">
      {message ? <p className="text-sm text-primary">{message}</p> : null}
      <div className="overflow-x-auto rounded border border-line bg-dark-soft">
        <table className="w-full min-w-[980px] text-left text-sm text-white-soft">
          <thead className="bg-dark">
            <tr>
              {[
                '姓名',
                '公司',
                '电话',
                '邮箱',
                '意向产品',
                '需求类型',
                '留言',
                '状态',
                '提交时间',
              ].map((label) => (
                <th key={label} className="p-4 font-bold text-white-soft">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length ? (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-line">
                  <td className="p-4">{lead.name}</td>
                  <td className="p-4">{lead.company || '-'}</td>
                  <td className="p-4">{lead.phone || '-'}</td>
                  <td className="p-4">{lead.email || '-'}</td>
                  <td className="p-4">{lead.interestedProduct || '-'}</td>
                  <td className="p-4">{lead.demandType || '-'}</td>
                  <td className="max-w-xs p-4">{lead.message || '-'}</td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(event) => void updateStatus(lead.id, event.target.value)}
                      className="rounded border border-line bg-dark px-2 py-2 text-white-soft"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">{new Date(lead.createdAt).toLocaleString('zh-CN')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4" colSpan={9}>
                  暂无线索
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
