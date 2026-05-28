require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_BR = path.join(__dirname, "data", "Ecoles_Primaires_bresil.csv");

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ";" && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function seedBrazilSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    let countryRes = await client.query("SELECT id FROM countries WHERE code = 'BR'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('BR', 'Brésil', 'Brazil', 'Brasil', '🇧🇷', 'pt', true)`
      );
      console.log("🇧🇷 Brazil added to countries table.");
    } else {
      console.log("🇧🇷 Brazil already exists in countries table.");
    }

    console.log("📖 Loading Ecoles_Primaires_bresil.csv...");
    const csvContent = fs.readFileSync(CSV_BR, "utf-8");
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]).map((h) => h.replace(/"/g, "").trim());
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map();
    const districtsMap = new Map();
    const validSchools = [];
    
    // We'll use a counter for district codes to keep them <= 10 chars
    let districtIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.replace(/"/g, "").trim());
      if (values.length < headers.length) continue;

      const activeStatus = values[idx("TP_SITUACAO_FUNCIONAMENTO")];
      if (activeStatus !== "1") continue; // 1 = Active

      const isPrimary = values[idx("IN_COMUM_FUND_AI")];
      if (isPrimary !== "1") continue; // 1 = Has primary school grades

      const prefName = values[idx("NO_UF")];
      const prefAcronym = values[idx("SG_UF")];
      const muniName = values[idx("NO_MUNICIPIO")];
      const schoolName = values[idx("NO_ENTIDADE")];
      const schoolCode = values[idx("CO_ENTIDADE")];
      const depType = values[idx("TP_DEPENDENCIA")];
      const lat = values[idx("LATITUDE")] || null;
      const lng = values[idx("LONGITUDE")] || null;

      if (!prefName || !muniName || !schoolName || !schoolCode) continue;

      const regionCode = `BR_${prefAcronym}`;
      if (!regionsMap.has(regionCode)) {
        regionsMap.set(regionCode, { code: regionCode, name: prefName });
      }

      const longKey = `${regionCode}_${muniName}`;
      let districtCode;
      if (!districtsMap.has(longKey)) {
        districtCode = `BR_D${districtIndex++}`;
        districtsMap.set(longKey, {
          regionCode,
          districtCode,
          districtName: muniName,
        });
      } else {
        districtCode = districtsMap.get(longKey).districtCode;
      }

      // 1=Federal, 2=State, 3=Municipal, 4=Private
      const isPrivate = depType === "4";
      
      validSchools.push({
        code: schoolCode.slice(0, 20),
        nameLocal: schoolName,
        districtCode,
        type: isPrivate ? 2 : 1,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null
      });
    }

    console.log(`✅ ${validSchools.length} active primary schools.`);
    console.log(`📊 ${regionsMap.size} states, ${districtsMap.size} municipalities.`);

    console.log("📁 Seeding regions...");
    await client.query("DELETE FROM regions WHERE country_code = 'BR'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'BR')`,
        [region.code, region.name, region.name, region.name]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'BR'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    console.log("📁 Seeding districts...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'BR')
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
      WHERE r.country_code = 'BR'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    console.log("📥 Seeding schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'BR')
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
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, 'inep.gov.br')`
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

      if (i % 5000 === 0 || i + batchSize >= validSchools.length) {
        console.log(`  📊 ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length} processed (${inserted} inserted)...`);
      }
    }

    const countRes = await client.query(`
      SELECT COUNT(*)::int AS count FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'BR')
      )
    `);
    console.log(`✅ Brazil seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Brazil schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedBrazilSchools();
