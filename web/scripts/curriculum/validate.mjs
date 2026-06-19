/**
 * Valide les bundles curriculum sur disque.
 * Usage: npm run curriculum:validate [-- DZ]
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../../curriculum");
const BUNDLE_FILES = ["curriculum.json", "competences.json", "exercise_bank.json", "evaluations.json"];
const countryArg = process.argv[2] ?? "DZ";

function shaDir(dir) {
  const h = crypto.createHash("sha256");
  for (const f of BUNDLE_FILES) {
    h.update(fs.readFileSync(path.join(dir, f)));
  }
  return h.digest("hex").slice(0, 16);
}

function validateBundle(dir) {
  const errors = [];
  const curriculum = JSON.parse(fs.readFileSync(path.join(dir, "curriculum.json"), "utf8"));
  const competences = JSON.parse(fs.readFileSync(path.join(dir, "competences.json"), "utf8"));
  const bank = JSON.parse(fs.readFileSync(path.join(dir, "exercise_bank.json"), "utf8"));
  fs.readFileSync(path.join(dir, "evaluations.json"), "utf8");

  const meta = curriculum.metadata ?? {};
  if (!meta.moduleId) errors.push("curriculum.metadata.moduleId manquant");
  if (!meta.level) errors.push("curriculum.metadata.level manquant");

  const compIds = new Set((competences.competencies ?? []).map((c) => c.competencyId));
  for (const item of bank.items ?? []) {
    if (!item.id) errors.push("exercise sans id");
    if (!item.competencyId) errors.push(`exercise ${item.id} sans competencyId`);
    else if (!compIds.has(item.competencyId)) {
      errors.push(`exercise ${item.id} → competencyId inconnu ${item.competencyId}`);
    }
    if (!item.variantGroup) errors.push(`exercise ${item.id} sans variantGroup`);
  }

  return { errors, hash: shaDir(dir), moduleId: meta.moduleId, exerciseCount: (bank.items ?? []).length };
}

function walkLevels(country) {
  const levelsDir = path.join(ROOT, "countries", country, "levels");
  if (!fs.existsSync(levelsDir)) return [];
  const results = [];
  for (const level of fs.readdirSync(levelsDir)) {
    if (level.startsWith("_")) continue;
    const levelPath = path.join(levelsDir, level);
    if (!fs.statSync(levelPath).isDirectory()) continue;
    for (const subject of fs.readdirSync(levelPath)) {
      const subjectPath = path.join(levelPath, subject);
      if (!fs.statSync(subjectPath).isDirectory()) continue;
      const hasAll = BUNDLE_FILES.every((f) => fs.existsSync(path.join(subjectPath, f)));
      if (!hasAll) continue;
      const v = validateBundle(subjectPath);
      results.push({ country, level, subject, ...v });
    }
  }
  return results;
}

const bundles = walkLevels(countryArg);
let failed = 0;
for (const b of bundles) {
  if (b.errors.length) {
    failed++;
    console.error(`✗ ${b.country}/${b.level}/${b.subject}`, b.errors);
  } else {
    console.log(`✓ ${b.country}/${b.level}/${b.subject} — ${b.moduleId} — ${b.exerciseCount} exos — hash ${b.hash}`);
  }
}

if (bundles.length === 0) {
  console.warn(`Aucun bundle complet trouvé pour ${countryArg}.`);
  process.exit(1);
}

process.exit(failed ? 1 : 0);
