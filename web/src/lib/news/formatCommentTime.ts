/** Horodatage style Facebook : « 21 h », « 3 j », « À l'instant » */
export function formatNewsCommentTime(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffD = Math.floor(diffMs / 86_400_000);

  const isAr = locale.startsWith("ar");

  if (diffMin < 1) return isAr ? "الآن" : "À l'instant";
  if (diffMin < 60) return isAr ? `${diffMin} د` : `${diffMin} min`;

  if (diffH < 24) return isAr ? `${diffH} س` : `${diffH} h`;

  if (diffD === 1) return isAr ? "أمس" : "Hier";
  if (diffD < 7) return isAr ? `${diffD} ي` : `${diffD} j`;

  return date.toLocaleDateString(isAr ? "ar" : locale.startsWith("fr") ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
  });
}
