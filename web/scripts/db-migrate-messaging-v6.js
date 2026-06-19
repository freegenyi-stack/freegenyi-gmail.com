/**
 * Messagerie v6 — réponses, épinglage, dernière connexion
 * Usage: npm run db:migrate:messaging-v6
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
      ALTER TABLE chat_messages
        ADD COLUMN IF NOT EXISTS reply_to_message_id INTEGER REFERENCES chat_messages(id) ON DELETE SET NULL;
    `);
    await client.query(`
      ALTER TABLE chat_messages
        ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP;
    `);
    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP;
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_messages_reply_idx ON chat_messages(reply_to_message_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_messages_pinned_idx ON chat_messages(conversation_id, pinned_at DESC)
        WHERE pinned_at IS NOT NULL;
    `);
    await client.query("COMMIT");
    console.log("OK — migration messagerie v6");
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
