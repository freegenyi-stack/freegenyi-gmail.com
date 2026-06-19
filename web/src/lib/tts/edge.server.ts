import { synthesize } from "@echristian/edge-tts";

export type EdgeSpeakResult =
  | { ok: true; audioBase64: string; mimeType: string }
  | { ok: false; error: string };

const VOICES: Record<string, string> = {
  fr: "fr-FR-DeniseNeural",
  en: "en-US-AvaNeural",
  ar: "ar-SA-HamedNeural",
};

/** Synthèse via Microsoft Edge TTS (gratuit, serveur Node). */
export async function synthesizeWithEdge(
  text: string,
  language: string = "fr"
): Promise<EdgeSpeakResult> {
  const trimmed = text.trim().slice(0, 1200);
  if (!trimmed) return { ok: false, error: "Texte vide" };

  const lang = language.startsWith("ar") ? "ar" : language.startsWith("en") ? "en" : "fr";
  const voice = process.env.EDGE_TTS_VOICE?.trim() || VOICES[lang] || VOICES.fr;

  try {
    const { audio } = await synthesize({
      text: trimmed,
      voice,
      language: lang === "ar" ? "ar-SA" : lang === "en" ? "en-US" : "fr-FR",
    });
    const buf = Buffer.from(await audio.arrayBuffer());
    return { ok: true, audioBase64: buf.toString("base64"), mimeType: "audio/mpeg" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Edge TTS indisponible";
    return { ok: false, error: message };
  }
}
