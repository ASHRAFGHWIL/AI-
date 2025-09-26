
import React, { useState } from 'react';
import type { MarketingOutput } from '../types';
import { useI18n } from '../hooks/useI18n';

interface OutputDisplayProps {
  data: MarketingOutput;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ data }) => {
  const { t } = useI18n();

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg h-full border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="flex-shrink-0 mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('output.title')}</h2>
        </div>
      
        <div className="flex-grow overflow-y-auto pe-2 space-y-6">
            {/* Main Content Display */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-end mb-2">
                    <CopyButton textToCopy={data.content} />
                </div>
                <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 font-mono text-sm">
                    {data.content}
                </div>
            </div>

            {/* Sources Display */}
            {data.sources && data.sources.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('output.sourcesTitle')}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                        {data.sources.map((source, index) => (
                            <li key={index} className="text-sm">
                                <a 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sky-600 hover:underline dark:text-sky-400"
                                >
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
  );
};

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button 
            onClick={handleCopy} 
            title="Copy to clipboard" 
            className="flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
        >
            {copied ? (
                 <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                 </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy All
                </>
            )}
        </button>
    );
};


export default OutputDisplay;
