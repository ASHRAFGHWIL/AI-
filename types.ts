export interface Platform {
  name: string;
  recommendedImageSize: string;
  recommendedVideoSize: string;
  aspectRatioLabel: string;
  guideline: string;
  wordCount?: { min: number; max: number };
  characterLimit?: number;
  allows_links?: boolean;
  settings?: PlatformSetting[];
}

export type PlatformSetting = {
  id: keyof PlatformSpecificSettings;
  label: string;
  type: 'number' | 'select';
  placeholder?: string;
  defaultValue?: string | number;
  unit?: string;
  options?: string[];
}

export interface PlatformSpecificSettings {
  maxVideoLength?: number;
  characterLimit?: number;
  tone?: string;
}

export interface MarketingInput {
  niche: string;
  audience: string;
  style: string;
  cta_style: string;
  platforms: string[];
  product_link?: string;
  custom_hashtags?: string;
  platform_images?: { [platformName: string]: string[] };
  platform_image_selection?: { [platformName: string]: 'auto' | number };
  platform_settings?: { [platformName: string]: PlatformSpecificSettings };
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface MarketingOutput {
  id: string;
  content: string;
  sources: GroundingSource[];
}

export interface SavedMarketingOutput extends MarketingOutput {
    savedAt: string;
    platforms: string[];
}