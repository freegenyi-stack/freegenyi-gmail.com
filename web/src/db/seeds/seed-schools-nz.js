const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_NZ = path.join(__dirname, "data", "ecoles_primaires_nouvelle_zelande.csv");

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
    if (!line.trim() || line.startsWith('"New Zealand Schools Directory"') || line.startsWith('"A list of New Zealand') || line.startsWith('^Email') || line.startsWith('*Principal') || line.startsWith('"Roll data') || line.startsWith('"Regional') || line.startsWith('"Territorial') || line.startsWith('"School') || line.startsWith('"Neighbourhood') || line === ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,') {
      // Skip preamble
      if (line.includes("School Number,School Name")) {
        const cols = parseCsvLine(line, ',');
        headers = cols.map(h => h.toLowerCase().replace(/['"]+/g, '').trim());
        isFirstLine = false;
      }
      continue;
    }
    
    if (isFirstLine && line.includes("School Number,School Name")) {
        const cols = parseCsvLine(line, ',');
        headers = cols.map(h => h.toLowerCase().replace(/['"]+/g, '').trim());
        isFirstLine = false;
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
  console.log("🚀 FreeGeny — Seeding New Zealand schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure NZ exists in 'countries'
  console.log("🇳🇿 Ensuring New Zealand exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('NZ', 'Nouvelle-Zélande', 'New Zealand', 'New Zealand', '🇳🇿', 'en,mi', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load schools CSV
  console.log("📖 Loading ecoles_primaires_nouvelle_zelande.csv...");
  const rawSchools = await readCSV(CSV_NZ);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Filter and parse unique Regions & Districts
  const regionsMap = new Map(); // regional_council -> name
  const districtsMap = new Map(); // region_district -> { region, district }
  const validSchools = [];

  console.log("🔍 Parsing regions and districts from schools list...");
  for (const s of rawSchools) {
    const schoolType = (s["school type"] || "").trim().toLowerCase();
    
    // Primary Filter: NZ primary schools are usually "Full Primary" or "Contributing"
    if (!schoolType.includes("primary") && !schoolType.includes("contributing") && !schoolType.includes("composite")) {
      continue; // Skip secondary and other non-primary types
    }
    // Specifically skip "Secondary (Year 7-15)" or similar, unless it's a composite
    if (schoolType.includes("secondary")) {
      continue;
    }

    const schoolName = s["school name"];
    const regionName = (s["regional council"] || "Unknown Region").trim();
    const districtName = (s["territorial authority"] || s["town / city"] || "Unknown District").trim();
    const code = s["school number"];

    if (!schoolName || !regionName || !code) {
      continue;
    }

    const provider = (s["authority"] || "").trim().toLowerCase();
    const isPrivate = provider.includes("private") || provider.includes("independent");
    const type = isPrivate ? 2 : 1;

    // Use a short code for region if needed, but we can just use the region name as code
    // Create a 2-4 char code for region
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

  console.log(`📊 Filtered down to ${validSchools.length} primary/composite schools.`);
  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);

  // 4. Seed Regions
  console.log("📁 Seeding Regions (Regional Councils)...");
  for (const [regionCode, regionName] of regionsMap.entries()) {
    const exReg = await client.query(
      "SELECT id FROM regions WHERE country_code = 'NZ' AND code = $1",
      [regionCode]
    );
    if (exReg.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('NZ', $1, $2, $3, $4)",
        [regionCode, regionName, regionName, regionName]
      );
    }
  }

  // Cache NZ regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'NZ'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Territorial Authorities)
  console.log("📁 Seeding Districts (Territorial Authorities)...");
  
  const exDistRes = await client.query(`
    SELECT d.id, d.name_local as dist_name, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'NZ'
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

  // Fetch and cache all NZ districts
  const distRes = await client.query(`
    SELECT d.id, d.name_local as dist_name, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'NZ'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.region_code}_${d.dist_name}`, d.id);
  }

  // 6. Clear existing NZ schools
  console.log("🗑️ Clearing existing NZ schools...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'NZ'
    )
  `);
  console.log("✅ Existing NZ schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding NZ primary schools...");
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
  console.log(`✅ Successfully imported New Zealand primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
