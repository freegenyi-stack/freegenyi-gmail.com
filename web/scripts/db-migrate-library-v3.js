/**
 * Bibliothèque v3 — Readium locators + signets
 * Usage: npm run db:migrate:library-v3
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      ALTER TABLE library_reading_progress
        ADD COLUMN IF NOT EXISTS locator_json TEXT;
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS library_bookmarks (
        id SERIAL PRIMARY KEY,
        child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        locator_json TEXT NOT NULL,
        label TEXT,
        kind VARCHAR(20) NOT NULL DEFAULT 'bookmark',
        color VARCHAR(20),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_bookmarks_child_book_idx
        ON library_bookmarks (child_id, book_id, created_at DESC);
    `);
    await client.query("COMMIT");
    console.log("OK — migration bibliothèque v3 (Readium)");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
