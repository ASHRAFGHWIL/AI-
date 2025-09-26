export interface Platform {
  name: string;
  recommendedImageSize: string;
  recommendedVideoSize: string;
  aspectRatioLabel: string;
  guideline: string;
  wordCount?: { min: number; max: number };
  characterLimit?: number;
  allows_links?: boolean;
}

export interface MarketingInput {
  niche: string;
  audience: string;
  style: string;
  platforms: string[];
  product_link?: string;
  custom_hashtags?: string;
  platform_images?: { [platformName: string]: string };
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface MarketingOutput {
  content: string;
  sources: GroundingSource[];
}