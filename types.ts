
export interface MarketingInput {
  product_name: string;
  short_description: string;
  long_description: string;
  main_keywords: string[];
  target_audience: string;
  tone: string;
  language: 'ar-EG' | 'en-US' | 'mixed';
  primary_cta: string;
  secondary_cta: string;
  platforms: string[];
  brand_guidelines: {
    max_hashtags: number;
    emoji_allowed: boolean;
    brand_words_to_avoid: string[];
  };
  seo_meta: {
    preferred_title_length: number;
    preferred_description_length: number;
  };
}

export interface Variant {
  variant: 'A' | 'B' | 'C';
  title?: string;
  caption?: string;
  text?: string;
  hashtags: string[];
  hashtag_reasoning: string;
  image_suggest: string;
  alt_text: string;
  meta_title: string;
  meta_description: string;
  cta: string;
  first_comment?: string;
  length_limit_notes: string;
  suggested_post_time: string;
  video_script_15s?: string;
}

export type PlatformOutput = Variant[];

export interface MarketingOutput {
  product: string;
  platforms: {
    [key: string]: PlatformOutput;
  };
}
