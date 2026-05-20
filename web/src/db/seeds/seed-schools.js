const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Support process.env.DATABASE_URL or default local development port
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

const CSV_PUBLIC = path.join(__dirname, "data", "ecoles_primaires_algerie.csv");
const CSV_PRIVATE = path.join(__dirname, "data", "ecoles_privees_algerie.csv");

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

async function readCSV(filePath) {
  const rows = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  let headers = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    if (isFirstLine) {
      headers = cols.map(h => h.toLowerCase().trim());
      isFirstLine = false;
      continue;
    }
    const row = {};
    headers.forEach((h, i) => { row[h] = (cols[i] || "").trim(); });
    rows.push(row);
  }
  return rows;
}

function cleanArabicName(name) {
  if (!name) return "";
  // Trim spaces and replace consecutive spaces with a single space
  return name.replace(/\s+/g, " ").trim();
}

async function main() {
  console.log("🚀 FreeGeny — Seeding schools database for VPS compatibility");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🔌 Connected to database. Applying database schema adjustments...");

  // 1. Drop old single unique code constraint and add composite unique constraint
  // This allows the same school code to appear in multiple limitrophe communes!
  await client.query(`
    ALTER TABLE schools DROP CONSTRAINT IF EXISTS schools_code_key;
    ALTER TABLE schools DROP CONSTRAINT IF EXISTS district_code_unique;
    ALTER TABLE schools ADD CONSTRAINT district_code_unique UNIQUE (district_id, code);
  `);
  console.log("✅ Composite UNIQUE constraint (district_id, code) enforced successfully!");

  // 2. Clear existing schools table
  console.log("🗑️ Clearing existing schools table...");
  await client.query("TRUNCATE TABLE schools RESTART IDENTITY CASCADE;");
  console.log("✅ Schools table cleared.");

  // 3. Load CSVs
  console.log("📖 Loading CSV raw datasets...");
  const publicSchools = await readCSV(CSV_PUBLIC);
  console.log(`✅ Loaded ${publicSchools.length} public schools from CSV.`);
  
  const privateSchools = await readCSV(CSV_PRIVATE);
  console.log(`✅ Loaded ${privateSchools.length} private schools from CSV.`);

  const allSchools = [
    ...publicSchools.map(s => ({ ...s, type: 1 })),
    ...privateSchools.map(s => ({ ...s, type: 2 })),
  ];

  console.log(`📊 Processing a total of ${allSchools.length} schools...`);

  // Fetch all districts to map them easily
  const distRes = await client.query(`
    SELECT d.id, d.code as district_code, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'DZ'
  `);
  
  const districtsMap = new Map();
  for (const d of distRes.rows) {
    const key = `${d.region_code}_${d.district_code}`;
    districtsMap.set(key, d.id);
  }

  // 4. Batch insert
  let inserted = 0;
  let skipped = 0;
  const batchSize = 100;
  
  for (let i = 0; i < allSchools.length; i += batchSize) {
    const batch = allSchools.slice(i, i + batchSize);
    
    // We will build a batch insert query
    const values = [];
    const valuePlaceholders = [];
    let placeholderIndex = 1;

    for (const s of batch) {
      const code = s.ecole_code;
      const rawName = s.nom_ecole || s.nom_ar || s.nom_ecole;
      const communeCode = s.commune_code;
      const wilayaCode = (s.wilaya_code || "").padStart(2, "0");
      const type = s.type;

      if (!rawName || !communeCode || !wilayaCode) {
        skipped++;
        continue;
      }

      // Map to correct district_id using our cached map
      const districtKey = `${wilayaCode}_${communeCode}`;
      const districtId = districtsMap.get(districtKey);

      if (!districtId) {
        skipped++;
        continue;
      }

      const cleanName = cleanArabicName(rawName);

      // As per Condition 1:
      // In Arabic layout: school name is Clean Arabic
      // In French layout: school name is ALSO Clean Arabic (no translation/transliteration)
      const nameLocal = cleanName;
      const nameFr = cleanName; 

      values.push(districtId, code || null, nameLocal, nameFr, type);
      valuePlaceholders.push(`($${placeholderIndex}, $${placeholderIndex + 1}, $${placeholderIndex + 2}, $${placeholderIndex + 3}, $${placeholderIndex + 4})`);
      placeholderIndex += 5;
    }

    if (values.length > 0) {
      const query = `
        INSERT INTO schools (district_id, code, name_local, name_fr, type)
        VALUES ${valuePlaceholders.join(", ")}
        ON CONFLICT (district_id, code) DO UPDATE SET
          name_local = EXCLUDED.name_local,
          name_fr = EXCLUDED.name_fr,
          updated_at = NOW()
      `;

      await client.query(query, values);
      inserted += values.length / 5;
    }

    if (inserted % 5000 === 0 || i + batchSize >= allSchools.length) {
      process.stdout.write(`\r  📊 Progress: ${inserted}/${allSchools.length} imported...`);
    }
  }

  console.log("\n");
  console.log(`✅ Successfully imported all schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows (missing district mapping or invalid columns)`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
