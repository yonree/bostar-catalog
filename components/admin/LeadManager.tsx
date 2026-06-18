'use client';

import { useEffect, useState } from 'react';

type LeadAttachment = {
  id: string;
  originalFilename: string;
  scanStatus: string;
};

type LeadNotificationLog = {
  id: string;
  channel: string;
  status: string;
  attemptCount: number;
};

type LeadRecord = {
  id: string;
  inquiryNumber?: string | null;
  locale: string;
  name: string;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  interestedProduct?: string | null;
  interestedProductModel?: string | null;
  interestedSolution?: string | null;
  demandType?: string | null;
  target?: string | null;
  message?: string | null;
  status: string;
  assignedTo?: string | null;
  dueAt?: string | null;
  firstResponseAt?: string | null;
  createdAt: string;
  attachments: LeadAttachment[];
  notificationLogs: LeadNotificationLog[];
};

const statusOptions = [
  'NEW',
  'NOTIFIED',
  'ASSIGNED',
  'CONTACTED',
  'QUALIFIED',
  'TEST_REQUESTED',
  'QUOTED',
  'WON',
  'LOST',
  'CLOSED',
  'INVALID',
  'SPAM',
  'DUPLICATE',
] as const;

const statusLabels: Record<string, string> = {
  NEW: '新建',
  NOTIFIED: '已通知',
  ASSIGNED: '已分配',
  CONTACTED: '已联系',
  QUALIFIED: '已确认需求',
  TEST_REQUESTED: '已申请寄样',
  QUOTED: '已报价',
  WON: '已成交',
  LOST: '已丢单',
  CLOSED: '已关闭',
  INVALID: '无效',
  SPAM: '垃圾提交',
  DUPLICATE: '重复线索',
};

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('zh-CN');
}

export function LeadManager() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
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
    setMessage(result.message || '线索已更新。');
    if (response.ok) {
      await load();
    }
  }

  return (
    <div className="grid gap-4">
      {message ? <p className="text-sm text-primary">{message}</p> : null}
      <div className="overflow-x-auto rounded border border-line bg-dark-soft">
        <table className="w-full min-w-[1520px] text-left text-sm text-white-soft">
          <thead className="bg-dark">
            <tr>
              {[
                '询盘编号',
                '语言',
                '公司 / 联系人',
                '电话 / 邮箱',
                '需求类型',
                '产品 / 方案',
                '目标需求',
                '附件',
                '通知',
                '负责人',
                'SLA 截止',
                '首次响应',
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
                <tr key={lead.id} className="border-t border-line align-top">
                  <td className="p-4 font-mono text-xs">{lead.inquiryNumber || lead.id}</td>
                  <td className="p-4">{lead.locale}</td>
                  <td className="p-4">
                    <div className="grid gap-1">
                      <span className="font-semibold">{lead.company || '-'}</span>
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="grid gap-1">
                      <span>{lead.phone || '-'}</span>
                      <span>{lead.email || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">{lead.demandType || '-'}</td>
                  <td className="p-4">
                    <div className="grid gap-1">
                      <span>{lead.interestedProduct || '-'}</span>
                      <span className="text-xs text-white-soft/60">{lead.interestedProductModel || lead.interestedSolution || '-'}</span>
                    </div>
                  </td>
                  <td className="max-w-xs p-4">
                    <div className="grid gap-1">
                      <span>{lead.target || '-'}</span>
                      <span className="text-xs text-white-soft/60">{lead.message || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="grid gap-2">
                      {lead.attachments.length ? (
                        lead.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={`/api/admin/leads/${lead.id}/attachments/${attachment.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded border border-line px-2 py-1 text-xs hover:border-primary"
                          >
                            {attachment.originalFilename} · {attachment.scanStatus}
                          </a>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="grid gap-1">
                      {lead.notificationLogs.length ? (
                        lead.notificationLogs.map((item) => (
                          <span key={item.id} className="text-xs">
                            {item.channel}:{item.status} ({item.attemptCount})
                          </span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{lead.assignedTo || '-'}</td>
                  <td className="p-4">{formatDate(lead.dueAt)}</td>
                  <td className="p-4">{formatDate(lead.firstResponseAt)}</td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(event) => void updateStatus(lead.id, event.target.value)}
                      className="rounded border border-line bg-dark px-2 py-2 text-white-soft"
                    >
                      {statusOptions.map((value) => (
                        <option key={value} value={value}>
                          {statusLabels[value]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">{formatDate(lead.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4" colSpan={14}>
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
