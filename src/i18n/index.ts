import zh from './zh.json';
import en from './en.json';

const translations: Record<string, Record<string, string>> = { zh, en };

export function getTranslation(lang: string, key: string): string {
  return translations[lang]?.[key] || translations.zh[key] || key;
}

export type TranslationKey = keyof typeof zh;
