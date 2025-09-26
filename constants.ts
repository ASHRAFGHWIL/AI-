
import type { MarketingInput } from './types';

export const PLATFORMS = [
  "Instagram",
  "Facebook",
  "X",
  "LinkedIn",
  "TikTok",
  "Pinterest",
  "YouTubeShort",
];

export const INITIAL_FORM_DATA: MarketingInput = {
  product_name: "مصباح خشبي مضيء",
  short_description: "مصباح مكتبي مصنوع من الخشب الطبيعي بتصميم فني مقطوع بالليزر، يضفي لمسة دافئة وعصرية.",
  long_description: " نقدم لكم المصباح الخشبي المضيء، قطعة فنية تجمع بين الأصالة والحداثة. مصنوع من أجود أنواع الخشب المستدام، ويتميز بتصميم فريد مقطوع بتقنية الليزر الدقيقة التي تخلق أنماطًا ضوئية ساحرة على الجدران. يوفر إضاءة ناعمة ومريحة للعين، مما يجعله مثاليًا لغرف النوم، غرف المعيشة، أو كمصباح قراءة على مكتبك. بفضل تصميمه البسيط والأنيق، يندمج بسهولة مع مختلف أنماط الديكور، من المودرن إلى الريفي. استمتع بأجواء دافئة ومميزة في منزلك.",
  main_keywords: ["مصباح خشبي", "ديكور منزلي", "إضاءة ليلية", "تصميم ليزر", "خشب طبيعي"],
  target_audience: "شباب و عائلات في الشرق الأوسط، تتراوح أعمارهم بين 25-45 عامًا، مهتمون بالديكور المنزلي العصري، التصاميم الفريدة، والمنتجات الصديقة للبيئة.",
  tone: "ودود وإبداعي",
  language: "ar-EG",
  primary_cta: "تسوق الآن",
  secondary_cta: "اكتشف المزيد",
  platforms: ["Instagram", "Facebook", "TikTok"],
  brand_guidelines: {
    max_hashtags: 10,
    emoji_allowed: true,
    brand_words_to_avoid: ["رخيص", "تقليدي"],
  },
  seo_meta: {
    preferred_title_length: 60,
    preferred_description_length: 155,
  },
};
