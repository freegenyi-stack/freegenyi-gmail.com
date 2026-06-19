/** Locale AR parent (DZ-ar, ar, …) */
export function isParentRtl(locale: string): boolean {
  return locale.endsWith("-ar") || locale === "ar";
}

export function parentTitleFont(isRtl: boolean): string {
  return isRtl ? "font-ui-ar" : "font-reem";
}

export function parentSubtitleFont(isRtl: boolean): string {
  return isRtl ? "font-lateef text-base md:text-lg leading-relaxed" : "";
}

/** Flèches directionnelles — à combiner avec les icônes Lucide */
export const RTL_ARROW_FLIP = "rtl:rotate-180";

export const RTL_BACK_ARROW_HOVER =
  "transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1";
