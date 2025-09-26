
import React, { useState } from 'react';
import type { MarketingOutput } from '../types';
import { useI18n } from '../hooks/useI18n';

interface OutputDisplayProps {
  data: MarketingOutput;
}

// This component parses the raw markdown-like text from the AI and renders it as styled JSX.
const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Anchored regexes to test if a string part IS a URL or a hashtag.
  const urlTestRegex = /^(https?:\/\/[^\s()]+)$/;
  const hashtagTestRegex = /^(#[\w-]+)$/;

  // Regex to SPLIT the content string by URLs or hashtags.
  // A single capturing group ensures delimiters are kept. This avoids nested
  // capturing groups that cause .split() to return `undefined` elements.
  const splitRegex = /(https?:\/\/[^\s()]+|#[\w-]+)/g;

  // This function takes a string and returns an array of strings and styled components
  const renderTextWithHighlights = (text: string) => {
    // Guard against non-string input.
    if (typeof text !== 'string') return null;

    return text.split(splitRegex).map((part, index) => {
      // A part can be an empty string from the split, which is valid.
      // We only need to protect against calling methods on null/undefined.
      if (!part) {
        return part;
      }

      if (urlTestRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            {part}
          </a>
        );
      }
      if (hashtagTestRegex.test(part)) {
        return (
          <span key={index} className="text-sky-600 dark:text-sky-400 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Process the entire content string line by line
  const lines = content.split('\n').map((line, lineIndex) => {
    // Render empty lines as spacing
    if (line.trim() === '') {
        return <div key={lineIndex} className="h-4" />;
    }
    // Render markdown headings
    if (line.startsWith('## ')) {
      return (
        <h2 key={lineIndex} className="text-2xl font-bold mt-6 mb-2 text-slate-900 dark:text-slate-100">
          {line.substring(3)}
        </h2>
      );
    }
    if (line.startsWith('### ')) {
      return (
        <h3 key={lineIndex} className="text-xl font-semibold mt-4 mb-1 text-slate-800 dark:text-slate-200">
          {line.substring(4)}
        </h3>
      );
    }
    // Render bolded labels (e.g., **Hook:**) and apply special styling
    const labelMatch = line.match(/^\*\*([\w\s]+):\*\*(.*)/);
    if (labelMatch) {
      const label = labelMatch[1];
      const restOfLine = labelMatch[2].trim();
      let contentNode;
      // Apply special color for the CTA line
      if (label.toLowerCase() === 'cta') {
        contentNode = (
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            {renderTextWithHighlights(restOfLine)}
          </span>
        );
      } else {
        contentNode = renderTextWithHighlights(restOfLine);
      }
      return (
        <div key={lineIndex} className="mt-1">
          <strong className="font-bold text-slate-800 dark:text-slate-200">{label}:</strong>{' '}
          {contentNode}
        </div>
      );
    }
    // Render regular paragraphs
    return <p key={lineIndex}>{renderTextWithHighlights(line)}</p>;
  });

  return <>{lines}</>;
};


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
                <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    <ContentRenderer content={data.content} />
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
    const { t } = useI18n();

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
                    {t('output.copied')}
                 </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {t('output.copyAll')}
                </>
            )}
        </button>
    );
};


export default OutputDisplay;