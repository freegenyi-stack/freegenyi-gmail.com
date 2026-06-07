/**
 * Messagerie intégrée v2 — colonnes + suggestions
 * Usage: npm run db:migrate:messaging-v2
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
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) DEFAULT 'direct',
        name TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS conversation_members (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message_type VARCHAR(20) DEFAULT 'text',
        content TEXT,
        media_url TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP;`);
    await client.query(`ALTER TABLE conversations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`);
    await client.query(`ALTER TABLE conversations ADD COLUMN IF NOT EXISTS school_id INTEGER;`);
    await client.query(`ALTER TABLE conversations ADD COLUMN IF NOT EXISTS direct_key VARCHAR(64);`);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS conversations_direct_key_idx
        ON conversations(direct_key) WHERE direct_key IS NOT NULL;
    `);

    await client.query(`ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP;`);
    await client.query(`ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS muted BOOLEAN DEFAULT false;`);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS conversation_members_pair_idx
        ON conversation_members(conversation_id, user_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_messages_conversation_idx
        ON chat_messages(conversation_id, created_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS message_suggestions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reason_key VARCHAR(64) NOT NULL,
        reason_params TEXT,
        sort_order INTEGER DEFAULT 0,
        dismissed BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, target_user_id, reason_key)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS message_suggestions_user_idx
        ON message_suggestions(user_id, dismissed);
    `);

    await client.query("COMMIT");
    console.log("✅ Migration messagerie v2 OK");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
