/**
 * Génère la structure d'un niveau à partir du template usine.
 * Usage: npm run curriculum:scaffold -- DZ 2AP
 *        npm run curriculum:scaffold -- DZ 3AP --force
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../../curriculum");
const TEMPLATE = path.join(ROOT, "countries", "DZ", "levels", "_TEMPLATE");
const BUNDLE_FILES = ["curriculum.json", "competences.json", "exercise_bank.json", "evaluations.json"];

const args = process.argv.slice(2);
const force = args.includes("--force");
const positional = args.filter((a) => !a.startsWith("--"));
const [country, level] = positional;

if (!country || !level || level.startsWith("_")) {
  console.error("Usage: node scripts/curriculum/scaffold-level.mjs DZ 2AP [--force]");
  process.exit(1);
}

const registryPath = path.join(ROOT, "countries", country, "registry.json");
if (!fs.existsSync(registryPath)) {
  console.error(`Registry introuvable: ${registryPath}`);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const levelMeta = registry.levels?.find((l) => l.code === level);
if (!levelMeta) {
  console.error(`Niveau ${level} absent du registry ${country}`);
  process.exit(1);
}

const levelDir = path.join(ROOT, "countries", country, "levels", level);
if (fs.existsSync(levelDir) && !force) {
  console.error(`${levelDir} existe déjà. Utilisez --force pour écraser les fichiers template.`);
  process.exit(1);
}

const subjectCodes = (levelMeta.subjects ?? []).map((s) => s.code);
if (subjectCodes.length === 0) {
  console.error(`Aucune matière dans registry pour ${level}`);
  process.exit(1);
}

const SUBJECT_SUFFIX = {
  ar_islam_civique: "AR",
  math_est: "MATH",
};

function replaceTokens(text, ctx) {
  return text
    .replaceAll("{{COUNTRY}}", ctx.country)
    .replaceAll("{{LEVEL}}", ctx.level)
    .replaceAll("{{SUBJECT}}", ctx.subject)
    .replaceAll("{{SUBJECT_SUFFIX}}", ctx.subjectSuffix)
    .replaceAll("{{MODULE_ID}}", ctx.moduleId);
}

function copySubjectTemplate(subject) {
  const srcDir = path.join(TEMPLATE, subject);
  const destDir = path.join(levelDir, subject);
  if (!fs.existsSync(srcDir)) {
    console.warn(`⚠ template matière manquant: ${srcDir}`);
    return;
  }

  fs.mkdirSync(destDir, { recursive: true });
  const subjectSuffix = SUBJECT_SUFFIX[subject] ?? subject.toUpperCase().slice(0, 4);
  const moduleId = `FG-${country}-${level}-${subjectSuffix}`;
  const ctx = { country, level, subject, subjectSuffix, moduleId };

  for (const file of BUNDLE_FILES) {
    const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
    const out = replaceTokens(raw, ctx);
    fs.writeFileSync(path.join(destDir, file), out);
  }
  console.log(`  ✓ ${subject}/ (${BUNDLE_FILES.length} fichiers)`);
}

fs.mkdirSync(levelDir, { recursive: true });

const metaOut = {
  country,
  level,
  labelFr: levelMeta.labelFr ?? level,
  labelAr: levelMeta.labelAr ?? level,
  status: "draft",
  version: 0,
  notesFr:
    levelMeta.status === "planned"
      ? "Généré par scaffold — remplir curriculum/competences/exercise_bank puis curriculum:validate && curriculum:import"
      : "Niveau en cours de production",
  subjects: subjectCodes,
  scaffoldedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(levelDir, "meta.json"), JSON.stringify(metaOut, null, 2) + "\n");
console.log(`✓ meta.json → ${levelDir}`);

for (const subject of subjectCodes) {
  copySubjectTemplate(subject);
}

console.log(`\nProchaines étapes:`);
console.log(`  1. Éditer curriculum/countries/${country}/levels/${level}/`);
console.log(`  2. npm run curriculum:validate`);
console.log(`  3. npm run curriculum:import -- ${country} ${level}`);
