'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings(d.data); });
  }, []);

  const update = (key: string, value: string) => setSettings((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: Object.entries(settings).map(([key, value]) => ({ key, value })),
        }),
      });
      alert('已保存');
    } catch {
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">系统设置</h2>
        <Button onClick={handleSave} loading={saving}>保存设置</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">网站名称（中文）</label>
          <input
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={settings['site_name'] || ''}
            onChange={(e) => update('site_name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">网站名称（英文）</label>
          <input
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={settings['site_name_en'] || ''}
            onChange={(e) => update('site_name_en', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">联系电话</label>
          <input
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={settings['contact_phone'] || ''}
            onChange={(e) => update('contact_phone', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">联系邮箱</label>
          <input
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={settings['contact_email'] || ''}
            onChange={(e) => update('contact_email', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">飞书 Webhook URL</label>
          <input
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={settings['feishu_webhook_url'] || ''}
            onChange={(e) => update('feishu_webhook_url', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Dify API Key</label>
          <input
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            type="password"
            value={settings['dify_api_key'] || ''}
            onChange={(e) => update('dify_api_key', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
