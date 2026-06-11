import { useCallback } from 'react';
import { translations, getNestedValue, type Language } from './dictionary';

export function useLanguage(): Language {
  return 'fr';
}

export function useTranslation() {
  const lang = useLanguage();

  const t = useCallback(
    (key: string): string => {
      const dict = translations[lang] as Record<string, unknown>;
      const value = getNestedValue(dict, key);
      if (value) return value;
      const frDict = translations.fr as Record<string, unknown>;
      return getNestedValue(frDict, key) ?? key;
    },
    [lang]
  );

  return { t, lang };
}
