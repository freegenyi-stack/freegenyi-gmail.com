/**
 * Bibliothèque v6 — audience (teachers/parents/family) + quota offline hebdo
 * Usage: npm run db:migrate:library-v6
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
      ALTER TABLE library_books
      ADD COLUMN IF NOT EXISTS audience VARCHAR(20) NOT NULL DEFAULT 'family';
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_books_audience_idx
        ON library_books (audience, is_published, created_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_offline_downloads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        week_start DATE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT library_offline_user_or_child CHECK (
          (user_id IS NOT NULL AND child_id IS NULL) OR
          (user_id IS NULL AND child_id IS NOT NULL)
        )
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS library_offline_user_week_idx
        ON library_offline_downloads (user_id, week_start)
        WHERE user_id IS NOT NULL;
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS library_offline_child_week_idx
        ON library_offline_downloads (child_id, week_start)
        WHERE child_id IS NOT NULL;
    `);

    await client.query("COMMIT");
    console.log("OK — migration bibliothèque v6 (audience + offline)");
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
