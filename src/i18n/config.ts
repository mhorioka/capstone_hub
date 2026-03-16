// ============================================================
// i18n Configuration — react-i18next
// Default language: Japanese
// Supported languages: ja, en
// Language preference stored in: capstone_v1_language
// ============================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ja } from './ja';
import { en } from './en';
import { STORAGE_KEYS } from '../lib/repository';

export type SupportedLanguage = 'ja' | 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ja', 'en'];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ja';

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored === 'ja' || stored === 'en') return stored;
  } catch {
    // Storage blocked (e.g. private browsing, SSR, test environment)
  }
  return DEFAULT_LANGUAGE;
}

export function setLanguage(lang: SupportedLanguage): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // Storage blocked — language change still applied in memory
    }
  }
  void i18n.changeLanguage(lang);
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    lng: getStoredLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
