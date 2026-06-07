/**
 * Crée la table organization_verifications + index schools.
 * Usage: npm run db:migrate:org
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
      CREATE TABLE IF NOT EXISTS organization_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        org_type VARCHAR(10) NOT NULL,
        tracking_code VARCHAR(30) NOT NULL UNIQUE,
        institution_subtype VARCHAR(50),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        documents TEXT,
        rejection_reason TEXT,
        reviewed_at TIMESTAMP,
        reviewed_by TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS org_verifications_user_id_idx
        ON organization_verifications(user_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS org_verifications_status_idx
        ON organization_verifications(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS schools_district_id_idx
        ON schools(district_id);
    `);

    await client.query("COMMIT");
    console.log("✅ Migration organization_verifications OK");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("❌ Migration échouée:", e.message);
  process.exit(1);
});
