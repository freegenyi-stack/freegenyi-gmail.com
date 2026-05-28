require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const CSV_KR = path.join(__dirname, "data", "ecoles_primaires_coree_sud.csv");

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function seedKoreaSchools() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    // Ensure South Korea exists
    let countryRes = await client.query("SELECT id, code FROM countries WHERE code = 'KR'");
    if (countryRes.rows.length === 0) {
      console.log("⚠️ South Korea not found in countries table. Inserting it now...");
      await client.query(
        "INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active) VALUES ('KR', 'Corée du Sud', 'South Korea', '대한민국', '🇰🇷', 'ko', true)"
      );
      console.log("🇰🇷 South Korea added to countries table.");
    }

    console.log("📖 Loading ecoles_primaires_coree_sud.csv...");
    const csvContent = fs.readFileSync(CSV_KR, 'utf-8');
    const lines = csvContent.split('\n');
    
    const headers = parseCsvLine(lines[0]).map(h => h.trim());
    const schools = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = parseCsvLine(line).map(v => v.trim());
      if (values.length !== headers.length) continue;

      const school = {};
      headers.forEach((header, index) => {
        school[header] = values[index];
      });

      // Filter out invalid/empty rows (sometimes headers repeat or empty)
      if (school['학교종류명'] !== "초등학교") continue;

      const schoolCode = school["행정표준코드"];
      if (!schoolCode) continue;

      schools.push(school);
    }

    console.log(`✅ Loaded ${schools.length} primary schools from CSV.`);

    const regionsMap = new Map();
    const districtsMap = new Map();
    const validSchools = [];

    const regionToCode = {
      "서울특별시": "SEOUL",
      "부산광역시": "BUSAN",
      "대구광역시": "DAEGU",
      "인천광역시": "INCHEON",
      "광주광역시": "GWANGJU",
      "대전광역시": "DAEJEON",
      "울산광역시": "ULSAN",
      "세종특별자치시": "SEJONG",
      "경기도": "GYEONGGI",
      "강원도": "GANGWON",
      "강원특별자치도": "GANGWON",
      "충청북도": "CHUNGBUK",
      "충청남도": "CHUNGNAM",
      "전라북도": "JEONBUK",
      "전북특별자치도": "JEONBUK",
      "전라남도": "JEONNAM",
      "경상북도": "GYEONGBUK",
      "경상남도": "GYEONGNAM",
      "제주특별자치도": "JEJU"
    };

    for (const school of schools) {
      const regionName = school['시도명'];
      const districtName = school['관할조직명'];
      const schoolNameLocal = school['학교명'];
      const schoolNameEn = school['영문학교명'];
      const schoolCode = school['행정표준코드'];
      
      if (!regionName || !schoolNameLocal) continue;

      let regionCode = regionToCode[regionName];
      if (!regionCode) {
        regionCode = regionName.substring(0, 10).toUpperCase();
      }
      
      if (!regionsMap.has(regionCode)) {
        regionsMap.set(regionCode, {
          code: regionCode,
          name: regionName
        });
      }

      // Some district names can be long, so we take a safe substring for code, but full name for DB
      const distCodeStr = districtName ? districtName.replace(/\s+/g, '_').substring(0, 10).toUpperCase() : "UNKNOWN";
      if (!districtsMap.has(distCodeStr)) {
        districtsMap.set(distCodeStr, {
          regionCode: regionCode,
          districtCode: distCodeStr,
          districtName: districtName || "Unknown District"
        });
      }

      const isPrivate = school['설립명'] === "사립";
      const type = isPrivate ? 2 : 1;

      validSchools.push({
        code: schoolCode,
        nameLocal: schoolNameLocal,
        nameEn: schoolNameEn || schoolNameLocal,
        districtCode: distCodeStr,
        type: type,
        lat: null,
        lng: null
      });
    }

    console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);

    console.log("📁 Seeding Regions...");
    await client.query("DELETE FROM regions WHERE country_code = 'KR'");
    
    for (const region of regionsMap.values()) {
      await client.query(
        "INSERT INTO regions (code, name_local, name_fr, name_en, country_code) VALUES ($1, $2, $3, $4, 'KR')",
        [region.code, region.name, region.name, region.name]
      );
    }
    
    console.log("📁 Seeding Districts...");
    const regionIds = new Map();
    const dbRegions = await client.query("SELECT id, code FROM regions WHERE country_code = 'KR'");
    for (const r of dbRegions.rows) {
      regionIds.set(r.code, r.id);
    }

    await client.query(`
      DELETE FROM districts 
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'KR')
    `);

    for (const district of districtsMap.values()) {
      const regionId = regionIds.get(district.regionCode);
      if (!regionId) continue;

      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, name_en, region_id) VALUES ($1, $2, $3, $4, $5)",
        [district.districtCode, district.districtName, district.districtName, district.districtName, regionId]
      );
    }

    console.log("📥 Seeding KR primary schools...");
    const districtIds = new Map();
    const dbDistricts = await client.query(`
      SELECT d.id, d.code FROM districts d 
      JOIN regions r ON d.region_id = r.id 
      WHERE r.country_code = 'KR'
    `);
    for (const d of dbDistricts.rows) {
      districtIds.set(d.code, d.id);
    }

    await client.query(`
      DELETE FROM schools 
      WHERE district_id IN (SELECT id FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'KR'))
    `);

    const batchSize = 500;
    for (let i = 0; i < validSchools.length; i += batchSize) {
      const batch = validSchools.slice(i, i + batchSize);
      const values = [];
      
      batch.forEach(school => {
        const districtId = districtIds.get(school.districtCode);
        if (!districtId) return;
        
        const local = school.nameLocal.replace(/'/g, "''");
        const en = school.nameEn.replace(/'/g, "''");
        
        values.push(`('${school.code}', '${local}', '${en}', '${en}', ${districtId}, ${school.type}, NULL, NULL)`);
      });

      if (values.length > 0) {
        await client.query(`
          INSERT INTO schools (code, name_local, name_fr, name_en, district_id, type, lat, lng)
          VALUES ${values.join(',')}
        `);
      }
      
      if ((i + batchSize) % 1000 === 0) {
        console.log(`  📊 Progress: ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length} schools imported...`);
      }
    }

    console.log("✅ Successfully imported South Korea primary schools!");
    
  } catch (error) {
    console.error("❌ Error seeding South Korea schools:", error);
  } finally {
    await client.end();
  }
}

seedKoreaSchools();
