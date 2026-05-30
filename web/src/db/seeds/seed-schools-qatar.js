require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_QA = path.join(__dirname, "data", "ecoles_primaires_qatar.csv");

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

function schoolType(nature) {
  // nature is usually 'publique' or 'privée'
  if (!nature) return 1;
  const l = nature.toLowerCase();
  if (l.includes("privée")) return 2;
  return 1;
}

async function seedQatarSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    const countryRes = await client.query("SELECT id FROM countries WHERE code = 'QA'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('QA', 'Qatar', 'Qatar', 'قطر', '🇶🇦', 'ar,en', true)`
      );
      console.log("🇶🇦 Added Qatar to countries table.");
    } else {
      console.log("🇶🇦 Qatar already exists in countries table.");
    }

    console.log("📖 Loading ecoles_primaires_qatar.csv...");
    const csvContent = fs.readFileSync(CSV_QA, "utf-8");
    // handle BOM if present
    const cleanContent = csvContent.replace(/^\uFEFF/, "");
    const lines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]);
    const idx = (name) => headers.indexOf(name);

    const regionsMap = new Map(); // municipalite -> { code, nameLocal }
    const districtsMap = new Map(); // quartier -> { code, nameLocal, regionCode }
    const validSchools = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length < headers.length) continue;

      const schoolName = values[idx("nom")]?.trim();
      const nature = values[idx("nature")]?.trim();
      let municipalite = values[idx("municipalite")]?.trim();
      let quartier = values[idx("quartier")]?.trim();
      const zone = values[idx("zone")]?.trim();
      const latStr = values[idx("latitude")]?.trim();
      const lngStr = values[idx("longitude")]?.trim();

      if (!schoolName) continue;
      
      if (!municipalite) municipalite = "Unknown Municipality";
      if (!quartier) quartier = municipalite; // fallback if quartier is missing

      const regionCode = normalizeCode(municipalite, 10);
      const districtCode = normalizeCode(`${municipalite}-${quartier}-${zone || ''}`, 15);

      if (!regionsMap.has(regionCode)) {
        regionsMap.set(regionCode, { code: regionCode, nameLocal: municipalite });
      }

      if (!districtsMap.has(districtCode)) {
        districtsMap.set(districtCode, {
          code: districtCode,
          nameLocal: quartier,
          regionCode,
        });
      }

      // Generate a unique code for the school
      let hash = 0;
      for (let j = 0; j < schoolName.length; j++) {
        hash = Math.imul(31, hash) + schoolName.charCodeAt(j) | 0;
      }
      const schoolCode = normalizeCode(`QA-${i}-${Math.abs(hash)}`, 30);

      let lat = null, lng = null;
      if (latStr && lngStr) {
          const plat = parseFloat(latStr);
          const plng = parseFloat(lngStr);
          if (!isNaN(plat) && !isNaN(plng)) {
              lat = plat;
              lng = plng;
          }
      }

      validSchools.push({
        code: schoolCode,
        nameLocal: schoolName,
        nameFr: schoolName, // In Arabic by default, keeping it as is
        districtCode,
        regionCode,
        type: schoolType(nature),
        lat,
        lng,
        source: "edu.gov.qa",
        extra: { nature, municipalite, quartier, zone }
      });
    }

    console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
    console.log(`📊 Municipalities: ${regionsMap.size}, Districts: ${districtsMap.size}, Schools: ${validSchools.length}.`);

    console.log("📁 Seeding Municipalities (regions)...");
    await client.query("DELETE FROM regions WHERE country_code = 'QA'");
    for (const r of regionsMap.values()) {
      await client.query(
        "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'QA')",
        [r.code, r.nameLocal, r.nameLocal]
      );
    }

    const regionIds = new Map();
    for (const r of regionsMap.values()) {
      const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'QA'", [r.code]);
      if (res.rows.length > 0) regionIds.set(r.code, res.rows[0].id);
    }

    console.log("📁 Seeding Districts (quartiers)...");
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'QA')
    `);

    for (const d of districtsMap.values()) {
      const regionId = regionIds.get(d.regionCode);
      if (!regionId) continue;
      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4)",
        [d.code, d.nameLocal, d.nameLocal, regionId]
      );
    }

    console.log("🗑️ Clearing existing QA schools...");
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'QA')
      )
    `);

    const districtIds = new Map();
    for (const d of districtsMap.values()) {
      const res = await client.query("SELECT id FROM districts WHERE code = $1", [d.code]);
      if (res.rows.length > 0) districtIds.set(d.code, res.rows[0].id);
    }

    console.log("📥 Seeding QA primary schools...");
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
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'QA')
      )
    `);

    console.log("✅ Successfully imported Qatar primary schools!");
    console.log(`🎉 Total in database: ${countRes.rows[0].count} records (batch inserted: ${inserted}).`);
  } catch (e) {
    console.error("❌ Error seeding Qatar schools:", e);
    throw e;
  } finally {
    await client.end();
    console.log("🏁 Database seeding complete.");
  }
}

seedQatarSchools().catch(console.error);
