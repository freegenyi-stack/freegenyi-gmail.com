const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_FI = path.join(__dirname, "data", "ecoles_primaires_finlande.csv");

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🚀 FreeGeny — Seeding Finland schools database...");
  console.log("🔌 Connected to database.");

  // 1. Ensure Finland exists in countries table
  const countryRes = await client.query("SELECT id FROM countries WHERE code = 'FI'");
  if (countryRes.rows.length === 0) {
    await client.query(
      "INSERT INTO countries (code, name_local, name_fr, name_en) VALUES ('FI', 'Suomi', 'Finlande', 'Finland')"
    );
    console.log("🇫🇮 Added Finland to countries table.");
  } else {
    console.log("🇫🇮 Finland already exists in countries table.");
  }

  // 2. Load CSV using simple line-by-line parsing
  console.log("📖 Loading ecoles_primaires_finlande.csv...");
  const csvContent = fs.readFileSync(CSV_FI, 'utf-8');
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

    if (values.length !== headers.length) continue;

    const school = {};
    headers.forEach((header, index) => {
      school[header.trim()] = values[index];
    });

    // Filter for primary schools (type_code 11 = Peruskoulut)
    if (school.type_code === '11') {
      schools.push(school);
    }
  }

  console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
  console.log(`📊 Filtered down to ${schools.length} primary schools.`);

  // 3. Collect unique regions (maakunta) and districts (seutukunta, commune)
  const regionsMap = new Map(); // maakunta_code -> { code, nameLocal, nameFr }
  const districtsMap = new Map(); // seutukunta_code + "_" + commune_code -> { regionCode, districtCode, districtName }
  const validSchools = [];

  for (const school of schools) {
    const regionCode = school.maakunta_code;
    const regionNameFi = school.maakunta_fi;
    const regionNameSv = school.maakunta_sv;
    const seutukuntaCode = school.seutukunta_code;
    const communeCode = school.commune_code;
    const communeNameFi = school.commune_fi;
    const communeNameSv = school.commune_sv;

    if (regionCode && regionNameFi) {
      // Use Finnish as nameLocal, Swedish as nameFr for consistency
      regionsMap.set(regionCode, {
        code: regionCode,
        nameLocal: regionNameFi,
        nameFr: regionNameSv || regionNameFi
      });

      // Create district key: seutukunta_code + "_" + commune_code
      const districtKey = `${seutukuntaCode}_${communeCode}`;
      districtsMap.set(districtKey, {
        regionCode: regionCode,
        districtCode: communeCode,
        districtName: communeNameFi || communeCode
      });

      const lat = parseFloat(school.latitude);
      const lng = parseFloat(school.longitude);

      validSchools.push({
        code: school.id,
        name: school.nom_ecole,
        districtCode: communeCode,
        regionCode: regionCode,
        type: 1, // All primary schools are public in Finland
        lat: isNaN(lat) ? null : lat,
        lng: isNaN(lng) ? null : lng
      });
    }
  }

  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);

  // 4. Seed Regions
  console.log("📁 Seeding Regions...");
  const regionsArray = Array.from(regionsMap.values());
  
  // Delete existing FI regions
  await client.query("DELETE FROM regions WHERE country_code = 'FI'");
  
  // Insert regions
  for (const region of regionsArray) {
    await client.query(
      "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'FI')",
      [region.code, region.nameLocal, region.nameFr]
    );
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Municipalities)
  console.log("📁 Seeding Districts (Municipalities)...");
  const districtsArray = Array.from(districtsMap.values());
  
  // Get region IDs for mapping
  const regionIds = new Map();
  for (const region of regionsArray) {
    const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'FI'", [region.code]);
    if (res.rows.length > 0) {
      regionIds.set(region.code, res.rows[0].id);
    }
  }

  // Delete existing FI districts
  await client.query("DELETE FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'FI')");

  // Batch insert districts
  const batchSize = 100;
  for (let i = 0; i < districtsArray.length; i += batchSize) {
    const batch = districtsArray.slice(i, i + batchSize);
    const districtValues = batch.map(d => [
      d.districtCode,
      d.districtName,
      d.districtName, // Use same name for both local and fr
      regionIds.get(d.regionCode)
    ]);

    for (const dv of districtValues) {
      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4)",
        dv
      );
    }
  }
  console.log(`✅ Seeding of ${districtsArray.length} districts complete.`);

  // 6. Clear existing FI schools
  console.log("🗑️ Clearing existing FI schools...");
  await client.query(`
    DELETE FROM schools
    WHERE district_id IN (
      SELECT d.id FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'FI'
    )
  `);
  console.log("✅ Existing FI schools cleared.");

  // 7. Seed FI primary schools
  console.log("📥 Seeding FI primary schools...");
  let insertedCount = 0;
  const schoolBatchSize = 500;

  for (let i = 0; i < validSchools.length; i += schoolBatchSize) {
    const batch = validSchools.slice(i, i + schoolBatchSize);
    
    for (const school of batch) {
      // Get district ID
      const districtRes = await client.query(
        "SELECT id FROM districts WHERE code = $1 AND region_id = (SELECT id FROM regions WHERE code = $2 AND country_code = 'FI')",
        [school.districtCode, school.regionCode]
      );

      if (districtRes.rows.length > 0) {
        const districtId = districtRes.rows[0].id;
        
        await client.query(
          `INSERT INTO schools (code, name_local, name_fr, district_id, type, lat, lng) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [school.code, school.name, school.name, districtId, school.type, school.lat, school.lng]
        );
        insertedCount++;
      }
    }

    if ((i + schoolBatchSize) % 500 === 0 || i + schoolBatchSize >= validSchools.length) {
      console.log(`  📊 Progress: ${Math.min(i + schoolBatchSize, validSchools.length)}/${validSchools.length} schools imported...`);
    }
  }

  console.log(`✅ Successfully imported Finland primary schools!`);
  console.log(`🎉 Total inserted: ${insertedCount} records`);
  console.log("🏁 Database seeding complete.");

  await client.end();
}

main().catch(console.error);
