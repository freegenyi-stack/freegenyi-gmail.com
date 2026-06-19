/**
 * Tentatives activités — scores élèves (assignation, mur, atelier)
 * Usage: npm run db:migrate:atelier-v6
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
      CREATE TABLE IF NOT EXISTS authoring_activity_attempts (
        id SERIAL PRIMARY KEY,
        resource_id INTEGER NOT NULL REFERENCES authoring_resources(id) ON DELETE CASCADE,
        teacher_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        child_id INTEGER REFERENCES children(id) ON DELETE SET NULL,
        submitted_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        progress_id INTEGER REFERENCES authoring_progress(id) ON DELETE SET NULL,
        share_id INTEGER REFERENCES pedagogy_shares(id) ON DELETE SET NULL,
        source VARCHAR(20) NOT NULL DEFAULT 'assignment',
        score INTEGER NOT NULL,
        xp_earned INTEGER,
        stars INTEGER,
        errors INTEGER,
        duration_seconds INTEGER,
        completed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_attempts_teacher_idx
        ON authoring_activity_attempts(teacher_user_id, completed_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_attempts_resource_idx
        ON authoring_activity_attempts(resource_id, completed_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_attempts_child_idx
        ON authoring_activity_attempts(child_id, completed_at DESC);
    `);
    await client.query("COMMIT");
    console.log("OK — migration atelier v6 (authoring_activity_attempts)");
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
