/**
 * Formations : certificats + date de complétion sur teacher_course_progress
 * Usage: npm run db:migrate:teacher-v5
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
      ALTER TABLE teacher_course_progress
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS certificate_code TEXT;
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS teacher_course_progress_certificate_code_idx
        ON teacher_course_progress (certificate_code)
        WHERE certificate_code IS NOT NULL;
    `);

    await client.query("COMMIT");
    console.log("OK — migration teacher v5 (certificats formations)");
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
