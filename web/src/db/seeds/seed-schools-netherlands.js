const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_NL = path.join(__dirname, "data", "ecoles_primaires_paysbas.csv");

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🚀 FreeGeny — Seeding Netherlands schools database...");
  console.log("🔌 Connected to database.");

  // 1. Ensure Netherlands exists in countries table
  const countryRes = await client.query("SELECT id FROM countries WHERE code = 'NL'");
  if (countryRes.rows.length === 0) {
    await client.query(
      "INSERT INTO countries (code, name_local, name_fr, name_en) VALUES ('NL', 'Nederland', 'Pays-Bas', 'Netherlands')"
    );
    console.log("🇳🇱 Added Netherlands to countries table.");
  } else {
    console.log("🇳🇱 Netherlands already exists in countries table.");
  }

  // 2. Load CSV using semicolon separator (Dutch CSV format)
  console.log("📖 Loading ecoles_primaires_paysbas.csv...");
  const csvContent = fs.readFileSync(CSV_NL, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(';').map(h => h.trim());
  const schools = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by semicolon
    const values = line.split(';').map(v => v.trim());

    if (values.length !== headers.length) continue;

    const school = {};
    headers.forEach((header, index) => {
      school[header] = values[index];
    });

    // Filter for primary schools (basisschoolen)
    // In Dutch data, we'll include all schools as they are primary schools
    schools.push(school);
  }

  console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
  console.log(`📊 Total schools: ${schools.length}.`);

  // 3. Collect unique provinces (provincies) and municipalities (gemeenten)
  const provincesMap = new Map(); // provincie -> { code, nameLocal, nameFr }
  const municipalitiesMap = new Map(); // gemeentenummer -> { provinceCode, municipalityCode, municipalityName }
  const validSchools = [];

  for (const school of schools) {
    const provinceName = school.PROVINCIE;
    const municipalityCode = school.GEMEENTENUMMER;
    const municipalityName = school.GEMEENTENAAM;
    const schoolName = school.VESTIGINGSNAAM;
    const postcode = school.POSTCODE;
    const city = school.PLAATSNAAM;

    if (provinceName && municipalityName) {
      // Create province code from name (first 3 letters uppercase)
      const provinceCode = provinceName.substring(0, 3).toUpperCase();
      provincesMap.set(provinceName, {
        code: provinceCode,
        nameLocal: provinceName,
        nameFr: provinceName
      });

      municipalitiesMap.set(municipalityCode, {
        provinceCode: provinceCode,
        municipalityCode: municipalityCode,
        municipalityName: municipalityName
      });

      // Try to get coordinates from postcode (Dutch postcodes are 4 digits + 2 letters)
      let lat = null;
      let lng = null;
      if (postcode && postcode.length >= 4) {
        // Simple approximation - in production, use a geocoding API
        // For now, we'll use null coordinates
      }

      validSchools.push({
        code: school.INSTELLINGSCODE + school.VESTIGINGSCODE,
        name: schoolName,
        districtCode: municipalityCode,
        regionCode: provinceCode,
        type: 1, // All primary schools are public in Netherlands
        lat: lat,
        lng: lng
      });
    }
  }

  console.log(`📊 Collected ${provincesMap.size} provinces and ${municipalitiesMap.size} municipalities.`);

  // 4. Seed Provinces (Regions)
  console.log("📁 Seeding Provinces...");
  const provincesArray = Array.from(provincesMap.values());
  
  // Delete existing NL regions
  await client.query("DELETE FROM regions WHERE country_code = 'NL'");
  
  // Insert provinces with ON CONFLICT DO NOTHING
  for (const province of provincesArray) {
    await client.query(
      "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'NL') ON CONFLICT (country_code, code) DO NOTHING",
      [province.code, province.nameLocal, province.nameFr]
    );
  }
  console.log("✅ Provinces seeded and cached.");

  // 5. Seed Municipalities (Districts)
  console.log("📁 Seeding Municipalities...");
  const municipalitiesArray = Array.from(municipalitiesMap.values());
  
  // Get region IDs for mapping
  const regionIds = new Map();
  for (const province of provincesArray) {
    const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'NL'", [province.code]);
    if (res.rows.length > 0) {
      regionIds.set(province.code, res.rows[0].id);
    }
  }

  // Delete existing NL districts
  await client.query("DELETE FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'NL')");

  // Batch insert municipalities
  const batchSize = 100;
  for (let i = 0; i < municipalitiesArray.length; i += batchSize) {
    const batch = municipalitiesArray.slice(i, i + batchSize);
    const municipalityValues = batch.map(m => [
      m.municipalityCode,
      m.municipalityName,
      m.municipalityName,
      regionIds.get(m.provinceCode)
    ]);

    for (const mv of municipalityValues) {
      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4) ON CONFLICT (code, region_id) DO NOTHING",
        mv
      );
    }
  }
  console.log(`✅ Seeding of ${municipalitiesArray.length} municipalities complete.`);

  // 6. Clear existing NL schools
  console.log("🗑️ Clearing existing NL schools...");
  await client.query(`
    DELETE FROM schools
    WHERE district_id IN (
      SELECT d.id FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'NL'
    )
  `);
  console.log("✅ Existing NL schools cleared.");

  // 7. Seed NL primary schools
  console.log("📥 Seeding NL primary schools...");
  let insertedCount = 0;
  const schoolBatchSize = 500;

  for (let i = 0; i < validSchools.length; i += schoolBatchSize) {
    const batch = validSchools.slice(i, i + schoolBatchSize);
    
    for (const school of batch) {
      // Get district ID
      const districtRes = await client.query(
        "SELECT id FROM districts WHERE code = $1 AND region_id = (SELECT id FROM regions WHERE code = $2 AND country_code = 'NL')",
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

  console.log(`✅ Successfully imported Netherlands primary schools!`);
  console.log(`🎉 Total inserted: ${insertedCount} records`);
  console.log("🏁 Database seeding complete.");

  await client.end();
}

main().catch(console.error);
