

import { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

export type SupportedLanguage = 'el' | 'en';

export interface Language {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

export const useTranslate = () => {
  const { t, i18n } = useTranslation();

  const currentLanguage = useMemo(
    () => (i18n.language as SupportedLanguage) || 'el',
    [i18n.language]
  );

  const changeLanguage = useCallback(
    async (lng: SupportedLanguage) => {
      try {
        await i18n.changeLanguage(lng);
        localStorage.setItem('lang', lng);
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    },
    [i18n]
  );

  const isCurrentLanguage = useCallback(
    (lng: SupportedLanguage) => currentLanguage === lng,
    [currentLanguage]
  );

  const isCurrentLanguageDetails = useMemo(
    () =>
      SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) ||
      SUPPORTED_LANGUAGES[0],
    [currentLanguage]
  );

  return {
    t,
    currentLanguage,
    changeLanguage,
    isCurrentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLanguageDetails: isCurrentLanguageDetails,
    isReady: i18n.isInitialized,
  };
};

export default useTranslate;

