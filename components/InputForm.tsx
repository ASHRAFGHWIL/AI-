import React, { useState, useMemo } from 'react';
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

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const platforms = checked
        ? [...prev.platforms, value]
        : prev.platforms.filter(p => p !== value);
      
      const newImages = { ...prev.platform_images };
      if (!checked) {
          delete newImages[value];
      }

      return { ...prev, platforms, platform_images: newImages };
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, platformName: string) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                platform_images: {
                    ...prev.platform_images,
                    [platformName]: reader.result as string,
                }
            }));
        };
        reader.readAsDataURL(file);
    }
  };

  const removeImage = (platformName: string) => {
      setFormData(prev => {
          const newImages = { ...prev.platform_images };
          delete newImages[platformName];
          return {
              ...prev,
              platform_images: newImages,
          };
      });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const showLinkFieldHint = useMemo(() => {
    return formData.platforms.some(platformName => {
        const platform = PLATFORMS.find(p => p.name === platformName);
        return platform?.allows_links;
    });
  }, [formData.platforms]);


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Fieldset legend={t('inputForm.coreDetails')}>
        <Input label={t('inputForm.niche')} name="niche" value={formData.niche} onChange={handleChange} placeholder="e.g., eco-friendly wooden lamps" />
        <Input label={t('inputForm.audience')} name="audience" value={formData.audience} onChange={handleChange} placeholder="e.g., US, Europe, or specific countries" />
        <Input label={t('inputForm.style')} name="style" value={formData.style} onChange={handleChange} placeholder="e.g., educational, entertaining, promotional" />
        <div>
            <Input label={t('inputForm.productLink')} name="product_link" value={formData.product_link || ''} onChange={handleChange} placeholder="e.g., https://example.com/product" />
            {showLinkFieldHint && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 px-1">{t('inputForm.productLinkHint')}</p>
            )}
        </div>
        <div>
            <Input label={t('inputForm.customHashtags')} name="custom_hashtags" value={formData.custom_hashtags || ''} onChange={handleChange} placeholder="e.g., #MyBrand #SummerSale" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 px-1">{t('inputForm.customHashtagsHint')}</p>
        </div>
      </Fieldset>
      
      <Fieldset legend={t('inputForm.platforms')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            {PLATFORMS.map(platform => {
              const isChecked = formData.platforms.includes(platform.name);
              const supportsImage = platform.recommendedImageSize;
              const imageData = formData.platform_images?.[platform.name];

              return (
                  <div key={platform.name} className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg">
                      <Checkbox
                          label={platform.name}
                          description={platform.guideline}
                          name="platform"
                          value={platform.name}
                          checked={isChecked}
                          onChange={handlePlatformChange}
                      />
                      {isChecked && supportsImage && (
                          <div className="mt-3 ms-6">
                              {imageData ? (
                                  <div className="flex items-center gap-3">
                                      <img src={imageData} alt={`${platform.name} preview`} className="w-12 h-12 object-cover rounded-md border-2 border-slate-300 dark:border-slate-600" />
                                      <button type="button" onClick={() => removeImage(platform.name)} className="text-xs text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-medium">Remove</button>
                                  </div>
                              ) : (
                                  <label className="cursor-pointer">
                                      <div className="flex items-center justify-center w-full px-3 py-2 text-xs border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors">
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 me-2">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                          </svg>
                                          Upload Image
                                      </div>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, platform.name)} />
                                  </label>
                              )}
                          </div>
                      )}
                  </div>
              )
            })}
        </div>
      </Fieldset>
      
      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-x-2 bg-slate-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-sky-600 dark:hover:bg-sky-500 dark:focus:ring-sky-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400">
        {isLoading ? (
            <>
              <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    <fieldset className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <legend className="text-lg font-semibold text-slate-800 dark:text-slate-200 -mt-10 px-2 bg-slate-50 dark:bg-slate-900">{legend}</legend>
        <div className="space-y-4">{children}</div>
    </fieldset>
);
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <input {...props} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:ring-sky-500 dark:focus:border-sky-500" />
    </div>
);

const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, description?: string }> = ({ label, description, ...props }) => (
    <div>
        <div className="flex items-center">
            <input {...props} type="checkbox" className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900 dark:checked:bg-sky-500" />
            <label className="ms-2 block text-sm font-medium text-slate-900 dark:text-slate-200">{label}</label>
        </div>
        {description && <p className="ms-6 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
);


export default InputForm;