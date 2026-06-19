/**
 * Actualités enseignant
 * Usage: npm run db:migrate:teacher-news
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
      CREATE TABLE IF NOT EXISTS teacher_news_articles (
        id SERIAL PRIMARY KEY,
        topic VARCHAR(30) NOT NULL,
        interest_tags TEXT,
        title_fr TEXT NOT NULL,
        title_ar TEXT NOT NULL,
        excerpt_fr TEXT NOT NULL,
        excerpt_ar TEXT NOT NULL,
        body_fr TEXT,
        body_ar TEXT,
        published_at TIMESTAMP NOT NULL DEFAULT NOW(),
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS teacher_news_published_idx
        ON teacher_news_articles(is_published, published_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS teacher_news_topic_idx ON teacher_news_articles(topic);
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher_news_reads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        article_id INTEGER NOT NULL REFERENCES teacher_news_articles(id) ON DELETE CASCADE,
        read_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, article_id)
      );
    `);
    await client.query("COMMIT");
    console.log("OK — migration actualités enseignant");
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
