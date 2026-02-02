const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'assets', 'js', 'i18n.js');
let content = fs.readFileSync(i18nPath, 'utf8');

// Extract the translations object
// We use eval to parse the object as it is in the file (hacky but effective for this structure)
// We need to carefully extract the object string
const startMarker = "const translations = {";
const endMarker = "};"; // This might match earlier blocks, need to be careful

let startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error("❌ Could not find translations object start.");
    process.exit(1);
}

// Find the matching closing brace for the translations object
let openBraces = 0;
let endIndex = -1;
for (let i = startIndex + 21; i < content.length; i++) {
    if (content[i] === '{') openBraces++;
    if (content[i] === '}') {
        if (openBraces === 0) {
            endIndex = i + 1;
            break;
        }
        openBraces--;
    }
}

if (endIndex === -1) {
    console.error("❌ Could not find translations object end.");
    process.exit(1);
}

const translationsStr = content.substring(startIndex + 21, endIndex); // 21 is length of "const translations = "
// We wrap it in braces to make it a valid object literal if we eval it, 
// but wait, eval needs "({" + str + "})"? 
// Actually, let's just use the string we found, but we need to handle potential comments inside validation if we use regex,
// but eval is dangerous if we don't trust content. Here we trust it (our own file).
// However, 'eval' inside node might verify syntax.

let translations;
try {
    translations = eval('({' + translationsStr + '})');
} catch (e) {
    console.error("❌ SYNTAX ERROR in i18n.js object structure:", e.message);
    process.exit(1);
}

const en = translations['en'];
const keysToCheck = Object.keys(en).filter(k =>
    k.startsWith('login_') ||
    k.startsWith('signup_') ||
    k.startsWith('reset_') ||
    k.startsWith('btn_')
);

const languages = Object.keys(translations);
const missingReport = {};
let hasErrors = false;

console.log(`🔍 Auditing ${languages.length} languages for ${keysToCheck.length} critical auth keys...`);

languages.forEach(lang => {
    if (lang === 'en') return;

    if (lang === 'he' || lang === 'iw') {
        console.error(`❌ HEBREW FOUND: Language code '${lang}' is still present!`);
        hasErrors = true;
    }

    const missing = [];
    const empty = [];

    keysToCheck.forEach(key => {
        const val = translations[lang][key];
        if (val === undefined) {
            missing.push(key);
        } else if (typeof val === 'string' && val.trim() === '') {
            empty.push(key);
        }
    });

    if (missing.length > 0 || empty.length > 0) {
        missingReport[lang] = { missing, empty };
        console.error(`❌ ${lang}: Missing ${missing.length}, Empty ${empty.length}`);
        if (missing.length > 0) console.log(`   Missing: ${missing.join(', ')}`);
        hasErrors = true;
    } else {
        // console.log(`✅ ${lang} OK`);
    }
});

// Check for Hebrew in other consts
const restOfFile = content.substring(endIndex);
if (restOfFile.includes("'he'") || restOfFile.includes('"he"') || restOfFile.includes("'iw'") || restOfFile.includes('"iw"')) {
    console.error("❌ HEBREW FOUND in code logic (outside translations object)!");
    hasErrors = true;
}

if (!hasErrors) {
    console.log("✅ Audit Passed: All languages have critical auth keys and Hebrew is absent.");
} else {
    console.log("❌ Audit Failed. See details above.");
    process.exit(1);
}
