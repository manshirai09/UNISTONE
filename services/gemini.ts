
import { GoogleGenAI } from "@google/genai";

export const askUnistoneAI = async (prompt: string) => {
  try {
    // Fix: Move GoogleGenAI instance creation inside the function to ensure it always uses the most current process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are UNISTONE AI, the smart assistant for UNISTONE University platform. 
        You help students with navigation, course details, events, and career advice. 
        Be professional, encouraging, and helpful. Keep responses concise.
        Current campus context: Main Admin Block, Science Complex, Tech Library, and Student Center are the main hubs.`,
        temperature: 0.7,
      },
    });
    // Accessing .text as a property per current SDK guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
};
