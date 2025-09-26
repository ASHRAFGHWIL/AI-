
import { GoogleGenAI, Type } from "@google/genai";
import type { MarketingInput, MarketingOutput } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT_INSTRUCTIONS = `
أنت مساعد ذكاء اصطناعي متقدم موجه لإنشاء منشورات تسويقية احترافية وصديقة لمحركات البحث (SEO) لمختلف منصات السوشال ميديا. مهمتك: استقبال مدخلات عن منتج/خدمة/حملة ثم إنتاج حزمة محتوى متكاملة معدّة للنشر لكل منصة محددة.

قواعد خروج المحتوى:
1. لكل منصة طلّع 3 متغيرات (A / B / C).
2. ضع أهم الكلمات المفتاحية في أول 1-3 كلمات في العناوين والوصف حيثما أمكن دون إفساد القراءة.
3. لكل منشور أدرج:
   - title (إذا المنصة بتدعم عنوان)
   - caption/text (بطول مناسب)
   - 5-12 هاشتاج (باللغة المطلوبة) مع تبرير سريع لاختيارهم
   - image_suggest: 1-2 جملة تصف الصورة المثالية + alt_text ≤ 125 حرف
   - seo_snippet: meta title و meta description مناسبين للـ SEO
   - length_limit_notes: تحذير عن طول النص المسموح للمنصة
   - suggested_post_time: (اقتراح عام حسب الـ target_audience — الصباح/المساء/ويكند)
   - CTA داخل النص ومقترحات للـ first comment (إن وُجدت)
4. لمنصات الفيديو (TikTok/YouTubeShort)، قدم نسخة مُختصرة للإعلانات مدتها 15 ثانية (نص لفيديو قصير) مع hook أول 3 ثواني قوي.
5. كل إخراج لازم يبقى بصيغة JSON قابلة للمعالجة آليًا تمامًا حسب الـ schema المحدد.
`;

const variantSchema = {
    type: Type.OBJECT,
    properties: {
        variant: { type: Type.STRING, enum: ['A', 'B', 'C'] },
        title: { type: Type.STRING, nullable: true, description: "Only for platforms that support it like Pinterest/LinkedIn." },
        caption: { type: Type.STRING, nullable: true, description: "The main post body/text. Use 'text' for platforms like X." },
        text: { type: Type.STRING, nullable: true, description: "Use for platforms like X (Twitter)." },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        hashtag_reasoning: { type: Type.STRING },
        image_suggest: { type: Type.STRING },
        alt_text: { type: Type.STRING },
        meta_title: { type: Type.STRING },
        meta_description: { type: Type.STRING },
        cta: { type: Type.STRING },
        first_comment: { type: Type.STRING, nullable: true },
        length_limit_notes: { type: Type.STRING },
        suggested_post_time: { type: Type.STRING },
        video_script_15s: { type: Type.STRING, nullable: true, description: "Only for video platforms like TikTok and YouTubeShort." },
    },
    required: [
        'variant', 'hashtags', 'hashtag_reasoning', 'image_suggest', 'alt_text', 
        'meta_title', 'meta_description', 'cta', 'length_limit_notes', 'suggested_post_time'
    ]
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    product: { type: Type.STRING },
    platforms: {
      type: Type.OBJECT,
      description: "An object where keys are platform names (e.g., 'Instagram', 'TikTok') and values are arrays of variants.",
      properties: {
        Instagram: { type: Type.ARRAY, items: variantSchema, nullable: true },
        Facebook: { type: Type.ARRAY, items: variantSchema, nullable: true },
        X: { type: Type.ARRAY, items: variantSchema, nullable: true },
        LinkedIn: { type: Type.ARRAY, items: variantSchema, nullable: true },
        TikTok: { type: Type.ARRAY, items: variantSchema, nullable: true },
        Pinterest: { type: Type.ARRAY, items: variantSchema, nullable: true },
        YouTubeShort: { type: Type.ARRAY, items: variantSchema, nullable: true },
      }
    }
  },
  required: ['product', 'platforms']
};


export const generateSocialPosts = async (input: MarketingInput): Promise<MarketingOutput> => {
  const model = 'gemini-2.5-flash';
  const fullPrompt = `${PROMPT_INSTRUCTIONS}\n\nHere is the input data:\n${JSON.stringify(input, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2,
        },
    });

    const responseText = response.text.trim();
    const parsedJson = JSON.parse(responseText);
    
    // Gemini sometimes returns an object with just the platform keys.
    // We need to ensure the top-level structure is always correct.
    if (!parsedJson.product || !parsedJson.platforms) {
        return {
            product: input.product_name,
            platforms: parsedJson,
        }
    }

    return parsedJson as MarketingOutput;

  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    let errorMessage = "Failed to generate content.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
    }
    // Attempt to find more detailed error info if available
    if (error && typeof error === 'object' && 'message' in error) {
      const typedError = error as { message: string; response?: any };
      if (typedError.response && typedError.response.candidates) {
        console.error("Gemini API Response details:", JSON.stringify(typedError.response.candidates, null, 2));
      }
    }
    throw new Error(errorMessage);
  }
};
