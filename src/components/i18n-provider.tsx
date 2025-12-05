'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { ReactNode, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem('lang') || navigator.language.split('-')[0];
    const finalLang = lang === 'en' || lang === 'el' ? lang : 'el';
    
    i18n.changeLanguage(finalLang).then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}