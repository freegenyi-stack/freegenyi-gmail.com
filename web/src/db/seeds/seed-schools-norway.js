const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_NO = path.join(__dirname, "data", "ecoles_primaires_norvege.csv");

// Norwegian county (Fylke) code to name mapping
const NORWEGIAN_COUNTIES = {
  // Old counties (before 2020 reform)
  "01": "Østfold",
  "02": "Akershus",
  "03": "Oslo",
  "04": "Hedmark",
  "05": "Oppland",
  "06": "Buskerud",
  "07": "Vestfold",
  "08": "Telemark",
  "09": "Aust-Agder",
  "10": "Vest-Agder",
  "11": "Rogaland",
  "12": "Hordaland",
  "13": "Bergen",
  "14": "Sogn og Fjordane",
  "15": "Møre og Romsdal",
  "16": "Sør-Trøndelag",
  "17": "Nord-Trøndelag",
  "18": "Nordland",
  "19": "Troms",
  "20": "Finnmark",
  "21": "Svalbard",
  // New counties (after 2020 reform)
  "30": "Viken",
  "31": "Vestfold og Telemark",
  "32": "Agder",
  "33": "Rogaland",
  "34": "Vestland",
  "38": "Innlandet",
  "39": "Møre og Romsdal",
  "40": "Trøndelag",
  "42": "Nordland",
  "46": "Troms og Finnmark",
  "50": "Trøndelag",
  "54": "Oslo",
  "55": "Viken",
  "56": "Vestland",
  // Special code for foreign schools
  "25": "Utlandet",
};

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🚀 FreeGeny — Seeding Norway schools database...");
  console.log("🔌 Connected to database.");

  // 1. Ensure Norway exists in countries table
  const countryRes = await client.query("SELECT id FROM countries WHERE code = 'NO'");
  if (countryRes.rows.length === 0) {
    await client.query(
      "INSERT INTO countries (code, name_local, name_fr, name_en) VALUES ('NO', 'Norge', 'Norvège', 'Norway')"
    );
    console.log("🇳🇴 Added Norway to countries table.");
  } else {
    console.log("🇳🇴 Norway already exists in countries table.");
  }

  // 2. Load CSV using simple line-by-line parsing
  console.log("📖 Loading ecoles_primaires_norvege.csv...");
  const csvContent = fs.readFileSync(CSV_NO, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const schools = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing - handle quoted fields
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const school = {};
    for (let k = 0; k < headers.length && k < values.length; k++) {
      school[headers[k].trim()] = values[k];
    }
    schools.push(school);
  }

  console.log(`✅ Loaded ${schools.length} rows from CSV.`);

  // 3. Parse regions and districts from schools list
  const regionsMap = new Map();
  const districtsMap = new Map();
  const validSchools = [];

  for (const s of schools) {
    // Only include primary schools (ErGrunnSkole = True)
    if (s["ErGrunnSkole"] !== "True") continue;

    const schoolName = s["Navn"] || s["FulltNavn"] || "";
    const schoolCode = s["NSRId"] || "";
    if (!schoolName || !schoolCode) continue;

    const fylkeNr = s["FylkeNr"] || "";
    const kommuneNr = s["KommuneNr"] || "";
    const kommuneNavn = s["KommuneNavn"] || "";

    if (!fylkeNr || !kommuneNr) continue;

    // Determine school type: 1 = Public, 2 = Private
    const isPublic = s["ErOffentligSkole"] === "True";
    const isPrivate = s["ErPrivatSkole"] === "True";
    const type = isPublic ? 1 : isPrivate ? 2 : 1;

    // Use fylke number as region (fylke) and kommune as district (kommun)
    const fylkeName = NORWEGIAN_COUNTIES[fylkeNr];
    // Only add region if it's a valid fylke code
    if (fylkeName) {
      regionsMap.set(fylkeNr, fylkeName);
      districtsMap.set(`${fylkeNr}_${kommuneNr}`, { regionCode: fylkeNr, districtCode: kommuneNr, districtName: kommuneNavn });

      validSchools.push({
        code: schoolCode,
        name: schoolName,
        districtCode: kommuneNr,
        regionCode: fylkeNr,
        type: type,
        lat: null, // No GPS data in this CSV
        lng: null
      });
    }
  }

  console.log(`📊 Filtered down to ${validSchools.length} primary schools.`);
  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);

  // 4. Seed Regions
  console.log("📁 Seeding Regions...");
  // Clear all existing NO regions to avoid duplicates
  await client.query("DELETE FROM regions WHERE country_code = 'NO'");
  for (const [regionCode, regionName] of regionsMap.entries()) {
    await client.query(
      "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('NO', $1, $2, $3, $4)",
      [regionCode, regionName, regionName, regionName]
    );
  }

  // Cache NO regions
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'NO'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Municipalities)
  console.log("📁 Seeding Districts (Municipalities)...");
  // Clear all existing NO districts to avoid orphaned references
  await client.query(`
    DELETE FROM districts 
    WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'NO')
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
      for (const d of batch) {
        values.push(d.regionId, d.code, d.distName, d.distName, d.distName);
        placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
        idx += 5;
      }
      await client.query(
        `INSERT INTO districts (region_id, code, name_local, name_fr, name_en) VALUES ${placeholders.join(', ')}`,
        values
      );
    }
    console.log(`✅ Seeding of ${missingDistricts.length} districts complete.`);
  } else {
    console.log("✅ All districts are already up-to-date.");
  }

  // Cache NO districts
  const distRes = await client.query(`
    SELECT d.id, d.code as dist_code, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'NO'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.region_code}_${d.dist_code}`, d.id);
  }

  // 6. Clear existing NO schools
  console.log("🗑️ Clearing existing NO schools...");
  await client.query(`
    DELETE FROM schools
    WHERE district_id IN (
      SELECT d.id FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'NO'
    )
  `);
  console.log("✅ Existing NO schools cleared.");

  // 7. Seed Schools
  console.log("📥 Seeding NO primary schools...");
  const batchSize = 100;
  for (let i = 0; i < validSchools.length; i += batchSize) {
    const batch = validSchools.slice(i, i + batchSize);
    const values = [];
    const placeholders = [];
    let placeholderIndex = 1;

    for (const s of batch) {
      const districtId = distIdMap.get(`${s.regionCode}_${s.districtCode}`);
      if (!districtId) continue;

      const name = s.name;
      values.push(districtId, s.code, name, name, s.type, s.lat, s.lng);
      placeholders.push(`($${placeholderIndex}, $${placeholderIndex + 1}, $${placeholderIndex + 2}, $${placeholderIndex + 3}, $${placeholderIndex + 4}, $${placeholderIndex + 5}, $${placeholderIndex + 6})`);
      placeholderIndex += 7;
    }

    if (placeholders.length > 0) {
      await client.query(
        `INSERT INTO schools (district_id, code, name_local, name_fr, type, lat, lng) VALUES ${placeholders.join(', ')}`,
        values
      );
    }

    if ((i + batchSize) % 500 === 0 || i + batchSize >= validSchools.length) {
      console.log(`  📊 Progress: ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length} schools imported...`);
    }
  }

  console.log(`✅ Successfully imported Norway primary schools!`);
  console.log(`🎉 Total inserted: ${validSchools.length} records`);
  console.log("🏁 Database seeding complete.");

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
