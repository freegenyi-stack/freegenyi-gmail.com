/**
 * Commentaires actualités + index
 * Usage: npm run db:migrate:news-v2
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
      CREATE TABLE IF NOT EXISTS news_article_comments (
        id SERIAL PRIMARY KEY,
        article_id INTEGER NOT NULL REFERENCES teacher_news_articles(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
        report_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS news_comments_article_idx
        ON news_article_comments(article_id, created_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS news_comments_user_idx ON news_article_comments(user_id);
    `);
    await client.query("COMMIT");
    console.log("OK — migration actualités v2 (commentaires)");
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
