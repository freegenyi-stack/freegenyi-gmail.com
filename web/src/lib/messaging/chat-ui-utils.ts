import type { ReplyPreview } from "./types";
import { replyPreviewLabel } from "./message-mapper";
import { displayMediaLabel } from "./media-labels";
import type { ChatMessageType } from "./types";

export function formatLastSeen(iso: string | null | undefined, locale: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const isAr = locale.startsWith("ar");
  const time = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  if (sameDay) return isAr ? `آخر ظهور ${time}` : `Vu à ${time}`;
  if (isYesterday) return isAr ? `آخر ظهور أمس ${time}` : `Vu hier à ${time}`;
  const date = d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  return isAr ? `آخر ظهور ${date}` : `Vu le ${date}`;
}

export function replyQuoteText(
  reply: ReplyPreview,
  locale: string
): string {
  return replyPreviewLabel(reply, locale, (content, url, type) =>
    displayMediaLabel(content, type as ChatMessageType, url, locale)
  );
}
