/** Convertit une URL publique mur pédagogique en route API (MIME + téléchargement fiable). */
export function pedagogyMediaApiUrl(publicUrl: string | null | undefined): string | null {
  if (!publicUrl?.trim()) return null;
  const url = publicUrl.trim();
  if (!url.startsWith("/uploads/pedagogy/")) return url;
  return `/api/pedagogy/media?path=${encodeURIComponent(url)}`;
}

const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf",
  txt: "text/plain; charset=utf-8",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function pedagogyMimeFromPath(url: string, hint?: string | null): string | undefined {
  if (hint?.trim()) return hint.split(";")[0]?.trim();
  const ext = url.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (!ext) return undefined;
  return EXT_MIME[ext];
}
