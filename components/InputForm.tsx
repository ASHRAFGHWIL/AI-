import React, { useState } from 'react';
import type { MarketingInput } from '../types';
import { PLATFORMS } from '../constants';
import { useI18n } from '../hooks/useI18n';

interface InputFormProps {
  initialData: MarketingInput;
  onSubmit: (data: MarketingInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<MarketingInput>(initialData);
  const { t } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, parent: 'brand_guidelines' | 'seo_meta') => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;

    if (type === 'number') {
      finalValue = Number(value);
    } else if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      finalValue = e.target.checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: finalValue,
      },
    }));
  };
  
  const handleStringArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'main_keywords' | 'brand_words_to_avoid') => {
      const { value } = e.target;
      if (field === 'main_keywords') {
        setFormData(prev => ({ ...prev, main_keywords: value.split(',').map(k => k.trim()).filter(Boolean) }));
      } else {
        setFormData(prev => ({ ...prev, brand_guidelines: {...prev.brand_guidelines, brand_words_to_avoid: value.split(',').map(k => k.trim()).filter(Boolean)} }));
      }
  };


  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const platforms = checked
        ? [...prev.platforms, value]
        : prev.platforms.filter(p => p !== value);
      return { ...prev, platforms };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Fieldset legend={t('inputForm.productDetails')}>
        <Input label={t('inputForm.productName')} name="product_name" value={formData.product_name} onChange={handleChange} />
        <Textarea label={t('inputForm.shortDescription')} name="short_description" value={formData.short_description} onChange={handleChange} rows={2} />
        <Textarea label={t('inputForm.longDescription')} name="long_description" value={formData.long_description} onChange={handleChange} rows={5} />
        <Textarea label={t('inputForm.mainKeywords')} name="main_keywords" value={formData.main_keywords.join(', ')} onChange={(e) => handleStringArrayChange(e, 'main_keywords')} rows={2} />
      </Fieldset>
      
      <Fieldset legend={t('inputForm.targetingTone')}>
        <Input label={t('inputForm.targetAudience')} name="target_audience" value={formData.target_audience} onChange={handleChange} />
        <Input label={t('inputForm.toneOfVoice')} name="tone" value={formData.tone} onChange={handleChange} />
        <Select label={t('inputForm.language')} name="language" value={formData.language} onChange={handleChange}>
            <option value="ar-EG">Arabic (Egypt) ar-EG</option>
            <option value="en-US">English (US) en-US</option>
            <option value="mixed">Mixed</option>
        </Select>
        <Input label={t('inputForm.primaryCta')} name="primary_cta" value={formData.primary_cta} onChange={handleChange} />
        <Input label={t('inputForm.secondaryCta')} name="secondary_cta" value={formData.secondary_cta} onChange={handleChange} />
      </Fieldset>

      <Fieldset legend={t('inputForm.platforms')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PLATFORMS.map(platform => (
                <Checkbox
                    key={platform}
                    label={platform}
                    name="platform"
                    value={platform}
                    checked={formData.platforms.includes(platform)}
                    onChange={handlePlatformChange}
                />
            ))}
        </div>
      </Fieldset>
      
      <Fieldset legend={t('inputForm.brandSeo')}>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Input label={t('inputForm.maxHashtags')} name="max_hashtags" type="number" value={formData.brand_guidelines.max_hashtags} onChange={(e) => handleNestedChange(e, 'brand_guidelines')} />
            <Input label={t('inputForm.preferredTitleLength')} name="preferred_title_length" type="number" value={formData.seo_meta.preferred_title_length} onChange={(e) => handleNestedChange(e, 'seo_meta')} />
            <Input label={t('inputForm.preferredDescLength')} name="preferred_description_length" type="number" value={formData.seo_meta.preferred_description_length} onChange={(e) => handleNestedChange(e, 'seo_meta')} />
            <Checkbox label={t('inputForm.emojisAllowed')} name="emoji_allowed" checked={formData.brand_guidelines.emoji_allowed} onChange={(e) => handleNestedChange(e, 'brand_guidelines')} />
         </div>
         <Textarea label={t('inputForm.wordsToAvoid')} name="brand_words_to_avoid" value={formData.brand_guidelines.brand_words_to_avoid.join(', ')} onChange={(e) => handleStringArrayChange(e, 'brand_words_to_avoid')} rows={2} />
      </Fieldset>

      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-x-2 bg-slate-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200">
        {isLoading ? (
            <>
              <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.generating')}
            </>
        ) : t('common.generate')}
      </button>
    </form>
  );
};

const Fieldset: React.FC<{ legend: string; children: React.ReactNode }> = ({ legend, children }) => (
    <fieldset className="border-t border-slate-200 pt-6">
        <legend className="text-lg font-semibold text-slate-800 -mt-10 px-2 bg-slate-50">{legend}</legend>
        <div className="space-y-4">{children}</div>
    </fieldset>
);
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input {...props} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" />
    </div>
);
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea {...props} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" />
    </div>
);
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select {...props} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm">
            {children}
        </select>
    </div>
);
const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="flex items-center">
        <input {...props} type="checkbox" className="h-4 w-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500" />
        <label className="ms-2 block text-sm text-slate-900">{label}</label>
    </div>
);


export default InputForm;