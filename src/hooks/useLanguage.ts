'use client';
import { useState, useEffect, useCallback } from 'react';
import { getTranslation, type TranslationKey } from '@/i18n';

export function useLanguage() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  useEffect(() => {
    const cookieLang = document.cookie
      .split('; ')
      .find((r) => r.startsWith('bostar_lang='))
      ?.split('=')[1];
    if (cookieLang === 'en') setLang('en');

    const browserLang = navigator.language?.startsWith('en') ? 'en' : 'zh';
    if (!cookieLang) setLang(browserLang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    document.cookie = `bostar_lang=${newLang}; path=/; max-age=${365 * 24 * 60 * 60}`;
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey) => getTranslation(lang, key),
    [lang]
  );

  return { lang, t, toggleLanguage };
}
