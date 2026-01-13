
import { GoogleGenAI, Type } from "@google/genai";
import { Language, SOV_ID } from "../types";

const MODEL_NAME = "gemini-3-pro-preview";
const THINKING_BUDGET = 32768;

/**
 * Robust cleaning of markdown symbols for a clean UI experience.
 */
export const cleanAIData = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[#*`_~]/g, '') // Remove markdown symbols
    .replace(/\[|\]/g, '')  // Remove brackets
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
    .trim();
};

export const autoAssessSolution = async (
  description: string,
  lang: Language
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = lang === 'en'
    ? "You are an EU Cloud Sovereignty Auditor. Evaluate 8 SOV categories. Provide SEAL levels (0-4) and brief justifications. NO MARKDOWN. JSON ONLY."
    : "Eres un Auditor de Soberanía Cloud de la UE. Evalúa 8 categorías SOV. Proporciona niveles SEAL (0-4) y justificaciones breves. SIN MARKDOWN. SOLO JSON.";

  const prompt = `Evaluate: "${description}"
Required IDs: SOV-1 to SOV-8.
Output JSON schema: { assessments: [{ id: string, score: number, justification: string }] }`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: THINKING_BUDGET },
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Auto-assessment error:", error);
    return null;
  }
};

export const getSovereigntyAdvice = async (
  objectiveName: string,
  factors: string[],
  userContext: string,
  lang: Language
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = lang === 'en' 
    ? `Expert EU Cloud Auditor. Respond in ENGLISH. DO NOT use markdown symbols like * or #. Plain text only.`
    : `Experto Auditor Cloud UE. Responde en ESPAÑOL. NO uses símbolos markdown como * o #. Solo texto plano.`;

  const prompt = `Analyze: "${userContext}" for ${objectiveName}.
Factors: ${factors.join(', ')}
Output: SEAL level, Reasoning, 3 Improvements.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    });
    return cleanAIData(response.text || "");
  } catch (error) {
    return lang === 'en' ? "Error connecting." : "Error al conectar.";
  }
};

export const getSealGuidance = async (
  objectiveName: string,
  factors: string[],
  solutionDescription: string,
  lang: Language
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = lang === 'en'
    ? "EU Compliance Architect. NO MARKDOWN symbols. Use plain text formatting."
    : "Arquitecto de Cumplimiento UE. SIN símbolos markdown. Usa formato de texto plano.";

  const prompt = `Custom L0-L4 rubric for "${solutionDescription}" regarding ${objectiveName}.
Factors: ${factors.join(', ')}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    });
    return cleanAIData(response.text || "");
  } catch (error) {
    return "Error.";
  }
};

export const globalChat = async (message: string, history: any[], lang: Language) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: lang === 'en' 
        ? "EU Cloud Assistant. Professional plain text. No markdown." 
        : "Asistente Cloud UE. Texto plano profesional. Sin markdown.",
      thinkingConfig: { thinkingBudget: THINKING_BUDGET }
    }
  });
  const response = await chat.sendMessage({ message });
  return cleanAIData(response.text || "");
};
