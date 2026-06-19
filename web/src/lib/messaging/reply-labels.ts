/** Labels serveur pour aperçus de réponse (sans next-intl). */
export function deletedReplyLabel(locale: string): string {
  if (locale === "ar" || locale.endsWith("-ar")) return "رسالة محذوفة";
  if (locale === "en" || locale.startsWith("en-")) return "Deleted message";
  return "Message supprimé";
}

export function hiddenReplyLabel(locale: string): string {
  if (locale === "ar" || locale.endsWith("-ar")) return "رسالة مخفية";
  if (locale === "en" || locale.startsWith("en-")) return "Hidden message";
  return "Message masqué";
}
