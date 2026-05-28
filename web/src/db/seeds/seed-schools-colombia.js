require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_CO = path.join(__dirname, "data", "ecoles_primaires_colombie.csv");

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function seedColombiaSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    let countryRes = await client.query("SELECT id FROM countries WHERE code = 'CO'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('CO', 'Colombie', 'Colombia', 'Colombia', '🇨🇴', 'es', true)`
      );
      console.log("🇨🇴 Colombia added to countries table.");
    } else {
      console.log("🇨🇴 Colombia already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_colombie.csv...");
    // Read with utf-8 and strip BOM
    const csvContent = fs.readFileSync(CSV_CO, "utf-8").replace(/^\uFEFF/, "");
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]).map((h) => h.replace(/"/g, "").trim());
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map();
    const districtsMap = new Map();
    const validSchoolsMap = new Map();
    
    let districtIndex = 1;
    let regionIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.replace(/"/g, "").trim());
      if (values.length < headers.length) continue;

      const departementName = values[idx("DEPARTAMENTO")];
      const muniName = values[idx("MUNICIPIO")];
      const schoolName = values[idx("NOMBRE_ESTABLECIMIENTO")];
      const schoolCodeRaw = values[idx("CODIGO_DANE")];
      const sector = values[idx("SECTOR")]; // OFICIAL = Public, NO OFICIAL = Private

      if (!departementName || !muniName || !schoolName || !schoolCodeRaw) continue;

      // Handle Regions (Departamentos)
      let regionCode;
      const rKey = departementName.toUpperCase();
      if (!regionsMap.has(rKey)) {
        regionCode = `CO_R${regionIndex++}`;
        regionsMap.set(rKey, { code: regionCode, name: departementName });
      } else {
        regionCode = regionsMap.get(rKey).code;
      }

      // Handle Districts (Municipios)
      const longKey = `${regionCode}_${muniName.toUpperCase()}`;
      let districtCode;
      if (!districtsMap.has(longKey)) {
        districtCode = `CO_D${districtIndex++}`;
        districtsMap.set(longKey, {
          regionCode,
          districtCode,
          districtName: muniName,
        });
      } else {
        districtCode = districtsMap.get(longKey).districtCode;
      }

      const isPrivate = (sector !== "OFICIAL");
      const schoolCode = schoolCodeRaw.slice(0, 20);
      
      validSchoolsMap.set(schoolCode, {
        code: schoolCode,
        nameLocal: schoolName,
        districtCode,
        type: isPrivate ? 2 : 1,
        lat: null, // Data doesn't seem to have lat/lng
        lng: null
      });
    }

    const validSchools = Array.from(validSchoolsMap.values());

    console.log(`✅ ${validSchools.length} primary schools loaded.`);
    console.log(`📊 ${regionsMap.size} departements, ${districtsMap.size} municipios.`);

    console.log("📁 Seeding regions...");
    await client.query("DELETE FROM regions WHERE country_code = 'CO'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'CO')`,
        [region.code, region.name, region.name, region.name]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'CO'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    console.log("📁 Seeding districts...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CO')
    `);
    for (const district of districtsMap.values()) {
      const regionId = regionIds.get(district.regionCode);
      if (!regionId) continue;
      await client.query(
        `INSERT INTO districts (code, name_local, name_fr, name_en, region_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [district.districtCode, district.districtName, district.districtName, district.districtName, regionId]
      );
    }

    const districtIds = new Map();
    const dbDistricts = await client.query(`
      SELECT d.id, d.code FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'CO'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    console.log("📥 Seeding schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CO')
      )
    `);

    const batchSize = 500;
    let inserted = 0;
    for (let i = 0; i < validSchools.length; i += batchSize) {
      const batch = validSchools.slice(i, i + batchSize);
      const params = [];
      const placeholders = [];

      let row = 0;
      for (const school of batch) {
        const districtId = districtIds.get(school.districtCode);
        if (!districtId) continue;
        const base = row * 8;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, 'dane.gov.co')`
        );
        params.push(school.code, school.nameLocal, school.nameLocal, school.nameLocal, districtId, school.type, school.lat, school.lng);
        row++;
      }

      if (placeholders.length > 0) {
        await client.query(
          `INSERT INTO schools (code, name_local, name_fr, name_en, district_id, type, lat, lng, source)
           VALUES ${placeholders.join(",")}`,
          params
        );
        inserted += placeholders.length;
      }

      if (i % 2000 === 0 || i + batchSize >= validSchools.length) {
        console.log(`  📊 ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length} processed (${inserted} inserted)...`);
      }
    }

    const countRes = await client.query(`
      SELECT COUNT(*)::int AS count FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CO')
      )
    `);
    console.log(`✅ Colombia seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Colombia schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedColombiaSchools();
