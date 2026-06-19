/**
 * Coqui TTS self-hosted — proxy vers COQUI_TTS_URL
 * Formats supportés : API /api/tts (POST JSON) ou GET ?text=
 */

export type CoquiSpeakResult =
  | { ok: true; audioBase64: string; mimeType: string }
  | { ok: false; error: string; fallback: true };

export async function synthesizeWithCoqui(
  text: string,
  language: string = "fr"
): Promise<CoquiSpeakResult> {
  const base = process.env.COQUI_TTS_URL?.replace(/\/$/, "");
  if (!base) {
    return { ok: false, error: "COQUI_TTS_URL non configuré", fallback: true };
  }

  const trimmed = text.trim().slice(0, 1200);
  if (!trimmed) {
    return { ok: false, error: "Texte vide", fallback: true };
  }

  const speaker = process.env.COQUI_TTS_SPEAKER || "";
  const lang = language.startsWith("ar") ? "ar" : language.startsWith("en") ? "en" : "fr";

  try {
    const postRes = await fetch(`${base}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "audio/wav,audio/*" },
      body: JSON.stringify({
        text: trimmed,
        language_id: lang,
        speaker_id: speaker || undefined,
      }),
      cache: "no-store",
    });

    if (postRes.ok) {
      const buf = Buffer.from(await postRes.arrayBuffer());
      const mime = postRes.headers.get("content-type") || "audio/wav";
      return { ok: true, audioBase64: buf.toString("base64"), mimeType: mime.split(";")[0] };
    }

    const getRes = await fetch(
      `${base}/api/tts?${new URLSearchParams({ text: trimmed, language_id: lang })}`,
      { headers: { Accept: "audio/wav,audio/*" }, cache: "no-store" }
    );

    if (!getRes.ok) {
      return { ok: false, error: `Coqui HTTP ${getRes.status}`, fallback: true };
    }

    const buf = Buffer.from(await getRes.arrayBuffer());
    const mime = getRes.headers.get("content-type") || "audio/wav";
    return { ok: true, audioBase64: buf.toString("base64"), mimeType: mime.split(";")[0] };
  } catch {
    return { ok: false, error: "Coqui injoignable", fallback: true };
  }
}
