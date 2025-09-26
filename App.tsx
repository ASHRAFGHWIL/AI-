import React, { useState, useCallback, useEffect } from 'react';
import type { MarketingInput, MarketingOutput } from './types';
import { generateSocialPosts } from './services/geminiService';
import { INITIAL_FORM_DATA } from './constants';
import Header from './components/Header';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { useI18n } from './hooks/useI18n';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<MarketingOutput | null>(null);
  const { t, setLocale, locale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    // Update form language based on UI language
    const formLang = document.querySelector('select[name="language"]') as HTMLSelectElement;
    if(formLang) {
        formLang.value = locale === 'ar' ? 'ar-EG' : 'en-US';
    }

  }, [locale]);


  const handleSubmit = useCallback(async (formData: MarketingInput) => {
    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await generateSocialPosts(formData);
      setOutput(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8 font-sans">
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 mt-8">
        <div className="lg:pe-6">
          <InputForm
            initialData={INITIAL_FORM_DATA}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        <div className="mt-10 lg:mt-0 relative">
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {output && !isLoading && !error && <OutputDisplay data={output} />}
          {!output && !isLoading && !error && (
             <div className="flex items-center justify-center h-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300">
                <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L12 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L18.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.898 20.575 16.5 21.75l-.398-1.175a3.375 3.375 0 0 0-2.455-2.456L12.75 18l1.175-.398a3.375 3.375 0 0 0 2.455-2.456L16.5 14.25l.398 1.175a3.375 3.375 0 0 0 2.456 2.456L20.25 18l-1.175.398a3.375 3.375 0 0 0-2.456 2.456Z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">{t('app.outputPlaceholderTitle')}</h3>
                    <p className="mt-1 text-sm text-slate-500">{t('app.outputPlaceholderDescription')}</p>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;