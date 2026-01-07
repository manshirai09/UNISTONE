
import { GoogleGenAI } from "@google/genai";

export const askUnistoneAI = async (prompt: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    console.error("Gemini API Error: API_KEY is not defined in environment variables.");
    return "I'm currently in offline mode because my API key isn't set up. Please contact the administrator.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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
    return response.text || "I processed your request but have no text to return.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
};
