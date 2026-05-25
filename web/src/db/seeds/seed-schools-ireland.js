const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_IE = path.join(__dirname, "data", "ecoles_primaires_irlande.csv");

function parseCsvLine(line, delimiter = ',') {
  // Using tab delimiter since python script output tab separated values if we didn't specify comma?
  // Wait, my python script used `csv.writer(fout)`. The default is comma delimiter!
  // Let me just parse it normally with comma.
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
    
    // Check for the header line
    if (isFirstLine || line.includes("Roll Number") && line.includes("Official Name")) {
      if (line.includes("Roll Number")) {
        const cols = parseCsvLine(line, ',');
        headers = cols.map(h => h.toLowerCase().replace(/['"]+/g, '').trim());
        isFirstLine = false;
      }
      continue;
    }

    if (isFirstLine) continue;

    const cols = parseCsvLine(line, ',');
    if (cols.length < headers.length) continue; // Skip incomplete lines or separators
    
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
  console.log("🚀 FreeGeny — Seeding Ireland schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure Ireland exists in 'countries'
  console.log("🇮🇪 Ensuring Ireland exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('IE', 'Irlande', 'Ireland', 'Éire', '🇮🇪', 'en,ga', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load schools CSV
  console.log("📖 Loading ecoles_primaires_irlande.csv...");
  const rawSchools = await readCSV(CSV_IE);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Filter and parse unique Regions & Districts
  const regionsMap = new Map(); // county -> name
  const districtsMap = new Map(); // county_district -> { region, district }
  const validSchools = [];

  console.log("🔍 Parsing regions and districts from schools list...");
  for (const s of rawSchools) {
    const schoolName = s["official name"];
    const regionName = (s["county description"] || "Unknown County").trim();
    const districtName = (s["local authority description"] || "Unknown Authority").trim();
    const code = s["roll number"];

    if (!schoolName || !regionName || !code) {
      continue;
    }

    // All schools in this list are state-aided national schools
    const type = 1;

    // Use the county name directly as the region code (capitalized, max 4 chars for consistency or just the name)
    const regionCode = regionName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');

    regionsMap.set(regionCode, regionName);
    districtsMap.set(`${regionCode}_${districtName}`, { regionCode, districtName });

    validSchools.push({
      code: code,
      name: schoolName,
      districtName: districtName,
      regionCode: regionCode,
      type: type
    });
  }

  console.log(`📊 Filtered down to ${validSchools.length} primary schools.`);
  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);

  // 4. Seed Regions
  console.log("📁 Seeding Regions (Counties)...");
  for (const [regionCode, regionName] of regionsMap.entries()) {
    const exReg = await client.query(
      "SELECT id FROM regions WHERE country_code = 'IE' AND code = $1",
      [regionCode]
    );
    if (exReg.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('IE', $1, $2, $3, $4)",
        [regionCode, regionName, regionName, regionName]
      );
    }
  }

  // Cache IE regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'IE'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Local Authorities)
  console.log("📁 Seeding Districts (Local Authorities)...");
  
  const exDistRes = await client.query(`
    SELECT d.id, d.name_local as dist_name, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'IE'
  `);
  
  const existingDistKeys = new Set();
  for (const d of exDistRes.rows) {
    existingDistKeys.add(`${d.region_code}_${d.dist_name}`);
  }

  const regionCounters = new Map();
  for (const regionCode of regionsMap.keys()) {
    const regionId = regIdMap.get(regionCode);
    if (!regionId) continue;
    const maxCodeRes = await client.query(
      "SELECT code FROM districts WHERE region_id = $1 ORDER BY code DESC LIMIT 1",
      [regionId]
    );
    if (maxCodeRes.rows.length > 0) {
      const lastCode = maxCodeRes.rows[0].code;
      const parts = lastCode.split('-');
      const numPart = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      regionCounters.set(regionCode, isNaN(numPart) ? 1 : numPart + 1);
    } else {
      regionCounters.set(regionCode, 1);
    }
  }

  const missingDistricts = [];
  for (const d of districtsMap.values()) {
    const regionId = regIdMap.get(d.regionCode);
    if (!regionId) continue;

    const key = `${d.regionCode}_${d.districtName}`;
    if (!existingDistKeys.has(key)) {
      let currentCounter = regionCounters.get(d.regionCode) || 1;
      const uniqueCode = `${d.regionCode}-${String(currentCounter).padStart(4, '0')}`;
      regionCounters.set(d.regionCode, currentCounter + 1);
      
      missingDistricts.push({
        regionId,
        code: uniqueCode,
        distName: d.districtName
      });
    }
  }

  if (missingDistricts.length > 0) {
    console.log(`📥 Batch inserting ${missingDistricts.length} missing districts...`);
    const dBatchSize = 100;
    for (let i = 0; i < missingDistricts.length; i += dBatchSize) {
      const batch = missingDistricts.slice(i, i + dBatchSize);
      const values = [];
      const placeholders = [];
      let idx = 1;
      for (const item of batch) {
        values.push(item.regionId, item.code, item.distName);
        placeholders.push(`($${idx}, $${idx+1}, $${idx+2}, $${idx+2}, $${idx+2})`);
        idx += 3;
      }
      
      await client.query(`
        INSERT INTO districts (region_id, code, name_local, name_fr, name_en)
        VALUES ${placeholders.join(", ")}
      `, values);
    }
    console.log(`✅ Seeding of ${missingDistricts.length} districts complete.`);
  } else {
    console.log("✅ All districts are already up-to-date.");
  }

  // Fetch and cache all IE districts
  const distRes = await client.query(`
    SELECT d.id, d.name_local as dist_name, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'IE'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.region_code}_${d.dist_name}`, d.id);
  }

  // 6. Clear existing IE schools
  console.log("🗑️ Clearing existing IE schools...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'IE'
    )
  `);
  console.log("✅ Existing IE schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding IE primary schools...");
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
      const districtKey = `${s.regionCode}_${s.districtName}`;
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
  console.log(`✅ Successfully imported Ireland primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
