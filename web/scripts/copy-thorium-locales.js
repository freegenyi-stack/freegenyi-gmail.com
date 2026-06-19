/**
 * Copie les traductions Thorium Web vers public/locales et src/lib/thorium-locales.
 */
const fs = require("fs");
const path = require("path");

const srcRoot = path.join(__dirname, "../node_modules/@edrlab/thorium-web/dist/locales");
const destRoots = [
  path.join(__dirname, "../public/locales"),
  path.join(__dirname, "../src/lib/thorium-locales"),
];
const locales = ["fr", "en"];
const files = ["thorium-shared.json", "thorium-web.json"];

if (!fs.existsSync(srcRoot)) {
  console.warn("[copy-thorium-locales] @edrlab/thorium-web introuvable, skip.");
  process.exit(0);
}

for (const destRoot of destRoots) {
  for (const lng of locales) {
    for (const file of files) {
      const from = path.join(srcRoot, lng, file);
      const to = path.join(destRoot, lng, file);
      if (!fs.existsSync(from)) {
        console.warn("[copy-thorium-locales] manquant:", from);
        continue;
      }
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

console.log("[copy-thorium-locales] OK → public/locales + src/lib/thorium-locales");
