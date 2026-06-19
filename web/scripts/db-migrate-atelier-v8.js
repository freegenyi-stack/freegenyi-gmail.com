/**
 * Phase 3: réponses détaillées tentatives + modération Mur
 * Usage: npm run db:migrate:atelier-v8
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
      ALTER TABLE authoring_activity_attempts
        ADD COLUMN IF NOT EXISTS answers_json jsonb;
    `);
    await client.query(`
      ALTER TABLE pedagogy_share_comments
        ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS report_count integer NOT NULL DEFAULT 0;
    `);
    await client.query(`
      ALTER TABLE pedagogy_shares
        ADD COLUMN IF NOT EXISTS report_count integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;
    `);
    await client.query("COMMIT");
    console.log("OK — migration atelier v8 (answers_json + modération Mur)");
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
