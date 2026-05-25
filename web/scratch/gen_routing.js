const fs = require('fs');
const path = require('path');

const regionsFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'constants', 'regions.ts'), 'utf-8');

const regex = /'([A-Z]{2})': \{ 'name': '[^']+', 'langs': \[([^\]]+)\] \}/g;
let match;
const locales = new Set([
  'ar', 'fr', 'en', 'nl', 'de', 'it', 'es', 'pt', 'tr', 'ru', 'be', 'uk', 'pl', 'ro', 'el', 'hu', 'cs', 'da', 'no', 'sv', 'fi', 'ga', 'af', 'zu', 'xh', 'zh', 'ms', 'ta', 'ja', 'ko', 'hi', 'mi', 'th', 'vi', 'id', 'ku'
]);

while ((match = regex.exec(regionsFile)) !== null) {
    const country = match[1];
    const langsStr = match[2];
    const langs = langsStr.match(/'([a-z]{2})'/g).map(l => l.replace(/'/g, ''));
    langs.forEach(lang => {
        locales.add(`${country}-${lang}`);
    });
}

const localesArr = Array.from(locales);

const output = `import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = [
  ${localesArr.map(l => `'${l}'`).join(', ')}
] as const;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "fr",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
`;

fs.writeFileSync(path.join(__dirname, '..', 'i18n', 'routing.ts'), output);
console.log("Updated routing.ts");
