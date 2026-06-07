require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const EMAIL = "ecole-test@freegeny.com";
const PASSWORD = "Test@FreeGeny2026!";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const r = await pool.query(
    "SELECT id, email, role, password_hash, onboarding_step FROM users WHERE email = $1",
    [EMAIL]
  );
  if (!r.rows.length) {
    console.log("MISSING_USER");
    await pool.end();
    return;
  }
  const u = r.rows[0];
  const ok = await bcrypt.compare(PASSWORD, u.password_hash);
  console.log({ id: u.id, role: u.role, onboarding: u.onboarding_step, passwordOk: ok });
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
