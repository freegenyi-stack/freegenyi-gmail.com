const fs = require('fs');
const readline = require('readline');
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/freegenydb";
const client = new Client({ connectionString: DATABASE_URL });

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

async function main() {
  await client.connect();

  const rows = [];
  const rl = readline.createInterface({
    input: fs.createReadStream('c:/Users/Yousr/freegonya/base/ecoles_privees_algerie.csv', { encoding: "utf8" }),
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

  const records = rows;
  console.log(`Total rows in CSV: ${records.length}`);

  let missingCommuneCode = 0;
  let missingDistrictInDb = 0;
  let validToInsert = 0;

  for (const s of records) {
    const communeCode = s.commune_code;
    let wilayaCode = s.wilaya_code ? s.wilaya_code.padStart(2, "0") : null;
    
    if (!communeCode) {
      missingCommuneCode++;
      continue;
    }

    const distRes = await client.query(
      `SELECT d.id FROM districts d
       JOIN regions r ON r.id = d.region_id
       WHERE d.code = $1 AND r.code = $2`,
      [communeCode, wilayaCode]
    );

    if (distRes.rows.length === 0) {
      missingDistrictInDb++;
      // Let's insert the missing district if possible!
      // But we need the region id
      const regionRes = await client.query(`SELECT id FROM regions WHERE code = $1`, [wilayaCode]);
      if (regionRes.rows.length > 0) {
        const cName = s.commune || `Commune ${communeCode}`;
        let ar = cName, fr = cName;
        const match = cName.match(/^(.*?)\s*\((.*?)\)$/);
        if (match) { ar = match[1].trim(); fr = match[2].trim(); }
        
        await client.query(
          `INSERT INTO districts (region_id, code, name_local, name_fr) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [regionRes.rows[0].id, communeCode, ar, fr]
        );
        missingDistrictInDb--; // Successfully resolved
        validToInsert++;
      } else {
        // region not found
      }
    } else {
      validToInsert++;
    }
  }

  console.log(`Missing commune_code in CSV: ${missingCommuneCode}`);
  console.log(`Missing district in DB: ${missingDistrictInDb}`);
  console.log(`Valid to insert: ${validToInsert}`);
  
  let inserted = 0;
  // Now actually insert them
  for (const s of records) {
    const code = s.ecole_code;
    const nameAr = s.nom_ecole;
    const communeCode = s.commune_code;
    const wilayaCode = s.wilaya_code ? s.wilaya_code.padStart(2, "0") : null;

    if (!nameAr || !communeCode) continue;

    const distRes = await client.query(
      `SELECT d.id FROM districts d
       JOIN regions r ON r.id = d.region_id
       WHERE d.code = $1 AND r.code = $2`,
      [communeCode, wilayaCode]
    );

    if (distRes.rows.length > 0) {
      const nameFr = nameAr.replace("إبتدائية", "École").replace("ابتدائية", "École");
      await client.query(
        `INSERT INTO schools (district_id, code, name_local, name_fr, type, source)
         VALUES ($1, $2, $3, $4, 2, 'awlyaa.education.dz')
         ON CONFLICT (code) DO UPDATE SET type = 2, name_local = EXCLUDED.name_local, name_fr = EXCLUDED.name_fr`,
        [distRes.rows[0].id, code || null, nameAr, nameFr]
      );
      inserted++;
    }
  }

  console.log(`Successfully processed/inserted: ${inserted}`);

  await client.end();
}

main().catch(console.error);
