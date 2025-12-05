import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import el from './locales/el.json';

// Check if we're running on the client side
const isBrowser = typeof window !== 'undefined';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        el: { translation: el },
      },
      supportedLngs: ['en', 'el'],
      fallbackLng: 'el',
      // Start with Greek on server, will be updated on client
      lng: 'el',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false, // Important for Next.js
      },
    });
  
  // On client side, detect and set language after initialization
  if (isBrowser) {
    const storedLang = localStorage.getItem('lang');
    const browserLang = navigator.language.split('-')[0];
    const detectedLang = storedLang || (browserLang === 'el' || browserLang === 'en' ? browserLang : 'el');
    
    // Set language after a microtask to allow hydration to complete
    Promise.resolve().then(() => {
      if (detectedLang !== 'el') {
        i18n.changeLanguage(detectedLang);
      }
    });
  }
}

export default i18n;