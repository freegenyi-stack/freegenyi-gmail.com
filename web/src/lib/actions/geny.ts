import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function askGeny(message: string, context: string = ""): Promise<string> {
  if (!API_KEY) {
    return "L'IA Geny est actuellement endormie. (Clé API Gemini manquante).";
  }

  const systemPrompt = `
Tu es Geny, l'Expert Éducatif et le "Mentor Famille" de la plateforme FreeGeny.
Ton but est d'accompagner les parents dans l'éducation de leurs enfants avec bienveillance, expertise, et une touche de luxe.
Adopte un ton chaleureux, encourageant et très professionnel.
Tu ne donnes jamais les réponses directes aux devoirs, tu utilises la méthode Socratique pour faire réfléchir l'enfant ou aider le parent à expliquer.
Contexte supplémentaire: ${context}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemPrompt });
    const result = await model.generateContent(message);
    return result.response.text();
  } catch (error) {
    console.error("Geny AI Error:", error);
    return "Je suis désolé, mon cerveau est un peu fatigué en ce moment. Pouvons-nous réessayer plus tard ?";
  }
}
