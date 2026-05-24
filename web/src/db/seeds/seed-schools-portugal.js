const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_PT = path.join(__dirname, "data", "ecoles_primaires_portugal.csv");

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🚀 FreeGeny — Seeding Portugal schools database...");
  console.log("🔌 Connected to database.");

  // 1. Ensure Portugal exists in countries table
  const countryRes = await client.query("SELECT id FROM countries WHERE code = 'PT'");
  if (countryRes.rows.length === 0) {
    await client.query(
      "INSERT INTO countries (code, name_local, name_fr, name_en) VALUES ('PT', 'Portugal', 'Portugal', 'Portugal')"
    );
    console.log("🇵🇹 Added Portugal to countries table.");
  } else {
    console.log("🇵🇹 Portugal already exists in countries table.");
  }

  // 2. Load CSV using comma separator (Portuguese CSV format)
  console.log("📖 Loading ecoles_primaires_portugal.csv...");
  const csvContent = fs.readFileSync(CSV_PT, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const schools = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma
    const values = line.split(',').map(v => v.trim());

    if (values.length !== headers.length) continue;

    const school = {};
    headers.forEach((header, index) => {
      school[header] = values[index];
    });

    // Filter for primary schools (escolas básicas)
    // Include all schools as they are primary schools in Portugal
    schools.push(school);
  }

  console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
  console.log(`📊 Total schools: ${schools.length}.`);

  // 3. Collect unique districts (distritos) and municipalities (municipios)
  const districtsMap = new Map(); // distrito -> { code, nameLocal, nameFr }
  const municipalitiesMap = new Map(); // municipio -> { districtCode, municipalityCode, municipalityName }
  const validSchools = [];

  for (const school of schools) {
    const districtName = school.distrito;
    const municipalityName = school.municipio;
    const schoolName = school.nome_escola;
    const schoolCode = school.codigo_escola_dgeec;

    // Skip invalid entries
    if (!districtName || !municipalityName || !schoolName || !schoolCode) continue;
    if (schoolCode === '*' || schoolCode === '-') continue;

    // Create district code from district name (take first 10 chars, uppercase, no spaces)
    const districtCode = districtName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '').substring(0, 10);
    
    // Create municipality code from municipality name (take first 10 chars, uppercase, no spaces)
    const municipalityCode = municipalityName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '').substring(0, 10);

    // Add to districts map
    if (!districtsMap.has(districtCode)) {
      districtsMap.set(districtCode, {
        code: districtCode,
        nameLocal: districtName,
        nameFr: districtName
      });
    }

    // Add to municipalities map
    if (!municipalitiesMap.has(municipalityCode)) {
      municipalitiesMap.set(municipalityCode, {
        districtCode: districtCode,
        municipalityCode: municipalityCode,
        municipalityName: municipalityName
      });
    }

    validSchools.push({
      code: schoolCode,
      name: schoolName,
      districtCode: municipalityCode,
      regionCode: districtCode,
      type: 1, // All primary schools are public in Portugal
      lat: null,
      lng: null
    });
  }

  console.log(`📊 Collected ${districtsMap.size} districts and ${municipalitiesMap.size} municipalities.`);

  // 4. Seed Districts (Regions)
  console.log("📁 Seeding Districts...");
  const districtsArray = Array.from(districtsMap.values());
  
  // Delete existing PT regions
  await client.query("DELETE FROM regions WHERE country_code = 'PT'");
  
  // Insert districts with ON CONFLICT DO NOTHING
  for (const district of districtsArray) {
    await client.query(
      "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'PT') ON CONFLICT (country_code, code) DO NOTHING",
      [district.code, district.nameLocal, district.nameFr]
    );
  }
  console.log("✅ Districts seeded and cached.");

  // 5. Seed Municipalities (Districts)
  console.log("📁 Seeding Municipalities...");
  const municipalitiesArray = Array.from(municipalitiesMap.values());
  
  // Get region IDs for mapping
  const regionIds = new Map();
  for (const district of districtsArray) {
    const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'PT'", [district.code]);
    if (res.rows.length > 0) {
      regionIds.set(district.code, res.rows[0].id);
    }
  }

  // Delete existing PT districts
  await client.query("DELETE FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'PT')");

  // Batch insert municipalities
  const batchSize = 100;
  for (let i = 0; i < municipalitiesArray.length; i += batchSize) {
    const batch = municipalitiesArray.slice(i, i + batchSize);
    const municipalityValues = batch.map(m => [
      m.municipalityCode,
      m.municipalityName,
      m.municipalityName,
      regionIds.get(m.districtCode)
    ]);

    for (const mv of municipalityValues) {
      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4) ON CONFLICT (code, region_id) DO NOTHING",
        mv
      );
    }
  }
  console.log(`✅ Seeding of ${municipalitiesArray.length} municipalities complete.`);

  // 6. Clear existing PT schools
  console.log("🗑️ Clearing existing PT schools...");
  await client.query(`
    DELETE FROM schools
    WHERE district_id IN (
      SELECT d.id FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'PT'
    )
  `);
  console.log("✅ Existing PT schools cleared.");

  // 7. Seed PT primary schools
  console.log("📥 Seeding PT primary schools...");
  let insertedCount = 0;
  const schoolBatchSize = 500;

  for (let i = 0; i < validSchools.length; i += schoolBatchSize) {
    const batch = validSchools.slice(i, i + schoolBatchSize);
    
    for (const school of batch) {
      // Get district ID
      const districtRes = await client.query(
        "SELECT id FROM districts WHERE code = $1 AND region_id = (SELECT id FROM regions WHERE code = $2 AND country_code = 'PT')",
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

  console.log("✅ Successfully imported Portugal primary schools!");
  console.log(`🎉 Total inserted: ${insertedCount} records`);
  console.log("🏁 Database seeding complete.");

  await client.end();
}

main().catch(err => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
