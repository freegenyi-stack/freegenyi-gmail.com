require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_TN = path.join(__dirname, "data", "ecoles_primaires_tunisie.csv");

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
  return (
    raw
      .toString()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "")
      .slice(0, maxLen) || fallback
  );
}

async function seedTunisiaSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    const countryRes = await client.query("SELECT id FROM countries WHERE code = 'TN'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('TN', 'Tunisie', 'Tunisia', 'تونس', '🇹🇳', 'ar,fr', true)`
      );
      console.log("🇹🇳 Tunisia added to countries table.");
    } else {
      await client.query(
        `UPDATE countries SET name_fr = 'Tunisie', name_en = 'Tunisia', name_local = 'تونس', langs = 'ar,fr', is_active = true WHERE code = 'TN'`
      );
      console.log("🇹🇳 Tunisia already exists in countries table (updated).");
    }

    console.log("📖 Loading ecoles_primaires_tunisie.csv...");
    const csvContent = fs.readFileSync(CSV_TN, "utf-8");
    const lines = csvContent
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0);

    const headers = parseCsvLine(lines[0]).map((h) =>
      h.replace(/"/g, "").replace(/^\uFEFF/, "").trim()
    );
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map();
    const districtsMap = new Map();
    const validSchools = [];
    const schoolCodesPerDistrict = new Map();
    let regionIndex = 1;
    let districtIndex = 1;

    function allocateSchoolCode(districtCode, schoolCode) {
      let code = (schoolCode || "").slice(0, 20);
      if (!code) return null;
      if (!schoolCodesPerDistrict.has(districtCode)) {
        schoolCodesPerDistrict.set(districtCode, new Set());
      }
      const seen = schoolCodesPerDistrict.get(districtCode);
      let suffix = 2;
      let finalCode = code;
      while (seen.has(finalCode)) {
        const base = code.slice(0, 16);
        finalCode = `${base}${suffix}`;
        suffix++;
      }
      seen.add(finalCode);
      return finalCode;
    }

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.replace(/"/g, "").trim());
      if (values.length < headers.length) continue;

      const govName = values[idx("GOUVERNORAT")];
      const govNameAr = values[idx("GOUVERNORAT_AR")];
      const delegationName = values[idx("DELEGATION")];
      const delegationNameAr = values[idx("DELEGATION_AR")];
      const schoolCode = values[idx("CODE_ETABLISSEMENT")];
      const nameFr = values[idx("NOM_ETABLISSEMENT")];
      const nameAr = values[idx("NOM_ETABLISSEMENT_AR")];
      const schoolType = (values[idx("TYPE")] || "").toLowerCase();
      const source = values[idx("SOURCE")] || "data.gov.tn";
      const latRaw = values[idx("LATITUDE")];
      const lngRaw = values[idx("LONGITUDE")];
      const lat = latRaw && !Number.isNaN(Number(latRaw)) ? Number(latRaw) : null;
      const lng = lngRaw && !Number.isNaN(Number(lngRaw)) ? Number(lngRaw) : null;

      if (!govName || !delegationName || !nameFr || !schoolCode) continue;

      const regionKey = govName;
      if (!regionsMap.has(regionKey)) {
        regionsMap.set(regionKey, {
          code: `R${String(regionIndex++).padStart(3, "0")}`,
          nameFr: govName,
          nameAr: govNameAr || govName,
        });
      } else if (govNameAr && !regionsMap.get(regionKey).nameAr) {
        regionsMap.get(regionKey).nameAr = govNameAr;
      }
      const regionCode = regionsMap.get(regionKey).code;

      const districtKey = `${regionKey}::${delegationName}`;
      if (!districtsMap.has(districtKey)) {
        const districtCode = normalizeCode(delegationName, `D${String(districtIndex).padStart(7, "0")}`);
        districtsMap.set(districtKey, {
          code: districtCode,
          nameFr: delegationName,
          nameAr: delegationNameAr || delegationName,
          regionCode,
        });
        districtIndex++;
      }
      const districtCode = districtsMap.get(districtKey).code;

      const code = allocateSchoolCode(districtCode, schoolCode);
      if (!code) continue;

      const isPrivate = schoolType.includes("priv") || schoolType.includes("prive");
      validSchools.push({
        code,
        nameFr,
        nameAr: nameAr || nameFr,
        districtCode,
        type: isPrivate ? 2 : 1,
        source,
        lat,
        lng,
      });
    }

    console.log(`✅ ${validSchools.length} primary schools found.`);
    console.log(`📊 ${regionsMap.size} governorates, ${districtsMap.size} delegations.`);

    await client.query("DELETE FROM regions WHERE country_code = 'TN'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'TN')`,
        [region.code, region.nameAr, region.nameFr, region.nameFr]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'TN'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'TN')
    `);
    for (const district of districtsMap.values()) {
      const regionId = regionIds.get(district.regionCode);
      if (!regionId) continue;
      await client.query(
        `INSERT INTO districts (code, name_local, name_fr, name_en, region_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [district.code, district.nameAr, district.nameFr, district.nameFr, regionId]
      );
    }

    const districtIds = new Map();
    const dbDistricts = await client.query(`
      SELECT d.id, d.code
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'TN'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'TN')
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
        const base = row * 9;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9})`
        );
        params.push(
          school.code,
          school.nameAr,
          school.nameFr,
          school.nameFr,
          districtId,
          school.type,
          school.lat,
          school.lng,
          school.source
        );
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
        console.log(
          `  📊 ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length} processed (${inserted} inserted)...`
        );
      }
    }

    const countRes = await client.query(`
      SELECT COUNT(*)::int AS count
      FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'TN')
      )
    `);
    console.log(`✅ Tunisia seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Tunisia schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedTunisiaSchools();
