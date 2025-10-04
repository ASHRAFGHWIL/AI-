import type { MarketingInput, Platform } from './types';

export const LINKEDIN_TONES = [
    "Professional",
    "Casual",
    "Authoritative",
    "Friendly"
];

export const PLATFORMS: Platform[] = [
  { name: "Instagram", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '1080x1920 pixels', aspectRatioLabel: 'Square / Portrait', guideline: 'Optimal caption: ~125-150 words. Use high-quality visuals, relevant emojis, and ask questions to boost engagement.', wordCount: { min: 100, max: 150 }, allows_links: false },
  { name: "Facebook", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '1080x1080 pixels', aspectRatioLabel: 'Square', guideline: 'Engaging posts are concise: ~40-80 words. Pair with strong visuals (images/video) and encourage discussion with questions.', wordCount: { min: 40, max: 80 }, allows_links: true },
  { name: "X", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '1280x720 pixels', aspectRatioLabel: 'Square / Landscape', guideline: 'Strict limit of 280 characters. Use visuals (images, GIFs) to increase engagement. Short, impactful tweets or informative threads work well.', characterLimit: 280, allows_links: true,
    settings: [
      { id: 'characterLimit', label: 'inputForm.platformSettings.characterLimit', type: 'number', placeholder: '280' }
    ]
  },
  { name: "LinkedIn", recommendedImageSize: '1200x627 pixels', recommendedVideoSize: '', aspectRatioLabel: 'Landscape', guideline: 'Professional posts: ~150-200 words. Maintain a professional tone, use industry hashtags, and encourage thoughtful comments.', wordCount: { min: 150, max: 200 }, allows_links: true,
    settings: [
      { id: 'tone', label: 'inputForm.platformSettings.tone', type: 'select', options: LINKEDIN_TONES, defaultValue: 'Professional' }
    ]
  },
  { name: "TikTok", recommendedImageSize: '', recommendedVideoSize: '1080x1920 pixels', aspectRatioLabel: 'Portrait', guideline: 'Short & punchy captions: ~15-50 words. Crucial to use trending sounds and a strong visual hook in the first 3 seconds.', wordCount: { min: 15, max: 50 }, allows_links: false,
    settings: [
      { id: 'maxVideoLength', label: 'inputForm.platformSettings.maxVideoLength', type: 'number', placeholder: '60', unit: 'seconds' }
    ]
  },
  { name: "Pinterest", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '', aspectRatioLabel: 'Square', guideline: 'Description up to 500 characters. Focus on keyword-rich descriptions and visually compelling Pins that drive clicks.', characterLimit: 500, allows_links: true },
  { name: "YouTubeShort", recommendedImageSize: '', recommendedVideoSize: '1080x1920 pixels', aspectRatioLabel: 'Portrait', guideline: 'Title up to 100 characters. Capture attention immediately with a strong hook and leverage trending audio for visibility.', characterLimit: 100, allows_links: true,
    settings: [
      { id: 'maxVideoLength', label: 'inputForm.platformSettings.maxVideoLength', type: 'number', placeholder: '60', unit: 'seconds' }
    ]
  }
];

export const CONTENT_STYLES = [
    "Promotional",
    "Entertaining",
    "Educational",
    "Storytelling"
];

export const TARGET_AUDIENCES = [
    "US",
    "European",
    "Asian",
    "South American",
    "Australian"
];

export const CTA_STYLES = [
    "Direct",
    "Question",
    "Benefit-driven",
    "Urgency",
    "Soft",
    "Teaser",
    "Community"
];

export const INITIAL_FORM_DATA: MarketingInput = {
  niche: "eco-friendly wooden lamps",
  audience: TARGET_AUDIENCES[0],
  style: CONTENT_STYLES[0],
  cta_style: CTA_STYLES[0],
  platforms: ["Instagram"],
  product_link: "",
  custom_hashtags: "",
  platform_images: {},
  platform_image_selection: {},
  platform_settings: {},
};