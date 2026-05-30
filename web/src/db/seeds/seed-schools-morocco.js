require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CSV_MA = path.join(__dirname, "data", "ecoles_primaires_maroc.csv");
const { resolveMaRegion } = require(path.join(__dirname, "..", "..", "data", "ma-regions-data.js"));

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

function makeSchoolCode(region, commune, nameFr) {
  const hash = crypto
    .createHash("md5")
    .update(`${region}::${commune}::${nameFr}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
  return `M${hash}`;
}

async function seedMoroccoSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    const countryRes = await client.query("SELECT id FROM countries WHERE code = 'MA'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('MA', 'Maroc', 'Morocco', 'المغرب', '🇲🇦', 'ar,fr', true)`
      );
      console.log("🇲🇦 Morocco added to countries table.");
    } else {
      await client.query(
        `UPDATE countries SET name_fr = 'Maroc', name_en = 'Morocco', name_local = 'المغرب', langs = 'ar,fr', is_active = true WHERE code = 'MA'`
      );
      console.log("🇲🇦 Morocco already exists in countries table (updated).");
    }

    console.log("📖 Loading ecoles_primaires_maroc.csv...");
    const csvContent = fs.readFileSync(CSV_MA, "utf-8");
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

    function allocateSchoolCode(districtCode, region, commune, nameFr, address) {
      let code = makeSchoolCode(region, commune, nameFr);
      if (address) {
        code = makeSchoolCode(region, commune, `${nameFr}|${address}`);
      }
      if (!schoolCodesPerDistrict.has(districtCode)) {
        schoolCodesPerDistrict.set(districtCode, new Set());
      }
      const seen = schoolCodesPerDistrict.get(districtCode);
      let suffix = 2;
      while (seen.has(code)) {
        const base = code.slice(0, 16);
        code = `${base}${suffix}`;
        suffix++;
      }
      seen.add(code);
      return code.slice(0, 20);
    }

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.replace(/"/g, "").trim());
      if (values.length < headers.length) continue;

      const regionName = values[idx("REGION")];
      const regionNameAr = values[idx("REGION_AR")];
      const provinceName = values[idx("PROVINCE")] || "";
      const provinceNameAr = values[idx("PROVINCE_AR")] || "";
      const communeName = values[idx("COMMUNE")];
      const nameFr = values[idx("NOM_ETABLISSEMENT")];
      const nameAr = values[idx("NOM_ETABLISSEMENT_AR")];
      const address = values[idx("ADRESSE")] || "";
      const schoolType = (values[idx("TYPE")] || "").toUpperCase();
      const source = values[idx("SOURCE")] || "MENPS";

      if (!regionName || !communeName || !nameFr) continue;

      const canonRegion = resolveMaRegion(regionName);
      const regionKey = canonRegion.fr || regionName;
      const regionAr = regionNameAr || canonRegion.ar;

      if (!regionsMap.has(regionKey)) {
        regionsMap.set(regionKey, {
          code: `R${String(regionIndex++).padStart(3, "0")}`,
          nameFr: canonRegion.fr,
          nameAr: regionAr,
        });
      } else if (regionNameAr && !regionsMap.get(regionKey).nameAr) {
        regionsMap.get(regionKey).nameAr = regionNameAr;
      }
      const regionCode = regionsMap.get(regionKey).code;

      const districtKey = `${regionKey}::${provinceName}::${communeName}`;
      if (!districtsMap.has(districtKey)) {
        const districtCode = normalizeCode(
          `${provinceName}_${communeName}`,
          `D${String(districtIndex).padStart(7, "0")}`
        );
        districtsMap.set(districtKey, {
          code: districtCode,
          nameFr: communeName,
          nameAr: provinceNameAr ? `${provinceNameAr} · ${communeName}` : communeName,
          regionCode,
        });
        districtIndex++;
      }
      const districtCode = districtsMap.get(districtKey).code;

      const isPrivate = schoolType === "PRIVE";
      validSchools.push({
        code: allocateSchoolCode(districtCode, regionName, communeName, nameFr, address),
        nameFr,
        nameAr: nameAr || nameFr,
        districtCode,
        type: isPrivate ? 2 : 1,
        source,
      });
    }

    console.log(`✅ ${validSchools.length} primary schools found.`);
    console.log(`📊 ${regionsMap.size} regions, ${districtsMap.size} communes.`);

    await client.query("DELETE FROM regions WHERE country_code = 'MA'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'MA')`,
        [region.code, region.nameAr, region.nameFr, region.nameFr]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'MA'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'MA')
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
      WHERE r.country_code = 'MA'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'MA')
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
        const base = row * 7;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, NULL, NULL, $${base + 7})`
        );
        params.push(
          school.code,
          school.nameAr,
          school.nameFr,
          school.nameFr,
          districtId,
          school.type,
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

      if (i % 5000 === 0 || i + batchSize >= validSchools.length) {
        console.log(
          `  📊 ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length} processed (${inserted} inserted)...`
        );
      }
    }

    const countRes = await client.query(`
      SELECT COUNT(*)::int AS count
      FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'MA')
      )
    `);
    console.log(`✅ Morocco seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Morocco schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedMoroccoSchools();
