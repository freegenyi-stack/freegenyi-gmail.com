/**
 * library_bookmarks.note_text — notes enfant dans le lecteur
 * Usage: npm run db:migrate:library-v7
 */
require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      ALTER TABLE library_bookmarks
      ADD COLUMN IF NOT EXISTS note_text TEXT;
    `);
    await client.query("COMMIT");
    console.log("OK — migration bibliothèque v7 (note_text)");
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
