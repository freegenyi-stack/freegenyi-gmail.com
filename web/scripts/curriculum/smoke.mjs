/**
 * Smoke test usine curriculum (fichiers JSON, sans serveur).
 * Usage: npm run curriculum:smoke
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createFsrsCard, reviewFsrsCard, dueFsrsCards } from "./fsrs-lite.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../../curriculum");
let failed = 0;

function ok(label) {
  console.log(`✓ ${label}`);
}
function fail(label, detail) {
  failed++;
  console.error(`✗ ${label}`, detail ?? "");
}

const mq01Path = path.join(
  ROOT,
  "countries/DZ/levels/1AP/ar_islam_civique/curriculum.json"
);
const lessonsPath = path.join(
  ROOT,
  "countries/DZ/levels/1AP/ar_islam_civique/lessons.json"
);
const bankPath = path.join(
  ROOT,
  "countries/DZ/levels/1AP/ar_islam_civique/exercise_bank.json"
);
const typesPath = path.join(ROOT, "schemas/exercise-types.registry.json");

const curriculum = JSON.parse(fs.readFileSync(mq01Path, "utf8"));
const lessons = JSON.parse(fs.readFileSync(lessonsPath, "utf8"));
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const types = JSON.parse(fs.readFileSync(typesPath, "utf8"));

const mq01 = curriculum.maqaate?.find((m) => m.maqtaId === "mq01");
if (!mq01) fail("mq01 in curriculum");
else {
  ok(`mq01 — ${mq01.units?.length ?? 0} unités, ${mq01.blocks?.length ?? 0} blocs, ${mq01.nodes?.length ?? 0} nodes`);
}

if ((lessons.lessons?.length ?? 0) >= 13) ok(`lessons.json — ${lessons.lessons.length} leçons`);
else fail("lessons.json", `expected 13, got ${lessons.lessons?.length ?? 0}`);

if ((bank.items?.length ?? 0) >= 3) ok(`exercise_bank — ${bank.items.length} exos pilotes`);
else fail("exercise_bank", "too few items");

const nativeCount = types.nativeActivityTypes?.length ?? 0;
if (nativeCount === 12) ok("12 types natifs référencés");
else fail("exercise-types.registry", nativeCount);

if (curriculum.enrichment?.modules?.length >= 4) ok(`enrichissement — ${curriculum.enrichment.modules.length} modules`);
else fail("enrichment modules");

let card = createFsrsCard("test");
const reviewed = reviewFsrsCard(card, 3);
if (reviewed.intervalDays >= 1 && reviewed.card.due.getTime() > Date.now()) ok("FSRS lite — prochaine révision planifiée");
else fail("FSRS lite");

console.log(failed ? `\n${failed} échec(s)` : "\nTout OK — prêt pour scan demain");
process.exit(failed ? 1 : 0);
