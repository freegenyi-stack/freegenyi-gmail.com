const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, 'data', 'ecoles_primaires_liban.csv'), 'utf-8').replace(/^\uFEFF/, '');
const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
console.log('HEADERS:', lines[0]);

const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
console.log('\nParsed headers:', JSON.stringify(headers));

const regionIdx = headers.indexOf('المنطقة_التربوية');
const ownerIdx  = headers.indexOf('المالك');
console.log('regionIdx:', regionIdx, '  ownerIdx:', ownerIdx);

const regions = new Set();
const owners = new Set();
for (let i = 1; i < lines.length; i++) {
  const vals = lines[i].split(',');
  if (vals[regionIdx]) regions.add(vals[regionIdx].trim().replace(/"/g, ''));
  if (vals[ownerIdx])  owners.add(vals[ownerIdx].trim().replace(/"/g, ''));
}

console.log('\nAll unique regions (' + regions.size + '):');
[...regions].sort().forEach(r => console.log('  |' + r + '|'));

console.log('\nAll unique owners:');
[...owners].forEach(o => console.log('  |' + o + '|'));
