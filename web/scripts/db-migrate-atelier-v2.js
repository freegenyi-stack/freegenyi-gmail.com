/**
 * Mon Atelier v2 — assignations (child/note), suivi progression
 * Usage: npm run db:migrate:atelier-v2
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
      ALTER TABLE authoring_assignments
        ADD COLUMN IF NOT EXISTS child_id INT REFERENCES children(id) ON DELETE CASCADE,
        ADD COLUMN IF NOT EXISTS note TEXT;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS authoring_progress (
        id SERIAL PRIMARY KEY,
        assignment_id INT NOT NULL REFERENCES authoring_assignments(id) ON DELETE CASCADE,
        child_id INT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        completed_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (assignment_id, child_id)
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_progress_child_idx
        ON authoring_progress (child_id, status, updated_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_progress_assignment_idx
        ON authoring_progress (assignment_id, status);
    `);

    await client.query("COMMIT");
    console.log("OK — migration Mon Atelier v2");
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
