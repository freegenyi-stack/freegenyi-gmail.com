const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_AUSTRALIA = path.join(__dirname, "data", "ecoles_primaires_australie.csv");

const STATES = {
  "NSW": { en: "New South Wales", fr: "Nouvelle-Galles du Sud" },
  "VIC": { en: "Victoria", fr: "Victoria" },
  "QLD": { en: "Queensland", fr: "Queensland" },
  "WA":  { en: "Western Australia", fr: "Australie-Occidentale" },
  "SA":  { en: "South Australia", fr: "Australie-Méridionale" },
  "TAS": { en: "Tasmania", fr: "Tasmanie" },
  "ACT": { en: "Australian Capital Territory", fr: "Territoire de la capitale australienne" },
  "NT":  { en: "Northern Territory", fr: "Territoire du Nord" }
};

function parseCsvLine(line, delimiter = ';') {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
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
    const cols = parseCsvLine(line, ';');
    if (isFirstLine) {
      headers = cols.map(h => h.toLowerCase().replace(/['"]+/g, '').trim());
      isFirstLine = false;
      continue;
    }
    const row = {};
    headers.forEach((h, i) => {
      let colVal = cols[i] || "";
      if (colVal.startsWith('"') && colVal.endsWith('"')) {
        colVal = colVal.substring(1, colVal.length - 1);
      }
      row[h] = colVal.trim();
    });
    rows.push(row);
  }
  return rows;
}

async function main() {
  console.log("🚀 FreeGeny — Seeding Australian schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure Australia exists in 'countries'
  console.log("🇦🇺 Ensuring Australia exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('AU', 'Australie', 'Australia', 'Australia', '🇦🇺', 'en', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load schools CSV
  console.log("📖 Loading ecoles_primaires_australie.csv...");
  const rawSchools = await readCSV(CSV_AUSTRALIA);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Filter and parse unique States & Suburbs
  const regionsMap = new Map(); // stateCode -> full names
  const districtsMap = new Map(); // `${stateCode}_${suburb}` -> { stateCode, suburb, postcode }
  const validSchools = [];

  console.log("🔍 Parsing states and suburbs from schools list...");
  for (const s of rawSchools) {
    // We only import Primary and Combined schools
    const schoolType = (s["school type"] || "").trim().toLowerCase();
    if (schoolType !== "primary" && schoolType !== "combined") {
      continue;
    }

    const schoolName = s["school name"] || s["school_name"];
    const suburb = (s["suburb"] || "").toUpperCase().trim();
    const stateCode = (s["state"] || "").toUpperCase().trim();
    const postcode = s["postcode"] || "";
    const smlId = s["acara sml id"] || s["acara_sml_id"];

    if (!schoolName || !suburb || !stateCode || !smlId) {
      continue;
    }

    const stateNames = STATES[stateCode] || { en: `${stateCode} State`, fr: `${stateCode} État` };

    regionsMap.set(stateCode, stateNames);
    districtsMap.set(`${stateCode}_${suburb}`, { stateCode, suburb, postcode });

    validSchools.push({
      code: smlId,
      name: schoolName,
      suburb,
      stateCode,
      sector: s["school sector"] || s["school_sector"]
    });
  }

  console.log(`📊 Filtered down to ${validSchools.length} primary/combined schools.`);
  console.log(`📊 Collected ${regionsMap.size} states and ${districtsMap.size} suburbs.`);

  // 4. Seed Regions (States)
  console.log("📁 Seeding Regions (States)...");
  for (const [stateCode, stateNames] of regionsMap.entries()) {
    const exReg = await client.query(
      "SELECT id FROM regions WHERE country_code = 'AU' AND code = $1",
      [stateCode]
    );
    if (exReg.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('AU', $1, $2, $3, $2)",
        [stateCode, stateNames.en, stateNames.fr]
      );
    }
  }

  // Cache AU regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'AU'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Suburbs) in bulk
  console.log("📁 Seeding Districts (Suburbs)...");
  
  // Fetch existing AU districts to skip duplicates
  const exDistRes = await client.query(`
    SELECT d.id, d.name_local as suburb_name, r.code as state_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'AU'
  `);
  
  const existingDistKeys = new Set();
  for (const d of exDistRes.rows) {
    existingDistKeys.add(`${d.state_code}_${d.suburb_name}`);
  }

  const regionCounters = new Map();
  for (const stateCode of regionsMap.keys()) {
    const regionId = regIdMap.get(stateCode);
    if (!regionId) continue;
    const maxCodeRes = await client.query(
      "SELECT code FROM districts WHERE region_id = $1 ORDER BY code DESC LIMIT 1",
      [regionId]
    );
    if (maxCodeRes.rows.length > 0) {
      const lastCode = maxCodeRes.rows[0].code;
      const parts = lastCode.split('-');
      const numPart = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      regionCounters.set(stateCode, isNaN(numPart) ? 1 : numPart + 1);
    } else {
      regionCounters.set(stateCode, 1);
    }
  }

  const missingDistricts = [];
  for (const d of districtsMap.values()) {
    const regionId = regIdMap.get(d.stateCode);
    if (!regionId) continue;

    const key = `${d.stateCode}_${d.suburb}`;
    if (!existingDistKeys.has(key)) {
      let currentCounter = regionCounters.get(d.stateCode) || 1;
      const uniqueCode = `${d.stateCode}-${String(currentCounter).padStart(4, '0')}`;
      regionCounters.set(d.stateCode, currentCounter + 1);
      
      missingDistricts.push({
        regionId,
        code: uniqueCode,
        suburb: d.suburb
      });
    }
  }

  if (missingDistricts.length > 0) {
    console.log(`📥 Batch inserting ${missingDistricts.length} missing suburbs...`);
    const dBatchSize = 100;
    for (let i = 0; i < missingDistricts.length; i += dBatchSize) {
      const batch = missingDistricts.slice(i, i + dBatchSize);
      const values = [];
      const placeholders = [];
      let idx = 1;
      for (const item of batch) {
        values.push(item.regionId, item.code, item.suburb);
        placeholders.push(`($${idx}, $${idx+1}, $${idx+2}, $${idx+2}, $${idx+2})`);
        idx += 3;
      }
      
      await client.query(`
        INSERT INTO districts (region_id, code, name_local, name_fr, name_en)
        VALUES ${placeholders.join(", ")}
      `, values);
    }
    console.log(`✅ Seeding of ${missingDistricts.length} suburbs complete.`);
  } else {
    console.log("✅ All suburbs are already up-to-date.");
  }

  // Fetch and cache all AU districts
  const distRes = await client.query(`
    SELECT d.id, d.name_local as suburb_name, r.code as state_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'AU'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.state_code}_${d.suburb_name}`, d.id);
  }

  // 6. Clear existing Australian schools
  console.log("🗑️ Clearing existing Australian schools...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'AU'
    )
  `);
  console.log("✅ Existing Australian schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding Australian primary/combined schools...");
  let inserted = 0;
  let skipped = 0;
  const batchSize = 150;
  const insertedSet = new Set();

  for (let i = 0; i < validSchools.length; i += batchSize) {
    const batch = validSchools.slice(i, i + batchSize);
    const values = [];
    const valuePlaceholders = [];
    let placeholderIndex = 1;

    for (const s of batch) {
      let code = s.code || "";
      const name = s.name;
      const districtKey = `${s.stateCode}_${s.suburb}`;
      const districtId = distIdMap.get(districtKey);

      if (!districtId || !name) {
        skipped++;
        continue;
      }

      if (code.length > 20) {
        code = code.substring(0, 20);
      }

      const globalKey = `${districtId}_${code}`;
      if (insertedSet.has(globalKey)) {
        skipped++;
        continue;
      }
      insertedSet.add(globalKey);

      // School Sector maps to type: Government = 1, Catholic/Independent = 2
      const sectorLower = (s.sector || "").trim().toLowerCase();
      const type = sectorLower === "government" ? 1 : 2;

      values.push(districtId, code, name, name, type);
      valuePlaceholders.push(`($${placeholderIndex}, $${placeholderIndex + 1}, $${placeholderIndex + 2}, $${placeholderIndex + 3}, $${placeholderIndex + 4})`);
      placeholderIndex += 5;
    }

    if (values.length > 0) {
      const query = `
        INSERT INTO schools (district_id, code, name_local, name_fr, type)
        VALUES ${valuePlaceholders.join(", ")}
        ON CONFLICT (district_id, code) DO UPDATE SET
          name_local = EXCLUDED.name_local,
          name_fr = EXCLUDED.name_fr,
          updated_at = NOW()
      `;

      await client.query(query, values);
      inserted += values.length / 5;
    }

    if (inserted % 1500 === 0 || i + batchSize >= validSchools.length) {
      process.stdout.write(`\r  📊 Progress: ${inserted}/${validSchools.length} schools imported...`);
    }
  }

  console.log("\n");
  console.log(`✅ Successfully imported Australian primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
