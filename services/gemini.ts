import { GoogleGenAI } from "@google/genai";

// AI Assistant service for UNISTONE University platform
export const askUnistoneAI = async (prompt: string) => {
  // Use process.env.API_KEY exclusively as per guidelines and initialize strictly
  try {
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

    // Directly access .text property as per guidelines (do not use .text())
    return response.text || "I processed your request but have no text to return.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Silent handling of configuration errors for a better user experience
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
};