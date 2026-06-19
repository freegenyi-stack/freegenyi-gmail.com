/**
 * Messagerie v8 — legacy Rocket.Chat + colonne is_read inutilisée
 * Usage: npm run db:migrate:messaging-v8
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`ALTER TABLE chat_messages DROP COLUMN IF EXISTS is_read;`);
    await client.query(`DROP TABLE IF EXISTS chat_room_mappings;`);
    await client.query("COMMIT");
    console.log("OK — migration messagerie v8");
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
