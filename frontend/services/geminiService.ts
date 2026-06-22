import { GoogleGenAI } from '@google/genai';

// Initialize the SDK. It relies on process.env.API_KEY being available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const SYSTEM_INSTRUCTION = `
You are Chalo AI, the intelligent assistant for "Chalo - India's Everyday Super App".
Your goal is to help users find the best deals, compare prices across platforms (Uber, Ola, Swiggy, Zomato, Blinkit, etc.), and manage their unified cart.
Be concise, friendly, and format your responses clearly using markdown.
If a user asks for recommendations, provide a structured comparison.
Example: If they ask for a ride, suggest options like "Uber Go: ₹150 (3 mins)", "Ola Mini: ₹165 (5 mins)".
Keep responses under 150 words unless detailed comparison is needed.
`;

export const generateChatResponse = async (prompt: string, history: {role: string, text: string}[]): Promise<string> => {
  try {
    // Format history for the API if needed, but for simplicity in this mockup, 
    // we'll just send the current prompt with context if we were using a full Chat session.
    // Here we use generateContent for a stateless-like interaction but pass history as text context.
    
    let contextPrompt = history.map(msg => `${msg.role === 'user' ? 'User' : 'Chalo AI'}: ${msg.text}`).join('\n');
    contextPrompt += `\nUser: ${prompt}\nChalo AI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Oops! I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
