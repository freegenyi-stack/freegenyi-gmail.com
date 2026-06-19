/**
 * Déclenche le digest via l'API cron (serveur Next requis ou APP_URL en prod)
 * Usage: npm run digest:teacher-weekly
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function main() {
  const base = process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const secret = process.env.CRON_SECRET || "dev-cron-secret";
  const dryRun = process.argv.includes("--dry-run");
  const url = `${base.replace(/\/$/, "")}/api/cron/teacher-digest${dryRun ? "?dryRun=1" : ""}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(data);
    process.exit(1);
  }
  console.log(data);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
