
import { GoogleGenAI, Type } from "@google/genai";
import { Language, SOV_ID } from "../types";

const MODEL_PRO = "gemini-3-pro-preview";
const MODEL_FLASH = "gemini-3-flash-preview";
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

/**
 * Converts a diagram image to a textual description.
 */
export const describeArchitectureDiagram = async (
  base64Data: string,
  mimeType: string,
  lang: Language
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = lang === 'en'
    ? "Describe this architecture diagram in detail. Focus on components, cloud providers, locations, and security. Output ONLY plain text in English. NO MARKDOWN symbols."
    : "Describe este diagrama de arquitectura en detalle. Céntrate en componentes, proveedores cloud, ubicaciones y seguridad. Devuelve SOLO texto plano en español. SIN símbolos markdown.";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      }
    });
    return cleanAIData(response.text || "");
  } catch (error) {
    console.error("Diagram analysis error:", error);
    return null;
  }
};

export const autoAssessSolution = async (
  description: string,
  lang: Language
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = lang === 'en'
    ? "You are an EU Cloud Sovereignty Auditor. Evaluate 8 SOV categories. CRITICAL: SOV-8 (Environmental Sustainability) MUST focus strictly on energy efficiency, green energy usage, and hardware lifecycle. IGNORE business sustainability. JSON ONLY. RESPOND IN ENGLISH."
    : "Eres un Auditor de Soberanía Cloud de la UE. Evalúa 8 categorías SOV. CRÍTICO: SOV-8 (Sostenibilidad Ambiental) DEBE centrarse estrictamente en eficiencia energética, uso de energía verde y ciclo de vida del hardware. IGNORA la sostenibilidad del negocio. SOLO JSON. RESPONDE EN ESPAÑOL.";

  const prompt = `Evaluate: "${description}"
Return JSON with the following structure:
{ "assessments": [{ "id": "SOV-1", "score": number, "justification": "string" }] }
The score MUST be an integer between 0 and 4. Include all IDs from SOV-1 to SOV-8.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
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
  
  const isEnvironmental = objectiveName.toLowerCase().includes('sostenibilidad') || objectiveName.toLowerCase().includes('environmental');
  
  const systemInstruction = lang === 'en' 
    ? `Expert EU Cloud Auditor. Respond in ENGLISH. NO markdown symbols. ${isEnvironmental ? 'Focus ONLY on green energy, carbon footprint and hardware efficiency.' : ''}`
    : `Experto Auditor Cloud UE. Responde en ESPAÑOL. SIN símbolos markdown. ${isEnvironmental ? 'Céntrate EXCLUSIVAMENTE en energía verde, huella de carbono y eficiencia del hardware.' : ''}`;

  const prompt = `Objective: ${objectiveName}.
Evidence: "${userContext}".
Recommend a SEAL level (0-4), justify why, and provide 3 improvement steps.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
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
    ? "EU Compliance Architect. NO MARKDOWN symbols. Respond in ENGLISH."
    : "Arquitecto de Cumplimiento UE. SIN símbolos markdown. Responde en ESPAÑOL.";

  const prompt = `Create a custom L0 to L4 guide for "${solutionDescription}" for objective ${objectiveName}.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
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
    model: MODEL_PRO,
    config: {
      systemInstruction: lang === 'en' 
        ? "EU Cloud Assistant. Professional plain text. No markdown. Respond in ENGLISH." 
        : "Asistente Cloud UE. Texto plano profesional. Sin markdown. Responde en ESPAÑOL.",
      thinkingConfig: { thinkingBudget: THINKING_BUDGET }
    }
  });
  const response = await chat.sendMessage({ message });
  return cleanAIData(response.text || "");
};
