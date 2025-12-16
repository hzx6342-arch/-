import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Step 1: Analyze user text and generate a descriptive English prompt for the image model.
 */
export const optimizePrompt = async (userText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userText,
      config: {
        systemInstruction: `You are an expert visual director and AI art prompter. 
        Your task is to analyze the user's input text (which could be a blog title, a marketing slogan, a poem, or a snippet of an article in any language) and convert it into a highly effective, descriptive English image generation prompt.
        
        Guidelines:
        1. Identify the core mood, subject matter, and metaphor of the text.
        2. Determine an appropriate art style (e.g., minimalist vector, cinematic photorealism, warm watercolor, cyberpunk, 3D isometric) that fits the context of the text.
        3. Describe the lighting, composition, and color palette.
        4. Output ONLY the English prompt string. Do not include explanations.`,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate optimized prompt.");
    return text.trim();
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    throw new Error("Failed to analyze text. Please try again.");
  }
};

/**
 * Step 2: Generate the image using the optimized prompt.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        // Nano Banana models do not support responseMimeType or tools.
        // Just send the prompt.
      }
    });

    // Extract image from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content received from image model.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }

    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};