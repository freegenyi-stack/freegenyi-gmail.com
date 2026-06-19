/**
 * Formations (difficulté + durée) + gamification assignations (score/xp/étoiles)
 * Usage: npm run db:migrate:teacher-v4
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
      ALTER TABLE teacher_courses
        ADD COLUMN IF NOT EXISTS duration_minutes INT,
        ADD COLUMN IF NOT EXISTS difficulty_level INT NOT NULL DEFAULT 1;
    `);

    await client.query(`
      UPDATE teacher_courses
      SET difficulty_level = 1
      WHERE difficulty_level IS NULL OR difficulty_level < 1 OR difficulty_level > 3;
    `);

    await client.query(`
      ALTER TABLE authoring_progress
        ADD COLUMN IF NOT EXISTS score INT,
        ADD COLUMN IF NOT EXISTS xp_earned INT,
        ADD COLUMN IF NOT EXISTS stars INT;
    `);

    await client.query("COMMIT");
    console.log("OK — migration teacher v4 (formations + gamification assignations)");
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
