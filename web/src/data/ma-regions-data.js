/**
 * Morocco regions (12 official) + legacy CSV aliases. Shared by seed and UI.
 */

const MA_REGIONS = [
  { fr: "Tanger-Tétouan-Al Hoceïma", ar: "طنجة-تطوان-الحسيمة" },
  { fr: "L'Oriental", ar: "الشرق" },
  { fr: "Fès-Meknès", ar: "فاس-مكناس" },
  { fr: "Rabat-Salé-Kénitra", ar: "الرباط-سلا-القنيطرة" },
  { fr: "Béni Mellal-Khénifra", ar: "بني ملال-خنيفرة" },
  { fr: "Casablanca-Settat", ar: "الدار البيضاء-سطات" },
  { fr: "Marrakech-Safi", ar: "مراكش-آسفي" },
  { fr: "Drâa-Tafilalet", ar: "درعة-تافيلالت" },
  { fr: "Souss-Massa", ar: "سوس-ماسة" },
  { fr: "Guelmim-Oued Noun", ar: "كلميم-واد نون" },
  { fr: "Laâyoune-Sakia El Hamra", ar: "العيون-الساقية الحمراء" },
  { fr: "Dakhla-Oued Ed-Dahab", ar: "الداخلة-وادي الذهب" },
];

const MA_REGION_ALIASES = {
  tangertetouanalhoceima: "Tanger-Tétouan-Al Hoceïma",
  tangertetouan: "Tanger-Tétouan-Al Hoceïma",
  tazaalhoceimataounate: "Tanger-Tétouan-Al Hoceïma",
  loriental: "L'Oriental",
  oriental: "L'Oriental",
  fesmeknes: "Fès-Meknès",
  fesboulmane: "Fès-Meknès",
  meknestafilalet: "Fès-Meknès",
  rabatsalekenitra: "Rabat-Salé-Kénitra",
  rabatsalezemmourzaer: "Rabat-Salé-Kénitra",
  benimellalkhenifra: "Béni Mellal-Khénifra",
  tadlaazilal: "Béni Mellal-Khénifra",
  casablancasettat: "Casablanca-Settat",
  grandcasablancasettat: "Casablanca-Settat",
  grandcasablanca: "Casablanca-Settat",
  chaouiaourdigha: "Casablanca-Settat",
  doukalaabda: "Casablanca-Settat",
  gharbchrardabenihssen: "Casablanca-Settat",
  marrakechsafi: "Marrakech-Safi",
  marrakechensiftalhaouz: "Marrakech-Safi",
  marrakechtensiftalhaouz: "Marrakech-Safi",
  draatafilalet: "Drâa-Tafilalet",
  soussmassa: "Souss-Massa",
  soussmassadraa: "Souss-Massa",
  sousmassadraa: "Souss-Massa",
  guelmimouednoun: "Guelmim-Oued Noun",
  guelmimessemara: "Guelmim-Oued Noun",
  guelmimessmara: "Guelmim-Oued Noun",
  ouededdhablagouira: "Dakhla-Oued Ed-Dahab",
  laayounesakiaelhamra: "Laâyoune-Sakia El Hamra",
  laayouneboujdoursakiaalhamra: "Laâyoune-Sakia El Hamra",
  dakhlaouededahab: "Dakhla-Oued Ed-Dahab",
  eddakhlahouededdahab: "Dakhla-Oued Ed-Dahab",
  ouededahablagouira: "Dakhla-Oued Ed-Dahab",
};

function normalizeMaKey(raw) {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`.]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

const FR_TO_REGION = new Map(MA_REGIONS.map((r) => [normalizeMaKey(r.fr), r]));

function resolveMaRegion(nameFr) {
  const raw = (nameFr || "").trim();
  if (!raw) return { fr: "", ar: "" };

  const key = normalizeMaKey(raw);
  const aliasFr = MA_REGION_ALIASES[key];
  if (aliasFr) {
    const canon = MA_REGIONS.find((r) => r.fr === aliasFr);
    if (canon) return canon;
  }

  const direct = FR_TO_REGION.get(key);
  if (direct) return direct;

  for (const region of MA_REGIONS) {
    const canonKey = normalizeMaKey(region.fr);
    if (key.includes(canonKey) || canonKey.includes(key)) return region;
  }

  return { fr: raw, ar: raw };
}

function formatMaRegionName(nameFr, lang) {
  const { fr, ar } = resolveMaRegion(nameFr);
  if (lang === "ar") return ar || fr;
  return fr || ar;
}

function maAdminLabels(lang) {
  if (lang === "ar") {
    return { region: "الجهة", commune: "الجماعة" };
  }
  return { region: "Région", commune: "Commune" };
}

module.exports = {
  MA_REGIONS,
  resolveMaRegion,
  formatMaRegionName,
  maAdminLabels,
};
