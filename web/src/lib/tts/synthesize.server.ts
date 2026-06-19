import { synthesizeWithCoqui } from "@/lib/tts/coqui.server";
import { synthesizeWithEdge } from "@/lib/tts/edge.server";

export type SpeechEngine = "coqui" | "edge" | "browser";

export type SynthesizeSpeechResult =
  | { ok: true; engine: SpeechEngine; audioBase64: string; mimeType: string }
  | { ok: false; error: string; fallback: true };

/** Coqui self-hosted d'abord, puis Edge TTS (voix naturelle sans serveur Coqui). */
export async function synthesizeSpeech(
  text: string,
  language: string = "fr"
): Promise<SynthesizeSpeechResult> {
  const coqui = await synthesizeWithCoqui(text, language);
  if (coqui.ok) {
    return {
      ok: true,
      engine: "coqui",
      audioBase64: coqui.audioBase64,
      mimeType: coqui.mimeType,
    };
  }

  const edge = await synthesizeWithEdge(text, language);
  if (edge.ok) {
    return {
      ok: true,
      engine: "edge",
      audioBase64: edge.audioBase64,
      mimeType: edge.mimeType,
    };
  }

  return {
    ok: false,
    error: coqui.error || edge.error || "Synthèse indisponible",
    fallback: true,
  };
}
