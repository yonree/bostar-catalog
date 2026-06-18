'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

type CookieState = 'hidden' | 'banner' | 'panel';

const storageKey = 'bostar-cookie-preferences';

const copy = {
  'zh-CN': {
    bannerTitle: 'Cookie 提示',
    bannerBody: '本站默认只启用必要 Cookie，用于语言切换、会话连续性和表单安全。任何可选第三方服务都将在你明确同意后才启用。',
    bannerAccept: '仅接受必要 Cookie',
    bannerManage: '管理偏好',
    panelTitle: 'Cookie 偏好设置',
    panelBody: '必要 Cookie 始终开启。未来如接入视频、地图或即时沟通等第三方服务，将按你的授权单独启用。',
    necessaryTitle: '必要 Cookie',
    necessaryBody: '用于语言偏好、会话连续性和表单安全，不能关闭。',
    alwaysOn: '始终开启',
    optionalTitle: '可选嵌入服务',
    optionalBody: '允许未来启用视频、地图或即时通讯等第三方嵌入能力。',
    save: '保存设置',
    necessaryOnly: '仅必要 Cookie',
  },
  en: {
    bannerTitle: 'Cookie Notice',
    bannerBody: 'This site uses necessary cookies for language, session continuity, and form security. Optional third-party services stay disabled until you opt in.',
    bannerAccept: 'Accept Necessary',
    bannerManage: 'Manage Preferences',
    panelTitle: 'Cookie Preferences',
    panelBody: 'We only enable necessary cookies by default. Optional cookies can be enabled for future embedded media or external contact tools after consent.',
    necessaryTitle: 'Necessary Cookies',
    necessaryBody: 'Required for language preference, session continuity, and form safety.',
    alwaysOn: 'Always on',
    optionalTitle: 'Optional Embedded Services',
    optionalBody: 'Allow future third-party embeds such as video, map, or instant messaging widgets after explicit approval.',
    save: 'Save Preferences',
    necessaryOnly: 'Necessary Only',
  },
} as const;

export function CookiePreferenceBanner({ locale }: { locale: Locale }) {
  const [state, setState] = useState<CookieState>('hidden');
  const [marketing, setMarketing] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      setState('banner');
      return;
    }

    try {
      const parsed = JSON.parse(saved) as { marketing?: boolean };
      setMarketing(Boolean(parsed.marketing));
    } catch {}
  }, []);

  function savePreference(nextMarketing: boolean) {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        necessary: true,
        marketing: nextMarketing,
        updatedAt: new Date().toISOString(),
      })
    );
    setMarketing(nextMarketing);
    setState('hidden');
  }

  if (state === 'hidden') {
    return null;
  }

  if (state === 'panel') {
    return (
      <div className="fixed inset-x-4 bottom-4 z-50 max-w-xl rounded-[28px] border border-line bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:left-auto">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-black text-ink">{text.panelTitle}</p>
            <p className="mt-2 text-sm text-steel">{text.panelBody}</p>
          </div>
          <div className="rounded-2xl border border-line bg-bg-soft p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">{text.necessaryTitle}</p>
                <p className="mt-1 text-sm text-steel">{text.necessaryBody}</p>
              </div>
              <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">{text.alwaysOn}</span>
            </div>
          </div>
          <label className="flex items-start gap-3 rounded-2xl border border-line p-4">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-line"
            />
            <span>
              <span className="block font-semibold text-ink">{text.optionalTitle}</span>
              <span className="mt-1 block text-sm text-steel">{text.optionalBody}</span>
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => savePreference(marketing)}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              {text.save}
            </button>
            <button
              type="button"
              onClick={() => savePreference(false)}
              className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink"
            >
              {text.necessaryOnly}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 rounded-[24px] border border-line bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:left-4 md:max-w-xl">
      <p className="text-sm font-semibold text-ink">{text.bannerTitle}</p>
      <p className="mt-2 text-sm text-steel">{text.bannerBody}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => savePreference(false)}
          className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          {text.bannerAccept}
        </button>
        <button
          type="button"
          onClick={() => setState('panel')}
          className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink"
        >
          {text.bannerManage}
        </button>
      </div>
    </div>
  );
}
