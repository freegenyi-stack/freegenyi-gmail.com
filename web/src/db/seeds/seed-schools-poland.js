require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const CSV_PL = path.join(__dirname, "data", "ecoles_primaires_pologne.csv");

async function seedPolandSchools() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    // Check if Poland exists in countries table
    const countryRes = await client.query("SELECT id, code FROM countries WHERE code = 'PL'");
    if (countryRes.rows.length === 0) {
      console.error("❌ Poland not found in countries table. Please add it first.");
      return;
    }
    console.log("🇵🇱 Poland already exists in countries table.");

    // Load CSV
    console.log("📖 Loading ecoles_primaires_pologne.csv...");
    const csvContent = fs.readFileSync(CSV_PL, 'utf-8');
    const lines = csvContent.split('\n');
    
    // Parse CSV (semicolon separator)
    const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''));
    const schools = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV line (semicolon separator)
      const values = line.split(';').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length !== headers.length) continue;

      const school = {};
      headers.forEach((header, index) => {
        school[header] = values[index];
      });

      // Filter: only include "Szkoła podstawowa" (primary schools)
      if (school.Typ !== "Szkoła podstawowa") continue;

      // Filter: require valid RSPO number (school code)
      const schoolCode = school["Numer RSPO"];
      if (!schoolCode) continue;
      if (schoolCode === '*' || schoolCode === '-') continue;
      if (isNaN(parseInt(schoolCode))) continue;

      schools.push(school);
    }

    console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
    console.log(`📊 Total schools: ${schools.length}.`);

    // 3. Collect unique voivodeships (województwa) and districts (powiaty)
    const districtsMap = new Map(); // voivodeship -> { code, nameLocal, nameFr }
    const municipalitiesMap = new Map(); // powiat -> { districtCode, municipalityCode, municipalityName }
    const validSchools = [];

    // Define the 16 voivodeships of Poland with codes <= 10 chars
    const polandVoivodeships = [
      { code: "DOLNOSLASK", name: "Dolnośląskie", nameFr: "Basse-Silésie" },
      { code: "KUJAWSPOMO", name: "Kujawsko-pomorskie", nameFr: "Couïavie-Poméranie" },
      { code: "LUBELSKIE", name: "Lubelskie", nameFr: "Lublin" },
      { code: "LUBUSKIE", name: "Lubuskie", nameFr: "Lubusz" },
      { code: "LODZKIE", name: "Łódzkie", nameFr: "Łódź" },
      { code: "MALOPOLSK", name: "Małopolskie", nameFr: "Petite-Pologne" },
      { code: "MAZOWIECK", name: "Mazowieckie", nameFr: "Mazovie" },
      { code: "OPOLSKIE", name: "Opolskie", nameFr: "Opole" },
      { code: "PODKARPACK", name: "Podkarpackie", nameFr: "Bas-Carpathes" },
      { code: "PODLASKIE", name: "Podlaskie", nameFr: "Podlachie" },
      { code: "POMORSKIE", name: "Pomorskie", nameFr: "Poméranie" },
      { code: "SLASKIE", name: "Śląskie", nameFr: "Silésie" },
      { code: "SWIETOKRZ", name: "Świętokrzyskie", nameFr: "Sainte-Croix" },
      { code: "WARMIINSK", name: "Warmińsko-mazurskie", nameFr: "Varmie-Mazurie" },
      { code: "WIELKOPOL", name: "Wielkopolskie", nameFr: "Grande-Pologne" },
      { code: "ZACHODNIO", name: "Zachodniopomorskie", nameFr: "Poméranie occidentale" }
    ];

    // Add all voivodeships to the map
    for (const voivodeship of polandVoivodeships) {
      districtsMap.set(voivodeship.code, {
        code: voivodeship.code,
        nameLocal: voivodeship.name,
        nameFr: voivodeship.nameFr
      });
    }

    // Map voivodeship names to codes (CSV uses uppercase without accents)
    const voivodeshipNameToCode = {
      "DOLNOŚLĄSKIE": "DOLNOSLASK",
      "DOLNOSLASKIE": "DOLNOSLASK",
      "KUJAWSKO-POMORSKIE": "KUJAWSPOMO",
      "KUJAWSKOPOMORSKIE": "KUJAWSPOMO",
      "LUBELSKIE": "LUBELSKIE",
      "LUBUSKIE": "LUBUSKIE",
      "ŁÓDZKIE": "LODZKIE",
      "LODZKIE": "LODZKIE",
      "MAŁOPOLSKIE": "MALOPOLSK",
      "MALOPOLSKIE": "MALOPOLSK",
      "MAZOWIECKIE": "MAZOWIECK",
      "OPOLSKIE": "OPOLSKIE",
      "PODKARPACKIE": "PODKARPACK",
      "PODLASKIE": "PODLASKIE",
      "POMORSKIE": "POMORSKIE",
      "ŚLĄSKIE": "SLASKIE",
      "SLASKIE": "SLASKIE",
      "ŚWIĘTOKRZYSKIE": "SWIETOKRZ",
      "SWIETOKRZYSKIE": "SWIETOKRZ",
      "WARMIŃSKO-MAZURSKIE": "WARMIINSK",
      "WARMIINSKOMAZURSKIE": "WARMIINSK",
      "WIELKOPOLSKIE": "WIELKOPOL",
      "ZACHODNIOPOMORSKIE": "ZACHODNIO"
    };

    for (const school of schools) {
      const voivodeshipName = school.Województwo;
      const districtName = school.Powiat;
      const municipalityName = school.Gmina;
      const schoolName = school.Nazwa;
      const schoolCode = school["Numer RSPO"];

      // Skip invalid entries
      if (!voivodeshipName || !schoolName) continue;

      // Get voivodeship code
      const voivodeshipCode = voivodeshipNameToCode[voivodeshipName.toUpperCase()];
      if (!voivodeshipCode) {
        console.warn(`⚠️  No voivodeship code found for: ${voivodeshipName}`);
        continue;
      }

      // Create district code from district name (take first 10 chars, uppercase, no spaces)
      const districtCode = districtName ? districtName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '').substring(0, 10) : "NO_DISTRICT";
      
      // Create municipality code from municipality name (take first 10 chars, uppercase, no spaces)
      const municipalityCode = municipalityName ? municipalityName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '').substring(0, 10) : "NO_MUNICIPALITY";

      // Add to municipalities map
      if (!municipalitiesMap.has(districtCode)) {
        municipalitiesMap.set(districtCode, {
          districtCode: voivodeshipCode,
          municipalityCode: districtCode,
          municipalityName: districtName || "Bez powiatu"
        });
      }

      // Determine school type (public vs private)
      const publicStatus = school["Publiczność status"];
      const type = publicStatus === "publiczna" ? 1 : 2; // 1 = public, 2 = private

      validSchools.push({
        code: schoolCode,
        name: schoolName,
        districtCode: districtCode,
        regionCode: voivodeshipCode,
        type: type,
        lat: null,
        lng: null
      });
    }

    console.log(`📊 Collected ${districtsMap.size} voivodeships and ${municipalitiesMap.size} districts.`);

    // 4. Seed Voivodeships (Regions)
    console.log("📁 Seeding Voivodeships...");
    const districtsArray = Array.from(districtsMap.values());
    
    // Delete existing PL regions
    await client.query("DELETE FROM regions WHERE country_code = 'PL'");
    
    // Insert voivodeships
    for (const district of districtsArray) {
      await client.query(
        "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'PL')",
        [district.code, district.nameLocal, district.nameFr]
      );
    }
    console.log("✅ Voivodeships seeded and cached.");

    // 5. Seed Districts (Municipalities)
    console.log("📁 Seeding Districts...");
    const municipalitiesArray = Array.from(municipalitiesMap.values());
    
    // Get region IDs for mapping
    const regionIds = new Map();
    for (const district of districtsArray) {
      const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'PL'", [district.code]);
      if (res.rows.length > 0) {
        regionIds.set(district.code, res.rows[0].id);
      }
    }

    // Delete existing PL districts
    await client.query(`
      DELETE FROM districts 
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'PL')
    `);

    // Insert districts
    for (const municipality of municipalitiesArray) {
      const regionId = regionIds.get(municipality.districtCode);
      if (!regionId) {
        console.warn(`⚠️  No region ID found for district code: ${municipality.districtCode}`);
        continue;
      }

      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4)",
        [municipality.municipalityCode, municipality.municipalityName, municipality.municipalityName, regionId]
      );
    }
    console.log("✅ Seeding of districts complete.");

    // 6. Seed Schools
    console.log("🗑️ Clearing existing PL schools...");
    await client.query(`
      DELETE FROM schools 
      WHERE district_id IN (SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'PL'))
    `);
    console.log("✅ Existing PL schools cleared.");

    console.log("📥 Seeding PL primary schools...");
    
    // Get district IDs for mapping
    const districtIds = new Map();
    for (const municipality of municipalitiesArray) {
      const res = await client.query(
        "SELECT id FROM districts WHERE code = $1",
        [municipality.municipalityCode]
      );
      if (res.rows.length > 0) {
        districtIds.set(municipality.municipalityCode, res.rows[0].id);
      }
    }

    // Batch insert schools
    const batchSize = 500;
    for (let i = 0; i < validSchools.length; i += batchSize) {
      const batch = validSchools.slice(i, i + batchSize);
      const values = batch.map(school => {
        const districtId = districtIds.get(school.districtCode);
        if (!districtId) return null;
        return `('${school.code}', '${school.name.replace(/'/g, "''")}', '${school.name.replace(/'/g, "''")}', ${districtId}, ${school.type}, ${school.lat ? school.lat : 'NULL'}, ${school.lng ? school.lng : 'NULL'})`;
      }).filter(v => v !== null);

      if (values.length > 0) {
        await client.query(`
          INSERT INTO schools (code, name_local, name_fr, district_id, type, lat, lng)
          VALUES ${values.join(',')}
        `);
      }

      if ((i + batchSize) % 500 === 0) {
        console.log(`  📊 Progress: ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length} schools imported...`);
      }
    }

    console.log("✅ Successfully imported Poland primary schools!");
    const insertedRes = await client.query("SELECT COUNT(*) as count FROM schools WHERE district_id IN (SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'PL'))");
    console.log(`🎉 Total inserted: ${insertedRes.rows[0].count} records`);

  } catch (error) {
    console.error("❌ Error seeding Poland schools:", error);
    throw error;
  } finally {
    await client.end();
    console.log("🏁 Database seeding complete.");
  }
}

seedPolandSchools().catch(console.error);
