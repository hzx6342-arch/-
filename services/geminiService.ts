import { GoogleGenAI } from "@google/genai";

// Helper to get a fresh AI instance with the current key
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

/**
 * Step 1: Analyze user text and generate a descriptive English prompt.
 */
export const optimizePrompt = async (userText: string, style: string = 'Auto'): Promise<string> => {
  try {
    const ai = getAI();
    let promptContent = `User Input Text: "${userText}"`;
    
    if (style !== 'Auto') {
      promptContent += `\n\nREQUIRED VISUAL STYLE: ${style}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptContent,
      config: {
        systemInstruction: `You are an expert visual director. 
        Your task is to analyze the user's input text and convert it into a highly effective, descriptive English prompt for generating a static image.
        
        Guidelines:
        1. Identify the core mood, subject matter, and metaphor.
        2. ${style === 'Auto' ? 'Determine an appropriate art style.' : 'Use the REQUIRED VISUAL STYLE provided.'}
        3. Describe lighting, composition, and color palette.
        4. Output ONLY the English prompt string.`,
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
 * Step 2: Generate Image
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content received.");

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};