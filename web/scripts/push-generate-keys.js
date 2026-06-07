#!/usr/bin/env node
/** Génère une paire de clés VAPID pour Web Push. */
const webpush = require("web-push");
const keys = webpush.generateVAPIDKeys();
console.log("\n# Ajoutez ces lignes à .env.local :\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log("VAPID_CONTACT_EMAIL=notifications@freegeny.app\n");
