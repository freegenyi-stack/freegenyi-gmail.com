/**
 * Bibliothèque numérique — table library_books
 * Usage: npm run db:migrate:library
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
      CREATE TABLE IF NOT EXISTS library_books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        description TEXT,
        format VARCHAR(10) NOT NULL DEFAULT 'epub',
        file_url TEXT,
        cover_url TEXT,
        age_min SMALLINT,
        age_max SMALLINT,
        subject TEXT,
        language VARCHAR(8) DEFAULT 'fr',
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        calibre_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_books_published_idx
        ON library_books (is_published, created_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_books_subject_idx
        ON library_books (subject);
    `);
    await client.query("COMMIT");
    console.log("OK — migration bibliothèque (library_books)");
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
