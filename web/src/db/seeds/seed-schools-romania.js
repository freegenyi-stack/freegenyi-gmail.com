require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_RO = path.join(__dirname, "data", "ecoles_primaires_roumanie.csv");

function parseCsvLine(line) {
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

async function seedRomaniaSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    let countryRes = await client.query("SELECT id FROM countries WHERE code = 'RO'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('RO', 'Roumanie', 'Romania', 'România', '🇷🇴', 'ro', true)`
      );
      console.log("🇷🇴 Romania added to countries table.");
    } else {
      console.log("🇷🇴 Romania already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_roumanie.csv...");
    // Read with utf-8 and strip BOM
    const csvContent = fs.readFileSync(CSV_RO, "utf-8").replace(/^\uFEFF/, "");
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]).map((h) => h.replace(/"/g, "").trim());
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map();
    const districtsMap = new Map();
    const validSchoolsMap = new Map();

    let districtIndex = 1;
    let regionIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.trim());
      if (values.length < headers.length) continue;

      const judet = values[idx("Judet PJ")];
      const localitate = values[idx("Localitate PJ")];
      const schoolName = values[idx("Denumire lunga unitate")] || values[idx("Denumire scurta unitate")];
      const schoolCode = values[idx("Cod SIIIR unitate")];
      const proprietate = values[idx("Forma proprietate")];

      if (!judet || !localitate || !schoolName || !schoolCode) continue;

      // Handle Regions (Județ)
      let regionCode;
      const rKey = judet.toUpperCase();
      if (!regionsMap.has(rKey)) {
        regionCode = `RO_R${regionIndex++}`;
        regionsMap.set(rKey, { code: regionCode, name: judet });
      } else {
        regionCode = regionsMap.get(rKey).code;
      }

      // Handle Districts (Localitate)
      const districtName = localitate;
      const longKey = `${regionCode}_${districtName.toUpperCase()}`;
      let districtCode;
      if (!districtsMap.has(longKey)) {
        districtCode = `RO_D${districtIndex++}`;
        districtsMap.set(longKey, { regionCode, districtCode, districtName });
      } else {
        districtCode = districtsMap.get(longKey).districtCode;
      }

      const isPrivate = proprietate && proprietate.toLowerCase().includes("privat");
      const code = schoolCode.slice(0, 20);

      validSchoolsMap.set(code, {
        code,
        nameLocal: schoolName,
        districtCode,
        type: isPrivate ? 2 : 1,
        lat: null, // Data doesn't seem to have lat/lng
        lng: null,
      });
    }

    const validSchools = Array.from(validSchoolsMap.values());
    console.log(`✅ ${validSchools.length} primary schools loaded.`);
    console.log(`📊 ${regionsMap.size} județe, ${districtsMap.size} localități.`);

    console.log("📁 Seeding regions...");
    await client.query("DELETE FROM regions WHERE country_code = 'RO'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'RO')`,
        [region.code, region.name, region.name, region.name]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'RO'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    console.log("📁 Seeding districts...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'RO')
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
      WHERE r.country_code = 'RO'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    console.log("📥 Seeding schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'RO')
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
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, 'edu.ro')`
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
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'RO')
      )
    `);
    console.log(`✅ Romania seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Romania schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedRomaniaSchools();
