/**
 * Profil d'apprentissage enfant (besoins + mode + durée écran)
 * Usage: npm run db:migrate:child-profile
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
      ALTER TABLE children
        ADD COLUMN IF NOT EXISTS learning_profile TEXT;
    `);
    await client.query("COMMIT");
    console.log("OK — migration profil enfant (learning_profile)");
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
