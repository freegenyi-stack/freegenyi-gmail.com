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
  
  // 1. Check if the file imports next/link
  const nextLinkRegex = /import\s+Link\s+from\s+["']next\/link["'];?/g;
  if (nextLinkRegex.test(content)) {
    // Remove the next/link import
    content = content.replace(nextLinkRegex, '');
    
    // Check if the file already imports from @/i18n/routing
    const routingRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*["']@\/i18n\/routing["'];?/g;
    const routingMatch = routingRegex.exec(content);
    
    if (routingMatch) {
      // Merge Link into the existing import
      const imports = routingMatch[1].split(',').map(s => s.trim());
      if (!imports.includes('Link')) {
        imports.unshift('Link');
      }
      const newImport = `import { ${imports.join(', ')} } from "@/i18n/routing";`;
      content = content.replace(routingRegex, newImport);
    } else {
      // Add a new import from @/i18n/routing
      // Find the first import statement and prepend
      const firstImportIndex = content.indexOf('import');
      if (firstImportIndex !== -1) {
        content = content.substring(0, firstImportIndex) + `import { Link } from "@/i18n/routing";\n` + content.substring(firstImportIndex);
      } else {
        content = `import { Link } from "@/i18n/routing";\n` + content;
      }
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Migrated Link to i18n/routing in: ${path.relative(path.join(__dirname, '..'), file)}`);
  }
});

console.log("All standard Link imports successfully migrated to i18n/routing!");
