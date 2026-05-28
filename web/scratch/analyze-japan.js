const fs = require('fs');
const path = require('path');

const CSV_JP = path.join(__dirname, '..', 'src', 'db', 'seeds', 'data', 'ecoles_primaires_japon.csv');

function extractMunicipality(address, prefecture) {
  let rest = address;
  if (address.startsWith(prefecture)) {
    rest = address.substring(prefecture.length);
  }
  
  const wardMatch = rest.match(/^([^市]+市[^区]+区)/);
  if (wardMatch) {
    return wardMatch[1];
  }
  
  const gunMatch = rest.match(/^([^郡]+郡[^町村]+[町村])/);
  if (gunMatch) {
    return gunMatch[1];
  }
  
  const simpleMatch = rest.match(/^([^市区町村]+[市区町村])/);
  if (simpleMatch) {
    return simpleMatch[1];
  }
  
  return "その他";
}

function main() {
  console.log("📖 Reading CSV...");
  const content = fs.readFileSync(CSV_JP, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  console.log("Headers:", headers);
  
  const prefectures = new Set();
  const municipalities = new Set();
  let validSchoolsCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (simple split by comma is fine if there are no commas in quotes, let's verify if there are any)
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length !== headers.length) continue;
    
    const school = {};
    headers.forEach((h, index) => {
      school[h] = values[index];
    });
    
    // Only process primary schools (学校種 is B1(小学校))
    if (!school['学校種 (Type école)'] || !school['学校種 (Type école)'].includes('小学校')) continue;
    
    // Skip closed schools (属性情報廃止年月日 is not empty)
    if (school['属性情報廃止年月日 (Date fermeture)']) continue;
    
    const pref = school['都道府県名 (Préfecture)'];
    const addr = school['学校所在地 (Adresse)'];
    
    if (pref) {
      prefectures.add(pref);
      const muni = extractMunicipality(addr, pref);
      municipalities.add(`${pref}_${muni}`);
      validSchoolsCount++;
    }
  }
  
  console.log(`📊 Valid primary schools found: ${validSchoolsCount}`);
  console.log(`📊 Unique Prefectures found: ${prefectures.size}`);
  console.log(`📊 Unique Municipalities found: ${municipalities.size}`);
  
  console.log("\nPrefectures list:", Array.from(prefectures));
}

main();
