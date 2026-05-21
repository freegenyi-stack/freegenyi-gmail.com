const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_CANADA = path.join(__dirname, "data", "école_primaires_canada.csv");

// Canadian Provinces
const PROVINCES = {
  "AB": { en: "Alberta", fr: "Alberta" },
  "BC": { en: "British Columbia", fr: "Colombie-Britannique" },
  "MB": { en: "Manitoba", fr: "Manitoba" },
  "NB": { en: "New Brunswick", fr: "Nouveau-Brunswick" },
  "NL": { en: "Newfoundland and Labrador", fr: "Terre-Neuve-et-Labrador" },
  "NS": { en: "Nova Scotia", fr: "Nouvelle-Écosse" },
  "ON": { en: "Ontario", fr: "Ontario" },
  "PE": { en: "Prince Edward Island", fr: "Île-du-Prince-Édouard" },
  "QC": { en: "Quebec", fr: "Québec" },
  "SK": { en: "Saskatchewan", fr: "Saskatchewan" },
  "NT": { en: "Northwest Territories", fr: "Territoires du Nord-Ouest" },
  "NU": { en: "Nunavut", fr: "Nunavut" },
  "YT": { en: "Yukon", fr: "Yukon" }
};

function parseCsvLine(line, delimiter = ',') {
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
    const cols = parseCsvLine(line, ',');
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
  console.log("🚀 FreeGeny — Seeding Canadian schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure Canada exists in 'countries'
  console.log("🇨🇦 Ensuring Canada exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('CA', 'Canada', 'Canada', 'Canada', '🇨🇦', 'fr,en', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load schools CSV
  console.log("📖 Loading école_primaires_canada.csv...");
  const rawSchools = await readCSV(CSV_CANADA);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Filter and parse unique Provinces & Cities
  const regionsMap = new Map(); // provinceCode -> full names
  const districtsMap = new Map(); // \`${provinceCode}_\${city}\` -> { provinceCode, city }
  const validSchools = [];

  console.log("🔍 Parsing provinces and cities from schools list...");
  for (const s of rawSchools) {
    const minGrade = (s["min_grade"] || "").trim().toLowerCase();
    
    // Primary Filter: If it starts at grade 7 or higher, it's strictly a high school / middle school.
    // 'k' or 'pk' or 'pr' or 'jk' evaluates to NaN, which is fine (we want to keep them).
    const parsedMin = parseInt(minGrade, 10);
    if (!isNaN(parsedMin) && parsedMin > 6) {
      continue; // Skip secondary-only schools
    }

    const schoolName = s["facility_name"];
    const city = (s["addresslocality"] || s["addressLocality"] || "").toUpperCase().trim();
    const provinceCode = (s["province_code"] || "").toUpperCase().trim();
    const code = s["unique_id"] || s["school_id"]; // Fallback to school_id if unique_id is missing

    if (!schoolName || !city || !provinceCode || !code) {
      continue;
    }

    // Provider check (public vs private). Usually 'Public' or 'Private' in Canada data.
    const provider = (s["provider"] || "").trim().toLowerCase();
    const isPrivate = provider.includes("private") || provider.includes("independent") || s["isced1"] === "Private Institution";
    const type = isPrivate ? 2 : 1;

    const provinceNames = PROVINCES[provinceCode] || { en: provinceCode, fr: provinceCode };

    regionsMap.set(provinceCode, provinceNames);
    districtsMap.set(`${provinceCode}_${city}`, { provinceCode, city });

    validSchools.push({
      code: code,
      name: schoolName,
      city: city,
      provinceCode: provinceCode,
      type: type
    });
  }

  console.log(`📊 Filtered down to ${validSchools.length} primary/elementary schools.`);
  console.log(`📊 Collected ${regionsMap.size} provinces and ${districtsMap.size} cities.`);

  // 4. Seed Regions (Provinces)
  console.log("📁 Seeding Regions (Provinces)...");
  for (const [provinceCode, provNames] of regionsMap.entries()) {
    const exReg = await client.query(
      "SELECT id FROM regions WHERE country_code = 'CA' AND code = $1",
      [provinceCode]
    );
    if (exReg.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('CA', $1, $2, $3, $4)",
        [provinceCode, provNames.fr, provNames.fr, provNames.en]
      );
    }
  }

  // Cache CA regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'CA'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Provinces seeded and cached.");

  // 5. Seed Districts (Cities) in bulk
  console.log("📁 Seeding Districts (Cities)...");
  
  const exDistRes = await client.query(`
    SELECT d.id, d.name_local as city_name, r.code as province_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'CA'
  `);
  
  const existingDistKeys = new Set();
  for (const d of exDistRes.rows) {
    existingDistKeys.add(`${d.province_code}_${d.city_name}`);
  }

  const regionCounters = new Map();
  for (const provinceCode of regionsMap.keys()) {
    const regionId = regIdMap.get(provinceCode);
    if (!regionId) continue;
    const maxCodeRes = await client.query(
      "SELECT code FROM districts WHERE region_id = $1 ORDER BY code DESC LIMIT 1",
      [regionId]
    );
    if (maxCodeRes.rows.length > 0) {
      const lastCode = maxCodeRes.rows[0].code;
      const parts = lastCode.split('-');
      const numPart = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      regionCounters.set(provinceCode, isNaN(numPart) ? 1 : numPart + 1);
    } else {
      regionCounters.set(provinceCode, 1);
    }
  }

  const missingDistricts = [];
  for (const d of districtsMap.values()) {
    const regionId = regIdMap.get(d.provinceCode);
    if (!regionId) continue;

    const key = `${d.provinceCode}_${d.city}`;
    if (!existingDistKeys.has(key)) {
      let currentCounter = regionCounters.get(d.provinceCode) || 1;
      const uniqueCode = `${d.provinceCode}-${String(currentCounter).padStart(4, '0')}`;
      regionCounters.set(d.provinceCode, currentCounter + 1);
      
      missingDistricts.push({
        regionId,
        code: uniqueCode,
        city: d.city
      });
    }
  }

  if (missingDistricts.length > 0) {
    console.log(`📥 Batch inserting ${missingDistricts.length} missing cities...`);
    const dBatchSize = 100;
    for (let i = 0; i < missingDistricts.length; i += dBatchSize) {
      const batch = missingDistricts.slice(i, i + dBatchSize);
      const values = [];
      const placeholders = [];
      let idx = 1;
      for (const item of batch) {
        values.push(item.regionId, item.code, item.city);
        placeholders.push(`($${idx}, $${idx+1}, $${idx+2}, $${idx+2}, $${idx+2})`);
        idx += 3;
      }
      
      await client.query(`
        INSERT INTO districts (region_id, code, name_local, name_fr, name_en)
        VALUES ${placeholders.join(", ")}
      `, values);
    }
    console.log(`✅ Seeding of ${missingDistricts.length} cities complete.`);
  } else {
    console.log("✅ All cities are already up-to-date.");
  }

  // Fetch and cache all CA districts
  const distRes = await client.query(`
    SELECT d.id, d.name_local as city_name, r.code as province_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'CA'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.province_code}_${d.city_name}`, d.id);
  }

  // 6. Clear existing CA schools
  console.log("🗑️ Clearing existing CA schools...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'CA'
    )
  `);
  console.log("✅ Existing CA schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding CA primary schools...");
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
      const districtKey = `${s.provinceCode}_${s.city}`;
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

      const type = s.type;

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
  console.log(`✅ Successfully imported Canadian primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
