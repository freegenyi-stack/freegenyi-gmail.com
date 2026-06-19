/** Filtre basique automatique — pas de modération manuelle */
const BLOCKED_PATTERNS = [
  /\b(?:merde|putain|connard|salope|fdp|encul)\b/i,
  /\b(?:fuck|shit|bitch|asshole)\b/i,
];

export function sanitizeCommentBody(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

export function isCommentBodyAllowed(body: string): { ok: true } | { ok: false; reason: string } {
  if (body.length > 2000) return { ok: false, reason: "Commentaire trop long (2000 car. max)." };
  if (BLOCKED_PATTERNS.some((re) => re.test(body))) {
    return { ok: false, reason: "Langage inapproprié détecté." };
  }
  return { ok: true };
}

export function isCommentContentAllowed(
  body: string,
  hasAttachment: boolean
): { ok: true } | { ok: false; reason: string } {
  const trimmed = sanitizeCommentBody(body);
  if (!hasAttachment && trimmed.length < 2) {
    return { ok: false, reason: "Commentaire trop court." };
  }
  if (trimmed.length > 0) {
    return isCommentBodyAllowed(trimmed);
  }
  if (!hasAttachment) return { ok: false, reason: "Commentaire vide." };
  return { ok: true };
}

export const COMMENT_REPORT_HIDE_THRESHOLD = 3;
