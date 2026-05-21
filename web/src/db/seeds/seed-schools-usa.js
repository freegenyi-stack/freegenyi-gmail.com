const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_USA = path.join(__dirname, "data", "ecoles_primaires_usa.csv");

// Common US state abbreviations to nice names
const STATES = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
  "DC": "District of Columbia", "PR": "Puerto Rico"
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
  console.log("🚀 FreeGeny — Seeding US schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure USA exists in 'countries'
  console.log("🇺🇸 Ensuring United States exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('US', 'États-Unis', 'United States', 'United States', '🇺🇸', 'en', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load Public schools CSV
  console.log("📖 Loading ecoles_primaires_usa.csv...");
  const rawPublicSchools = await readCSV(CSV_USA);
  console.log(`✅ Loaded ${rawPublicSchools.length} public schools from CSV.`);

  // 2b. Load Private schools CSV
  const CSV_PRIVATE_USA = path.join(__dirname, "data", "ecoles_privees_usa.csv");
  let rawPrivateSchools = [];
  if (fs.existsSync(CSV_PRIVATE_USA)) {
    console.log("📖 Loading ecoles_privees_usa.csv...");
    rawPrivateSchools = await readCSV(CSV_PRIVATE_USA);
    console.log(`✅ Loaded ${rawPrivateSchools.length} private schools from CSV.`);
  }

  // 3. Filter and parse unique States & Cities
  const regionsMap = new Map(); // stateCode -> full names
  const districtsMap = new Map(); // `${stateCode}_${city}` -> { stateCode, city }
  const validSchools = [];

  console.log("🔍 Parsing public schools...");
  for (const s of rawPublicSchools) {
    // Only import Elementary schools, Prekindergarten, 'other' (combinations), or primary-level combinations
    const level = (s["level"] || "").trim().toLowerCase();
    if (level !== "elementary" && level !== "prekindergarten" && level !== "primary" && level !== "other") {
      continue;
    }

    const schoolName = s["sch_name"];
    const city = (s["lcity"] || s["mcity"] || "").toUpperCase().trim();
    const stateCode = (s["st"] || s["mstate"] || "").toUpperCase().trim();
    const code = s["ncessch"] || s["schid"]; // NCES School ID

    if (!schoolName || !city || !stateCode || !code) {
      continue;
    }

    // Default to stateCode if full name isn't found
    const stateName = STATES[stateCode] || s["statename"] || stateCode;

    regionsMap.set(stateCode, { en: stateName, fr: stateName });
    districtsMap.set(`${stateCode}_${city}`, { stateCode, city });

    // In the US, most public schools are type 1 (Regular), we'll assume type 1 (Public)
    validSchools.push({
      code: code,
      name: schoolName,
      city: city,
      stateCode: stateCode,
      type: 1 // Public
    });
  }

  console.log("🔍 Parsing private schools...");
  for (const s of rawPrivateSchools) {
    const schoolName = s["name"];
    const city = (s["city"] || "").toUpperCase().trim();
    const stateCode = (s["state"] || "").toUpperCase().trim();
    const code = s["ppin"]; // Private School Universe Survey ID

    if (!schoolName || !city || !stateCode || !code) {
      continue;
    }

    const stateName = STATES[stateCode] || stateCode;
    regionsMap.set(stateCode, { en: stateName, fr: stateName });
    districtsMap.set(`${stateCode}_${city}`, { stateCode, city });

    validSchools.push({
      code: code,
      name: schoolName,
      city: city,
      stateCode: stateCode,
      type: 2 // Private
    });
  }

  console.log(`📊 Filtered down to ${validSchools.length} total schools (public + private).`);
  console.log(`📊 Collected ${regionsMap.size} states and ${districtsMap.size} cities.`);

  // 4. Seed Regions (States)
  console.log("📁 Seeding Regions (States)...");
  for (const [stateCode, stateNames] of regionsMap.entries()) {
    const exReg = await client.query(
      "SELECT id FROM regions WHERE country_code = 'US' AND code = $1",
      [stateCode]
    );
    if (exReg.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('US', $1, $2, $3, $2)",
        [stateCode, stateNames.en, stateNames.fr]
      );
    }
  }

  // Cache US regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'US'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Cities) in bulk
  console.log("📁 Seeding Districts (Cities)...");
  
  // Fetch existing US districts to skip duplicates
  const exDistRes = await client.query(`
    SELECT d.id, d.name_local as city_name, r.code as state_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'US'
  `);
  
  const existingDistKeys = new Set();
  for (const d of exDistRes.rows) {
    existingDistKeys.add(`${d.state_code}_${d.city_name}`);
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

    const key = `${d.stateCode}_${d.city}`;
    if (!existingDistKeys.has(key)) {
      let currentCounter = regionCounters.get(d.stateCode) || 1;
      const uniqueCode = `${d.stateCode}-${String(currentCounter).padStart(4, '0')}`;
      regionCounters.set(d.stateCode, currentCounter + 1);
      
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

  // Fetch and cache all US districts
  const distRes = await client.query(`
    SELECT d.id, d.name_local as city_name, r.code as state_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'US'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.state_code}_${d.city_name}`, d.id);
  }

  // 6. Clear existing US schools
  console.log("🗑️ Clearing existing US schools...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'US'
    )
  `);
  console.log("✅ Existing US schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding US elementary schools...");
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
      const districtKey = `${s.stateCode}_${s.city}`;
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
  console.log(`✅ Successfully imported US elementary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
