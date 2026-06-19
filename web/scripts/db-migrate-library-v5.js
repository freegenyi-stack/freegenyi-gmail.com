/**
 * Bibliothèque v5 — quiz enfant + badges lecture
 * Usage: npm run db:migrate:library-v5
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
      CREATE TABLE IF NOT EXISTS library_quizzes (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_quizzes_book_idx ON library_quizzes (book_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_quiz_questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER NOT NULL REFERENCES library_quizzes(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        options_json TEXT NOT NULL,
        correct_index SMALLINT NOT NULL DEFAULT 0,
        sort_order SMALLINT NOT NULL DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_quiz_attempts (
        id SERIAL PRIMARY KEY,
        child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        quiz_id INTEGER NOT NULL REFERENCES library_quizzes(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
        score SMALLINT NOT NULL,
        total SMALLINT NOT NULL,
        answers_json TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_quiz_attempts_child_idx
        ON library_quiz_attempts (child_id, created_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS library_reading_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
        badge_key VARCHAR(40) NOT NULL,
        label TEXT NOT NULL,
        earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_reading_badges_user_idx
        ON library_reading_badges (user_id, earned_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS library_reading_badges_child_idx
        ON library_reading_badges (child_id, earned_at DESC);
    `);

    await client.query("COMMIT");
    console.log("OK — migration bibliothèque v5 (quiz + badges)");
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
