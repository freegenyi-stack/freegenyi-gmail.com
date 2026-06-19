/**
 * Generates docs/couverture-ecoles-primaires.md
 * Usage: node scripts/generate-coverage-md.js
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// Aligné sur web/src/constants/regions.ts
const SUPPORTED = {
  DZ: { name: "Algérie", langs: ["ar", "fr"] },
  MA: { name: "Maroc", langs: ["ar", "fr"] },
  TN: { name: "Tunisie", langs: ["ar", "fr"] },
  EG: { name: "Égypte", langs: ["ar"] },
  SA: { name: "Arabie saoudite", langs: ["ar"] },
  AE: { name: "Émirats arabes unis", langs: ["ar"] },
  QA: { name: "Qatar", langs: ["ar", "en"] },
  KW: { name: "Koweït", langs: ["ar"] },
  LB: { name: "Liban", langs: ["ar", "fr"] },
  LY: { name: "Libye", langs: ["ar"] },
  SY: { name: "Syrie", langs: ["ar"] },
  IQ: { name: "Irak", langs: ["ar", "ku"] },
  JO: { name: "Jordanie", langs: ["ar"] },
  OM: { name: "Oman", langs: ["ar"] },
  BH: { name: "Bahreïn", langs: ["ar"] },
  YE: { name: "Yémen", langs: ["ar"] },
  SD: { name: "Soudan", langs: ["ar"] },
  FR: { name: "France", langs: ["fr"] },
  BE: { name: "Belgique", langs: ["fr", "nl"] },
  CH: { name: "Suisse", langs: ["fr", "de", "it"] },
  CA: { name: "Canada", langs: ["fr", "en"] },
  US: { name: "États-Unis", langs: ["en"] },
  GB: { name: "Royaume-Uni", langs: ["en"] },
  DE: { name: "Allemagne", langs: ["de"] },
  ES: { name: "Espagne", langs: ["es"] },
  IT: { name: "Italie", langs: ["it"] },
  PT: { name: "Portugal", langs: ["pt"] },
  BR: { name: "Brésil", langs: ["pt"] },
  TR: { name: "Turquie", langs: ["tr"] },
  RU: { name: "Russie", langs: ["ru"] },
  BY: { name: "Biélorussie", langs: ["be", "ru"] },
  UA: { name: "Ukraine", langs: ["uk"] },
  PL: { name: "Pologne", langs: ["pl"] },
  RO: { name: "Roumanie", langs: ["ro"] },
  GR: { name: "Grèce", langs: ["el"] },
  HU: { name: "Hongrie", langs: ["hu"] },
  CZ: { name: "République tchèque", langs: ["cs"] },
  DK: { name: "Danemark", langs: ["da"] },
  NO: { name: "Norvège", langs: ["no"] },
  SE: { name: "Suède", langs: ["sv"] },
  FI: { name: "Finlande", langs: ["fi", "sv"] },
  NL: { name: "Pays-Bas", langs: ["nl"] },
  IE: { name: "Irlande", langs: ["en", "ga"] },
  AT: { name: "Autriche", langs: ["de"] },
  MX: { name: "Mexique", langs: ["es"] },
  AR: { name: "Argentine", langs: ["es"] },
  CO: { name: "Colombie", langs: ["es"] },
  CL: { name: "Chili", langs: ["es"] },
  PE: { name: "Pérou", langs: ["es"] },
  SN: { name: "Sénégal", langs: ["fr"] },
  AO: { name: "Angola", langs: ["pt"] },
  ZA: { name: "Afrique du Sud", langs: ["en", "af", "zu", "xh"] },
  CN: { name: "Chine", langs: ["zh"] },
  SG: { name: "Singapour", langs: ["en", "zh", "ms", "ta"] },
  TW: { name: "Taïwan", langs: ["zh"] },
  JP: { name: "Japon", langs: ["ja"] },
  KR: { name: "Corée du Sud", langs: ["ko"] },
  IN: { name: "Inde", langs: ["hi", "en"] },
  AU: { name: "Australie", langs: ["en"] },
  NZ: { name: "Nouvelle-Zélande", langs: ["en", "mi"] },
  TH: { name: "Thaïlande", langs: ["th"] },
  VN: { name: "Vietnam", langs: ["vi"] },
  ID: { name: "Indonésie", langs: ["id"] },
  MY: { name: "Malaisie", langs: ["ms"] },
};

const LANG_LABELS = {
  ar: "Arabe",
  fr: "Français",
  en: "Anglais",
  de: "Allemand",
  es: "Espagnol",
  it: "Italien",
  pt: "Portugais",
  tr: "Turc",
  ru: "Russe",
  be: "Biélorusse",
  uk: "Ukrainien",
  pl: "Polonais",
  ro: "Roumain",
  el: "Grec",
  hu: "Hongrois",
  cs: "Tchèque",
  da: "Danois",
  no: "Norvégien",
  sv: "Suédois",
  fi: "Finnois",
  nl: "Néerlandais",
  ga: "Irlandais (gaélique)",
  ja: "Japonais",
  ko: "Coréen",
  zh: "Chinois",
  hi: "Hindi",
  th: "Thaïlandais",
  vi: "Vietnamien",
  id: "Indonésien",
  ms: "Malais",
  ta: "Tamoul",
  mi: "Maori",
  af: "Afrikaans",
  zu: "Zoulou",
  xh: "Xhosa",
  ku: "Kurde",
};

/**
 * Nombre officiel déclaré d'établissements primaires (sources ministères / open data / UIS).
 * null = non documenté dans le projet
 */
const OFFICIAL_COUNTS = {
  DZ: { n: 24544, src: "awlyaa.education.dz (public + privé, 2024)" },
  MA: { n: 10705, src: "MENPS Maroc (open data)" },
  TN: { n: 4556, src: "data.gov.tn (écoles primaires publiques, 2024)" },
  BH: { n: 220, src: "Ministère bahreïni (public + privé par gouvernorat)" },
  QA: { n: 392, src: "edu.gov.qa (registre open data)" },
  KW: { n: 294, src: "Registre open data Koweït" },
  LB: { n: 1873, src: "Données MEHE Liban" },
  JO: { n: 7296, src: "moe.gov.jo" },
  OM: { n: 1766, src: "Registre open data Oman" },
  LY: { n: 4800, src: "Fichier open data Libye" },
  IQ: { n: 12547, src: "Registre open data Irak" },
  SY: { n: 5635, src: "Registre open data Syrie" },
  SD: { n: 19381, src: "Registre open data Soudan" },
  YE: { n: 1028, src: "Registre open data Yémen" },
  FR: { n: 48247, src: "data.education.gouv.fr (écoles élémentaires, 2023)" },
  GB: { n: 16800, src: "DfE UK (primary schools, ~2023)" },
  US: { n: 87000, src: "NCES (public + private elementary, ~2022)" },
  CA: { n: 18858, src: "StatCan / fichier CSV projet" },
  PT: { n: 4408, src: "dgeec Portugal (fichier CSV projet)" },
  NL: { n: 6110, src: "DUO Pays-Bas (fichier CSV projet)" },
  PL: { n: 14083, src: "RSPO Pologne (fichier CSV projet)" },
  CZ: { n: 4370, src: "msmt.cz (Základní škola, registre IZO)" },
  RO: { n: 2164, src: "Registre open data Roumanie" },
  GR: { n: 1827, src: "Registre open data Grèce" },
  DK: { n: 1427, src: "Fichier CSV projet (Danmarks Statistik)" },
  SE: { n: 5091, src: "Skolverket (fichier CSV projet)" },
  NO: { n: 18139, src: "Fichier CSV projet (UDIR / registre norvégien)" },
  FI: { n: 2501, src: "Fichier CSV projet (Peruskoulut)" },
  IE: { n: 3085, src: "gov.ie open data (fichier CSV projet)" },
  RU: { n: 42805, src: "Registre open data Russie" },
  BY: { n: 2189, src: "Registre open data Biélorussie" },
  UA: { n: 17582, src: "Registre open data Ukraine" },
  TR: { n: 60958, src: "MEB Turquie (fichier CSV projet)" },
  BR: { n: 99682, src: "INEP Brasil (fichier CSV projet)" },
  AR: { n: 64606, src: "Registre open data Argentine" },
  MX: { n: 99604, src: "SEP Mexique (fichier CSV projet)" },
  CO: { n: 18076, src: "Registre open data Colombie" },
  CL: { n: 8100, src: "Registre open data Chili" },
  PE: { n: 39406, src: "Registre open data Pérou" },
  AO: { n: 969, src: "Registre open data Angola" },
  ZA: { n: 25505, src: "DBE Afrique du Sud (fichier CSV projet)" },
  CN: { n: 6775, src: "Registre open data Chine (fichier projet)" },
  JP: { n: 19000, src: "MEXT Japon (~écoles élémentaires actives)" },
  KR: { n: 6341, src: "Registre open data Corée du Sud" },
  TW: { n: 2614, src: "Registre open data Taïwan" },
  SG: { n: 179, src: "moe.gov.sg (179 écoles primaires)" },
  IN: { n: 1245384, src: "UDISE+ Inde (fichier CSV local)" },
  ID: { n: 176919, src: "Registre open data Indonésie" },
  MY: { n: 7781, src: "Registre open data Malaisie" },
  TH: { n: 27351, src: "Registre open data Thaïlande" },
  VN: { n: 7117, src: "Registre open data Vietnam" },
  AU: { n: 9698, src: "ACARA Australie (fichier CSV projet)" },
  NZ: { n: 2593, src: "Education Counts NZ (fichier CSV projet)" },
};

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5433/freegenydb";

const CSV_TO_COUNTRY = {
  ecoles_primaires_afrique_du_sud: "ZA",
  ecoles_primaires_algerie: "DZ",
  ecoles_privees_algerie: "DZ",
  ecoles_primaires_angola: "AO",
  ecoles_primaires_argentine: "AR",
  ecoles_primaires_australie: "AU",
  ecoles_primaires_bahrein: "BH",
  ecoles_primaires_bielorussie: "BY",
  ecoles_primaires_chili: "CL",
  ecoles_primaires_chine: "CN",
  ecoles_primaires_colombie: "CO",
  ecoles_primaires_coree_sud: "KR",
  ecoles_primaires_denemark: "DK",
  ecoles_primaires_finlande: "FI",
  ecoles_primaires_france: "FR",
  ecoles_primaires_grece: "GR",
  ecoles_primaires_inde: "IN",
  ecoles_primaires_indonesie: "ID",
  ecoles_primaires_irak: "IQ",
  ecoles_primaires_irlande: "IE",
  ecoles_primaires_japon: "JP",
  ecoles_primaires_jordanie: "JO",
  ecoles_primaires_koweit: "KW",
  ecoles_primaires_liban: "LB",
  ecoles_primaires_libye: "LY",
  ecoles_primaires_malaisie: "MY",
  ecoles_primaires_maroc: "MA",
  ecoles_primaires_mexique: "MX",
  ecoles_primaires_norvege: "NO",
  ecoles_primaires_nouvelle_zelande: "NZ",
  ecoles_primaires_oman: "OM",
  ecoles_primaires_paysbas: "NL",
  ecoles_primaires_perou: "PE",
  ecoles_primaires_pologne: "PL",
  ecoles_primaires_portugal: "PT",
  ecoles_primaires_qatar: "QA",
  ecoles_primaires_roumanie: "RO",
  ecoles_primaires_royaume_uni: "GB",
  ecoles_primaires_russie: "RU",
  ecoles_primaires_r_tcheque: "CZ",
  ecoles_primaires_singapour: "SG",
  ecoles_primaires_soudan: "SD",
  ecoles_primaires_suede: "SE",
  ecoles_primaires_syrie: "SY",
  ecoles_primaires_taiwan: "TW",
  ecoles_primaires_thailande: "TH",
  ecoles_primaires_tunisie: "TN",
  ecoles_primaires_turquie: "TR",
  ecoles_primaires_ukraine: "UA",
  ecoles_primaires_usa: "US",
  ecoles_privees_usa: "US",
  ecoles_primaires_vietnam: "VN",
  ecoles_primaires_yemen: "YE",
  Ecoles_Primaires_bresil: "BR",
  "école_primaires_canada": "CA",
};

const SEED_TO_COUNTRY = {
  "seed-schools.js": "DZ",
  "seed-schools-france.js": "FR",
  "seed-schools-denmark.js": "DK",
  "seed-schools-sweden.js": "SE",
  "seed-schools-norway.js": "NO",
  "seed-schools-finland.js": "FI",
  "seed-schools-netherlands.js": "NL",
  "seed-schools-portugal.js": "PT",
  "seed-schools-poland.js": "PL",
  "seed-schools-czech.js": "CZ",
  "seed-schools-chile.js": "CL",
  "seed-schools-colombia.js": "CO",
  "seed-schools-mexico.js": "MX",
  "seed-schools-peru.js": "PE",
  "seed-schools-taiwan.js": "TW",
  "seed-schools-romania.js": "RO",
  "seed-schools-singapore.js": "SG",
  "seed-schools-korea.js": "KR",
  "seed-schools-japan.js": "JP",
  "seed-schools-brazil.js": "BR",
  "seed-schools-argentina.js": "AR",
  "seed-schools-morocco.js": "MA",
  "seed-schools-tunisia.js": "TN",
  "seed-schools-australia.js": "AU",
  "seed-schools-uk.js": "GB",
  "seed-schools-usa.js": "US",
  "seed-schools-canada.js": "CA",
  "seed-schools-nz.js": "NZ",
  "seed-schools-ireland.js": "IE",
  "seed-schools-qatar.js": "QA",
  "seed-schools-jordan.js": "JO",
  "seed-schools-angola.js": "AO",
  "seed-schools-southafrica.js": "ZA",
  "seed-schools-lebanon.js": "LB",
};

function countCsvRows(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return Math.max(0, content.split(/\r?\n/).filter((l) => l.trim()).length - 1);
}

function discoverProjectCountries() {
  const codes = new Set();
  const dataDir = path.join(__dirname, "../src/db/seeds/data");
  const seedsDir = path.join(__dirname, "../src/db/seeds");

  if (fs.existsSync(dataDir)) {
    for (const f of fs.readdirSync(dataDir)) {
      if (!f.endsWith(".csv")) continue;
      const base = f.replace(/\.csv$/i, "");
      const code = CSV_TO_COUNTRY[base];
      if (code) codes.add(code);
    }
  }

  if (fs.existsSync(seedsDir)) {
    for (const f of fs.readdirSync(seedsDir)) {
      if (!f.startsWith("seed-schools")) continue;
      const code = SEED_TO_COUNTRY[f];
      if (code) codes.add(code);
    }
  }

  return codes;
}

function formatLangs(codes) {
  return codes.map((c) => LANG_LABELS[c] || c).join(", ");
}

function pct(db, official) {
  if (!official || official === 0) return "—";
  return ((db / official) * 100).toFixed(1) + " %";
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  const r = await client.query(`
    SELECT c.code, COUNT(s.id)::int AS n
    FROM countries c
    LEFT JOIN regions rg ON rg.country_code = c.code
    LEFT JOIN districts d ON d.region_id = rg.id
    LEFT JOIN schools s ON s.district_id = d.id
    GROUP BY c.code
  `);
  await client.end();

  const dbCounts = Object.fromEntries(r.rows.map((row) => [row.code.trim(), row.n]));

  const projectCodes = discoverProjectCountries();
  for (const [code, n] of Object.entries(dbCounts)) {
    if (n > 0) projectCodes.add(code);
  }

  const rows = [...projectCodes]
    .map((code) => {
      const meta = SUPPORTED[code] || { name: code, langs: [] };
      const db = dbCounts[code] || 0;
      const off = OFFICIAL_COUNTS[code];
      return {
        code,
        name: meta.name,
        langs: formatLangs(meta.langs || []),
        official: off ? off.n : null,
        db,
        coverage: pct(db, off?.n),
        src: off?.src,
      };
    })
    .filter((row) => row.official != null || row.db > 0)
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const lines = [
    "# Couverture des écoles primaires — FreeGeny",
    "",
    `> Généré le ${new Date().toISOString().slice(0, 10)} à partir de la base PostgreSQL locale et des registres officiels / open data référencés dans le projet.`,
    "",
    "| N° | Pays | Langues officielles d'enseignement | Nb officiel déclaré (écoles primaires) | Nb en base FreeGeny | Taux de couverture (%) |",
    "|---:|------|-----------------------------------|---------------------------------------:|--------------------:|-----------------------:|",
  ];

  rows.forEach((row, i) => {
    const offStr = row.official != null ? row.official.toLocaleString("fr-FR") : "N/D";
    const dbStr = row.db > 0 ? row.db.toLocaleString("fr-FR") : "0";
    lines.push(
      `| ${i + 1} | ${row.name} | ${row.langs || "—"} | ${offStr} | ${dbStr} | ${row.coverage} |`
    );
  });

  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- **Nb en base FreeGeny** : comptage live `schools` → `districts` → `regions` → `countries` (PostgreSQL).");
  lines.push("- **Nb officiel déclaré** : chiffres des ministères ou jeux open data utilisés pour construire les CSV de seed ; peut différer des totaux UIS/UNESCO selon définitions (primaire vs élémentaire, public seul, etc.).");
  lines.push("- **Taux de couverture** = (Nb en base ÷ Nb officiel) × 100.");
  lines.push("- Pays avec CSV/seed préparés mais import non exécuté sur cette base (ex. Tunisie, Afrique du Sud, Royaume-Uni, Norvège) : base = 0.");
  lines.push("- Script de régénération : `node scripts/generate-coverage-md.js`.");
  lines.push("");
  lines.push("### Sources par pays (colonne officielle)");
  lines.push("");
  rows
    .filter((r) => r.src)
    .forEach((r) => lines.push(`- **${r.name}** : ${r.src}`));

  const out = path.join(__dirname, "../docs/couverture-ecoles-primaires.md");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join("\n") + "\n", "utf8");
  console.log("Written:", out);
  console.log("Rows:", rows.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
