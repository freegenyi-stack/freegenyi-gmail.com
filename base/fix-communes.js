const fs = require('fs');
const readline = require('readline');
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/freegenydb";
const client = new Client({ connectionString: DATABASE_URL });

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  await client.connect();
  const rows = [];
  const rl = readline.createInterface({
    input: fs.createReadStream('c:/Users/Yousr/freegonya/base/ecoles_primaires_algerie.csv'),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  let headers = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    if (isFirstLine) {
      headers = cols.map(h => h.toLowerCase().trim());
      isFirstLine = false;
      continue;
    }
    const row = {};
    headers.forEach((h, i) => { row[h] = (cols[i] || "").trim(); });
    rows.push(row);
  }

  const communes = new Map();
  for (const s of rows) {
    const code = s.commune_code;
    const name = s.commune;
    if (code && name && !communes.has(code)) {
      communes.set(code, name);
    }
  }

  let updated = 0;
  for (const [code, name] of communes) {
    let ar = name;
    let fr = name;
    const match = name.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
        ar = match[1].trim();
        fr = match[2].trim();
    }
    await client.query("UPDATE districts SET name_local = $1, name_fr = $2 WHERE code = $3", [ar, fr, code]);
    updated++;
  }

  console.log(`Updated ${updated} communes. Example: 1002 is ${communes.get("1002")}`);
  await client.end();
}
main().catch(console.error);
