/**
 * library_books.page_count — progression PDF
 * Usage: npm run db:migrate:library-v9
 */
require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      ALTER TABLE library_books
      ADD COLUMN IF NOT EXISTS page_count SMALLINT;
    `);
    await client.query("COMMIT");
    console.log("OK — migration bibliothèque v9 (page_count)");
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
