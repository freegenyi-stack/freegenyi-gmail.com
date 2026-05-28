require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_SG = path.join(__dirname, "data", "ecoles_primaires_singapour.csv");

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

function normalizeCode(raw, maxLen = 10) {
  if (!raw) return "UNKNOWN";
  return raw
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "")
    .slice(0, maxLen) || "UNKNOWN";
}

function schoolType(typeCode) {
  // In SG dataset, type_code is e.g. "GOVERNMENT SCHOOL", "GOVERNMENT-AIDED SCH"
  // We keep it simple: treat all as public (1).
  return 1;
}

async function seedSingaporeSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    const countryRes = await client.query("SELECT id FROM countries WHERE code = 'SG'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('SG', 'Singapour', 'Singapore', 'Singapore', '🇸🇬', 'en,zh,ms,ta', true)`
      );
      console.log("🇸🇬 Added Singapore to countries table.");
    } else {
      console.log("🇸🇬 Singapore already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_singapour.csv...");
    const csvContent = fs.readFileSync(CSV_SG, "utf-8");
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]);
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map(); // zone_code -> { code, nameLocal }
    const districtsMap = new Map(); // dgp_code -> { code, nameLocal, regionCode }
    const validSchools = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length < headers.length) continue;

      const schoolName = values[idx("school_name")]?.trim();
      const address = values[idx("address")]?.trim();
      const postal = values[idx("postal_code")]?.trim();
      const zone = values[idx("zone_code")]?.trim(); // NORTH/SOUTH/EAST/WEST
      const dgp = values[idx("dgp_code")]?.trim(); // e.g. WOODLANDS, ANG MO KIO
      const typeCode = values[idx("type_code")]?.trim();

      if (!schoolName || !zone || !dgp) continue;

      const regionCode = normalizeCode(zone, 10);
      const districtCode = normalizeCode(dgp, 10);

      if (!regionsMap.has(regionCode)) {
        regionsMap.set(regionCode, { code: regionCode, nameLocal: zone });
      }

      if (!districtsMap.has(districtCode)) {
        districtsMap.set(districtCode, {
          code: districtCode,
          nameLocal: dgp,
          regionCode,
        });
      }

      const schoolCode = normalizeCode(`${dgp}-${postal || schoolName}`, 20);
      const displayName = schoolName;
      const nameLocal = displayName;
      const nameFr = displayName;

      validSchools.push({
        code: schoolCode,
        nameLocal,
        nameFr,
        districtCode,
        regionCode,
        type: schoolType(typeCode),
        lat: null,
        lng: null,
        source: "moe.gov.sg",
        extra: { address, postal },
      });
    }

    console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
    console.log(`📊 Regions (zones): ${regionsMap.size}, Districts (DGP): ${districtsMap.size}, Schools: ${validSchools.length}.`);

    console.log("📁 Seeding Zones (regions)...");
    await client.query("DELETE FROM regions WHERE country_code = 'SG'");
    for (const r of regionsMap.values()) {
      await client.query(
        "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'SG')",
        [r.code, r.nameLocal, r.nameLocal]
      );
    }

    const regionIds = new Map();
    for (const r of regionsMap.values()) {
      const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'SG'", [r.code]);
      if (res.rows.length > 0) regionIds.set(r.code, res.rows[0].id);
    }

    console.log("📁 Seeding DGP areas (districts)...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'SG')
    `);

    for (const d of districtsMap.values()) {
      const regionId = regionIds.get(d.regionCode);
      if (!regionId) continue;
      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4)",
        [d.code, d.nameLocal, d.nameLocal, regionId]
      );
    }

    console.log("🗑️ Clearing existing SG schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'SG')
      )
    `);

    const districtIds = new Map();
    for (const d of districtsMap.values()) {
      const res = await client.query("SELECT id FROM districts WHERE code = $1", [d.code]);
      if (res.rows.length > 0) districtIds.set(d.code, res.rows[0].id);
    }

    console.log("📥 Seeding SG primary schools...");
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
        params.push(s.code, s.nameLocal, s.nameFr, districtId, s.type, s.lat, s.lng, s.source);
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
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'SG')
      )
    `);

    console.log("✅ Successfully imported Singapore primary schools!");
    console.log(`🎉 Total in database: ${countRes.rows[0].count} records (batch inserted: ${inserted}).`);
  } catch (e) {
    console.error("❌ Error seeding Singapore schools:", e);
    throw e;
  } finally {
    await client.end();
    console.log("🏁 Database seeding complete.");
  }
}

seedSingaporeSchools().catch(console.error);

