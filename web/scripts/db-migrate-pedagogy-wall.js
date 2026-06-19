/**
 * Mur pédagogique — tables partages enseignants
 * Usage: npm run db:migrate:pedagogy-wall
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
      CREATE TABLE IF NOT EXISTS pedagogy_shares (
        id SERIAL PRIMARY KEY,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_type VARCHAR(20) NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        education_level TEXT NOT NULL,
        subject TEXT,
        view_count INTEGER NOT NULL DEFAULT 0,
        like_count INTEGER NOT NULL DEFAULT 0,
        is_removed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS pedagogy_shares_level_idx
        ON pedagogy_shares(education_level, created_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS pedagogy_shares_author_idx
        ON pedagogy_shares(author_id, created_at DESC);
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS pedagogy_share_attachments (
        id SERIAL PRIMARY KEY,
        share_id INTEGER NOT NULL REFERENCES pedagogy_shares(id) ON DELETE CASCADE,
        file_url TEXT NOT NULL,
        file_name TEXT NOT NULL,
        mime_type TEXT,
        file_size INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS pedagogy_share_likes (
        id SERIAL PRIMARY KEY,
        share_id INTEGER NOT NULL REFERENCES pedagogy_shares(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(share_id, user_id)
      );
    `);
    await client.query("COMMIT");
    console.log("OK — migration mur pédagogique");
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
