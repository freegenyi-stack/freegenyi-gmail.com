require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_JP = path.join(__dirname, "data", "ecoles_primaires_japon.csv");

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

function parsePrefCode(prefNumCol) {
  const m = (prefNumCol || "").match(/^(\d{1,2})/);
  return m ? `P${m[1].padStart(2, "0")}` : "P00";
}

function extractMunicipality(address, prefecture) {
  let rest = address || "";
  if (prefecture && rest.startsWith(prefecture)) {
    rest = rest.substring(prefecture.length);
  }

  const wardMatch = rest.match(/^([^市]+市[^区]+区)/);
  if (wardMatch) return wardMatch[1];

  const gunMatch = rest.match(/^([^郡]+郡[^町村]+[町村])/);
  if (gunMatch) return gunMatch[1];

  const simpleMatch = rest.match(/^([^市区町村]+[市区町村])/);
  if (simpleMatch) return simpleMatch[1];

  return "その他";
}

async function seedJapanSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    let countryRes = await client.query("SELECT id FROM countries WHERE code = 'JP'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('JP', 'Japon', 'Japan', '日本', '🇯🇵', 'ja', true)`
      );
      console.log("🇯🇵 Japan added to countries table.");
    } else {
      console.log("🇯🇵 Japan already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_japon.csv...");
    const csvContent = fs.readFileSync(CSV_JP, "utf-8");
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

      const typeSchool = values[idx("学校種 (Type école)")];
      if (!typeSchool || !typeSchool.includes("小学校")) continue;

      const closedDate = values[idx("属性情報廃止年月日 (Date fermeture)")];
      if (closedDate) continue;

      const statusNom = values[idx("本分校区分 (Statut nom)")];
      if (statusNom === "廃") continue;

      const prefName = values[idx("都道府県名 (Préfecture)")];
      const prefNum = values[idx("都道府県番号 (N° préfecture)")];
      const schoolName = values[idx("学校名 (Nom école)")];
      const schoolCode = values[idx("学校コード (Code école)")];
      const address = values[idx("学校所在地 (Adresse)")];
      const gestion = values[idx("設置区分名 (Gestion)")];

      if (!prefName || !schoolName || !schoolCode) continue;

      const regionCode = parsePrefCode(prefNum);
      if (!regionsMap.has(regionCode)) {
        regionsMap.set(regionCode, { code: regionCode, name: prefName });
      }

      const muniName = extractMunicipality(address, prefName);
      const longKey = `${regionCode}_${muniName}`;
      let districtCode;
      if (!districtsMap.has(longKey)) {
        districtCode = `D${String(districtIndex++).padStart(7, "0")}`;
        districtsMap.set(longKey, {
          regionCode,
          districtCode,
          districtName: muniName,
        });
      } else {
        districtCode = districtsMap.get(longKey).districtCode;
      }

      const isPrivate = gestion && gestion.includes("私");
      validSchools.push({
        code: schoolCode.slice(0, 20),
        nameLocal: schoolName,
        districtCode,
        type: isPrivate ? 2 : 1,
      });
    }

    console.log(`✅ ${validSchools.length} active primary schools.`);
    console.log(`📊 ${regionsMap.size} prefectures, ${districtsMap.size} municipalities.`);

    console.log("📁 Seeding regions...");
    await client.query("DELETE FROM regions WHERE country_code = 'JP'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'JP')`,
        [region.code, region.name, region.name, region.name]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'JP'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    console.log("📁 Seeding districts...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'JP')
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
      WHERE r.country_code = 'JP'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    console.log("📥 Seeding schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'JP')
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
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, NULL, NULL, 'mext.go.jp')`
        );
        params.push(school.code, school.nameLocal, school.nameLocal, school.nameLocal, districtId, school.type);
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
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'JP')
      )
    `);
    console.log(`✅ Japan seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Japan schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedJapanSchools();
