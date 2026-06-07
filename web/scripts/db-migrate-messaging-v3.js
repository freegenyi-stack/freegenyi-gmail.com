/**
 * Messagerie v3 — édition/suppression messages
 * Usage: npm run db:migrate:messaging-v3
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP;`);
    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_messages_active_idx
        ON chat_messages(conversation_id, created_at DESC)
        WHERE is_deleted = false;
    `);
    await client.query("COMMIT");
    console.log("OK — migration messagerie v3");
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
