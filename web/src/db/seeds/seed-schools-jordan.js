require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_JO = path.join(__dirname, "data", "ecoles_primaires_jordanie.csv");

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  values.push(current.trim());
  return values;
}

function schoolType(nature) {
  if (!nature) return 1;
  const l = nature.toLowerCase();
  if (l.includes("priv") || l.includes("خاص")) return 2;
  return 1;
}

async function seedJordanSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    // Ensure Jordan exists in countries table
    const countryRes = await client.query("SELECT id FROM countries WHERE code = 'JO'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('JO', 'Jordanie', 'Jordan', 'الأردن', '🇯🇴', 'ar', true)`
      );
      console.log("🇯🇴 Added Jordan to countries table.");
    } else {
      console.log("🇯🇴 Jordan already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_jordanie.csv...");
    const csvContent = fs.readFileSync(CSV_JO, "utf-8");
    const cleanContent = csvContent.replace(/^\uFEFF/, "");
    const lines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]);
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map(); // nameLocal -> { code, nameLocal }
    const districtsMap = new Map(); // `${gov}-${liw}` -> { code, nameLocal, regionCode }
    const validSchools = [];

    let regionCounter = 0;
    let districtCounter = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length < headers.length) continue;

      const codeEcole = values[idx("code_ecole")]?.trim();
      const schoolName = values[idx("nom_ecole")]?.trim();
      const nature = values[idx("nature")]?.trim();
      let gouvernorat = values[idx("gouvernorat")]?.trim();
      let liwa = values[idx("liwa")]?.trim();

      if (!schoolName) continue;
      
      if (!gouvernorat) gouvernorat = "Unknown Gouvernorat";
      if (!liwa) liwa = "Unknown Liwa";

      if (!regionsMap.has(gouvernorat)) {
        regionCounter++;
        regionsMap.set(gouvernorat, {
          code: `JO-RG-${regionCounter}`,
          nameLocal: gouvernorat
        });
      }
      const regionCode = regionsMap.get(gouvernorat).code;

      const distKey = `${gouvernorat}-${liwa}`;
      if (!districtsMap.has(distKey)) {
        districtCounter++;
        districtsMap.set(distKey, {
          code: `JO-DS-${districtCounter}`,
          nameLocal: liwa,
          regionCode,
        });
      }
      const districtCode = districtsMap.get(distKey).code;

      // Unique code for Jordan schools
      const schoolCode = `JO-${i}-${codeEcole || 'UNK'}`;

      validSchools.push({
        code: schoolCode,
        nameLocal: schoolName,
        nameFr: schoolName,
        districtCode,
        regionCode,
        type: schoolType(nature),
        source: "moe.gov.jo",
        extra: { nature, gouvernorat, liwa }
      });
    }

    console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
    console.log(`📊 Gouvernorats: ${regionsMap.size}, Liwas: ${districtsMap.size}, Schools: ${validSchools.length}.`);

    console.log("📁 Seeding Gouvernorats (regions)...");
    await client.query("DELETE FROM regions WHERE country_code = 'JO'");
    for (const r of regionsMap.values()) {
      await client.query(
        "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'JO')",
        [r.code, r.nameLocal, r.nameLocal]
      );
    }

    const regionIds = new Map();
    for (const r of regionsMap.values()) {
      const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'JO'", [r.code]);
      if (res.rows.length > 0) regionIds.set(r.code, res.rows[0].id);
    }

    console.log("📁 Seeding Liwas (districts)...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'JO')
    `);

    for (const d of districtsMap.values()) {
      const regionId = regionIds.get(d.regionCode);
      if (!regionId) continue;
      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4)",
        [d.code, d.nameLocal, d.nameLocal, regionId]
      );
    }

    console.log("🗑️ Clearing existing JO schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'JO')
      )
    `);

    const districtIds = new Map();
    for (const d of districtsMap.values()) {
      const res = await client.query("SELECT id FROM districts WHERE code = $1", [d.code]);
      if (res.rows.length > 0) districtIds.set(d.code, res.rows[0].id);
    }

    console.log("📥 Seeding JO primary schools...");
    const batchSize = 300;
    let inserted = 0;

    for (let i = 0; i < validSchools.length; i += batchSize) {
      const batch = validSchools
        .slice(i, i + batchSize)
        .filter((s) => districtIds.has(s.districtCode));

      const params = [];
      const placeholders = [];

      batch.forEach((s, j) => {
        const districtId = districtIds.get(s.districtCode);
        const base = j * 8;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`
        );
        params.push(s.code, s.nameLocal, s.nameFr, districtId, s.type, null, null, s.source);
      });

      if (placeholders.length) {
        await client.query(
          `INSERT INTO schools (code, name_local, name_fr, district_id, type, lat, lng, source)
           VALUES ${placeholders.join(",")}`,
          params
        );
        inserted += placeholders.length;
      }
    }

    const countRes = await client.query(`
      SELECT COUNT(*)::int AS count FROM schools
      WHERE district_id IN (
        SELECT id FROM districts
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'JO')
      )
    `);

    console.log("✅ Successfully imported Jordan primary schools!");
    console.log(`🎉 Total in database: ${countRes.rows[0].count} records (batch inserted: ${inserted}).`);
  } catch (e) {
    console.error("❌ Error seeding Jordan schools:", e);
    throw e;
  } finally {
    await client.end();
    console.log("🏁 Database seeding complete.");
  }
}

seedJordanSchools().catch(console.error);
