/**
 * Copie TeacherSpace.atelier depuis en.json vers toutes les locales sauf fr/ar/en.
 * Usage: npm run i18n:sync:atelier
 */
const fs = require("fs");
const path = require("path");

const messagesDir = path.join(__dirname, "..", "messages");
const source = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));
const atelier = source.TeacherSpace?.atelier;
const workshopNav = source.TeacherSpace?.nav?.workshop;
const workshopHub = source.TeacherSpace?.home?.hubs?.workshop;

if (!atelier) {
  console.error("TeacherSpace.atelier missing in en.json");
  process.exit(1);
}

const preserve = new Set(["fr.json", "ar.json", "en.json"]);
const files = fs.readdirSync(messagesDir).filter((f) => f.endsWith(".json"));
let updated = 0;

for (const file of files) {
  if (preserve.has(file)) continue;
  const filePath = path.join(messagesDir, file);
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const data = JSON.parse(raw);
  if (!data.TeacherSpace) data.TeacherSpace = {};
  data.TeacherSpace.atelier = atelier;
  if (workshopNav) data.TeacherSpace.nav = { ...data.TeacherSpace.nav, workshop: workshopNav };
  if (workshopHub) {
    data.TeacherSpace.home = data.TeacherSpace.home || {};
    data.TeacherSpace.home.hubs = { ...data.TeacherSpace.home.hubs, workshop: workshopHub };
  }
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  updated++;
}

console.log(`OK — TeacherSpace.atelier synchronisé dans ${updated} locale(s)`);
