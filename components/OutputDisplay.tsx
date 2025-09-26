import React, { useState } from 'react';
import type { MarketingOutput, Variant } from '../types';
import { useI18n } from '../hooks/useI18n';

interface OutputDisplayProps {
  data: MarketingOutput;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ data }) => {
  const platforms = Object.keys(data.platforms);
  const [activeTab, setActiveTab] = useState<string>(platforms[0] || '');
  const { t } = useI18n();

  if (!platforms.length) {
    return <p>{t('output.noPlatforms')}</p>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg h-full border border-slate-200">
        <h2 className="text-2xl font-bold mb-1 text-slate-900">{t('output.title')}</h2>
        <p className="text-slate-600 mb-4">{t('common.product')}: <span className="font-semibold">{data.product}</span></p>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-4 rtl:space-x-reverse overflow-x-auto" aria-label="Tabs">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`${
                activeTab === platform
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {platform}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4 max-h-[calc(100vh-20rem)] overflow-y-auto pe-2">
        {platforms.map((platform) => (
          <div key={platform} className={activeTab === platform ? 'block' : 'hidden'}>
            <div className="space-y-6">
              {data.platforms[platform]?.map((variant) => (
                <VariantCard key={variant.variant} variant={variant} platform={platform} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VariantCard: React.FC<{ variant: Variant, platform: string }> = ({ variant, platform }) => {
    const { t } = useI18n();
    return (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <h3 className="font-bold text-lg text-slate-800 mb-3">{t('common.variant')} {variant.variant}</h3>
            <div className="space-y-3 text-sm">
                {variant.title && <InfoItem label={t('output.card.title')} content={variant.title} />}
                <InfoItem label={t('output.card.caption')} content={variant.caption || variant.text || 'N/A'} isPreformatted={true} />
                {variant.video_script_15s && <InfoItem label={t('output.card.videoScript')} content={variant.video_script_15s} isPreformatted={true} />}
                <InfoItem label={t('output.card.hashtags')} content={variant.hashtags.join(' ')} />
                <InfoItem label={t('output.card.imageSuggestion')} content={variant.image_suggest} />
                <InfoItem label={t('output.card.altText')} content={variant.alt_text} />
                <hr className="my-2 border-slate-200"/>
                <div className="bg-slate-100 p-3 rounded-md">
                    <p className="font-semibold text-slate-600 mb-2 text-xs uppercase tracking-wider">{t('output.card.seoSnippet')}</p>
                    <InfoItem label={t('output.card.metaTitle')} content={variant.meta_title} />
                    <InfoItem label={t('output.card.metaDesc')} content={variant.meta_description} />
                </div>
                 <hr className="my-2 border-slate-200"/>
                {variant.first_comment && <InfoItem label={t('output.card.firstComment')} content={variant.first_comment} />}
                <InfoItem label={t('output.card.postTiming')} content={variant.suggested_post_time} icon="time" />
                <InfoItem label={t('output.card.lengthNote')} content={variant.length_limit_notes} icon="info"/>
            </div>
        </div>
    )
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
        <button onClick={handleCopy} title="Copy to clipboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            {copied ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
};

const InfoItem: React.FC<{ label: string, content: string, isPreformatted?: boolean, icon?: 'info' | 'time' }> = ({ label, content, isPreformatted, icon }) => (
    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-x-4 gap-y-1 items-start">
        <span className="font-semibold text-slate-600 flex items-center gap-1.5">
            {icon === 'time' && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            {icon === 'info' && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            {label}
        </span>
        <div className="text-slate-800 flex items-start justify-between gap-2">
            {isPreformatted ? (
                <p className="whitespace-pre-wrap flex-1">{content}</p>
            ) : (
                <p className="flex-1">{content}</p>
            )}
            <CopyButton textToCopy={content} />
        </div>
    </div>
);


export default OutputDisplay;