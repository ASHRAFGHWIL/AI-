import React from 'react';
import { useI18n } from '../hooks/useI18n';

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useI18n();

    const inactiveStyle = "px-3 py-1 text-sm text-slate-500 bg-white rounded-md hover:bg-slate-100";
    const activeStyle = "px-3 py-1 text-sm font-semibold text-white bg-slate-800 rounded-md";
    
    return (
        <div className="flex justify-center items-center gap-2 mt-6 p-1 bg-slate-200/50 rounded-lg w-min mx-auto">
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


const Header: React.FC = () => {
  const { t } = useI18n();
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
        {t('header.title')}
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        {t('header.description')}
      </p>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;