/**
 * Messagerie v7 — signalements, modération texte, typing persistant
 * Usage: npm run db:migrate:messaging-v7
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
        ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
    `);
    await client.query(`
      ALTER TABLE chat_messages
        ADD COLUMN IF NOT EXISTS report_count INTEGER NOT NULL DEFAULT 0;
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_message_reports (
        id SERIAL PRIMARY KEY,
        message_id INTEGER NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
        reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE (message_id, reporter_id)
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_message_reports_message_idx
        ON chat_message_reports(message_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_messages_report_idx
        ON chat_messages(report_count DESC, created_at DESC)
        WHERE report_count > 0;
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_typing (
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        display_name TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        PRIMARY KEY (conversation_id, user_id)
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_typing_expires_idx ON chat_typing(expires_at);
    `);
    await client.query("COMMIT");
    console.log("OK — migration messagerie v7");
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
