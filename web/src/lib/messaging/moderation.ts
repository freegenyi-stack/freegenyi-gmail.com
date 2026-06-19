import { MESSAGING_DEFAULT_TIMEZONE } from "./messaging-policy";

const DEFAULT_TZ = MESSAGING_DEFAULT_TIMEZONE;

function localParts(now: Date, timeZone: string): { day: number; hour: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { day: dayMap[weekday] ?? now.getDay(), hour };
}

/** Horaires scolaires : lun–ven 8h–17h (fuseau Africa/Algiers par défaut). */
export function isWithinSchoolMessagingHours(now = new Date(), timeZone = DEFAULT_TZ): boolean {
  const { day, hour } = localParts(now, timeZone);
  if (day === 0 || day === 6) return false;
  return hour >= 8 && hour < 17;
}

export function schoolHoursBlockMessage(locale: string): string {
  const isAr = locale === "ar" || locale.endsWith("-ar");
  return isAr
    ? "المراسلة متاحة في أوقات الدوام المدرسي فقط (8:00–17:00، الاثنين–الجمعة)."
    : "Messagerie disponible uniquement en horaires scolaires (8h–17h, lun–ven).";
}
