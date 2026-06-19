/**
 * library_books.is_featured — remplace le préfixe [vedette] dans subject
 * Usage: npm run db:migrate:library-v8
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
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
    `);
    await client.query(`
      UPDATE library_books
      SET is_featured = true
      WHERE subject ILIKE '[vedette]%';
    `);
    await client.query(`
      UPDATE library_books
      SET subject = TRIM(REGEXP_REPLACE(subject, '^\\[vedette\\]\\s*', '', 'i'))
      WHERE subject ILIKE '[vedette]%';
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_books_featured_idx
      ON library_books (is_featured, is_published, created_at DESC);
    `);
    await client.query("COMMIT");
    console.log("OK — migration bibliothèque v8 (is_featured)");
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
