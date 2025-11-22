import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { EngineResponse, CATEGORIES } from '../types';

// Define the expected JSON schema for the response
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    action: { 
      type: Type.STRING, 
      enum: ["create", "update", "delete", "chat", "confirm"],
      description: "The action to perform based on user intent."
    },
    message: { type: Type.STRING, description: "Conversational response to the user." },
    targetId: { type: Type.STRING, description: "If updating or deleting, the ID of the card to target. If creating, leave empty." },
    data: {
      type: Type.OBJECT,
      description: "Data for the experience card (for create/update actions).",
      properties: {
        title: { type: Type.STRING, description: "Category Name in Korean (e.g., '공모전', '인턴')." },
        category: { 
          type: Type.STRING, 
          enum: CATEGORIES.map(c => c.id),
          description: "Internal Category ID." 
        },
        iconType: { type: Type.STRING, enum: ["medal", "trophy", "star"] },
        date: { type: Type.STRING, description: "Date strictly in 'YY.MM.DD' format (e.g., 24.01.05)." },
        fields: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "Field label." },
              value: { type: Type.STRING, description: "Field content." }
            }
          }
        }
      }
    },
    timeline: {
      type: Type.OBJECT,
      description: "Timeline entry for the experience.",
      properties: {
        year: { type: Type.INTEGER },
        date: { type: Type.STRING, description: "Date strictly in 'YY.MM.DD' format." },
        title: { type: Type.STRING, description: "Concise summary title (max 40 chars)." },
        categoryId: { type: Type.STRING }
      }
    }
  }
};

interface FileData {
  mimeType: string;
  base64: string;
}

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `
        You are the 'Experience Engine' for CONDOT.
        You manage experience cards through conversation.
        
        ROLES & BEHAVIOR:
        1. **State Maintenance**: 
           - You are 'Drafting' until the user provides enough info.
           - If the user is correcting a previous card, use 'update'.
           - If the user wants to remove something, use 'delete'.
           - If the user switches topics completely, start a new 'create' flow.

        2. **Color Mapping**:
           - Use the 'category' field strictly. The frontend will handle the hex mapping based on this ID.
           - Available Categories: ${CATEGORIES.map(c => `${c.id}(${c.name})`).join(', ')}.

        3. **Data Formatting Rules (CRITICAL)**:
           - **Date**: ALWAYS convert any date input to **'YY.MM.DD'** format (e.g., 2023-05-01 -> 23.05.01).
           - **Key Result (핵심성과)**: Must be **ONE sentence** and **LESS THAN 40 characters**. Remove unnecessary adjectives. Focus on the result.
           - **Language**: Korean.

        4. **CRUD Actions**:
           - **'create'**: Return this when a NEW experience is fully described.
           - **'update'**: Return this when the user says "Change the date", "Fix the typo", "Add this detail".
           - **'delete'**: Return this when the user says "Remove it", "Delete this experience".
           - **'chat'**: Use this for asking questions.

        5. **Output**:
           - Always return JSON satisfying the schema.
           - 'data' and 'timeline' are required for 'create' and 'update'.
      `,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string, fileData?: FileData): Promise<EngineResponse> => {
  const chat = initializeChat();
  
  try {
    let messagePayload: any = message;

    if (fileData) {
      messagePayload = {
        parts: [
          {
            inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.base64
            }
          },
          { text: message }
        ]
      };
    }

    const result: GenerateContentResponse = await chat.sendMessage({ message: messagePayload });
    const jsonText = result.text;
    
    if (!jsonText) {
        return { action: 'chat', message: "죄송합니다. 응답을 생성하는데 문제가 발생했습니다." };
    }

    const parsed = JSON.parse(jsonText);
    return parsed as EngineResponse;

  } catch (error) {
    console.error("Gemini Error:", error);
    return { action: 'chat', message: "오류가 발생했습니다. 다시 시도해주세요." };
  }
};