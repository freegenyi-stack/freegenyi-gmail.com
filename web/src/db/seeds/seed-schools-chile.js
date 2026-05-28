require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_CL = path.join(__dirname, "data", "ecoles_primaires_chili.csv");

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

async function seedChileSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    let countryRes = await client.query("SELECT id FROM countries WHERE code = 'CL'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('CL', 'Chili', 'Chile', 'Chile', '🇨🇱', 'es', true)`
      );
      console.log("🇨🇱 Chile added to countries table.");
    } else {
      console.log("🇨🇱 Chile already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_chili.csv...");
    const csvContent = fs.readFileSync(CSV_CL, "utf-8");
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]).map((h) => h.replace(/"/g, "").trim());
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map();
    const districtsMap = new Map();
    const validSchools = [];
    
    let districtIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.replace(/"/g, "").trim());
      if (values.length < headers.length) continue;

      const activeStatus = values[idx("ESTADO_ESTAB")];
      if (activeStatus !== "1") continue; // 1 = Active

      const regionCodeNum = values[idx("COD_REG_RBD")];
      const regionAbbr = values[idx("NOM_REG_RBD_A")];
      const muniName = values[idx("NOM_COM_RBD")];
      const schoolName = values[idx("NOM_RBD")];
      const schoolCode = values[idx("RBD")];
      const depType2 = values[idx("COD_DEPE2")]; // 1,5=Public, 2,3,4=Private
      const latStr = values[idx("LATITUD")];
      const lngStr = values[idx("LONGITUD")];

      if (!regionCodeNum || !muniName || !schoolName || !schoolCode) continue;

      const regionCode = `CL_${regionCodeNum}`;
      if (!regionsMap.has(regionCode)) {
        regionsMap.set(regionCode, { code: regionCode, name: regionAbbr || `Región ${regionCodeNum}` });
      }

      const longKey = `${regionCode}_${muniName}`;
      let districtCode;
      if (!districtsMap.has(longKey)) {
        districtCode = `CL_D${districtIndex++}`;
        districtsMap.set(longKey, {
          regionCode,
          districtCode,
          districtName: muniName,
        });
      } else {
        districtCode = districtsMap.get(longKey).districtCode;
      }

      const isPrivate = (depType2 === "2" || depType2 === "3" || depType2 === "4");
      
      const parseCoord = (str) => {
        if (!str || str.trim() === "" || str.trim() === " ") return null;
        const val = parseFloat(str.replace(",", "."));
        return isNaN(val) ? null : val;
      };

      validSchools.push({
        code: schoolCode.slice(0, 20),
        nameLocal: schoolName,
        districtCode,
        type: isPrivate ? 2 : 1,
        lat: parseCoord(latStr),
        lng: parseCoord(lngStr)
      });
    }

    console.log(`✅ ${validSchools.length} active primary schools.`);
    console.log(`📊 ${regionsMap.size} regions, ${districtsMap.size} comunas.`);

    console.log("📁 Seeding regions...");
    await client.query("DELETE FROM regions WHERE country_code = 'CL'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'CL')`,
        [region.code, region.name, region.name, region.name]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'CL'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    console.log("📁 Seeding districts...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CL')
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
      WHERE r.country_code = 'CL'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    console.log("📥 Seeding schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CL')
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
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, 'mineduc.cl')`
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
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CL')
      )
    `);
    console.log(`✅ Chile seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Chile schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedChileSchools();
