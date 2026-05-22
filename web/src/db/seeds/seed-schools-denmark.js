const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_DK = path.join(__dirname, "data", "ecoles_primaires_denemark.csv");

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
  // The Danish CSV file is encoded in UTF-16 LE
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf16le" }),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  let headers = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    // Check for the header line
    if (isFirstLine || (line.includes("INST_NR") && line.includes("INST_NAVN"))) {
      if (line.includes("INST_NR")) {
        const cols = parseCsvLine(line, ';');
        headers = cols.map(h => h.toLowerCase().replace(/['"]+/g, '').trim());
        isFirstLine = false;
      }
      continue;
    }

    if (isFirstLine) continue;

    const cols = parseCsvLine(line, ';');
    if (cols.length < headers.length) continue; // Skip incomplete lines
    
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
  console.log("🚀 FreeGeny — Seeding Denmark schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure Denmark exists in 'countries'
  console.log("🇩🇰 Ensuring Denmark exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('DK', 'Danemark', 'Denmark', 'Danmark', '🇩🇰', 'da', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load schools CSV
  console.log("📖 Loading ecoles_primaires_denemark.csv...");
  const rawSchools = await readCSV(CSV_DK);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Filter and parse unique Regions & Districts
  const regionsMap = new Map(); // regionCode -> regionName
  const districtsMap = new Map(); // regionCode_districtCode -> { regionCode, districtCode, districtName }
  const validSchools = [];

  console.log("🔍 Parsing regions and districts from schools list...");
  for (const s of rawSchools) {
    const schoolName = s["inst_navn"];
    const regionName = (s["region_navn"] || "Region Hovedstaden").trim();
    const regionCode = (s["bel_region"] || "1084").trim();
    const districtName = (s["adm_kommune_navn"] || "Københavns Kommune").trim();
    const districtCode = (s["kommune_nr"] || "101").trim();
    const code = s["inst_nr"];

    if (!schoolName || !regionCode || !districtCode || !code) {
      continue;
    }

    // Determine type: Kommunale is Public (1), Selvejende is Private (2)
    const ownerType = (s["ejerkode_navn"] || "").trim();
    const type = ownerType === "Kommunale" ? 1 : 2;

    // Parse coordinates if they exist
    let lat = null;
    let lng = null;
    if (s["geo_bredde_grad"]) {
      lat = parseFloat(s["geo_bredde_grad"].replace(",", "."));
    }
    if (s["geo_laengde_grad"]) {
      lng = parseFloat(s["geo_laengde_grad"].replace(",", "."));
    }

    regionsMap.set(regionCode, regionName);
    districtsMap.set(`${regionCode}_${districtCode}`, { regionCode, districtCode, districtName });

    validSchools.push({
      code: code,
      name: schoolName,
      districtCode: districtCode,
      regionCode: regionCode,
      type: type,
      lat: isNaN(lat) ? null : lat,
      lng: isNaN(lng) ? null : lng
    });
  }

  console.log(`📊 Filtered down to ${validSchools.length} primary schools.`);
  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);

  // 4. Seed Regions
  console.log("📁 Seeding Regions...");
  for (const [regionCode, regionName] of regionsMap.entries()) {
    const exReg = await client.query(
      "SELECT id FROM regions WHERE country_code = 'DK' AND code = $1",
      [regionCode]
    );
    if (exReg.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('DK', $1, $2, $3, $4)",
        [regionCode, regionName, regionName, regionName]
      );
    }
  }

  // Cache DK regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'DK'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Municipalities)
  console.log("📁 Seeding Districts (Municipalities)...");
  
  const exDistRes = await client.query(`
    SELECT d.id, d.code as dist_code, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'DK'
  `);
  
  const existingDistKeys = new Set();
  for (const d of exDistRes.rows) {
    existingDistKeys.add(`${d.region_code}_${d.dist_code}`);
  }

  const missingDistricts = [];
  for (const d of districtsMap.values()) {
    const regionId = regIdMap.get(d.regionCode);
    if (!regionId) continue;

    const key = `${d.regionCode}_${d.districtCode}`;
    if (!existingDistKeys.has(key)) {
      missingDistricts.push({
        regionId,
        code: d.districtCode,
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

  // Fetch and cache all DK districts
  const distRes = await client.query(`
    SELECT d.id, d.code as dist_code, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'DK'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.region_code}_${d.dist_code}`, d.id);
  }

  // 6. Clear existing DK schools
  console.log("🗑️ Clearing existing DK schools...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'DK'
    )
  `);
  console.log("✅ Existing DK schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding DK primary schools...");
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
      const districtKey = `${s.regionCode}_${s.districtCode}`;
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
      const lat = s.lat;
      const lng = s.lng;

      values.push(districtId, code, name, name, type, lat, lng);
      valuePlaceholders.push(`($${placeholderIndex}, $${placeholderIndex + 1}, $${placeholderIndex + 2}, $${placeholderIndex + 3}, $${placeholderIndex + 4}, $${placeholderIndex + 5}, $${placeholderIndex + 6})`);
      placeholderIndex += 7;
    }

    if (values.length > 0) {
      const query = `
        INSERT INTO schools (district_id, code, name_local, name_fr, type, lat, lng)
        VALUES ${valuePlaceholders.join(", ")}
        ON CONFLICT (district_id, code) DO UPDATE SET
          name_local = EXCLUDED.name_local,
          name_fr = EXCLUDED.name_fr,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          updated_at = NOW()
      `;

      await client.query(query, values);
      inserted += values.length / 7;
    }

    if (inserted % 500 === 0 || i + batchSize >= validSchools.length) {
      process.stdout.write(`\r  📊 Progress: ${inserted}/${validSchools.length} schools imported...`);
    }
  }

  console.log("\n");
  console.log(`✅ Successfully imported Denmark primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
