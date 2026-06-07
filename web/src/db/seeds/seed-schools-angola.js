require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

const client = new Client({ connectionString: DATABASE_URL });

const angolaProvinces = [
  { code: 'BGO', name_local: 'Bengo', name_fr: 'Bengo' },
  { code: 'BGE', name_local: 'Benguela', name_fr: 'Benguela' },
  { code: 'BIE', name_local: 'Bié', name_fr: 'Bié' },
  { code: 'CAB', name_local: 'Cabinda', name_fr: 'Cabinda' },
  { code: 'CCU', name_local: 'Cuando Cubango', name_fr: 'Cuando Cubango' },
  { code: 'CNO', name_local: 'Cuanza Norte', name_fr: 'Cuanza Norte' },
  { code: 'CSU', name_local: 'Cuanza Sul', name_fr: 'Cuanza Sul' },
  { code: 'CUN', name_local: 'Cunene', name_fr: 'Cunene' },
  { code: 'HUA', name_local: 'Huambo', name_fr: 'Huambo' },
  { code: 'HUI', name_local: 'Huíla', name_fr: 'Huíla' },
  { code: 'LUA', name_local: 'Luanda', name_fr: 'Luanda' },
  { code: 'LNO', name_local: 'Lunda Norte', name_fr: 'Lunda Norte' },
  { code: 'LSU', name_local: 'Lunda Sul', name_fr: 'Lunda Sul' },
  { code: 'MAL', name_local: 'Malanje', name_fr: 'Malanje' },
  { code: 'MOX', name_local: 'Moxico', name_fr: 'Moxico' },
  { code: 'NAM', name_local: 'Namibe', name_fr: 'Namibe' },
  { code: 'UIG', name_local: 'Uíge', name_fr: 'Uíge' },
  { code: 'ZAI', name_local: 'Zaire', name_fr: 'Zaire' }
];

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const headers = parseCsvLine(lines[0]).map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

async function main() {
  await client.connect();
  console.log('🇦🇴 Connected to database');

  // Check if Angola exists in countries
  const countryRes = await client.query("SELECT id FROM countries WHERE code = 'AO'");
  if (countryRes.rows.length === 0) {
    await client.query(
      `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
       VALUES ('AO', 'Angola', 'Angola', 'Angola', '🇦🇴', 'pt', true)`
    );
    console.log('🇦🇴 Angola added to countries table.');
  } else {
    console.log('🇦🇴 Angola already exists in countries table.');
  }

  // Clean up existing Angola data using regions
  console.log('🇦🇴 Cleaning up existing Angola schools/districts/regions...');
  await client.query(`
    DELETE FROM schools WHERE district_id IN (
      SELECT d.id FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'AO'
    )
  `);
  await client.query(`
    DELETE FROM districts WHERE region_id IN (
      SELECT id FROM regions WHERE country_code = 'AO'
    )
  `);
  await client.query("DELETE FROM regions WHERE country_code = 'AO'");
  console.log('✅ Cleanup complete');

  // Seed provinces (regions)
  console.log('🇦🇴 Seeding provinces...');
  for (const province of angolaProvinces) {
    await client.query(
      `INSERT INTO regions (country_code, code, name_local, name_fr)
       VALUES ($1, $2, $3, $4)`,
      ['AO', province.code, province.name_local, province.name_fr]
    );
  }
  console.log(`✅ ${angolaProvinces.length} provinces seeded`);

  // Get region IDs
  const regionIds = {};
  for (const province of angolaProvinces) {
    const res = await client.query(
      `SELECT id FROM regions WHERE code = $1 AND country_code = 'AO'`,
      [province.code]
    );
    regionIds[province.code] = res.rows[0].id;
  }

  // Read CSV
  const csvPath = path.join(__dirname, 'data', 'ecoles_primaires_angola.csv');
  const rawSchools = readCSV(csvPath);
  console.log(`📖 Read ${rawSchools.length} raw schools from CSV`);

  // Filter primary schools
  const primarySchools = rawSchools.filter(s => {
    const name = (s.name || s.name_pt || s.name_en || '').toLowerCase();
    const city = (s.addr_city || '').toLowerCase();
    
    // Ignore high level institutes/universities
    if (name.includes('universidade') || name.includes('instituto superior') || name.includes('instituto médio') || name.includes('liceu')) {
      return false;
    }
    return true;
  });
  console.log(`🎯 Filtered ${primarySchools.length} candidate primary schools`);

  // Detect and resolve Province & Municipality (District) for each school
  const provinceCodesByName = {
    'bengo': 'BGO',
    'benguela': 'BGE',
    'bié': 'BIE', 'bie': 'BIE',
    'cabinda': 'CAB',
    'cuando cubango': 'CCU',
    'cuanza norte': 'CNO',
    'cuanza sul': 'CSU',
    'cunene': 'CUN',
    'huambo': 'HUA',
    'huíla': 'HUI', 'huila': 'HUI',
    'luanda': 'LUA',
    'lunda norte': 'LNO',
    'lunda sul': 'LSU',
    'malanje': 'MAL',
    'moxico': 'MOX',
    'namibe': 'NAM', 'moçâmedes': 'NAM',
    'uíge': 'UIG', 'uige': 'UIG',
    'zaire': 'ZAI'
  };

  const districtSet = new Set();
  const schoolResolvedList = [];

  primarySchools.forEach((school, index) => {
    let rawCity = school.addr_city ? school.addr_city.trim() : '';
    let rawStreet = school.addr_street ? school.addr_street.trim() : '';
    
    let provinceCode = null;
    let municipalityName = null;

    // Check if city maps to a known province name
    const rawCityLower = rawCity.toLowerCase();
    if (provinceCodesByName[rawCityLower]) {
      provinceCode = provinceCodesByName[rawCityLower];
      // If it maps to a province, use city as province, and try to find a sub-district/street or default to "Município de " + province
      municipalityName = `Município de ${provinceCode === 'NAM' ? 'Moçâmedes' : provinceCode === 'CAB' ? 'Cabinda' : provinceCode === 'LUA' ? 'Luanda' : rawCity}`;
    } else {
      // Lubango is in Huíla
      if (rawCityLower.includes('lubango') || rawStreet.toLowerCase().includes('lubango')) {
        provinceCode = 'HUI';
        municipalityName = 'Município do Lubango';
      } else if (rawCityLower.includes('soyo')) {
        provinceCode = 'ZAI';
        municipalityName = 'Município do Soyo';
      } else if (rawCityLower.includes('lobito')) {
        provinceCode = 'BGE';
        municipalityName = 'Município do Lobito';
      } else if (rawCityLower.includes('humpata')) {
        provinceCode = 'HUI';
        municipalityName = 'Município da Humpata';
      } else if (rawCityLower.includes('cuito') || rawCityLower.includes('cuíto')) {
        provinceCode = 'BIE';
        municipalityName = 'Município do Cuito';
      } else if (rawCityLower.includes('ganda')) {
        provinceCode = 'BGE';
        municipalityName = 'Município da Ganda';
      } else if (rawCityLower.includes('ondjiva')) {
        provinceCode = 'CUN';
        municipalityName = 'Município de Cuanhama (Ondjiva)';
      } else if (rawCityLower.includes('tômbua')) {
        provinceCode = 'NAM';
        municipalityName = 'Município do Tômbua';
      } else if (rawCityLower.includes('viana')) {
        provinceCode = 'LUA';
        municipalityName = 'Município de Viana';
      } else if (rawCityLower.includes('cazenga')) {
        provinceCode = 'LUA';
        municipalityName = 'Município do Cazenga';
      } else {
        // Default to Luanda if not found or cannot map
        provinceCode = 'LUA';
        municipalityName = 'Município de Luanda';
      }
    }

    const distKey = `${provinceCode}::${municipalityName}`;
    districtSet.add(distKey);

    schoolResolvedList.push({
      ...school,
      resolvedProvince: provinceCode,
      resolvedMunicipality: municipalityName,
      distKey,
      index
    });
  });

  // Seed districts
  console.log('🇦🇴 Seeding districts (municipalities)...');
  const districtIds = {};
  const districtCounters = {};

  for (const distKey of districtSet) {
    const [provCode, munName] = distKey.split('::');
    const regionId = regionIds[provCode];
    if (!regionId) continue;

    districtCounters[provCode] = (districtCounters[provCode] || 0) + 1;
    const districtCode = `AO-${provCode}-${String(districtCounters[provCode]).padStart(2, '0')}`;

    const res = await client.query(
      `INSERT INTO districts (region_id, code, name_local, name_fr)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [regionId, districtCode, munName, munName]
    );
    districtIds[distKey] = res.rows[0].id;
  }
  console.log(`✅ ${Object.keys(districtIds).length} municipalities seeded`);

  // Seed schools using parameterized queries to avoid SQL injection and type errors
  console.log('🇦🇴 Seeding schools...');
  let insertedCount = 0;

  for (const school of schoolResolvedList) {
    const districtId = districtIds[school.distKey];
    if (!districtId) continue;

    const lat = parseFloat(school.latitude) || null;
    const lng = parseFloat(school.longitude) || null;

    // Determine type (private or public) - type column is smallint (1 = public, 2 = private)
    let typeVal = 1; // public
    if (school.operator_type === 'private' || school.operator_type === 'religious') {
      typeVal = 2; // private
    }

    // Determine name
    let rawName = (school.name || school.name_pt || school.name_en || '').trim();
    if (!rawName) {
      rawName = `Escola Primária Sem Nome [${school.id.replace('node/', '').replace('way/', '')}]`;
    }

    const schoolCode = `AO-${school.id.replace('node/', '').replace('way/', '')}`;

    await client.query(
      `INSERT INTO schools (code, name_local, name_fr, district_id, type, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [schoolCode, rawName, rawName, districtId, typeVal, lat, lng]
    );
    insertedCount++;

    if (insertedCount % 100 === 0) {
      console.log(`   Inserted ${insertedCount} schools...`);
    }
  }

  console.log(`✅ ${insertedCount} schools seeded`);

  await client.end();
  console.log('🏁 Database seeding complete.');
}

main().catch(console.error);
