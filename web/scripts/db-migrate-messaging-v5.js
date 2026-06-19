/**
 * Messagerie v5 — réactions sur messages
 * Usage: npm run db:migrate:messaging-v5
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS reactions TEXT;`);
    await client.query("COMMIT");
    console.log("OK — migration messagerie v5");
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
