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

console.log("Headers:", headers);
const regions = new Set();
const districts = new Set();

for (let i = 1; i < 50; i++) {
  const values = parseCsvLine(lines[i]);
  const gov = values[idx("gouvernorat")];
  const liw = values[idx("liwa")];
  console.log(`Row ${i}: gov="${gov}" -> code="${normalizeCode(gov, 10)}", liw="${liw}" -> code="${normalizeCode(`${gov}-${liw}`, 15)}"`);
}
