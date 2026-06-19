/** Convertit une URL publique de chat en route API avec bons en-têtes MIME. */
export function chatMediaApiUrl(publicUrl: string | null | undefined): string | null {
  if (!publicUrl?.trim()) return null;
  const url = publicUrl.trim();
  if (!url.startsWith("/uploads/chat/")) return url;
  return `/api/chat/media?path=${encodeURIComponent(url)}`;
}

const EXT_MIME: Record<string, string> = {
  webm: "video/webm",
  mp4: "video/mp4",
  mov: "video/quicktime",
  m4v: "video/mp4",
  mp3: "audio/mpeg",
  mpeg: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
};

export function mimeFromPath(
  url: string,
  messageType?: string | null
): string | undefined {
  const ext = url.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (!ext) return undefined;

  if (ext === "webm") {
    if (messageType === "voice" || messageType === "audio") return "audio/webm";
    if (messageType === "video") return "video/webm";
    return "video/webm";
  }

  return EXT_MIME[ext];
}
