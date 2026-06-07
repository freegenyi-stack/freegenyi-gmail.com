/** Horaires scolaires DZ : lun–ven 8h–17h (heure locale navigateur / serveur). */
export function isWithinSchoolMessagingHours(now = new Date()): boolean {
  const day = now.getDay();
  if (day === 0 || day === 6) return false;
  const hour = now.getHours();
  return hour >= 8 && hour < 17;
}

export function schoolHoursBlockMessage(locale: string): string {
  const isAr = locale === "ar" || locale.endsWith("-ar");
  return isAr
    ? "المراسلة متاحة في أوقات الدوام المدرسي فقط (8:00–17:00، الاثنين–الجمعة)."
    : "Messagerie disponible uniquement en horaires scolaires (8h–17h, lun–ven).";
}
