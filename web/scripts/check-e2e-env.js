#!/usr/bin/env node
/**
 * Vérifie les variables E2E parent (Playwright).
 * Usage : node scripts/check-e2e-env.js
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const required = [
  { key: "E2E_PARENT_EMAIL", hint: "Compte parent de test (onboarding terminé)" },
  { key: "E2E_PARENT_PASSWORD", hint: "Mot de passe du compte parent E2E" },
];

const optional = [
  { key: "E2E_LOCALE", hint: "Locale de test (défaut DZ-fr)" },
  { key: "PLAYWRIGHT_BASE_URL", hint: "URL app (défaut http://localhost:3000)" },
];

console.log("FreeGeny — vérification env E2E parent\n");

let failed = 0;
for (const { key, hint } of required) {
  const ok = Boolean(process.env[key]?.trim());
  console.log(`${ok ? "✓" : "✗"} ${key}${ok ? "" : ` — MANQUANT (${hint})`}`);
  if (!ok) failed++;
}

for (const { key, hint } of optional) {
  const val = process.env[key];
  console.log(`${val ? "✓" : "○"} ${key}${val ? ` = ${val}` : ` — optionnel (${hint})`}`);
}

console.log(failed ? "\n→ Tests auth parent ignorés sans E2E_PARENT_*.\n" : "\n→ Prêt pour npm run test:e2e:parent:auth\n");
process.exit(failed ? 1 : 0);
