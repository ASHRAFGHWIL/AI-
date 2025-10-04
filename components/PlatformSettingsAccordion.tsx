import React, { useState } from 'react';
import type { MarketingInput, Platform } from '../types';
import { useI18n } from '../hooks/useI18n';
import SocialIcon from './SocialIcon';

interface PlatformSettingsAccordionProps {
  platforms: Platform[];
  formData: MarketingInput;
  onSettingChange: (platformName: string, settingId: string, value: string | number) => void;
}

const PlatformSettingsAccordion: React.FC<PlatformSettingsAccordionProps> = ({ platforms, formData, onSettingChange }) => {
    const { t } = useI18n();
    const [openPlatform, setOpenPlatform] = useState<string | null>(platforms[0]?.name ?? null);

    const togglePlatform = (platformName: string) => {
        setOpenPlatform(prev => (prev === platformName ? null : platformName));
    };

    return (
        <div className="space-y-2">
            {platforms.map(platform => {
                const isOpen = openPlatform === platform.name;
                return (
                    <div key={platform.name} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-sm">
                        <h3 className="m-0">
                            <button
                                type="button"
                                onClick={() => togglePlatform(platform.name)}
                                className="flex items-center justify-between w-full p-3 text-sm font-medium text-start text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/70 dark:hover:bg-slate-800"
                                aria-expanded={isOpen}
                                aria-controls={`settings-panel-${platform.name}`}
                            >
                                <span className="flex items-center gap-3">
                                    <SocialIcon platform={platform.name} />
                                    {platform.name}
                                </span>
                                <svg
                                    className={`w-4 h-4 transform transition-transform text-slate-500 dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </h3>
                        <div
                            id={`settings-panel-${platform.name}`}
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                        >
                            <div className="p-4 space-y-4 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                                {platform.settings?.map(setting => (
                                    <div key={setting.id}>
                                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">{t(setting.label)}</label>
                                        {setting.type === 'number' && (
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder={setting.placeholder}
                                                    value={formData.platform_settings?.[platform.name]?.[setting.id] ?? ''}
                                                    onChange={(e) => onSettingChange(platform.name, setting.id, e.target.valueAsNumber)}
                                                    className="block w-full text-xs px-2 py-1.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                                />
                                                {setting.unit && <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">{t(`inputForm.platformSettings.units.${setting.unit}`)}</span>}
                                            </div>
                                        )}
                                        {setting.type === 'select' && setting.options && (
                                            <select
                                                value={formData.platform_settings?.[platform.name]?.[setting.id] ?? setting.defaultValue}
                                                onChange={(e) => onSettingChange(platform.name, setting.id, e.target.value)}
                                                className="block w-full text-xs px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                            >
                                                {setting.options.map(option => (
                                                    <option key={option} value={option}>{t(`inputForm.platformSettings.linkedinTones.${option}`)}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PlatformSettingsAccordion;
