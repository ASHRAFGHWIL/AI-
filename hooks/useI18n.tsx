import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';

type Locale = 'en' | 'ar';

// Define a recursive type for nested JSON objects
type TranslationMap = {
    [key: string]: string | TranslationMap;
};

type AllTranslations = Record<Locale, TranslationMap>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('ar'); // Default to Arabic
  const [translations, setTranslations] = useState<AllTranslations | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchTranslations = async () => {
        try {
            // Use fetch, a standard browser API, to load JSON files.
            // The paths are relative to the index.html file.
            const [enResponse, arResponse] = await Promise.all([
                fetch('./locales/en.json'),
                fetch('./locales/ar.json')
            ]);

            if (!enResponse.ok || !arResponse.ok) {
                throw new Error(`Failed to load translation files. Status: ${enResponse.status}, ${arResponse.status}`);
            }

            const enData = await enResponse.json();
            const arData = await arResponse.json();
            
            setTranslations({ en: enData, ar: arData });
            setIsLoaded(true);

        } catch(error) {
            console.error("Error fetching translations:", error);
            // In a real app, you might want to set an error state and show a message
        }
    };

    fetchTranslations();
  }, []); // Empty dependency array ensures this runs only once on mount

  const t = useCallback((key: string): string => {
    if (!isLoaded || !translations) {
      return key; // Return the key itself or a loading indicator
    }

    const keys = key.split('.');
    let result: any = translations[locale];
    try {
      for (const k of keys) {
        result = result[k];
      }
    } catch (e) {
        result = undefined;
    }


    if (result === undefined) {
      // Fallback to English if key not found in current locale
      let fallbackResult: any = translations['en'];
       try {
            for (const fk of keys) {
                fallbackResult = fallbackResult[fk];
            }
            return fallbackResult || key;
        } catch(e) {
            return key;
        }
    }
    return result as string || key;
  }, [locale, translations, isLoaded]);

  // Don't render children until translations are loaded to prevent FOUC
  if (!isLoaded) {
    return null; 
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
