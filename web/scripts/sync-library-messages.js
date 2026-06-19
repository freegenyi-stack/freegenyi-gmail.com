/**
 * Copie le namespace Library depuis en.json vers toutes les locales sauf fr/ar.
 * Usage: npm run i18n:sync:library
 */
const fs = require("fs");
const path = require("path");

const messagesDir = path.join(__dirname, "..", "messages");
const source = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));
const library = source.Library;
if (!library) {
  console.error("Library namespace missing in en.json");
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
  data.Library = library;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  updated++;
}
console.log(`OK — Library synchronisé dans ${updated} locale(s)`);
