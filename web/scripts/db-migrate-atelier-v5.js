/**
 * Lien Mur pédagogique ↔ ressource atelier
 * Usage: npm run db:migrate:atelier-v5
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
      ALTER TABLE pedagogy_shares
      ADD COLUMN IF NOT EXISTS authoring_resource_id INTEGER
      REFERENCES authoring_resources(id) ON DELETE SET NULL;
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS pedagogy_shares_resource_idx
        ON pedagogy_shares(authoring_resource_id)
        WHERE authoring_resource_id IS NOT NULL;
    `);
    await client.query("COMMIT");
    console.log("OK — migration atelier v5 (authoring_resource_id sur pedagogy_shares)");
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
