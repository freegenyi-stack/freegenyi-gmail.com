const fs = require('fs');
const content = fs.readFileSync('src/db/seeds/data/ecoles_primaires_royaume_uni.csv', 'utf8');
const lines = content.trim().split('\n');
console.log('Total lignes:', lines.length - 1);

function parseLine(line) {
  const cols = [];
  let cur = '', inQ = false;
  for (let c of line) {
    if (c === '"') inQ = !inQ;
    else if (c === ',' && !inQ) { cols.push(cur); cur = ''; }
    else cur += c;
  }
  cols.push(cur.replace(/\r/, ''));
  return cols;
}

const header = parseLine(lines[0]);
const statusCol = header.indexOf('EstablishmentStatus (name)');
const phaseCol = header.indexOf('PhaseOfEducation (name)');
const typeCol = header.indexOf('TypeOfEstablishment (name)');
const gorCol = header.indexOf('GOR (name)');
const nameCol = header.indexOf('EstablishmentName');
const laCol = header.indexOf('LA (name)');
const townCol = header.indexOf('Town');

console.log('Colonnes clés trouvées:', { statusCol, phaseCol, typeCol, gorCol, nameCol, laCol, townCol });

let statusCounts = {}, phaseCounts = {}, typeCounts = {}, gorCounts = {};
let missingName = 0, missingRegion = 0, openPrimary = 0;

lines.slice(1).forEach(line => {
  const cols = parseLine(line);
  const status = cols[statusCol] || '';
  const phase = cols[phaseCol] || '';
  const type = cols[typeCol] || '';
  const gor = cols[gorCol] || '';
  const name = cols[nameCol] || '';

  statusCounts[status] = (statusCounts[status] || 0) + 1;
  phaseCounts[phase] = (phaseCounts[phase] || 0) + 1;
  typeCounts[type] = (typeCounts[type] || 0) + 1;
  gorCounts[gor] = (gorCounts[gor] || 0) + 1;
  if (!name) missingName++;
  if (!gor) missingRegion++;
  if (status === 'Open' && phase === 'Primary') openPrimary++;
});

console.log('\n--- Statuts ---');
Object.entries(statusCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(' ', k, ':', v));
console.log('\n--- Phase ---');
Object.entries(phaseCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(' ', k, ':', v));
console.log('\n--- Types (top 12) ---');
Object.entries(typeCounts).sort((a,b) => b[1]-a[1]).slice(0,12).forEach(([k,v]) => console.log(' ', k, ':', v));
console.log('\n--- Regions GOR (Government Office Region) ---');
Object.entries(gorCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(' ', k, ':', v));
console.log('\nNom manquant:', missingName, '/ Region manquante:', missingRegion);
console.log('\n✅ Écoles primaires OPEN:', openPrimary);
