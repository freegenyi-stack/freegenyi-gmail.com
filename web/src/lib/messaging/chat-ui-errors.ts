import type { MessagingErrorCode } from "./messaging-errors";

/** Résout une erreur API messagerie côté client (code i18n ou texte legacy). */
export function resolveMessagingError(
  data: { error?: string; code?: string },
  t: (key: string) => string,
  fallbackKey = "errorGeneric"
): string {
  const code = data.code || data.error;
  if (code && /^[a-z_]+$/.test(code)) {
    try {
      return t(`errors.${code}`);
    } catch {
      /* clé manquante */
    }
  }
  if (data.error && !/^[a-z_]+$/.test(data.error)) return data.error;
  return t(fallbackKey);
}

export type MessagingApiError = { error: MessagingErrorCode; code: MessagingErrorCode };
