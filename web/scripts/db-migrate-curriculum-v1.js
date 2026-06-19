/**
 * Curriculum factory v1 — tables pour import JSON → PostgreSQL
 * Usage: npm run db:migrate:curriculum-v1
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
      CREATE TABLE IF NOT EXISTS curriculum_bundles (
        id SERIAL PRIMARY KEY,
        country_code CHAR(2) NOT NULL,
        level_code VARCHAR(8) NOT NULL,
        subject_code VARCHAR(32) NOT NULL,
        module_id VARCHAR(64) NOT NULL,
        version INT NOT NULL DEFAULT 1,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        source_hash VARCHAR(64),
        snapshot_json JSONB NOT NULL,
        imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS curriculum_bundles_unique
        ON curriculum_bundles (country_code, level_code, subject_code, version);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS curriculum_nodes (
        id SERIAL PRIMARY KEY,
        bundle_id INT NOT NULL REFERENCES curriculum_bundles(id) ON DELETE CASCADE,
        node_id VARCHAR(64) NOT NULL,
        competency_id VARCHAR(64) NOT NULL,
        domaine VARCHAR(32),
        sort_order INT NOT NULL DEFAULT 0,
        title_fr TEXT NOT NULL,
        title_ar TEXT,
        meta_json JSONB
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS curriculum_nodes_bundle_node
        ON curriculum_nodes (bundle_id, node_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS curriculum_nodes_competency_idx
        ON curriculum_nodes (bundle_id, competency_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS curriculum_exercises (
        id SERIAL PRIMARY KEY,
        bundle_id INT NOT NULL REFERENCES curriculum_bundles(id) ON DELETE CASCADE,
        item_id VARCHAR(64) NOT NULL,
        competency_id VARCHAR(64) NOT NULL,
        variant_group VARCHAR(64) NOT NULL,
        item_json JSONB NOT NULL
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS curriculum_exercises_bundle_item
        ON curriculum_exercises (bundle_id, item_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS curriculum_exercises_competency_idx
        ON curriculum_exercises (bundle_id, competency_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS curriculum_child_progress (
        id SERIAL PRIMARY KEY,
        child_id INT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        bundle_id INT NOT NULL REFERENCES curriculum_bundles(id) ON DELETE CASCADE,
        competency_id VARCHAR(64) NOT NULL,
        stars SMALLINT NOT NULL DEFAULT 0,
        xp_earned INT NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'available',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS curriculum_child_progress_unique
        ON curriculum_child_progress (child_id, bundle_id, competency_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS curriculum_child_progress_child_idx
        ON curriculum_child_progress (child_id, updated_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS curriculum_sessions (
        id SERIAL PRIMARY KEY,
        session_key VARCHAR(64) NOT NULL UNIQUE,
        child_id INT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        bundle_id INT REFERENCES curriculum_bundles(id) ON DELETE SET NULL,
        source VARCHAR(24) NOT NULL,
        competency_id VARCHAR(64) NOT NULL,
        payload_json JSONB NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        score INT,
        xp_earned INT,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS curriculum_sessions_child_idx
        ON curriculum_sessions (child_id, status, created_at DESC);
    `);

    await client.query("COMMIT");
    console.log("✓ curriculum v1 migration OK");
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
