const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_UK = path.join(__dirname, "data", "ecoles_primaires_royaume_uni.csv");

// 9 Government Office Regions (GOR)
const UK_REGIONS = {
  "London":                    { en: "London",                    fr: "Londres" },
  "South East":                { en: "South East",                fr: "Sud-Est" },
  "South West":                { en: "South West",                fr: "Sud-Ouest" },
  "East of England":           { en: "East of England",           fr: "Est de l'Angleterre" },
  "East Midlands":             { en: "East Midlands",             fr: "Midlands de l'Est" },
  "West Midlands":             { en: "West Midlands",             fr: "Midlands de l'Ouest" },
  "Yorkshire and the Humber":  { en: "Yorkshire and the Humber",  fr: "Yorkshire et Humber" },
  "North West":                { en: "North West",                fr: "Nord-Ouest" },
  "North East":                { en: "North East",                fr: "Nord-Est" },
};

// Types considered as "public" (state-funded)
const PUBLIC_TYPES = new Set([
  "community school",
  "academy converter",
  "academy sponsor led",
  "voluntary aided school",
  "voluntary controlled school",
  "foundation school",
  "free schools",
  "local authority nursery school",
  "community special school",
  "academy special converter",
  "free schools special",
  "studio schools",
  "university technical college",
  "foundation special school",
  "city technology college",
  "further education",
]);

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
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
      headers = cols.map(h => h.replace(/"/g, '').trim());
      isFirstLine = false;
      continue;
    }
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] || "").replace(/^"|"$/g, '').trim();
    });
    rows.push(row);
  }
  return rows;
}

// 9 Government Office Regions (GOR) short 3-letter codes for varchar(10) column
const UK_REGION_CODES = {
  "London":                    "LDN",
  "South East":                "SE",
  "South West":                "SW",
  "East of England":           "EE",
  "East Midlands":             "EM",
  "West Midlands":             "WM",
  "Yorkshire and the Humber":  "YH",
  "North West":                "NW",
  "North East":                "NE",
};

async function main() {
  console.log("🚀 FreeGeny — Seeding United Kingdom schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure UK exists in 'countries'
  console.log("🇬🇧 Ensuring United Kingdom exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('GB', 'Royaume-Uni', 'United Kingdom', 'United Kingdom', '🇬🇧', 'en', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load CSV
  console.log("📖 Loading ecoles_primaires_royaume_uni.csv...");
  const rawSchools = await readCSV(CSV_UK);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Filter and parse
  const regionsMap = new Map();    // gorName -> { en, fr }
  const districtsMap = new Map();  // `${gorName}_${laName}` -> { gorName, laName }
  const validSchools = [];

  let skippedCount = 0;
  console.log("🔍 Filtering primary schools...");

  for (const s of rawSchools) {
    const phase = (s["PhaseOfEducation (name)"] || "").trim();
    const status = (s["EstablishmentStatus (name)"] || "").trim();
    const gorName = (s["GOR (name)"] || "").trim();
    const laName  = (s["LA (name)"] || "").trim();
    const name    = (s["EstablishmentName"] || "").trim();
    const type    = (s["TypeOfEstablishment (name)"] || "").trim();
    const urn     = (s["URN"] || "").trim();

    // Only open primary schools with a known GOR
    if (status !== "Open" && status !== "Open, but proposed to close") { skippedCount++; continue; }
    if (phase !== "Primary" && phase !== "Middle deemed primary") { skippedCount++; continue; }
    if (!gorName || !laName || !name || !urn) { skippedCount++; continue; }
    if (!UK_REGIONS[gorName]) { skippedCount++; continue; }

    regionsMap.set(gorName, UK_REGIONS[gorName]);
    districtsMap.set(`${gorName}_${laName}`, { gorName, laName });

    const typeLower = type.toLowerCase();
    const schoolType = PUBLIC_TYPES.has(typeLower) ? 1 : 2; // 1=public, 2=private

    validSchools.push({ urn, name, gorName, laName, schoolType });
  }

  console.log(`📊 Filtered to ${validSchools.length} primary schools (skipped ${skippedCount}).`);
  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} LA districts.`);

  // 4. Seed Regions (GOR)
  console.log("📁 Seeding Regions (Government Office Regions)...");
  for (const [gorName, names] of regionsMap.entries()) {
    const gorCode = UK_REGION_CODES[gorName] || gorName.toUpperCase().replace(/\s+/g, '_').substring(0, 10);
    const existing = await client.query(
      "SELECT id FROM regions WHERE country_code = 'GB' AND code = $1",
      [gorCode]
    );
    if (existing.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('GB', $1, $2, $3, $2)",
        [gorCode, names.en, names.fr]
      );
    }
  }

  const regRes = await client.query("SELECT id, code, name_local FROM regions WHERE country_code = 'GB'");
  const regIdMap = new Map(); // gorName -> id
  const gorCodeMap = new Map(); // gorName -> code
  for (const r of regRes.rows) {
    regIdMap.set(r.name_local, r.id);
    gorCodeMap.set(r.name_local, r.code);
  }
  console.log(`✅ ${regRes.rows.length} regions seeded.`);

  // 5. Seed Districts (Local Authorities)
  console.log("📁 Seeding Districts (Local Authorities)...");

  const exDistRes = await client.query(`
    SELECT d.id, d.name_local, r.name_local as region_name
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'GB'
  `);

  const existingDistKeys = new Set();
  for (const d of exDistRes.rows) {
    existingDistKeys.add(`${d.region_name}_${d.name_local}`);
  }

  // Compute next district code counters
  const regionCounters = new Map();
  for (const gorName of regionsMap.keys()) {
    const regionId = regIdMap.get(gorName);
    if (!regionId) continue;
    const maxCodeRes = await client.query(
      "SELECT code FROM districts WHERE region_id = $1 ORDER BY code DESC LIMIT 1",
      [regionId]
    );
    if (maxCodeRes.rows.length > 0) {
      const parts = maxCodeRes.rows[0].code.split('-');
      const numPart = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      regionCounters.set(gorName, isNaN(numPart) ? 1 : numPart + 1);
    } else {
      regionCounters.set(gorName, 1);
    }
  }

  const missingDistricts = [];
  for (const [key, d] of districtsMap.entries()) {
    const regionId = regIdMap.get(d.gorName);
    if (!regionId) continue;
    if (existingDistKeys.has(key)) continue;

    const gorCode = (gorCodeMap.get(d.gorName) || "GB").substring(0, 6);
    let counter = regionCounters.get(d.gorName) || 1;
    const uniqueCode = `${gorCode}-${String(counter).padStart(4, '0')}`;
    regionCounters.set(d.gorName, counter + 1);

    missingDistricts.push({ regionId, code: uniqueCode, laName: d.laName });
  }

  if (missingDistricts.length > 0) {
    console.log(`📥 Inserting ${missingDistricts.length} Local Authority districts...`);
    const dBatchSize = 100;
    for (let i = 0; i < missingDistricts.length; i += dBatchSize) {
      const batch = missingDistricts.slice(i, i + dBatchSize);
      const values = [];
      const placeholders = [];
      let idx = 1;
      for (const item of batch) {
        values.push(item.regionId, item.code, item.laName);
        placeholders.push(`($${idx}, $${idx+1}, $${idx+2}, $${idx+2}, $${idx+2})`);
        idx += 3;
      }
      await client.query(
        `INSERT INTO districts (region_id, code, name_local, name_fr, name_en) VALUES ${placeholders.join(", ")}`,
        values
      );
    }
    console.log(`✅ ${missingDistricts.length} districts inserted.`);
  } else {
    console.log("✅ All districts already up-to-date.");
  }

  // Fetch and cache all GB districts
  const distRes = await client.query(`
    SELECT d.id, d.name_local, r.name_local as region_name
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'GB'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.region_name}_${d.name_local}`, d.id);
  }
  console.log(`✅ Cached ${distIdMap.size} districts.`);

  // 6. Clear existing UK schools
  console.log("🗑️  Clearing existing UK schools from database...");
  await client.query(`
    DELETE FROM schools
    WHERE district_id IN (
      SELECT d.id FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'GB'
    )
  `);
  console.log("✅ Existing UK schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding UK primary schools...");
  let inserted = 0;
  let skipped = 0;
  const batchSize = 200;
  const insertedUrns = new Set();

  for (let i = 0; i < validSchools.length; i += batchSize) {
    const batch = validSchools.slice(i, i + batchSize);
    const values = [];
    const valuePlaceholders = [];
    let idx = 1;

    for (const s of batch) {
      const districtKey = `${s.gorName}_${s.laName}`;
      const districtId = distIdMap.get(districtKey);

      if (!districtId || !s.name) { skipped++; continue; }
      if (insertedUrns.has(s.urn)) { skipped++; continue; }
      insertedUrns.add(s.urn);

      const code = s.urn.substring(0, 20);
      values.push(districtId, code, s.name, s.name, s.schoolType);
      valuePlaceholders.push(`($${idx}, $${idx+1}, $${idx+2}, $${idx+3}, $${idx+4})`);
      idx += 5;
    }

    if (values.length > 0) {
      await client.query(`
        INSERT INTO schools (district_id, code, name_local, name_fr, type)
        VALUES ${valuePlaceholders.join(", ")}
        ON CONFLICT (district_id, code) DO UPDATE SET
          name_local = EXCLUDED.name_local,
          name_fr = EXCLUDED.name_fr,
          updated_at = NOW()
      `, values);
      inserted += values.length / 5;
    }

    if (i % 2000 === 0 || i + batchSize >= validSchools.length) {
      process.stdout.write(`\r  📊 Progress: ${Math.min(inserted, validSchools.length)}/${validSchools.length} schools...`);
    }
  }

  console.log("\n");
  console.log(`✅ Successfully imported UK primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) console.log(`⚠️  Skipped: ${skipped} rows`);

  await client.end();
  console.log("🏁 Database seeding complete for 🇬🇧 United Kingdom.");
}

main().catch(console.error);
