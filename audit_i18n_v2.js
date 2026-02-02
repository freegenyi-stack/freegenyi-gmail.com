const fs = require('fs');
const path = require('path');
const vm = require('vm');

const i18nPath = path.join(__dirname, 'assets', 'js', 'i18n.js');
const code = fs.readFileSync(i18nPath, 'utf8');

const sandbox = {
    console: console,
    window: {},
    document: {
        documentElement: { dir: '', lang: '' },
        body: { style: {} },
        querySelector: () => ({ style: {} }),
        querySelectorAll: () => [],
        addEventListener: () => { },
        getElementById: () => null
    },
    navigator: { languages: ['en'] },
    localStorage: { getItem: () => null, setItem: () => { } },
    fetch: () => Promise.resolve({ ok: true, json: () => ({ country_code: 'US' }) }),
    CustomEvent: class { }
};

// Append code to expose the variables we need
// Inside the VM, 'this' refers to the sandbox object
const codeToRun = code + "\n" +
    "this.exposed_translations = typeof translations !== 'undefined' ? translations : {};" + "\n" +
    "this.exposed_countryToLang = typeof countryToLang !== 'undefined' ? countryToLang : {};" + "\n" +
    "this.exposed_rtlLangs = typeof rtlLangs !== 'undefined' ? rtlLangs : [];";

try {
    vm.createContext(sandbox);
    vm.runInContext(codeToRun, sandbox);
} catch (e) {
    console.error("❌ Error executing i18n.js in sandbox:", e);
    // process.exit(1);
}

const translations = sandbox.exposed_translations;

if (!translations || Object.keys(translations).length === 0) {
    console.error("❌ 'translations' object not found or empty after execution.");
    process.exit(1);
}

const en = translations['en'];
if (!en) {
    console.error("❌ English translations missing!");
    process.exit(1);
}

// Keys to strictly check (Auth related)
const authKeys = [
    'login_welcome', 'login_subtitle', 'signup_title', 'signup_subtitle',
    'login_fname_label', 'login_fname_ph', 'login_lname_label', 'login_lname_ph',
    'login_user_label', 'login_user_ph', 'login_pass_label', 'login_pass_ph',
    'login_forgot', 'btn_login_submit', 'btn_signup_submit',
    'login_or', 'login_no_acc', 'login_signup_link', 'login_has_acc', 'login_signin_link',
    'login_legal_text', 'login_connecting',
    'reset_title', 'reset_subtitle', 'reset_pass_label', 'reset_pass_ph',
    'reset_confirm_label', 'reset_confirm_ph',
    'reset_btn', 'reset_btn_updating', 'reset_btn_retry',
    'reset_success', 'reset_back_link',
    'err_pass_mismatch', 'err_invalid_token'
];

// Check which keys are actually in EN (some in my list might be slightly off, so I verify against EN first)
const validAuthKeys = authKeys.filter(k => {
    if (en[k]) return true;
    console.warn(`⚠️ Warning: Key '${k}' not found in English (source of truth). Skipping check for this key.`);
    return false;
});

const languages = Object.keys(translations);
console.log(`🔍 Auditing ${languages.length} languages for ${validAuthKeys.length} auth keys...`);

let hasErrors = false;
let missingReport = {};

languages.forEach(lang => {
    if (lang === 'en') return;

    // Check for Hebrew code presence
    if (lang === 'he' || lang === 'iw') {
        console.error(`❌ HEBREW DETECTED: Language code '${lang}' exists in translations!`);
        hasErrors = true;
    }

    const missing = [];
    validAuthKeys.forEach(k => {
        if (!translations[lang][k]) {
            missing.push(k);
        }
    });

    if (missing.length > 0) {
        hasErrors = true;
        console.error(`❌ ${lang}: Missing ${missing.length} keys`);
        console.error(`   Keys: ${missing.join(', ')}`);
        missingReport[lang] = missing;
    }
});

// Check strict Hebrew removal in other variables
const countryToLang = sandbox.exposed_countryToLang;
const rtlLangs = sandbox.exposed_rtlLangs;

if (countryToLang && (countryToLang['IL'] === 'he' || countryToLang['IL'] === 'iw')) {
    console.error("❌ Hebrew mapping found in countryToLang!");
    hasErrors = true;
}

if (rtlLangs && (rtlLangs.includes('he') || rtlLangs.includes('iw'))) {
    console.error("❌ Hebrew found in rtlLangs!");
    hasErrors = true;
}

if (hasErrors) {
    console.log("\n❌ Audit Failed. Please fix the missing keys above.");
    process.exit(1);
} else {
    console.log("\n✅ ALL CHECKS PASSED. All languages have complete auth translations.");
}
