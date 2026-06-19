import type { ChatMessageType } from "./types";

const AUTO_NAME = /^(voice|video|audio|image|file)-\d+\.[a-z0-9]+$/i;
const AUTO_PREFIX = /^\d+-[a-z0-9._-]+\.[a-z0-9]+$/i;

export function looksLikeAutoFilename(name: string): boolean {
  const base = name.trim();
  if (!base) return true;
  if (AUTO_NAME.test(base)) return true;
  if (AUTO_PREFIX.test(base)) return true;
  return false;
}

export function defaultMediaLabel(messageType: ChatMessageType | string | null | undefined, locale: string): string {
  const isAr = locale === "ar" || locale.endsWith("-ar");
  switch (messageType) {
    case "image":
      return isAr ? "صورة" : "Image";
    case "video":
      return isAr ? "فيديو" : "Vidéo";
    case "voice":
      return isAr ? "رسالة صوتية" : "Message vocal";
    case "audio":
      return isAr ? "صوت" : "Audio";
    case "file":
      return isAr ? "مستند" : "Document";
    default:
      return isAr ? "مرفق" : "Pièce jointe";
  }
}

/** Libellé affiché — commentaire utilisateur ou nom pro par défaut. */
export function resolveMediaContent(
  caption: string | undefined,
  messageType: ChatMessageType | string,
  fileName: string | undefined,
  locale: string
): string {
  const trimmed = caption?.trim();
  if (trimmed && !looksLikeAutoFilename(trimmed)) return trimmed;

  if (fileName?.trim() && !looksLikeAutoFilename(fileName.trim())) {
    const withoutExt = fileName.replace(/\.[a-z0-9]{2,5}$/i, "").trim();
    if (withoutExt && !looksLikeAutoFilename(withoutExt)) return withoutExt;
  }

  return defaultMediaLabel(messageType, locale);
}

/** Libellé court pour bulles et listes. */
export function displayMediaLabel(
  content: string | null | undefined,
  messageType: ChatMessageType | string | null | undefined,
  mediaUrl: string | null | undefined,
  locale: string
): string {
  const text = (content || "").trim();
  if (text && !looksLikeAutoFilename(text)) return text;
  if (mediaUrl) {
    const part = decodeURIComponent(mediaUrl.split("/").pop() || "");
    const cleaned = part.replace(/^\d+-/, "");
    if (cleaned && !looksLikeAutoFilename(cleaned)) {
      const withoutExt = cleaned.replace(/\.[a-z0-9]{2,5}$/i, "");
      if (withoutExt && !looksLikeAutoFilename(withoutExt)) return withoutExt;
    }
  }
  return defaultMediaLabel(messageType, locale);
}

export type MessageReactionMap = Record<string, number[]>;

export function parseReactions(raw: string | null | undefined): MessageReactionMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as MessageReactionMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function toggleReaction(map: MessageReactionMap, emoji: string, userId: number): MessageReactionMap {
  const next = { ...map };
  const list = [...(next[emoji] || [])];
  const idx = list.indexOf(userId);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(userId);
  if (list.length === 0) delete next[emoji];
  else next[emoji] = list;
  return next;
}
