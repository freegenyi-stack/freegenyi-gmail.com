require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

const client = new Client({ connectionString: DATABASE_URL });

// South African provinces (regions)
const southAfricaProvinces = [
  { code: 'WC', name: 'Western Cape', name_local: 'Western Cape', name_fr: 'Cap-Occidental' },
  { code: 'EC', name: 'Eastern Cape', name_local: 'Eastern Cape', name_fr: 'Cap-Oriental' },
  { code: 'NC', name: 'Northern Cape', name_local: 'Northern Cape', name_fr: 'Cap-Nord' },
  { code: 'FS', name: 'Free State', name_local: 'Free State', name_fr: 'État-Libre' },
  { code: 'KZN', name: 'KwaZulu-Natal', name_local: 'KwaZulu-Natal', name_fr: 'KwaZulu-Natal' },
  { code: 'GP', name: 'Gauteng', name_local: 'Gauteng', name_fr: 'Gauteng' },
  { code: 'MP', name: 'Mpumalanga', name_local: 'Mpumalanga', name_fr: 'Mpumalanga' },
  { code: 'LP', name: 'Limpopo', name_local: 'Limpopo', name_fr: 'Limpopo' },
  { code: 'NW', name: 'North West', name_local: 'North West', name_fr: 'Nord-Ouest' },
];

// Province name to code mapping
const provinceNameToCode = {
  '1. Western Cape': 'WC',
  'Western Cape': 'WC',
  '2. Eastern Cape': 'EC',
  'Eastern Cape': 'EC',
  '3. Northern Cape': 'NC',
  'Northern Cape': 'NC',
  '4. Free State': 'FS',
  'Free State': 'FS',
  '5. KwaZulu-Natal': 'KZN',
  'KwaZulu-Natal': 'KZN',
  '6. Gauteng': 'GP',
  'Gauteng': 'GP',
  '7. Mpumalanga': 'MP',
  'Mpumalanga': 'MP',
  '8. Limpopo': 'LP',
  'Limpopo': 'LP',
  '9. North West': 'NW',
  'North West': 'NW',
};

// Normalize province name for matching
function normalizeProvinceName(name) {
  return name.trim();
}

// Parse CSV line (comma-separated)
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

// Read CSV file
function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = parseCsvLine(lines[0]);
  
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
  console.log('🇿🇦 Connected to database');

  // Check if South Africa exists in countries table
  const countryRes = await client.query("SELECT id FROM countries WHERE code = 'ZA'");
  if (countryRes.rows.length === 0) {
    await client.query(
      `INSERT INTO countries (code, name_fr, name_en, name_local, flag_emoji, langs, is_active)
       VALUES ('ZA', 'Afrique du Sud', 'South Africa', 'South Africa', '🇿🇦', 'en,af,zu,xh', true)`
    );
    console.log('🇿🇦 South Africa added to countries table.');
  } else {
    console.log('🇿🇦 South Africa already exists in countries table.');
  }

  const countryId = (await client.query("SELECT id FROM countries WHERE code = 'ZA'")).rows[0].id;

  // Clean up existing South Africa data
  console.log('🇿🇦 Cleaning up existing South Africa data...');
  await client.query("DELETE FROM schools WHERE code LIKE '1%'");
  await client.query("DELETE FROM districts WHERE country_code = 'ZA'");
  await client.query("DELETE FROM regions WHERE country_code = 'ZA'");
  console.log('✅ Cleanup complete');

  // Seed provinces (regions)
  console.log('🇿🇦 Seeding provinces...');
  for (const province of southAfricaProvinces) {
    await client.query(
      `INSERT INTO regions (country_code, code, name_local, name_fr)
       VALUES ($1, $2, $3, $4)`,
      ['ZA', province.code, province.name_local, province.name_fr]
    );
  }
  console.log(`✅ ${southAfricaProvinces.length} provinces seeded`);

  // Get region IDs
  const regionIds = {};
  for (const province of southAfricaProvinces) {
    const res = await client.query(
      `SELECT id FROM regions WHERE code = $1 AND country_code = 'ZA'`,
      [province.code]
    );
    regionIds[province.code] = res.rows[0].id;
  }

  // Read and process CSV
  const csvPath = path.join(__dirname, 'data', 'ecoles_primaires_afrique_du_sud.csv');
  const schools = readCSV(csvPath);
  console.log(`📖 Read ${schools.length} schools from CSV`);

  // Filter primary schools and extract unique districts
  const primarySchools = schools.filter(s => 
    s.Phase_PED && s.Phase_PED.includes('Primary School') && s.NatEmis
  );
  console.log(`🎯 Filtered ${primarySchools.length} primary schools`);

  // Extract unique districts
  const districtSet = new Set();
  primarySchools.forEach(school => {
    if (school.DMunName) {
      districtSet.add(school.DMunName.trim());
    }
  });

  const districts = Array.from(districtSet).map(name => ({
    name: name,
    name_local: name,
    name_fr: name
  }));

  console.log(`📍 Found ${districts.length} unique districts`);

  // Seed districts
  console.log('🇿🇦 Seeding districts...');
  const districtIds = {};
  for (const district of districts) {
    // Find which province this district belongs to
    const sampleSchool = primarySchools.find(s => s.DMunName === district.name);
    if (!sampleSchool) continue;

    const provinceName = normalizeProvinceName(sampleSchool.Province);
    const provinceCode = provinceNameToCode[provinceName];
    if (!provinceCode) continue;

    const regionId = regionIds[provinceCode];
    if (!regionId) continue;

    // Generate district code (first 10 chars of name, uppercase)
    const districtCode = district.name.substring(0, 10).toUpperCase().replace(/[^A-Z]/g, '');

    const res = await client.query(
      `INSERT INTO districts (country_code, region_id, code, name_local, name_fr)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['ZA', regionId, districtCode, district.name_local, district.name_fr]
    );
    districtIds[district.name] = res.rows[0].id;
  }
  console.log(`✅ ${Object.keys(districtIds).length} districts seeded`);

  // Seed schools
  console.log('🇿🇦 Seeding schools...');
  let insertedCount = 0;
  const batchSize = 100;
  const values = [];

  for (const school of primarySchools) {
    const provinceName = normalizeProvinceName(school.Province);
    const provinceCode = provinceNameToCode[provinceName];
    if (!provinceCode) continue;

    const districtName = school.DMunName ? school.DMunName.trim() : null;
    if (!districtName || !districtIds[districtName]) continue;

    const districtId = districtIds[districtName];
    const lat = parseFloat(school.GIS_Lat) || null;
    const lng = parseFloat(school.GIS_Long) || null;
    
    // Determine school type (Public = public, Independent = private)
    const type = school.Sector === '1. Public' ? 'public' : 'private';

    // Escape school name
    const schoolName = school.Institution_Name.replace(/'/g, "''");

    values.push(`('${school.NatEmis}', '${schoolName}', '${schoolName}', ${districtId}, '${type}', ${lat}, ${lng})`);

    if (values.length >= batchSize) {
      const query = `
        INSERT INTO schools (code, name_local, name_fr, district_id, type, lat, lng)
        VALUES ${values.join(',')}
      `;
      await client.query(query);
      insertedCount += values.length;
      values.length = 0;
      console.log(`   Inserted ${insertedCount} schools...`);
    }
  }

  // Insert remaining schools
  if (values.length > 0) {
    const query = `
      INSERT INTO schools (code, name_local, name_fr, district_id, type, lat, lng)
      VALUES ${values.join(',')}
    `;
    await client.query(query);
    insertedCount += values.length;
  }

  console.log(`✅ ${insertedCount} schools seeded`);

  await client.end();
  console.log('🏁 Database seeding complete.');
}

main().catch(console.error);
