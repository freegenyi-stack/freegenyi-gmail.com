const fs = require('fs');
const path = 'c:/Users/Yousr/freegonya/assets/js/i18n.js';

try {
    const content = fs.readFileSync(path, 'utf8');

    // Extract the translations object string
    // Assuming structure: const translations = { ... };
    const startMatch = content.match(/const translations = \{/);
    if (!startMatch) throw new Error("Could not find translations start");

    let startIndex = startMatch.index + "const translations = ".length;
    let braceCount = 0;
    let endIndex = -1;
    let inString = false;
    let escape = false;
    let stringChar = '';

    // Simple parser to find the end of the object
    for (let i = startIndex; i < content.length; i++) {
        const char = content[i];

        if (inString) {
            if (escape) {
                escape = false;
            } else if (char === '\\') {
                escape = true;
            } else if (char === stringChar) {
                inString = false;
            }
        } else {
            if (char === "'" || char === '"' || char === '`') {
                inString = true;
                stringChar = char;
            } else if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i + 1;
                    break;
                }
            }
        }
    }

    if (endIndex === -1) throw new Error("Could not find end of translations object");

    const objectStr = content.substring(startIndex, endIndex);

    // Evaluate the object string to get the JS object
    // We use eval here because the file is local and trusted for this verification task
    const translations = eval('(' + objectStr + ')');

    const enKeys = Object.keys(translations['en']);
    const languages = Object.keys(translations);

    console.log(`Checking ${languages.length} languages against ${enKeys.length} English keys...`);

    let hasErrors = false;

    languages.forEach(lang => {
        if (lang === 'en') return;

        const langKeys = Object.keys(translations[lang]);
        const missing = enKeys.filter(k => !translations[lang][k]);

        if (missing.length > 0) {
            console.error(`❌ ${lang} is missing ${missing.length} keys: ${missing.slice(0, 5).join(', ')}...`);
            hasErrors = true;
        } else {
            // console.log(`✅ ${lang} is complete.`);
        }
    });

    if (!hasErrors) {
        console.log("✅ All translations verified! No missing keys.");
    } else {
        console.error("⚠️ Some languages have missing keys.");
        process.exit(1);
    }

} catch (err) {
    console.error("Error reading or parsing file:", err);
    process.exit(1);
}
