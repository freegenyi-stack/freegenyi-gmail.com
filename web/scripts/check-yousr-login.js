require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const r = await pool.query(
    `SELECT id, email, username, role, password_hash, locked_until
     FROM users WHERE email ILIKE '%yousr%' OR username ILIKE '%yousr%'`
  );
  console.log("Users found:", JSON.stringify(r.rows, null, 2));
  for (const row of r.rows) {
    if (row.password_hash) {
      const ok = await bcrypt.compare("Yousr4568520&", row.password_hash);
      console.log(`Password match for ${row.email}:`, ok);
    }
  }
  console.log("FREEGENY_ADMIN_EMAILS:", process.env.FREEGENY_ADMIN_EMAILS);
  console.log("FREEGENY_YOUSR_EMAIL:", process.env.FREEGENY_YOUSR_EMAIL);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
