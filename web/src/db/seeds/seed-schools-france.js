const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Support process.env.DATABASE_URL or default local development port
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

const CSV_FRANCE = path.join(__dirname, "data", "ecoles_primaires_france.csv");

const DEPARTMENTS = {
  "01": "Ain", "02": "Aisne", "03": "Allier", "04": "Alpes-de-Haute-Provence", "05": "Hautes-Alpes",
  "06": "Alpes-Maritimes", "07": "Ardèche", "08": "Ardennes", "09": "Ariège", "10": "Aube",
  "11": "Aude", "12": "Aveyron", "13": "Bouches-du-Rhône", "14": "Calvados", "15": "Cantal",
  "16": "Charente", "17": "Charente-Maritime", "18": "Cher", "19": "Corrèze", "2A": "Corse-du-Sud",
  "2B": "Haute-Corse", "21": "Côte-d'Or", "22": "Côtes-d'Armor", "23": "Creuse", "24": "Dordogne",
  "25": "Doubs", "26": "Drôme", "27": "Eure", "28": "Eure-et-Loir", "29": "Finistère",
  "30": "Gard", "31": "Haute-Garonne", "32": "Gers", "33": "Gironde", "34": "Hérault",
  "35": "Ille-et-Vilaine", "36": "Indre", "37": "Indre-et-Loire", "38": "Isère", "39": "Jura",
  "40": "Landes", "41": "Loir-et-Cher", "42": "Loire", "43": "Haute-Loire", "44": "Loire-Atlantique",
  "45": "Loiret", "46": "Lot", "47": "Lot-et-Garonne", "48": "Lozère", "49": "Maine-et-Loire",
  "50": "Manche", "51": "Marne", "52": "Haute-Marne", "53": "Mayenne", "54": "Meurthe-et-Moselle",
  "55": "Meuse", "56": "Morbihan", "57": "Moselle", "58": "Nièvre", "59": "Nord",
  "60": "Oise", "61": "Orne", "62": "Pas-de-Calais", "63": "Puy-de-Dôme", "64": "Pyrénées-Atlantiques",
  "65": "Hautes-Pyrénées", "66": "Pyrénées-Orientales", "67": "Bas-Rhin", "68": "Haut-Rhin",
  "69": "Rhône", "70": "Haute-Saône", "71": "Saône-et-Loire", "72": "Sarthe", "73": "Savoie",
  "74": "Haute-Savoie", "75": "Paris", "76": "Seine-Maritime", "77": "Seine-et-Marne", "78": "Yvelines",
  "79": "Deux-Sèvres", "80": "Somme", "81": "Tarn", "82": "Tarn-et-Garonne", "83": "Var",
  "84": "Vaucluse", "85": "Vendée", "86": "Vienne", "87": "Haute-Vienne", "88": "Vosges",
  "89": "Yonne", "90": "Territoire de Belfort", "91": "Essonne", "92": "Hauts-de-Seine",
  "93": "Seine-Saint-Denis", "94": "Val-de-Marne", "95": "Val-d'Oise",
  "971": "Guadeloupe", "972": "Martinique", "973": "Guyane", "974": "La Réunion", "976": "Mayotte"
};

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      // Check for double double-quote "" representing an escaped quote inside quotes
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip the next quote
      } else {
        inQuotes = !inQuotes;
      }
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
      headers = cols.map(h => h.toLowerCase().replace(/['"]+/g, '').trim());
      isFirstLine = false;
      continue;
    }
    const row = {};
    headers.forEach((h, i) => {
      let colVal = cols[i] || "";
      // Strip outer quotes if present
      if (colVal.startsWith('"') && colVal.endsWith('"')) {
        colVal = colVal.substring(1, colVal.length - 1);
      }
      row[h] = colVal.trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseAddress(address) {
  if (!address) return null;
  // Match French postal codes (5 digits, e.g. "01000" or "97130")
  const match = address.match(/\b(\d{5})\b/);
  if (!match) return null;
  
  const postalCode = match[1];
  // Determine department code (first 2 digits, or first 3 digits for DOM-TOM)
  let deptCode = postalCode.substring(0, 2);
  if (postalCode.startsWith("97")) {
    deptCode = postalCode.substring(0, 3);
  }

  // Extract everything after the postal code as the commune name
  const idx = address.indexOf(postalCode);
  let commune = address.substring(idx + postalCode.length).trim();
  
  // Clean up leading/trailing symbols (commas, dashes, dots, spaces)
  commune = commune.replace(/^[\s,.-]+/g, "").replace(/[\s,.-]+$/g, "").trim();
  commune = commune.replace(/ France$/gi, "").trim();

  return {
    postalCode,
    deptCode,
    commune: commune.toUpperCase()
  };
}

async function main() {
  console.log("🚀 FreeGeny — Seeding French schools database...");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database.");

  // 1. Ensure France exists in 'countries'
  console.log("🇫🇷 Ensuring France exists in 'countries' table...");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('FR', 'France', 'France', 'France', '🇫🇷', 'fr', true)
    ON CONFLICT (code) DO UPDATE SET is_active = true;
  `);

  // 2. Load schools CSV
  console.log("📖 Loading ecoles_primaires_france.csv...");
  const rawSchools = await readCSV(CSV_FRANCE);
  console.log(`✅ Loaded ${rawSchools.length} rows from CSV.`);

  // 3. Collect unique Departments (Regions) & Communes (Districts)
  const regionsMap = new Map(); // deptCode -> deptName
  const districtsMap = new Map(); // `${deptCode}_${commune}` -> { deptCode, commune, postalCode }

  console.log("🔍 Parsing departments and communes from addresses...");
  const validSchools = [];
  for (const s of rawSchools) {
    const parsed = parseAddress(s.address);
    if (!parsed || !parsed.commune) continue;

    const { deptCode, postalCode, commune } = parsed;
    const deptName = DEPARTMENTS[deptCode] || `Département ${deptCode}`;

    regionsMap.set(deptCode, deptName);
    districtsMap.set(`${deptCode}_${commune}`, { deptCode, commune, postalCode });

    validSchools.push({
      ...s,
      deptCode,
      commune,
      postalCode
    });
  }

  console.log(`📊 Collected ${regionsMap.size} regions and ${districtsMap.size} districts.`);
  console.log(`📊 Processing ${validSchools.length} valid primary schools.`);

  // 4. Seed Regions (Departments)
  console.log("📁 Seeding Regions (Departments)...");
  for (const [deptCode, deptName] of regionsMap.entries()) {
    // Check if region exists
    const exReg = await client.query(
      "SELECT id FROM regions WHERE country_code = 'FR' AND code = $1",
      [deptCode]
    );
    if (exReg.rows.length === 0) {
      await client.query(
        "INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES ('FR', $1, $2, $2, $2)",
        [deptCode, deptName]
      );
    }
  }

  // Fetch all FR regions to map them
  const regRes = await client.query("SELECT id, code FROM regions WHERE country_code = 'FR'");
  const regIdMap = new Map();
  for (const r of regRes.rows) {
    regIdMap.set(r.code, r.id);
  }
  console.log("✅ Regions seeded and cached.");

  // 5. Seed Districts (Communes) in bulk
  console.log("📁 Seeding Districts (Communes)...");
  
  // Fetch existing FR districts to skip duplicates
  const exDistRes = await client.query(`
    SELECT d.id, d.name_local as commune_name, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'FR'
  `);
  
  const existingDistKeys = new Set();
  for (const d of exDistRes.rows) {
    existingDistKeys.add(`${d.region_code}_${d.commune_name}`);
  }

  // We keep a local counter per department to generate a 100% unique short code (e.g. "01-0001")
  const regionCounters = new Map();
  for (const deptCode of regionsMap.keys()) {
    const regionId = regIdMap.get(deptCode);
    if (!regionId) continue;
    const maxCodeRes = await client.query(
      "SELECT code FROM districts WHERE region_id = $1 ORDER BY code DESC LIMIT 1",
      [regionId]
    );
    if (maxCodeRes.rows.length > 0) {
      const lastCode = maxCodeRes.rows[0].code;
      const parts = lastCode.split('-');
      const numPart = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      regionCounters.set(deptCode, isNaN(numPart) ? 1 : numPart + 1);
    } else {
      regionCounters.set(deptCode, 1);
    }
  }

  const missingDistricts = [];
  for (const d of districtsMap.values()) {
    const regionId = regIdMap.get(d.deptCode);
    if (!regionId) continue;

    const key = `${d.deptCode}_${d.commune}`;
    if (!existingDistKeys.has(key)) {
      let currentCounter = regionCounters.get(d.deptCode) || 1;
      const uniqueCode = `${d.deptCode}-${String(currentCounter).padStart(4, '0')}`;
      regionCounters.set(d.deptCode, currentCounter + 1);
      
      missingDistricts.push({
        regionId,
        code: uniqueCode,
        commune: d.commune
      });
    }
  }

  if (missingDistricts.length > 0) {
    console.log(`📥 Batch inserting ${missingDistricts.length} missing districts...`);
    const dBatchSize = 100;
    for (let i = 0; i < missingDistricts.length; i += dBatchSize) {
      const batch = missingDistricts.slice(i, i + dBatchSize);
      const values = [];
      const placeholders = [];
      let idx = 1;
      for (const item of batch) {
        values.push(item.regionId, item.code, item.commune);
        placeholders.push(`($${idx}, $${idx+1}, $${idx+2}, $${idx+2}, $${idx+2})`);
        idx += 3;
      }
      
      await client.query(`
        INSERT INTO districts (region_id, code, name_local, name_fr, name_en)
        VALUES ${placeholders.join(", ")}
      `, values);
    }
    console.log(`✅ Seeding of ${missingDistricts.length} districts complete.`);
  } else {
    console.log("✅ All communes are already up-to-date. Skipping district seeding.");
  }

  // Fetch all FR districts to map them for the schools seeding
  const distRes = await client.query(`
    SELECT d.id, d.name_local as commune_name, r.code as region_code 
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'FR'
  `);
  const distIdMap = new Map();
  for (const d of distRes.rows) {
    distIdMap.set(`${d.region_code}_${d.commune_name}`, d.id);
  }
  console.log("✅ Districts cached for schools mapping.");

  // 6. Clear existing French schools in the table
  console.log("🗑️ Clearing existing French schools from database...");
  await client.query(`
    DELETE FROM schools 
    WHERE district_id IN (
      SELECT d.id 
      FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'FR'
    )
  `);
  console.log("✅ Existing French schools cleared.");

  // 7. Batch insert schools
  console.log("📥 Seeding French schools...");
  let inserted = 0;
  let skipped = 0;
  const batchSize = 150;

  // Track globally inserted (districtId_code) to avoid duplicates within or across batches
  const insertedSet = new Set();

  for (let i = 0; i < validSchools.length; i += batchSize) {
    const batch = validSchools.slice(i, i + batchSize);
    const values = [];
    const valuePlaceholders = [];
    let placeholderIndex = 1;

    for (const s of batch) {
      let code = s.code || "";
      const name = s.name;
      const districtKey = `${s.deptCode}_${s.commune}`;
      const districtId = distIdMap.get(districtKey);

      if (!districtId || !name) {
        skipped++;
        continue;
      }

      // Safety check to truncate code to 20 characters
      if (code.length > 20) {
        code = code.substring(0, 20);
      }

      // Check unique (districtId, code) constraint key
      const globalKey = `${districtId}_${code}`;
      if (insertedSet.has(globalKey)) {
        skipped++;
        continue;
      }
      insertedSet.add(globalKey);

      // Public / Private translation: csv field 'public' is a string ("true"/"false")
      const isPublic = s.public === "true";
      const type = isPublic ? 1 : 2; // 1 = public, 2 = privé

      values.push(districtId, code || null, name, name, type);
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

    if (inserted % 3000 === 0 || i + batchSize >= validSchools.length) {
      process.stdout.write(`\r  📊 Progress: ${inserted}/${validSchools.length} schools imported...`);
    }
  }

  console.log("\n");
  console.log(`✅ Successfully imported French primary schools!`);
  console.log(`🎉 Total inserted: ${inserted} records`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped: ${skipped} rows (duplicates or invalid columns)`);
  }

  await client.end();
  console.log("🏁 Database seeding complete.");
}

main().catch(console.error);
