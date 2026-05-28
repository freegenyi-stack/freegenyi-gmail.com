/**
 * Singapore zone (NORTH/SOUTH/EAST/WEST) display labels.
 * DGP planning areas stay in official English (proper nouns).
 */

const SG_ZONES: Record<string, { en: string; zh: string; ms: string; ta: string }> = {
  NORTH: { en: "North", zh: "北部", ms: "Utara", ta: "வடக்கு" },
  SOUTH: { en: "South", zh: "南部", ms: "Selatan", ta: "தெற்கு" },
  EAST: { en: "East", zh: "东部", ms: "Timur", ta: "கிழக்கு" },
  WEST: { en: "West", zh: "西部", ms: "Barat", ta: "மேற்கு" },
};

function normalizeZoneKey(codeOrName: string): string {
  return codeOrName.replace(/[^A-Za-z]/g, "").toUpperCase();
}

/** Hero image path per UI language (en uses ms/ until SG/en/hero.png is added). */
export function sgHeroImagePath(lang: string): string {
  const folder = lang === "zh" || lang === "ms" || lang === "ta" ? lang : "ms";
  return `/assets/img/regions/SG/${folder}/hero.png`;
}

export function formatSgRegionName(code: string, nameLocal: string | null, lang: string): string {
  const key = normalizeZoneKey(code || nameLocal || "");
  const entry = SG_ZONES[key];
  if (!entry) return nameLocal || code;
  if (lang === "zh") return entry.zh;
  if (lang === "ms") return entry.ms;
  if (lang === "ta") return entry.ta;
  return entry.en;
}

/** DGP areas: official English names (title case for readability). */
export function formatSgDistrictName(nameLocal: string | null): string {
  if (!nameLocal) return "";
  return nameLocal
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
