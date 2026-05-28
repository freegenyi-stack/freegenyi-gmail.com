require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_AR = path.join(__dirname, "data", "ecoles_primaires_argentine.csv");

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

function normalizeCode(raw, fallback, maxLen = 10) {
  if (!raw) return fallback;
  return raw
    .toString()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "")
    .slice(0, maxLen) || fallback;
}

async function seedArgentinaSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    const countryRes = await client.query("SELECT id FROM countries WHERE code = 'AR'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('AR', 'Argentine', 'Argentina', 'Argentina', '🇦🇷', 'es', true)`
      );
      console.log("🇦🇷 Argentina added to countries table.");
    } else {
      console.log("🇦🇷 Argentina already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_argentine.csv...");
    const csvContent = fs.readFileSync(CSV_AR, "utf-8");
    const lines = csvContent
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0);

    const headers = parseCsvLine(lines[0]).map((h) => h.replace(/"/g, "").trim());
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map();
    const districtsMap = new Map();
    const validSchools = [];
    let regionIndex = 1;
    let districtIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.replace(/"/g, "").trim());
      if (values.length < headers.length) continue;

      const primaria = values[idx("Primario")] || values[idx("Primario ")];
      if (primaria !== "1") continue;

      const regionName = values[idx("Jurisdicción")];
      const districtName = values[idx("Departamento")];
      const districtCodeRaw = values[idx("Código de departamento")];
      const schoolCode = values[idx("Cueanexo")];
      const schoolName = values[idx("Nombre")];
      const sector = values[idx("Sector")];

      if (!regionName || !districtName || !schoolName || !schoolCode) continue;

      if (!regionsMap.has(regionName)) {
        regionsMap.set(regionName, {
          code: `R${String(regionIndex++).padStart(3, "0")}`,
          name: regionName,
        });
      }
      const regionCode = regionsMap.get(regionName).code;

      const districtKey = `${regionName}::${districtName}`;
      if (!districtsMap.has(districtKey)) {
        const districtCode = districtCodeRaw
          ? normalizeCode(`D${districtCodeRaw}`, `D${String(districtIndex).padStart(7, "0")}`)
          : `D${String(districtIndex).padStart(7, "0")}`;
        districtsMap.set(districtKey, {
          code: districtCode,
          name: districtName,
          regionCode,
        });
        districtIndex++;
      }
      const districtCode = districtsMap.get(districtKey).code;

      const isPrivate = sector && sector.toLowerCase() !== "estatal";
      validSchools.push({
        code: schoolCode.slice(0, 20),
        name: schoolName,
        districtCode,
        type: isPrivate ? 2 : 1,
      });
    }

    console.log(`✅ ${validSchools.length} primary schools found.`);
    console.log(`📊 ${regionsMap.size} regions, ${districtsMap.size} districts.`);

    await client.query("DELETE FROM regions WHERE country_code = 'AR'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'AR')`,
        [region.code, region.name, region.name, region.name]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'AR'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'AR')
    `);
    for (const district of districtsMap.values()) {
      const regionId = regionIds.get(district.regionCode);
      if (!regionId) continue;
      await client.query(
        `INSERT INTO districts (code, name_local, name_fr, name_en, region_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [district.code, district.name, district.name, district.name, regionId]
      );
    }

    const districtIds = new Map();
    const dbDistricts = await client.query(`
      SELECT d.id, d.code
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'AR'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'AR')
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
        const base = row * 6;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, NULL, NULL, 'argentina.gob.ar')`
        );
        params.push(school.code, school.name, school.name, school.name, districtId, school.type);
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
      SELECT COUNT(*)::int AS count
      FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'AR')
      )
    `);
    console.log(`✅ Argentina seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Argentina schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedArgentinaSchools();
