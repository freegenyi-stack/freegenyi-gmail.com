const fs = require("fs");
const path = require("path");

const CSV_JO = path.join(__dirname, "..", "src", "db", "seeds", "data", "ecoles_primaires_jordanie.csv");

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  values.push(current.trim());
  return values;
}

function normalizeCode(raw, maxLen = 10) {
  if (!raw) return "UNKNOWN";
  return raw
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "")
    .slice(0, maxLen) || "UNKNOWN";
}

const csvContent = fs.readFileSync(CSV_JO, "utf-8");
const cleanContent = csvContent.replace(/^\uFEFF/, "");
const lines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
const headers = parseCsvLine(lines[0]);
const idx = (name) => headers.indexOf(name);

const regionsMap = new Map();
const districtsMap = new Map();

for (let i = 1; i < lines.length; i++) {
  const values = parseCsvLine(lines[i]);
  if (values.length < headers.length) continue;

  let gouvernorat = values[idx("gouvernorat")]?.trim();
  let liwa = values[idx("liwa")]?.trim();

  if (!gouvernorat) gouvernorat = "Unknown Gouvernorat";
  if (!liwa) liwa = "Unknown Liwa";

  const regionCode = normalizeCode(gouvernorat, 10);
  const districtCode = normalizeCode(`${gouvernorat}-${liwa}`, 15);

  regionsMap.set(regionCode, { code: regionCode, nameLocal: gouvernorat });
  districtsMap.set(districtCode, {
    code: districtCode,
    nameLocal: liwa,
    regionCode,
  });
}

console.log("Regions:");
for (const [k, v] of regionsMap.entries()) {
  console.log(`  key="${k}", code="${v.code}", nameLocal="${v.nameLocal}"`);
}

console.log("\nDistricts count:", districtsMap.size);
