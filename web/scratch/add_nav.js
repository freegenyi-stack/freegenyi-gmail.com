const fs = require('fs');
const path = require('path');

const locales = [
  { file: 'fr.json', val: 'Exploration Libre' },
  { file: 'en.json', val: 'Free Exploration' },
  { file: 'ar.json', val: 'استكشاف حر' }
];

locales.forEach(({ file, val }) => {
  const filePath = path.join(__dirname, '..', 'messages', file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.Nav) data.Nav = {};
    data.Nav.FreeExplore = val;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  }
});
