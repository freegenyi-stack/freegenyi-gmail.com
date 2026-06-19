/**
 * Commentaires actualités v3 — fils, likes, pièces jointes
 * Usage: npm run db:migrate:news-v3
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
      ALTER TABLE news_article_comments
        ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES news_article_comments(id) ON DELETE CASCADE;
    `);
    await client.query(`
      ALTER TABLE news_article_comments
        ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(20) NOT NULL DEFAULT 'none';
    `);
    await client.query(`
      ALTER TABLE news_article_comments
        ADD COLUMN IF NOT EXISTS attachment_url TEXT;
    `);
    await client.query(`
      ALTER TABLE news_article_comments
        ADD COLUMN IF NOT EXISTS attachment_sticker TEXT;
    `);
    await client.query(`
      ALTER TABLE news_article_comments
        ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0;
    `);
    await client.query(`
      ALTER TABLE news_article_comments
        ALTER COLUMN body SET DEFAULT '';
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS news_comment_likes (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER NOT NULL REFERENCES news_article_comments(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS news_comment_likes_unique_idx
        ON news_comment_likes(comment_id, user_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS news_comment_likes_user_idx ON news_comment_likes(user_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS news_comments_parent_idx ON news_article_comments(parent_id);
    `);

    await client.query("COMMIT");
    console.log("OK — migration actualités v3 (threads, likes, médias)");
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
