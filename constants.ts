import type { MarketingInput } from './types';

export const PLATFORMS = [
  { name: "Instagram", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '1080x1920 pixels', aspectRatioLabel: 'Square / Portrait', guideline: 'Optimal caption: ~125-150 words.', wordCount: { min: 100, max: 150 }, allows_links: false },
  { name: "Facebook", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '1080x1080 pixels', aspectRatioLabel: 'Square', guideline: 'Engaging posts are concise: ~40-80 words.', wordCount: { min: 40, max: 80 }, allows_links: true },
  { name: "X", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '1280x720 pixels', aspectRatioLabel: 'Square / Landscape', guideline: 'Strict limit of 280 characters.', characterLimit: 280, allows_links: true },
  { name: "LinkedIn", recommendedImageSize: '1200x627 pixels', recommendedVideoSize: '', aspectRatioLabel: 'Landscape', guideline: 'Professional posts: ~150-200 words.', wordCount: { min: 150, max: 200 }, allows_links: true },
  { name: "TikTok", recommendedImageSize: '', recommendedVideoSize: '1080x1920 pixels', aspectRatioLabel: 'Portrait', guideline: 'Short & punchy captions: ~15-50 words.', wordCount: { min: 15, max: 50 }, allows_links: false },
  { name: "Pinterest", recommendedImageSize: '1080x1080 pixels', recommendedVideoSize: '', aspectRatioLabel: 'Square', guideline: 'Description up to 500 characters.', characterLimit: 500, allows_links: true },
  { name: "YouTubeShort", recommendedImageSize: '', recommendedVideoSize: '1080x1920 pixels', aspectRatioLabel: 'Portrait', guideline: 'Title up to 100 characters.', characterLimit: 100, allows_links: true }
];

export const INITIAL_FORM_DATA: MarketingInput = {
  niche: "eco-friendly wooden lamps",
  audience: "US and Europe",
  style: "Educational and promotional",
  platforms: ["Instagram"],
  product_link: "",
  custom_hashtags: "",
  platform_images: {},
};