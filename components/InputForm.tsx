


import React, { useState, useMemo } from 'react';
import type { MarketingInput } from '../types';
import { PLATFORMS, CTA_STYLES, CONTENT_STYLES, TARGET_AUDIENCES } from '../constants';
import { useI18n } from '../hooks/useI18n';
import SocialIcon from './SocialIcon';
import PlatformSettingsAccordion from './PlatformSettingsAccordion';

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
      const newSelections = { ...prev.platform_image_selection };
      const newSettings = { ...prev.platform_settings };
      if (!checked) {
          delete newImages[value];
          delete newSelections[value];
          delete newSettings[value];
      }

      return { ...prev, platforms, platform_images: newImages, platform_image_selection: newSelections, platform_settings: newSettings };
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, platformName: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filePromises = Array.from(files).map(file => {
        // FIX: Add type-safe handling for FileReader result to ensure it's a string.
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('File could not be read as a data URL.'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(filePromises).then(dataUrls => {
        setFormData(prev => ({
            ...prev,
            platform_images: {
                ...prev.platform_images,
                [platformName]: [
                    ...(prev.platform_images?.[platformName] ?? []),
                    ...dataUrls
                ],
            }
        }));
    }).catch(error => {
        console.error("Error reading files:", error);
    });
    e.target.value = ''; // Allow re-uploading the same file
  };

  const removeImage = (platformName: string, imageIndex: number) => {
      setFormData(prev => {
          const newImages = { ...prev.platform_images };
          const platformImages = newImages[platformName] ? [...newImages[platformName]] : [];
          platformImages.splice(imageIndex, 1);

          const newSelections = { ...prev.platform_image_selection };
          const currentSelection = newSelections[platformName];
          
          if (typeof currentSelection === 'number') {
              if (currentSelection === imageIndex) {
                  newSelections[platformName] = 'auto';
              } else if (currentSelection > imageIndex) {
                  newSelections[platformName] = currentSelection - 1;
              }
          }

          if (platformImages.length === 0) {
              delete newImages[platformName];
              delete newSelections[platformName];
          } else {
              newImages[platformName] = platformImages;
          }

          return {
              ...prev,
              platform_images: newImages,
              platform_image_selection: newSelections,
          };
      });
  };

  const handleImageSelectionChange = (platformName: string, selection: 'auto' | number) => {
    setFormData(prev => ({
        ...prev,
        platform_image_selection: {
            ...prev.platform_image_selection,
            [platformName]: selection
        }
    }));
  };

  const handlePlatformSettingChange = (platformName: string, settingId: string, value: string | number) => {
    setFormData(prev => ({
        ...prev,
        platform_settings: {
            ...prev.platform_settings,
            [platformName]: {
                ...prev.platform_settings?.[platformName],
                [settingId]: value,
            }
        }
    }));
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
  
  const selectedPlatformsWithSettings = useMemo(() => {
    return PLATFORMS.filter(p => formData.platforms.includes(p.name) && p.settings && p.settings.length > 0);
  }, [formData.platforms]);


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Fieldset legend={t('inputForm.coreDetails')}>
        <Input label={t('inputForm.niche')} name="niche" value={formData.niche} onChange={handleChange} placeholder="e.g., eco-friendly wooden lamps" />
        <Select label={t('inputForm.audience')} name="audience" value={formData.audience} onChange={handleChange}>
            {TARGET_AUDIENCES.map(audience => (
              <option key={audience} value={audience}>{t(`inputForm.targetAudiences.${audience}`)}</option>
            ))}
        </Select>
        <Select label={t('inputForm.style')} name="style" value={formData.style} onChange={handleChange}>
            {CONTENT_STYLES.map(style => (
              <option key={style} value={style}>{t(`inputForm.contentStyles.${style}`)}</option>
            ))}
        </Select>
        <Select label={t('inputForm.ctaStyle')} name="cta_style" value={formData.cta_style} onChange={handleChange}>
            {CTA_STYLES.map(style => (
              <option key={style} value={style}>{t(`inputForm.ctaStyles.${style}`)}</option>
            ))}
        </Select>
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
              const images = formData.platform_images?.[platform.name] ?? [];
              const selection = formData.platform_image_selection?.[platform.name] ?? 'auto';

              return (
                  <div key={platform.name} className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg flex flex-col">
                      <div className="relative flex items-start">
                          <div className="flex h-6 items-center">
                              <input
                                id={`platform-${platform.name}`}
                                name="platform"
                                value={platform.name}
                                checked={isChecked}
                                onChange={handlePlatformChange}
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600 dark:bg-slate-700 dark:border-slate-600 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
                              />
                          </div>
                          <div className="ms-3 text-sm leading-6">
                              <label htmlFor={`platform-${platform.name}`} className="font-medium text-slate-900 dark:text-slate-200 flex items-center gap-2 cursor-pointer">
                                  <span className="text-slate-500 dark:text-slate-400"><SocialIcon platform={platform.name} /></span>
                                  {platform.name}
                              </label>
                              <p className="text-slate-500 dark:text-slate-400 text-xs">{platform.guideline}</p>
                          </div>
                      </div>
                      {isChecked && supportsImage && (
                         <div className="mt-3 flex-grow flex flex-col space-y-3 border-t border-slate-200 dark:border-slate-700/50 pt-3">
                            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('inputForm.imageSelection')}</h4>
                            <div>
                                <button type="button" onClick={() => handleImageSelectionChange(platform.name, 'auto')} className={`w-full text-xs px-3 py-1.5 rounded-md transition-colors ${selection === 'auto' ? 'bg-sky-600 text-white font-semibold' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                                    {t('inputForm.letAIChoose')}
                                </button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 flex-grow content-start">
                                {images.map((imgSrc, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <button
                                          type="button"
                                          onClick={() => handleImageSelectionChange(platform.name, index)}
                                          className={`w-full h-full rounded-md overflow-hidden focus:outline-none ring-offset-2 dark:ring-offset-slate-800/50 focus:ring-2 ${selection === index ? 'ring-2 ring-sky-500' : 'ring-1 ring-slate-300 dark:ring-slate-600 hover:ring-slate-400 dark:hover:ring-slate-500'}`}
                                        >
                                            <img src={imgSrc} alt={`upload preview ${index+1}`} className="w-full h-full object-cover" />
                                            {selection === index && (
                                                <div className="absolute inset-0 bg-sky-500/50 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                        <button type="button" onClick={() => removeImage(platform.name, index)} className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ring-offset-1 dark:ring-offset-slate-800/50" aria-label={t('inputForm.removeImage')}>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <label className="cursor-pointer aspect-square flex items-center justify-center w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="sr-only">{t('inputForm.addImage')}</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageChange(e, platform.name)} />
                                </label>
                            </div>
                         </div>
                      )}
                  </div>
              )
            })}
        </div>
      </Fieldset>
      
      {selectedPlatformsWithSettings.length > 0 && (
          <Fieldset legend={t('inputForm.platformCustomizations')}>
              <PlatformSettingsAccordion
                platforms={selectedPlatformsWithSettings}
                formData={formData}
                onSettingChange={handlePlatformSettingChange}
              />
          </Fieldset>
      )}
      
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

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <select {...props} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:focus:ring-sky-500 dark:focus:border-sky-500">
            {children}
        </select>
    </div>
);

export default InputForm;