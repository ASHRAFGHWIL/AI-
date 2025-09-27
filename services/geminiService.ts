import { GoogleGenAI } from "@google/genai";
import type { MarketingInput, MarketingOutput, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT_INSTRUCTIONS = `
You are a professional content generation assistant specialized in SEO-driven marketing content. You create fully optimized, engaging, and professional posts for all social media platforms (Facebook, Instagram, TikTok, Pinterest, YouTube, LinkedIn, X).

Your Task:
1. Based on the user's input (niche, audience, style, platforms), research and integrate the most searched keywords in the US and European markets related to the provided niche.
2. Generate SEO-friendly content using these keywords naturally.
3. Adapt the content format automatically to fit each chosen platform.
4. For each platform selected by the user, generate 3-5 variations.
5. If images are provided for specific platforms, analyze them and generate content that is highly relevant to the provided visuals.
6. Adhere to any platform-specific settings provided in the input, such as tone for LinkedIn or character limits for X.

Content for each variation MUST include:
- A strong hook at the beginning.
- A value-driven body (educational, emotional, or promotional).
- A clear call-to-action (CTA) tailored to the platform AND the user's selected 'cta_style'. If a 'product_link' is provided in the input, incorporate it into the CTA for platforms that support links.
- Relevant trending hashtags/keywords for reach. If 'custom_hashtags' are provided in the input, you MUST include them along with the ones you generate.

Output Format Rules:
- Use Markdown for structuring the entire output.
- Start with a top-level heading for each platform (e.g., '## Instagram').
- Use a sub-heading for each variation (e.g., '### Variation 1').
- Use bold markdown for labels (e.g., '**Hook:**', '**Body:**', '**CTA:**', '**Hashtags:**').
- DO NOT output JSON.
`;


export const generateSocialPosts = async (input: MarketingInput): Promise<MarketingOutput> => {
  const model = 'gemini-2.5-flash';
  
  const inputForPrompt = { ...input };
  if (inputForPrompt.platform_images && Object.keys(inputForPrompt.platform_images).length > 0) {
      inputForPrompt.platform_images = Object.fromEntries(
          Object.keys(inputForPrompt.platform_images).map(key => [key, 'Image Attached'])
      );
  } else {
    delete inputForPrompt.platform_images;
  }

  // Clean up empty platform_settings
  if (inputForPrompt.platform_settings) {
    inputForPrompt.platform_settings = Object.fromEntries(
        Object.entries(inputForPrompt.platform_settings).filter(([, settings]) => Object.values(settings).some(v => v !== null && v !== undefined && v !== ''))
    );
    if (Object.keys(inputForPrompt.platform_settings).length === 0) {
        delete inputForPrompt.platform_settings;
    }
  }

  const fullPrompt = `${PROMPT_INSTRUCTIONS}\n\nUser Input:\n${JSON.stringify(inputForPrompt, null, 2)}`;

  try {
    const textPart = { text: fullPrompt };

    const imageParts = Object.values(input.platform_images || {}).map(dataUrl => {
        const [meta, base64Data] = (dataUrl || '').split(',');
        if (!base64Data) return null;
        
        const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
        return {
            inlineData: {
                mimeType,
                data: base64Data,
            },
        };
    }).filter((p): p is { inlineData: { mimeType: string; data: string } } => p !== null);

    const parts = [textPart, ...imageParts];

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: parts },
        config: {
          tools: [{googleSearch: {}}],
          temperature: 0.3,
        },
    });

    const responseText = response?.text?.trim() ?? '';
    
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: GroundingSource[] = rawSources
      .map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title,
      }))
      .filter((source: GroundingSource) => source.uri && source.title);

    return {
      content: responseText,
      sources: sources,
    };

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