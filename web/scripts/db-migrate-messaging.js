/**
 * Tables messagerie : push_subscriptions + chat_room_mappings
 * Usage: npm run db:migrate:messaging
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
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_room_mappings (
        id SERIAL PRIMARY KEY,
        school_id INTEGER,
        org_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        room_key VARCHAR(64) NOT NULL,
        rc_room_name TEXT NOT NULL,
        rc_room_id TEXT,
        visibility VARCHAR(10) NOT NULL DEFAULT 'private',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS chat_room_school_key_idx
        ON chat_room_mappings(school_id, room_key);
    `);

    await client.query("COMMIT");
    console.log("✓ Migration messagerie OK");
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
