
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

export const getSovereigntyAdvice = async (
  objectiveName: string,
  factors: string[],
  userContext: string,
  lang: Language
) => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key from the dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Define system instruction in the config for better context isolation as per SDK guidelines
  const systemInstruction = lang === 'en' 
    ? `Act as an expert in the European Commission's Cloud Sovereignty Framework. 
       Analyze the provided evidence for the objective "${objectiveName}".
       Provide your response in ENGLISH.`
    : `Actúa como un experto en el Marco de Soberanía Cloud de la Comisión Europea.
       Analiza la evidencia proporcionada para el objetivo "${objectiveName}".
       Proporciona tu respuesta en ESPAÑOL.`;

  const prompt = `Critical factors to consider:
${factors.map(f => `- ${f}`).join('\n')}

Provider's description of evidence:
"${userContext}"

Please provide your expert analysis including:
1. A suggested SEAL level (0-4).
2. Detailed justification based on the contributing factors and European regulations.
3. Specific recommendations to improve the sovereignty level in this area.`;

  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex reasoning and policy analysis tasks
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        // By default, we do not need to set thinkingBudget, allowing the model to decide reasoning depth
      }
    });
    
    // The .text property is a getter that returns the extracted string output
    return response.text;
  } catch (error) {
    console.error("Error al consultar Gemini:", error);
    return lang === 'en' 
      ? "Sorry, there was an error processing your request with the AI advisor. Please check your connection or try again later."
      : "Lo sentimos, hubo un error al procesar tu consulta con el asesor de IA. Por favor, comprueba tu conexión o inténtalo de nuevo más tarde.";
  }
};
