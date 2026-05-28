require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const CSV_CZ = path.join(__dirname, 'data', 'ecoles_primaires_r_tcheque.csv');

const CZECH_KRAJE = [
  { code: 'CZ010', nameLocal: 'Hlavní město Praha', nameFr: 'Prague' },
  { code: 'CZ020', nameLocal: 'Středočeský', nameFr: 'Bohême-Centrale' },
  { code: 'CZ031', nameLocal: 'Jihočeský', nameFr: 'Bohême du Sud' },
  { code: 'CZ032', nameLocal: 'Plzeňský', nameFr: 'Plzeň' },
  { code: 'CZ041', nameLocal: 'Karlovarský', nameFr: 'Karlovy Vary' },
  { code: 'CZ042', nameLocal: 'Ústecký', nameFr: 'Ústí nad Labem' },
  { code: 'CZ051', nameLocal: 'Liberecký', nameFr: 'Liberec' },
  { code: 'CZ052', nameLocal: 'Královéhradecký', nameFr: 'Hradec Králové' },
  { code: 'CZ053', nameLocal: 'Pardubický', nameFr: 'Pardubice' },
  { code: 'CZ063', nameLocal: 'Olomoucký', nameFr: 'Olomouc' },
  { code: 'CZ064', nameLocal: 'Moravskoslezský', nameFr: 'Moravie-Silésie' },
  { code: 'CZ071', nameLocal: 'Jihomoravský', nameFr: 'Moravie du Sud' },
  { code: 'CZ072', nameLocal: 'Zlínský', nameFr: 'Zlín' },
  { code: 'CZ080', nameLocal: 'Vysočina', nameFr: 'Vysočina' },
];

function parseCsvLine(line, separator = ';') {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim().replace(/^"|"$/g, ''));
  return values;
}

function schoolTypeFromFounder(zrizovatel) {
  // 5 = právnická osoba (souvent privée), 7 = autre
  return zrizovatel === '5' || zrizovatel === '7' ? 2 : 1;
}

async function seedCzechSchools() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('🔌 Connected to database.');

    const countryRes = await client.query("SELECT id FROM countries WHERE code = 'CZ'");
    if (countryRes.rows.length === 0) {
      await client.query(
        `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
         VALUES ('CZ', 'République tchèque', 'Czech Republic', 'Česká republika', '🇨🇿', 'cs', true)`
      );
      console.log('🇨🇿 Added Czech Republic to countries table.');
    } else {
      console.log('🇨🇿 Czech Republic already exists in countries table.');
    }

    console.log('📖 Loading ecoles_primaires_r_tcheque.csv...');
    const csvContent = fs.readFileSync(CSV_CZ, 'utf-8');
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim());
    const headers = parseCsvLine(lines[0], ';');
    const idx = (name) => headers.indexOf(name);

    const uzemiMap = new Map();
    const validSchools = [];
    const seenIzo = new Set();
    let skippedRows = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i], ';');
      if (values.length < headers.length) continue;

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      if (row['Název'] !== 'Základní škola') continue;

      const izo = row['IZO'];
      if (!izo || seenIzo.has(izo)) {
        skippedRows++;
        continue;
      }
      seenIzo.add(izo);

      const uzemi = row['Území'];
      const krajCode = uzemi ? uzemi.substring(0, 5) : null;
      const schoolName = row['Plný název'] || row['Zkrácený název'];
      const place = row['Škola - Místo'] || row['Místo'];

      if (!uzemi || !krajCode || !schoolName) continue;

      if (!uzemiMap.has(uzemi)) {
        uzemiMap.set(uzemi, {
          code: uzemi,
          regionCode: krajCode,
          nameLocal: place || uzemi,
          count: 0,
        });
      }
      const uz = uzemiMap.get(uzemi);
      uz.count++;
      if (place && uz.count === 1) uz.nameLocal = place;

      validSchools.push({
        code: izo,
        name: schoolName,
        districtCode: uzemi,
        regionCode: krajCode,
        type: schoolTypeFromFounder(row['Zřizovatel']),
        lat: null,
        lng: null,
      });
    }

    console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
    console.log(`📊 Primary schools (unique IZO): ${validSchools.length} (${skippedRows} duplicate rows skipped).`);
    console.log(`📊 Kraje: ${CZECH_KRAJE.length}, Okresy (Území): ${uzemiMap.size}.`);

    console.log('📁 Seeding Kraje (regions)...');
    await client.query("DELETE FROM regions WHERE country_code = 'CZ'");
    for (const kraj of CZECH_KRAJE) {
      await client.query(
        "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'CZ')",
        [kraj.code, kraj.nameLocal, kraj.nameFr]
      );
    }

    const regionIds = new Map();
    for (const kraj of CZECH_KRAJE) {
      const res = await client.query(
        "SELECT id FROM regions WHERE code = $1 AND country_code = 'CZ'",
        [kraj.code]
      );
      if (res.rows.length > 0) regionIds.set(kraj.code, res.rows[0].id);
    }

    console.log('📁 Seeding Okresy (districts)...');
    await client.query(`
      DELETE FROM districts
      WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CZ')
    `);

    const uzemiArray = Array.from(uzemiMap.values());
    for (const uz of uzemiArray) {
      const regionId = regionIds.get(uz.regionCode);
      if (!regionId) {
        console.warn(`⚠️  No region ID for kraj: ${uz.regionCode}`);
        continue;
      }
      await client.query(
        'INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4)',
        [uz.code, uz.nameLocal, uz.nameLocal, regionId]
      );
    }

    console.log('🗑️ Clearing existing CZ schools...');
    await client.query(`
      DELETE FROM schools
      WHERE district_id IN (
        SELECT id FROM districts
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CZ')
      )
    `);

    const districtIds = new Map();
    for (const uz of uzemiArray) {
      const res = await client.query('SELECT id FROM districts WHERE code = $1', [uz.code]);
      if (res.rows.length > 0) districtIds.set(uz.code, res.rows[0].id);
    }

    console.log('📥 Seeding CZ primary schools...');
    const batchSize = 200;
    let inserted = 0;

    for (let i = 0; i < validSchools.length; i += batchSize) {
      const batch = validSchools
        .slice(i, i + batchSize)
        .filter((school) => districtIds.has(school.districtCode));

      const params = [];
      const placeholders = [];

      batch.forEach((school, j) => {
        const districtId = districtIds.get(school.districtCode);
        const base = j * 6;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`
        );
        params.push(
          school.code,
          school.name,
          school.name,
          districtId,
          school.type,
          'msmt.cz'
        );
      });

      if (placeholders.length > 0) {
        await client.query(
          `INSERT INTO schools (code, name_local, name_fr, district_id, type, source)
           VALUES ${placeholders.join(',')}`,
          params
        );
        inserted += placeholders.length;
      }

      if ((i + batchSize) % 1000 === 0 || i + batchSize >= validSchools.length) {
        console.log(`  📊 Progress: ${Math.min(i + batchSize, validSchools.length)}/${validSchools.length}...`);
      }
    }

    const countRes = await client.query(`
      SELECT COUNT(*)::int AS count FROM schools
      WHERE district_id IN (
        SELECT id FROM districts
        WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'CZ')
      )
    `);

    console.log('✅ Successfully imported Czech primary schools!');
    console.log(`🎉 Total in database: ${countRes.rows[0].count} records (batch inserted: ${inserted}).`);
  } catch (error) {
    console.error('❌ Error seeding Czech schools:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🏁 Database seeding complete.');
  }
}

seedCzechSchools().catch(console.error);
