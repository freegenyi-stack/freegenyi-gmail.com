/**
 * Bibliothèque v4 — lecture adulte (parent/enseignant), stats, avis, annexes
 * Usage: npm run db:migrate:library-v4
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
      CREATE TABLE IF NOT EXISTS library_user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        locator_json TEXT,
        percent SMALLINT NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'reading',
        pages_read INTEGER NOT NULL DEFAULT 0,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        finished_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (user_id, book_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_user_annotations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        locator_json TEXT NOT NULL,
        label TEXT,
        note_text TEXT,
        kind VARCHAR(20) NOT NULL DEFAULT 'bookmark',
        color VARCHAR(20),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_user_annotations_user_book_idx
        ON library_user_annotations (user_id, book_id, created_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        rating SMALLINT NOT NULL,
        comment TEXT,
        visibility VARCHAR(20) NOT NULL DEFAULT 'private',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (user_id, book_id)
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_reviews_book_visibility_idx
        ON library_reviews (book_id, visibility, created_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_reading_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        child_id INTEGER REFERENCES children(id) ON DELETE SET NULL,
        pages_delta INTEGER NOT NULL DEFAULT 0,
        duration_sec INTEGER NOT NULL DEFAULT 0,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ended_at TIMESTAMPTZ
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_reading_sessions_user_started_idx
        ON library_reading_sessions (user_id, started_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_book_annexes (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        kind VARCHAR(30) NOT NULL DEFAULT 'link',
        sort_order SMALLINT NOT NULL DEFAULT 0
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_book_annexes_book_idx
        ON library_book_annexes (book_id, sort_order);
    `);

    await client.query("COMMIT");
    console.log("OK — migration bibliothèque v4 (lecture adulte + stats)");
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
