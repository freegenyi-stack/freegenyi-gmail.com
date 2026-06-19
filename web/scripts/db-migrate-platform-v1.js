/**
 * Platform v1 — app_settings, formation enseignant, documents générés
 * Usage: npm run db:migrate:platform-v1
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
      CREATE TABLE IF NOT EXISTS app_settings (
        key VARCHAR(64) PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      INSERT INTO app_settings (key, value) VALUES
        ('maintenance_mode', 'false'),
        ('registration_open', 'true'),
        ('library_public', 'true')
      ON CONFLICT (key) DO NOTHING;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher_courses (
        id SERIAL PRIMARY KEY,
        kind VARCHAR(20) NOT NULL DEFAULT 'direct',
        slug TEXT NOT NULL UNIQUE,
        title_fr TEXT NOT NULL,
        title_ar TEXT NOT NULL,
        duration_label TEXT,
        tag_fr TEXT,
        tag_ar TEXT,
        total_episodes INT NOT NULL DEFAULT 1,
        external_url TEXT,
        sort_order INT NOT NULL DEFAULT 0,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher_course_progress (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id INT NOT NULL REFERENCES teacher_courses(id) ON DELETE CASCADE,
        episode INT NOT NULL DEFAULT 1,
        percent INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (user_id, course_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher_documents (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        template_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content_json TEXT NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS teacher_documents_user_idx ON teacher_documents (user_id, updated_at DESC);
    `);

    await client.query("COMMIT");
    console.log("OK — migration platform v1");
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
