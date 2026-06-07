/**
 * Family model + child PIN/QR pairing
 * Usage: npm run db:migrate:family
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "..", "drizzle", "0001_family_child_access.sql"),
      "utf8"
    );
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("✅ Migration family appliquée.");
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
