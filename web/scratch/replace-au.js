const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'auth', 'register', 'RegisterClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of regionCountry === 'AU'
content = content.replace(/regionCountry\s*===\s*'AU'/g, "['AU', 'GB', 'US'].includes(regionCountry)");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated RegisterClient.tsx with English region support!");
