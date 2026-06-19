/**
 * Installe les types d'activités essentiels sur le serveur interactif.
 * Usage: npm run h5p:bootstrap
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const base = (process.env.H5P_SERVER_URL || "http://127.0.0.1:8088")
  .replace(/\/$/, "")
  .replace(/^http:\/\/localhost(?=[:/]|$)/i, "http://127.0.0.1");

async function main() {
  const res = await fetch(`${base}/internal/bootstrap?all=1`, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Bootstrap failed:", data);
    process.exit(1);
  }
  console.log("OK — types installés:", data.installed?.length ?? 0, "/", data.total ?? "?");
  if (data.installed?.length) console.log(data.installed.join(", "));
  if (data.failed?.length) console.warn("Échecs:", data.failed.length, data.failed.slice(0, 10).join(", "));
  if (!data.installed?.length) {
    console.warn("Aucune bibliothèque installée — vérifiez les logs du conteneur h5p.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
