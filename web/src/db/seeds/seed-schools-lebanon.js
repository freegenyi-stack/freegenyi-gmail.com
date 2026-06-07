require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const CSV_LB = path.join(__dirname, "data", "ecoles_primaires_liban.csv");

// ── Mapping exact: Arabic educational region -> Governorate + District ──
// Keys are EXACTLY as they appear in the CSV (verified via inspect_lb.js)
const REGION_MAP = {
  // BEYROUTH / بيروت
  "بيروت االولى":   { govCode: "LB-RG-1", distFr: "Beyrouth 1",                    distAr: "بيروت الأولى" },
  "بيروت الثانية":  { govCode: "LB-RG-1", distFr: "Beyrouth 2",                    distAr: "بيروت الثانية" },
  "بيروت الثالثة":  { govCode: "LB-RG-1", distFr: "Beyrouth 3",                    distAr: "بيروت الثالثة" },

  // MONT-LIBAN / جبل لبنان
  "ضواحي بيروت المباشرة الشمالية": { govCode: "LB-RG-2", distFr: "Banlieue Nord Immédiate",     distAr: "ضواحي بيروت المباشرة الشمالية" },
  "ضواحي بيروت المباشرة الجنوبية": { govCode: "LB-RG-2", distFr: "Banlieue Sud Immédiate",      distAr: "ضواحي بيروت المباشرة الجنوبية" },
  "ضواحي بيروت القريبة الشمالية":  { govCode: "LB-RG-2", distFr: "Banlieue Nord Proche",        distAr: "ضواحي بيروت القريبة الشمالية" },
  "ضواحي بيروت القريبة الوسطى":    { govCode: "LB-RG-2", distFr: "Banlieue Centrale Proche",    distAr: "ضواحي بيروت القريبة الوسطى" },
  "ضواحي بيروت القريبة الجنوبية":  { govCode: "LB-RG-2", distFr: "Banlieue Sud Proche",         distAr: "ضواحي بيروت القريبة الجنوبية" },
  "ضواحي بيروت البعيدة كسروان":    { govCode: "LB-RG-2", distFr: "Banlieue Lointaine Kesrouan", distAr: "ضواحي بيروت البعيدة - كسروان" },
  "ضواحي بيروت البعيدة المتن":     { govCode: "LB-RG-2", distFr: "Banlieue Lointaine Metn",     distAr: "ضواحي بيروت البعيدة - المتن" },
  "ضواحي بيروت البعيدة عاليه":     { govCode: "LB-RG-2", distFr: "Banlieue Lointaine Aley",     distAr: "ضواحي بيروت البعيدة - عاليه" },
  "ضواحي بيروت البعيدة الشوف":     { govCode: "LB-RG-2", distFr: "Banlieue Lointaine Chouf",    distAr: "ضواحي بيروت البعيدة - الشوف" },
  "جبيل":   { govCode: "LB-RG-2", distFr: "Jbeil",    distAr: "جبيل" },
  "كسروان": { govCode: "LB-RG-2", distFr: "Kesrouan", distAr: "كسروان" },
  "المتن":  { govCode: "LB-RG-2", distFr: "Metn",     distAr: "المتن" },
  "بعبدا":  { govCode: "LB-RG-2", distFr: "Baabda",   distAr: "بعبدا" },
  "عاليه":  { govCode: "LB-RG-2", distFr: "Aley",     distAr: "عاليه" },
  "الشوف":  { govCode: "LB-RG-2", distFr: "Chouf",    distAr: "الشوف" },

  // LIBAN-NORD / لبنان الشمالي
  "طرابلس المدينة": { govCode: "LB-RG-3", distFr: "Tripoli Ville",    distAr: "طرابلس المدينة" },
  "طرابلس الضواحي": { govCode: "LB-RG-3", distFr: "Tripoli Banlieue", distAr: "طرابلس الضواحي" },
  "زغرتا":          { govCode: "LB-RG-3", distFr: "Zgharta",          distAr: "زغرتا" },
  "الكورة":          { govCode: "LB-RG-3", distFr: "Koura",            distAr: "الكورة" },
  "بشري":            { govCode: "LB-RG-3", distFr: "Bcharre",          distAr: "بشري" },
  "البترون":         { govCode: "LB-RG-3", distFr: "Batroun",          distAr: "البترون" },

  // AKKAR / عكار
  "عكار": { govCode: "LB-RG-4", distFr: "Akkar", distAr: "عكار" },

  // BÉQAA / البقاع
  "زحلة المدينة":    { govCode: "LB-RG-5", distFr: "Zahlé Ville",         distAr: "زحلة المدينة" },
  "زحلة الضواحي":   { govCode: "LB-RG-5", distFr: "Zahlé Banlieue",      distAr: "زحلة الضواحي" },
  "زحلة القضاء":    { govCode: "LB-RG-5", distFr: "Zahlé Caza",          distAr: "زحلة القضاء" },
  "الهرمل":          { govCode: "LB-RG-5", distFr: "Hermel",              distAr: "الهرمل" },
  "بعلبك":           { govCode: "LB-RG-5", distFr: "Baalbek",             distAr: "بعلبك" },
  "البق اع الغربي":  { govCode: "LB-RG-5", distFr: "Béqaa Occidental",    distAr: "البقاع الغربي" }, // exact spacing from CSV
  "راشيا":           { govCode: "LB-RG-5", distFr: "Rachaya",             distAr: "راشيا" },

  // LIBAN-SUD / لبنان الجنوبي
  "صيدا المدينة": { govCode: "LB-RG-6", distFr: "Saïda Ville",    distAr: "صيدا المدينة" },
  "صيدا الضواحي": { govCode: "LB-RG-6", distFr: "Saïda Banlieue", distAr: "صيدا الضواحي" },
  "صيدا القضاء":  { govCode: "LB-RG-6", distFr: "Saïda Caza",     distAr: "صيدا القضاء" },
  "جزين":          { govCode: "LB-RG-6", distFr: "Jezzine",        distAr: "جزين" },
  "صور":            { govCode: "LB-RG-6", distFr: "Tyr",            distAr: "صور" },

  // NABATIYEH / النبطية
  "النبطية":  { govCode: "LB-RG-7", distFr: "Nabatiyeh",  distAr: "النبطية" },
  "بنت جبيل": { govCode: "LB-RG-7", distFr: "Bint Jbeil", distAr: "بنت جبيل" },
  "حاصبيا":   { govCode: "LB-RG-7", distFr: "Hasbaya",    distAr: "حاصبيا" },
  "مرجعيون":  { govCode: "LB-RG-7", distFr: "Marjayoun",  distAr: "مرجعيون" },
};

// ── Governorate master list ──
const GOVERNORATES = {
  "LB-RG-1": { nameFr: "Beyrouth",       nameAr: "بيروت" },
  "LB-RG-2": { nameFr: "Mont-Liban",     nameAr: "جبل لبنان" },
  "LB-RG-3": { nameFr: "Liban-Nord",     nameAr: "لبنان الشمالي" },
  "LB-RG-4": { nameFr: "Akkar",          nameAr: "عكار" },
  "LB-RG-5": { nameFr: "Béqaa",          nameAr: "البقاع" },
  "LB-RG-6": { nameFr: "Liban-Sud",      nameAr: "لبنان الجنوبي" },
  "LB-RG-7": { nameFr: "Nabatiyeh",      nameAr: "النبطية" },
};

// ── CSV parser ──
function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { values.push(current.trim()); current = ""; continue; }
    current += ch;
  }
  values.push(current.trim());
  return values;
}

// ── School type: 1=public, 2=private ──
function schoolType(owner) {
  if (!owner) return 1;
  const o = owner.trim();
  if (o === "الدولة") return 1;
  return 2; // خاص / الوقف / جمعية
}

async function seedLebanonSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("🔌 Connected to database.");

    // ── Ensure Lebanon exists in countries ──
    const cRes = await client.query("SELECT id FROM countries WHERE code = 'LB'");
    if (cRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('LB', 'Liban', 'Lebanon', 'لبنان', '🇱🇧', 'ar,fr', true)`
      );
      console.log("🇱🇧 Lebanon added to countries.");
    } else {
      console.log("🇱🇧 Lebanon already in countries.");
    }

    // ── Load CSV ──
    console.log("📖 Loading ecoles_primaires_liban.csv...");
    const csvContent = fs.readFileSync(CSV_LB, "utf-8").replace(/^\uFEFF/, "");
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = parseCsvLine(lines[0]);

    const idx = (name) => headers.indexOf(name);
    const iSchoolNum  = idx("رقم");
    const iSchoolName = idx("اسم_المدرسة");
    const iRegion     = idx("المنطقة_التربوية");
    const iOwner      = idx("المالك");

    console.log(`📊 Column indices -> school: ${iSchoolName}, region: ${iRegion}, owner: ${iOwner}`);

    // ── Build district map & parse schools ──
    const districtsMap = new Map(); // distFr -> { code, nameFr, nameAr, govCode }
    let districtCounter = 0;
    const validSchools = [];
    const skipped = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const schoolName = values[iSchoolName]?.trim();
      const eduRegion  = values[iRegion]?.trim();
      const owner      = values[iOwner]?.trim();
      const schoolNum  = values[iSchoolNum]?.trim();

      if (!schoolName || !eduRegion) continue;

      const mapping = REGION_MAP[eduRegion];
      if (!mapping) {
        skipped.push({ row: i, region: eduRegion });
        continue;
      }

      const { govCode, distFr, distAr } = mapping;

      if (!districtsMap.has(distFr)) {
        districtCounter++;
        districtsMap.set(distFr, {
          code:   `LB-DS-${districtCounter}`,
          nameFr: distFr,
          nameAr: distAr,
          govCode,
        });
      }

      validSchools.push({
        code:         `LB-${schoolNum || i}`,
        nameLocal:    schoolName, // Arabic (always Arabic per user spec)
        nameFr:       schoolName, // also Arabic — form shows AR names even in FR locale
        districtCode: districtsMap.get(distFr).code,
        type:         schoolType(owner),
      });
    }

    console.log(`✅ Parsed ${lines.length - 1} rows.`);
    console.log(`📊 Governorates: ${Object.keys(GOVERNORATES).length} | Districts: ${districtsMap.size} | Schools: ${validSchools.length} | Skipped: ${skipped.length}`);
    if (skipped.length > 0) {
      console.warn("⚠️  Skipped regions:", [...new Set(skipped.map((s) => s.region))]);
    }

    // ── Wipe & Seed Regions ──
    console.log("🗑️  Clearing existing LB regions...");
    await client.query(`
      DELETE FROM schools WHERE district_id IN (
        SELECT d.id FROM districts d
        JOIN regions r ON d.region_id = r.id
        WHERE r.country_code = 'LB'
      )
    `);
    await client.query(`
      DELETE FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'LB')
    `);
    await client.query("DELETE FROM regions WHERE country_code = 'LB'");

    console.log("📁 Inserting governorates (regions)...");
    for (const [code, gov] of Object.entries(GOVERNORATES)) {
      await client.query(
        `INSERT INTO regions (code, name_local, name_fr, name_en, country_code)
         VALUES ($1, $2, $3, $4, 'LB')`,
        [code, gov.nameAr, gov.nameFr, gov.nameFr]
      );
    }

    // ── Fetch Region IDs ──
    const regionIds = new Map();
    for (const code of Object.keys(GOVERNORATES)) {
      const r = await client.query(
        "SELECT id FROM regions WHERE code = $1 AND country_code = 'LB'",
        [code]
      );
      if (r.rows.length > 0) regionIds.set(code, r.rows[0].id);
    }

    // ── Seed Districts ──
    console.log("📁 Inserting districts (cazas)...");
    for (const d of districtsMap.values()) {
      const regionId = regionIds.get(d.govCode);
      if (!regionId) { console.warn(`⚠️  No regionId for ${d.govCode}`); continue; }
      await client.query(
        `INSERT INTO districts (code, name_local, name_fr, name_en, region_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [d.code, d.nameAr, d.nameFr, d.nameFr, regionId]
      );
    }

    // ── Fetch District IDs ──
    const districtIds = new Map();
    for (const d of districtsMap.values()) {
      const r = await client.query("SELECT id FROM districts WHERE code = $1", [d.code]);
      if (r.rows.length > 0) districtIds.set(d.code, r.rows[0].id);
    }

    // ── Seed Schools in batches ──
    console.log("📥 Inserting schools in batches...");
    const batchSize = 300;
    let inserted = 0;

    for (let i = 0; i < validSchools.length; i += batchSize) {
      const batch = validSchools.slice(i, i + batchSize).filter((s) => districtIds.has(s.districtCode));

      const params = [];
      const placeholders = [];

      batch.forEach((s, j) => {
        const districtId = districtIds.get(s.districtCode);
        const base = j * 6;
        placeholders.push(`($${base+1}, $${base+2}, $${base+3}, $${base+4}, $${base+5}, $${base+6})`);
        params.push(s.code, s.nameLocal, s.nameFr, districtId, s.type, "crdp.org");
      });

      if (placeholders.length) {
        await client.query(
          `INSERT INTO schools (code, name_local, name_fr, district_id, type, source)
           VALUES ${placeholders.join(",")}`,
          params
        );
        inserted += placeholders.length;
      }
      process.stdout.write(`\r   → ${Math.min(i + batchSize, validSchools.length)} / ${validSchools.length}`);
    }
    console.log();

    // ── Verification ──
    const countRes = await client.query(`
      SELECT COUNT(*)::int AS count FROM schools
      WHERE district_id IN (
        SELECT d.id FROM districts d
        JOIN regions r ON d.region_id = r.id
        WHERE r.country_code = 'LB'
      )
    `);

    console.log("\n🎉 Lebanon seeding complete!");
    console.log(`   Total schools in DB: ${countRes.rows[0].count}`);
    console.log(`   Batch-inserted:      ${inserted}`);
    console.log(`   Districts created:   ${districtsMap.size}`);
    console.log(`   Governorates:        ${Object.keys(GOVERNORATES).length}`);

  } catch (e) {
    console.error("❌ Error:", e);
    throw e;
  } finally {
    await client.end();
    console.log("🏁 Done.");
  }
}

seedLebanonSchools().catch(console.error);
