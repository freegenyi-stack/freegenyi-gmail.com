const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '..'));

files.forEach(file => {
  if (file.includes('node_modules') || file.includes('.next')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Revert back from (locale === "ar" || locale.endsWith("-ar")) to locale === "ar"
  content = content.replace(/\(locale\s*===\s*["']ar["']\s*\|\|\s*locale\.endsWith\s*\(\s*["']-ar["']\s*\)\)/g, 'locale === "ar"');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Reverted locale checks in: ${path.relative(path.join(__dirname, '..'), file)}`);
  }
});

console.log("All locale checks successfully reverted back to original state!");
