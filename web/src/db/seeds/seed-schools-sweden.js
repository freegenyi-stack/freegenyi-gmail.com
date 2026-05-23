const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_SE = path.join(__dirname, "data", "ecoles_primaires_suede.csv");

// Swedish county (Län) code to name mapping (based on first 2 digits of municipality code)
const SWEDISH_COUNTIES = {
  "01": "Stockholm",
  "02": "Uppsala",
  "03": "Södermanland",
  "04": "Östergötland",
  "05": "Jönköping",
  "06": "Kronoberg",
  "07": "Kalmar",
  "08": "Gotland",
  "09": "Blekinge",
  "10": "Skåne",
  "11": "Halland",
  "12": "Västra Götaland",
  "13": "Värmland",
  "14": "Örebro",
  "15": "Västmanland",
  "16": "Dalarna",
  "17": "Gävleborg",
  "18": "Västernorrland",
  "19": "Jämtland",
  "20": "Västerbotten",
  "21": "Norrbotten",
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
  // Swedish CSV file is UTF-8 encoded
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  let headers = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    // Check for the header line
    if (isFirstLine || (line.includes("Code") && line.includes("Nom"))) {
      if (line.includes("Code")) {
        const cols = parseCsvLine(line, ',');
        headers = cols.map(h => h.toLowerCase().replace(/['"]+/g, '').trim());
        isFirstLine = false;
      }
      continue;
    }

    if (isFirstLine) continue;

    const cols = parseCsvLine(line, ',');
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
  console.log("🚀 FreeGeny — Seeding Sweden schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure Sweden exists in 'countries'
  console.log("🇸🇪 Ensuring Sweden exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('SE', 'Suède', 'Sweden', 'Sverige', '🇸🇪', 'sv', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load schools CSV
  console.log("📖 Loading ecoles_primaires_suede.csv...");
  const rawSchools = await readCSV(CSV_SE);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Filter and parse unique Regions & Districts
  const regionsMap = new Map(); // regionCode -> regionName
  const districtsMap = new Map(); // regionCode_districtCode -> { regionCode, districtCode, districtName }
  const validSchools = [];

  console.log("🔍 Parsing regions and districts from schools list...");
  for (const s of rawSchools) {
    const schoolName = s["nom"] || "";
    const regionCode = (s["code commune"] || "").trim();
    const districtName = (s["ville"] || "").trim();
    const districtCode = regionCode; // Use commune code as district code
    const code = s["code"] || "";
    const types = s["types"] || "";
    const statut = s["statut"] || "";

    // Filter: Only primary schools (GR) and adapted primary schools (GRAN)
    // Exclude: Gymnasium (GY), Adult education (VUX, GYAN)
    if (!types.includes("GR") || types.includes("GY") || types.includes("VUX") || types.includes("GYAN")) {
      continue;
    }

    // Only active schools
    if (statut !== "AKTIV") {
      continue;
    }

    if (!schoolName || !regionCode || !districtCode || !code) {
      continue;
    }

    // Determine type: Public schools (municipal) vs Private schools (independent)
    // In Sweden, independent schools are "fristående skolor"
    const isIndependent = schoolName.toLowerCase().includes("fristående") || 
                         schoolName.toLowerCase().includes("montessori") ||
                         schoolName.toLowerCase().includes("waldorf") ||
                         schoolName.toLowerCase().includes("steiner");
    const type = isIndependent ? 2 : 1;

    // Parse coordinates if they exist
    let lat = null;
    let lng = null;
    if (s["latitude"]) {
      lat = parseFloat(s["latitude"].replace(",", "."));
    }
    if (s["longitude"]) {
      lng = parseFloat(s["longitude"].replace(",", "."));
    }

    // Use commune code as region (län) and city as district (kommun)
    // In Sweden: Län (county) = Region, Kommun (municipality) = District
    // Use first 2 digits of commune code to get county name and as region code
    const countyCode = regionCode.substring(0, 2);
    const regionName = SWEDISH_COUNTIES[countyCode]; // Use mapping to get county name
    // Only add region and school if it's a valid county code (ignore invalid codes like 22, 23, 24, 25)
    if (regionName) {
      regionsMap.set(countyCode, regionName); // Use countyCode (2 digits) as key to avoid duplicates
      districtsMap.set(`${countyCode}_${districtCode}`, { regionCode: countyCode, districtCode, districtName });

      validSchools.push({
        code: code,
        name: schoolName,
        districtCode: districtCode,
        regionCode: countyCode, // Use countyCode (2 digits) instead of full commune code
        type: type,
        lat: isNaN(lat) ? null : lat,
        lng: isNaN(lng) ? null : lng
      });
    }
  }

  console.log(`📊 Filtered down to ${validSchools.length} primary schools.`);
  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);

  // Add missing counties that have no schools in the dataset
  const missingCounties = ["02", "11", "15", "16"]; // Uppsala, Halland, Västmanland, Dalarna
  for (const code of missingCounties) {
    if (!regionsMap.has(code) && SWEDISH_COUNTIES[code]) {
      regionsMap.set(code, SWEDISH_COUNTIES[code]);
    }
  }
  console.log(`📊 Total regions after adding missing counties: ${regionsMap.size}`);

  // 4. Seed Regions
  console.log("📁 Seeding Regions...");
  // Clear all existing SE regions to avoid duplicates
  await client.query("DELETE FROM regions WHERE country_code = 'SE'");
  for (const [regionCode, regionName] of regionsMap.entries()) {
    await client.query(
      "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('SE', $1, $2, $3, $4)",
      [regionCode, regionName, regionName, regionName]
    );
  }

  // Cache SE regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'SE'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Municipalities)
  console.log("📁 Seeding Districts (Municipalities)...");
  // Clear all existing SE districts to avoid orphaned references
  await client.query(`
    DELETE FROM districts 
    WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'SE')
  `);

  const missingDistricts = [];
  for (const d of districtsMap.values()) {
    const regionId = regIdMap.get(d.regionCode);
    if (!regionId) continue;

    missingDistricts.push({
      regionId,
      code: d.districtCode,
      distName: d.districtName
    });
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

  // Fetch and cache all SE districts
  const distRes = await client.query(`
    SELECT d.id, d.code as dist_code, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'SE'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.region_code}_${d.dist_code}`, d.id);
  }

  // 6. Clear existing SE schools
  console.log("🗑️ Clearing existing SE schools...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'SE'
    )
  `);
  console.log("✅ Existing SE schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding SE primary schools...");
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
  console.log(`✅ Successfully imported Sweden primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
