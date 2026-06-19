/**
 * Répare les ressources atelier H5P sans contentId ou avec contenu orphelin.
 * Usage: node scripts/repair-h5p-resources.js
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { Pool } = require("pg");

function normalizeH5pBase(url) {
  return (url || "http://127.0.0.1:8088").replace(/\/$/, "").replace(/^http:\/\/localhost/i, "http://127.0.0.1");
}

const base = normalizeH5pBase(process.env.H5P_SERVER_URL);
const apiKey = process.env.H5P_API_KEY || "";

async function h5pFetch(path, init = {}) {
  const headers = { "Content-Type": "application/json", ...(init.headers || {}) };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return fetch(`${base}${path}`, { ...init, headers });
}

async function contentExists(contentId) {
  const res = await h5pFetch(`/internal/content/${encodeURIComponent(contentId)}/exists`);
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data.exists);
}

async function resolveLibrary(machineName) {
  const res = await h5pFetch(`/internal/bootstrap/resolve/${encodeURIComponent(machineName)}`);
  if (!res.ok) return machineName;
  const data = await res.json();
  return data.library || machineName;
}

async function createContent(library, title) {
  const lib = library.includes(" ") ? library : await resolveLibrary(library);
  const res = await h5pFetch("/internal/content", {
    method: "POST",
    body: JSON.stringify({
      library: lib,
      title,
      params: { params: {}, metadata: { title, license: "U" } },
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  const data = JSON.parse(text);
  return String(data.contentId ?? data.id);
}

async function main() {
  const health = await fetch(`${base}/health`);
  console.log("H5P health", health.status, base);
  if (!health.ok) {
    console.error("H5P indisponible — arrêt.");
    process.exit(1);
  }

  await h5pFetch("/internal/bootstrap?all=1", { method: "POST" }).catch(() => {});

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query(`
    SELECT id, title, h5p_library, h5p_content_id
    FROM authoring_resources
    WHERE kind = 'h5p'
    ORDER BY id DESC
    LIMIT 100
  `);

  let repaired = 0;
  let ok = 0;
  let failed = 0;

  for (const row of rows) {
    const lib = row.h5p_library;
    if (!lib) {
      console.log("SKIP", row.id, row.title, "— pas de library");
      failed++;
      continue;
    }
    if (row.h5p_content_id) {
      const exists = await contentExists(String(row.h5p_content_id));
      if (exists) {
        const play = await fetch(`${base}/ix/${row.h5p_content_id}/play`);
        console.log("OK", row.id, row.title, "content", row.h5p_content_id, "play", play.status);
        ok++;
        continue;
      }
      console.log("ORPHAN", row.id, row.title, row.h5p_content_id);
    }
    try {
      const contentId = await createContent(lib, row.title || "Activité");
      await pool.query(
        `UPDATE authoring_resources SET h5p_content_id = $1, updated_at = NOW() WHERE id = $2`,
        [contentId, row.id]
      );
      const play = await fetch(`${base}/ix/${contentId}/play`);
      console.log("REPAIRED", row.id, row.title, "→", contentId, "play", play.status);
      repaired++;
    } catch (e) {
      console.log("FAIL", row.id, row.title, e.message?.slice(0, 120));
      failed++;
    }
  }

  console.log(`\nRésumé: ${ok} OK, ${repaired} réparées, ${failed} échecs`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
