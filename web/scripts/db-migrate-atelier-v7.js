/**
 * Commentaires mur pédagogique
 * Usage: npm run db:migrate:atelier-v7
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
      CREATE TABLE IF NOT EXISTS pedagogy_share_comments (
        id SERIAL PRIMARY KEY,
        share_id INTEGER NOT NULL REFERENCES pedagogy_shares(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS pedagogy_share_comments_share_idx
        ON pedagogy_share_comments(share_id, created_at DESC);
    `);
    await client.query("COMMIT");
    console.log("OK — migration atelier v7 (pedagogy_share_comments)");
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
