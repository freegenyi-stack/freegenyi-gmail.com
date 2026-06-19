#!/usr/bin/env node
/**
 * Vérifie les variables d'environnement critiques pour la prod FreeGeny.
 * Usage : node scripts/check-prod-env.js
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const checks = [
  { key: "DATABASE_URL", required: true, hint: "PostgreSQL connection string" },
  { key: "NEXTAUTH_SECRET", required: true, hint: "openssl rand -base64 32" },
  { key: "AUTH_SECRET", required: false, hint: "Peut être identique à NEXTAUTH_SECRET" },
  { key: "NEXTAUTH_URL", required: true, hint: "https://freegeny.com" },
  { key: "NEXT_PUBLIC_APP_URL", required: true, hint: "https://freegeny.com" },
  { key: "CRON_SECRET", required: true, hint: "openssl rand -hex 32 — crons parent/teacher digest" },
  { key: "NEXT_PUBLIC_VAPID_PUBLIC_KEY", required: true, hint: "npm run push:keys" },
  { key: "VAPID_PRIVATE_KEY", required: true, hint: "npm run push:keys" },
  { key: "VAPID_CONTACT_EMAIL", required: false, hint: "contact@freegeny.com" },
  { key: "SMTP_HOST", required: false, hint: "Ou FREEGENY_SMTP_LOCAL=true + localhost:25" },
  { key: "EMAIL_FROM", required: false, hint: "FreeGeny <contact@freegeny.com>" },
];

let failed = 0;
let warned = 0;

console.log("FreeGeny — vérification env prod\n");

for (const { key, required, hint } of checks) {
  const val = process.env[key];
  const ok = Boolean(val?.trim());
  if (!ok && required) {
    console.log(`✗ ${key} — MANQUANT (${hint})`);
    failed++;
  } else if (!ok) {
    console.log(`⚠ ${key} — absent (${hint})`);
    warned++;
  } else if (key === "CRON_SECRET" && val === "dev-cron-secret") {
    console.log(`⚠ ${key} — valeur dev détectée, changez en prod`);
    warned++;
  } else {
    console.log(`✓ ${key}`);
  }
}

const smtpOk =
  process.env.FREEGENY_SMTP_LOCAL === "true" ||
  Boolean(process.env.SMTP_HOST?.trim()) ||
  Boolean(process.env.RESEND_API_KEY?.trim());

if (!smtpOk) {
  console.log("⚠ E-mail — configurez FREEGENY_SMTP_LOCAL ou SMTP_HOST ou RESEND_API_KEY");
  warned++;
} else {
  console.log("✓ E-mail — service configuré");
}

console.log(`\nRésumé : ${failed} erreur(s), ${warned} avertissement(s)`);
if (failed > 0) process.exit(1);
