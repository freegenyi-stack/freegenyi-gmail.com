const fs = require('fs');
const readline = require('readline');
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/freegenydb";

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

async function readCSV(filePath) {
  const rows = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
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
  return rows;
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  const publicSchools = await readCSV('c:/Users/Yousr/freegonya/base/ecoles_primaires_algerie.csv');
  const privateSchools = await readCSV('c:/Users/Yousr/freegonya/base/ecoles_privees_algerie.csv');

  console.log(`Public CSV rows (excluding header): ${publicSchools.length}`);
  console.log(`Private CSV rows (excluding header): ${privateSchools.length}`);
  console.log(`Total expected: ${publicSchools.length + privateSchools.length}`);

  // Fetch all regions to see if we have them all
  const regionsRes = await client.query("SELECT code FROM regions");
  const regionCodes = new Set(regionsRes.rows.map(r => r.code));
  
  // Fetch all districts
  const distRes = await client.query("SELECT d.code as d_code, r.code as r_code FROM districts d JOIN regions r ON d.region_id = r.id");
  const districtKeys = new Set(distRes.rows.map(d => `${d.r_code}_${d.d_code}`));

  let publicStats = {
    missingName: 0,
    missingCommuneCode: 0,
    missingWilayaCode: 0,
    wilayaNotFound: 0,
    districtNotFound: 0,
    valid: 0
  };

  for (const s of publicSchools) {
    const code = s.ecole_code;
    const nameAr = s.nom_ecole || s.nom_ar;
    const communeCode = s.commune_code;
    const wilayaCode = s.wilaya_code ? s.wilaya_code.padStart(2, "0") : null;

    if (!nameAr) { publicStats.missingName++; continue; }
    if (!communeCode) { publicStats.missingCommuneCode++; continue; }
    if (!wilayaCode) { publicStats.missingWilayaCode++; continue; }

    if (!regionCodes.has(wilayaCode)) {
      publicStats.wilayaNotFound++;
      continue;
    }

    const key = `${wilayaCode}_${communeCode}`;
    if (!districtKeys.has(key)) {
      publicStats.districtNotFound++;
      continue;
    }

    publicStats.valid++;
  }

  let privateStats = {
    missingName: 0,
    missingCommuneCode: 0,
    missingWilayaCode: 0,
    wilayaNotFound: 0,
    districtNotFound: 0,
    valid: 0
  };

  for (const s of privateSchools) {
    const code = s.ecole_code;
    const nameAr = s.nom_ecole || s.nom_ar;
    const communeCode = s.commune_code;
    const wilayaCode = s.wilaya_code ? s.wilaya_code.padStart(2, "0") : null;

    if (!nameAr) { privateStats.missingName++; continue; }
    if (!communeCode) { privateStats.missingCommuneCode++; continue; }
    if (!wilayaCode) { privateStats.missingWilayaCode++; continue; }

    if (!regionCodes.has(wilayaCode)) {
      privateStats.wilayaNotFound++;
      continue;
    }

    const key = `${wilayaCode}_${communeCode}`;
    if (!districtKeys.has(key)) {
      privateStats.districtNotFound++;
      continue;
    }

    privateStats.valid++;
  }

  console.log("\n--- PUBLIC SCHOOLS DIAGNOSTIC ---");
  console.log(publicStats);
  
  console.log("\n--- PRIVATE SCHOOLS DIAGNOSTIC ---");
  console.log(privateStats);

  // Check unique codes
  const publicCodes = new Set(publicSchools.map(s => s.ecole_code).filter(Boolean));
  const privateCodes = new Set(privateSchools.map(s => s.ecole_code).filter(Boolean));
  
  console.log(`\nUnique ecole_codes in Public CSV: ${publicCodes.size} (vs ${publicSchools.length} rows)`);
  console.log(`Unique ecole_codes in Private CSV: ${privateCodes.size} (vs ${privateSchools.length} rows)`);

  // Check database counts
  const dbPublicCount = await client.query("SELECT count(*) FROM schools WHERE type = 1");
  const dbPrivateCount = await client.query("SELECT count(*) FROM schools WHERE type = 2");
  const dbTotalCount = await client.query("SELECT count(*) FROM schools");

  console.log(`\n--- DATABASE COUNTS ---`);
  console.log(`DB Public (type=1): ${dbPublicCount.rows[0].count}`);
  console.log(`DB Private (type=2): ${dbPrivateCount.rows[0].count}`);
  console.log(`DB Total: ${dbTotalCount.rows[0].count}`);

  await client.end();
}

main().catch(console.error);
