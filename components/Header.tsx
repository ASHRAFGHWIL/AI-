
import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useI18n();

    const inactiveStyle = "px-3 py-1 text-sm text-slate-500 bg-white rounded-md hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700";
    const activeStyle = "px-3 py-1 text-sm font-semibold text-white bg-slate-800 rounded-md dark:bg-sky-500 dark:text-slate-900";
    
    return (
        <div className="flex justify-center items-center gap-2 mt-6 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg w-min mx-auto">
            <button
                onClick={() => setLocale('en')}
                className={locale === 'en' ? activeStyle : inactiveStyle}
            >
                English
            </button>
            <button
                onClick={() => setLocale('ar')}
                className={locale === 'ar' ? activeStyle : inactiveStyle}
            >
                العربية
            </button>
        </div>
    )
}

const ThemeSwitcher: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    )
}


const Header: React.FC = () => {
  const { t } = useI18n();
  return (
    <header className="text-center relative">
      <div className="absolute top-0 end-0">
          <ThemeSwitcher />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 dark:text-red-400 tracking-tight">
        {t('header.title')}
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
        {t('header.description')}
      </p>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
