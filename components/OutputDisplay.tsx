
import React, { useState, useMemo } from 'react';
import type { MarketingOutput } from '../types';
import { useI18n } from '../hooks/useI18n';

interface OutputDisplayProps {
  data: MarketingOutput;
  onSave: (data: MarketingOutput) => void;
  isSaved: boolean;
}

const SaveButton: React.FC<{ onClick: () => void; isSaved: boolean; }> = ({ onClick, isSaved }) => {
    const { t } = useI18n();
    const baseStyle = "flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md transition-colors";
    const activeStyle = "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300";
    const savedStyle = "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default";

    return (
        <button
            onClick={onClick}
            disabled={isSaved}
            className={`${baseStyle} ${isSaved ? savedStyle : activeStyle}`}
        >
            {isSaved ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t('output.saved')}
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                    {t('output.save')}
                </>
            )}
        </button>
    );
};


const CopyButton: React.FC<{ textToCopy: string; children: React.ReactNode; }> = ({ textToCopy, children }) => {
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
            title={t('output.copyToClipboard')}
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
                children
            )}
        </button>
    );
};

const getPlainTextForVariation = (content: string): string => {
  if (!content) return '';
  return content
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/(\r\n|\n|\r)/gm, "\n") // Normalize line breaks
    .trim();
};

const renderTextWithHighlights = (text: string) => {
  if (typeof text !== 'string') return null;

  const urlTestRegex = /^(https?:\/\/[^\s()]+)$/;
  const hashtagTestRegex = /^(#[\w-]+)$/;
  const splitRegex = /(https?:\/\/[^\s()]+|#[\w-]+)/g;

  return text.split(splitRegex).map((part, index) => {
    if (!part) return part;
    if (urlTestRegex.test(part)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
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

const VariationContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n').map((line, lineIndex) => {
    if (line.trim() === '') {
      return <div key={lineIndex} className="h-2" />;
    }
    const labelMatch = line.match(/^\*\*([\w\s]+):\*\*(.*)/);
    if (labelMatch) {
      const label = labelMatch[1];
      const restOfLine = labelMatch[2].trim();
      let contentNode;
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
    return <p key={lineIndex}>{renderTextWithHighlights(line)}</p>;
  });

  return <>{lines}</>;
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, onSave, isSaved }) => {
  const { t } = useI18n();

  const fullPlainTextContent = useMemo(() => {
    if (!data.content) return '';
    return data.content
      .replace(/^##\s+/gm, '')
      .replace(/^###\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/(\r\n|\n|\r)/gm, "\n")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }, [data.content]);
  
  const parsedContent = useMemo(() => {
    if (!data.content) return [];
    
    type ParsedPlatform = { platform: string; variations: { title: string; content: string }[] };
    const platforms: ParsedPlatform[] = [];
    const platformBlocks = data.content.split(/(?=^##\s)/m).filter(block => block.trim() !== '');

    if (platformBlocks.length === 0 && data.content.trim()) {
        platformBlocks.push(data.content);
    }

    platformBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        const platformTitle = lines[0].startsWith('## ') ? lines[0].replace(/^##\s+/, '').trim() : t('output.title');
        const restOfBlock = lines[0].startsWith('## ') ? lines.slice(1).join('\n') : block;

        const variations: { title: string; content: string }[] = [];
        const variationBlocks = restOfBlock.split(/(?=^###\s)/m).filter(vBlock => vBlock.trim() !== '');
        
        if (variationBlocks.length === 0 && restOfBlock.trim()) {
            variations.push({
                title: `${t('common.variant')} 1`,
                content: restOfBlock.trim()
            });
        } else {
            variationBlocks.forEach(vBlock => {
                const vLines = vBlock.trim().split('\n');
                const variationTitle = vLines[0].replace(/^###\s+/, '').trim();
                const variationContent = vLines.slice(1).join('\n').trim();
                
                if (variationTitle && variationContent) {
                    variations.push({ title: variationTitle, content: variationContent });
                }
            });
        }

        if (platformTitle && variations.length > 0) {
            platforms.push({ platform: platformTitle, variations });
        }
    });

    return platforms;
  }, [data.content, t]);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg h-full border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="flex-shrink-0 mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('output.title')}</h2>
        </div>
      
        <div className="flex-grow overflow-y-auto pe-2 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-end gap-2 mb-2 flex-wrap">
                    <SaveButton onClick={() => onSave(data)} isSaved={isSaved} />
                    <CopyButton textToCopy={fullPlainTextContent}>
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.383-.03.766-.03 1.152 0 1.13.094 1.976 1.057 1.976 2.192V7.5M12 18.75v-5.25m-3 5.25v-5.25m3-7.5l-3-4.5-3 4.5m6 0v-2.25a2.25 2.25 0 0 0-2.25-2.25H8.25a2.25 2.25 0 0 0-2.25 2.25v2.25" />
                        </svg>
                        {t('output.copyPlainText')}
                      </>
                    </CopyButton>
                    <CopyButton textToCopy={data.content}>
                       <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                          {t('output.copyMarkdown')}
                       </>
                    </CopyButton>
                </div>
                <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                   {parsedContent.map((platform, pIndex) => (
                        <div key={pIndex} className="mb-8 last:mb-0">
                            <h2 className="text-2xl font-bold mt-4 mb-4 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                                {platform.platform}
                            </h2>
                            <div className="space-y-6">
                                {platform.variations.map((variation, vIndex) => (
                                    <div key={vIndex} className="bg-white dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                                {variation.title}
                                            </h3>
                                            <CopyButton textToCopy={getPlainTextForVariation(variation.content)}>
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                    </svg>
                                                    {t('output.copy')}
                                                </>
                                            </CopyButton>
                                        </div>
                                        <div className="text-sm leading-relaxed">
                                            <VariationContentRenderer content={variation.content} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                   ))}
                </div>
            </div>

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

export default OutputDisplay;
