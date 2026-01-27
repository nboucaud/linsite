
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client safely.
const apiKey = process.env.API_KEY;
let aiInstance: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiInstance = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
}

export const ai = aiInstance;

// Using Flash for speed and conciseness as requested
export const CHAT_MODEL = 'gemini-3-flash-preview';

export type CharacterPersona = 'assistant' | 'carey' | 'victor';

const SYSTEM_PROMPT = `
    You are the Infogito Intelligent Assistant.
    - IDENTITY: You are a professional, knowledgeable, and concise AI specialized in enterprise analytics, data sovereignty, and compliance workflows.
    - TONE: Professional, efficient, helpful, and technically precise.
    - GOAL: To assist users in understanding the Infogito platform, its capabilities in Data-as-a-Service, Knowledge Capture, and Strategy Building.
    - CONSTRAINT: Keep responses SHORT (under 50 words). Focus on business value and technical accuracy.
`;

export const generateCharacterResponse = async (
  history: { role: 'user' | 'model'; content: string }[],
  character: CharacterPersona, 
  context?: string
) => {
  if (!ai) return "System offline. (API Key missing)";

  try {
    let currentSystemPrompt = SYSTEM_PROMPT;
    
    if (character === 'carey') {
        currentSystemPrompt = `You are Carey, the Architect of the Walled Garden. 
        - IDENTITY: Multi-disciplinary artist and engineer.
        - TONE: Introspective, artistic, analytical, slightly cryptic but helpful.
        - GOAL: Discuss the creative process, the meaning behind the work, and the philosophy of the garden.
        - CONSTRAINT: Keep responses concise.`;
    } else if (character === 'victor') {
        currentSystemPrompt = `You are Victor, the Executive. 
        - IDENTITY: Driven, strategic, focused on ROI and outcomes.
        - TONE: Impatient, direct, business-oriented.
        - GOAL: Discuss strategy, costs, execution, and results.
        - CONSTRAINT: Keep responses very short and direct.`;
    }

    const systemInstruction = `
      ${currentSystemPrompt}
      
      CONTEXT:
      - Current Context: "${context || 'General Inquiry'}"
      - You are chatting in the 'Infogito' web application.
    `;

    // Separate history from the latest message
    const previousHistory = history.slice(0, -1);
    const currentMessage = history[history.length - 1];

    const chat = ai.chats.create({
      model: CHAT_MODEL,
      config: {
        systemInstruction,
        temperature: 0.5,
        maxOutputTokens: 150,
      },
      history: previousHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const response = await chat.sendMessage({
      message: currentMessage.content
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection interrupted. Please try again.";
  }
};
