const fs = require("fs");
const path = require("path");

function patchFile(filePath) {
  let source = fs.readFileSync(filePath, "utf8");
  if (!source.includes("StyleSheet.create")) return false;

  let changed = false;

  if (!source.includes("FgType")) {
    const themeImport = source.match(/import\s+\{([^}]+)\}\s+from\s+["']@\/ui\/theme["']/);
    if (themeImport) {
      if (!themeImport[1].includes("FgType")) {
        source = source.replace(
          /import\s+\{([^}]+)\}\s+from\s+["']@\/ui\/theme["']/,
          'import { $1, FgType } from "@/ui/theme"'
        );
        changed = true;
      }
    } else {
      const firstImport = source.indexOf("import ");
      const line = 'import { FgType } from "@/ui/theme";\n';
      if (firstImport >= 0) {
        source = source.slice(0, firstImport) + line + source.slice(firstImport);
      } else {
        source = line + source;
      }
      changed = true;
    }
  }

  const next = source.replace(
    /(\w+):\s*\{([^{}]*fontSize[^{}]*)\}/g,
    (full, key, body) => {
      if (body.includes("fontFamily") || body.includes("FgType")) return full;
      return `${key}: { ...FgType.regular, ${body.trim()} }`;
    }
  );

  if (next !== source) {
    source = next;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, source);
    console.log(filePath);
  }
  return changed;
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".expo") walk(full);
    } else if (/\.tsx?$/.test(entry.name) && !full.includes("fonts.ts") && !full.includes("theme.ts")) {
      patchFile(full);
    }
  }
}

walk(path.join(__dirname, ".."));
