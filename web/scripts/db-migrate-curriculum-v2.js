/**
 * Curriculum v2 — assignations parent/enseignant + réponses détaillées
 * Usage: npm run db:migrate:curriculum-v2
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
      CREATE TABLE IF NOT EXISTS curriculum_assignments (
        id SERIAL PRIMARY KEY,
        session_key VARCHAR(64) NOT NULL,
        child_id INT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        assigned_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assigned_by_role VARCHAR(16) NOT NULL,
        maqta_id VARCHAR(16),
        subject_code VARCHAR(32) NOT NULL,
        competency_id VARCHAR(64) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS curriculum_assignments_child_idx
        ON curriculum_assignments (child_id, status, assigned_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS curriculum_assignments_teacher_idx
        ON curriculum_assignments (assigned_by_user_id, assigned_at DESC);
    `);

    await client.query(`
      ALTER TABLE curriculum_sessions
        ADD COLUMN IF NOT EXISTS answers_json JSONB,
        ADD COLUMN IF NOT EXISTS maqta_id VARCHAR(16);
    `);

    await client.query("COMMIT");
    console.log("✓ curriculum v2 migration OK");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
