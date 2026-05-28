require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_TW = path.join(__dirname, "data", "ecoles_primaires_taiwan.csv");

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

// Extract district from address: e.g. "[234]新北市永和區福和路125..." → "永和區"
// Pattern: [CODE]CityDistrictRest → extract district (up to 區/鄉/鎮/市 after city)
function extractDistrict(address, cityName) {
  if (!address) return null;
  // Strip the leading [CODE] prefix
  const stripped = address.replace(/^\[\d+\]/, "").trim();
  // Strip the city prefix (縣市名稱) from the beginning
  const withoutCity = stripped.startsWith(cityName) ? stripped.slice(cityName.length) : stripped;
  // Match district ending in 區, 鎮, 鄉, or secondary city (市 not at end)
  const match = withoutCity.match(/^([^\d\s]+?[區鎮鄉])/);
  if (match) return match[1];
  // Fallback: take first 4 chars
  return withoutCity.slice(0, 4) || null;
}

async function seedTaiwanSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    let countryRes = await client.query("SELECT id FROM countries WHERE code = 'TW'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('TW', 'Taïwan', 'Taiwan', '臺灣', '🇹🇼', 'zh', true)`
      );
      console.log("🇹🇼 Taiwan added to countries table.");
    } else {
      console.log("🇹🇼 Taiwan already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_taiwan.csv...");
    const csvContent = fs.readFileSync(CSV_TW, "utf-8").replace(/^\uFEFF/, "");
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

      const schoolCode = values[idx("代碼")];
      const schoolName = values[idx("學校名稱")];
      const isPrivateStr = values[idx("公/私立")];
      const cityRaw = values[idx("縣市名稱")]; // e.g. "[01]新北市"
      const address = values[idx("地址")]; // e.g. "[234]新北市永和區福和路..."

      if (!schoolCode || !schoolName || !cityRaw) continue;

      // Strip [XX] code prefix from city name
      const cityName = cityRaw.replace(/^\[\d+\]/, "").trim();
      if (!cityName) continue;

      // Handle Regions (縣市)
      let regionCode;
      const rKey = cityName;
      if (!regionsMap.has(rKey)) {
        regionCode = `TW_R${regionIndex++}`;
        regionsMap.set(rKey, { code: regionCode, name: cityName });
      } else {
        regionCode = regionsMap.get(rKey).code;
      }

      // Handle Districts (區/鎮/鄉)
      const districtName = extractDistrict(address, cityName) || cityName;
      const longKey = `${regionCode}_${districtName}`;
      let districtCode;
      if (!districtsMap.has(longKey)) {
        districtCode = `TW_D${districtIndex++}`;
        districtsMap.set(longKey, { regionCode, districtCode, districtName });
      } else {
        districtCode = districtsMap.get(longKey).districtCode;
      }

      const isPrivate = isPrivateStr === "私立";
      const code = schoolCode.slice(0, 20);

      validSchoolsMap.set(code, {
        code,
        nameLocal: schoolName,
        districtCode,
        type: isPrivate ? 2 : 1,
        lat: null,
        lng: null,
      });
    }

    const validSchools = Array.from(validSchoolsMap.values());
    console.log(`✅ ${validSchools.length} primary schools loaded.`);
    console.log(`📊 ${regionsMap.size} 縣市 (counties/cities), ${districtsMap.size} 區/鎮/鄉 (districts).`);

    console.log("📁 Seeding regions...");
    await client.query("DELETE FROM regions WHERE country_code = 'TW'");
    for (const region of regionsMap.values()) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'TW')`,
        [region.code, region.name, region.name, region.name]
      );
    }

    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'TW'");
    for (const r of dbRegions.rows) regionIds.set(r.code, r.id);

    console.log("📁 Seeding districts...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'TW')
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
      WHERE r.country_code = 'TW'
    `);
    for (const d of dbDistricts.rows) districtIds.set(d.code, d.id);

    console.log("📥 Seeding schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'TW')
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
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, 'edu.tw')`
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
        SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'TW')
      )
    `);
    console.log(`✅ Taiwan seed complete: ${countRes.rows[0].count} schools in database.`);
  } catch (error) {
    console.error("❌ Error seeding Taiwan schools:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedTaiwanSchools();
