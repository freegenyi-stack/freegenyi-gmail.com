const fs = require("fs");
const path = require("path");

const CSV_LB = path.join(__dirname, "..", "src", "db", "seeds", "data", "ecoles_primaires_liban.csv");

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

const csvContent = fs.readFileSync(CSV_LB, "utf-8");
const cleanContent = csvContent.replace(/^\uFEFF/, "");
const lines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
const headers = parseCsvLine(lines[0]);
const idx = (name) => headers.indexOf(name);

const regions = new Map();

for (let i = 1; i < lines.length; i++) {
  const values = parseCsvLine(lines[i]);
  if (values.length < headers.length) continue;

  const reg = values[idx("المنطقة_التربوية")];
  const owner = values[idx("المالك")];
  const type = values[idx("نوع_التعليم")];
  const nature = values[idx("طبيعة")];

  regions.set(reg, (regions.get(reg) || 0) + 1);
}

console.log("Unique Educational Regions:");
for (const [k, v] of regions.entries()) {
  console.log(`- "${k}": ${v} schools`);
}
