/**
 * Crée ou met à jour le compte admin FreeGeny (validation écoles/ONG).
 * Usage: node scripts/seed-admin.js
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const { FREEGENY_EMAILS, freegenyFromAddress } = require("./site-emails.cjs");

const ADMIN_EMAIL = FREEGENY_EMAILS.admin;
const ADMIN_PASSWORD = "Admin@FreeGeny2026!";
const ADMIN_NAME = "Admin FreeGeny";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [ADMIN_EMAIL]);
  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE users SET password_hash = $1, full_name = $2, username = $3, phone = $4, role = 'parent', onboarding_step = 4, updated_at = NOW() WHERE email = $5`,
      [hash, ADMIN_NAME, "freegeny_admin", "+33000000000", ADMIN_EMAIL]
    );
    console.log("✅ Admin mis à jour:", ADMIN_EMAIL);
  } else {
    await pool.query(
      `INSERT INTO users (email, username, password_hash, full_name, phone, role, onboarding_step, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'parent', 4, NOW(), NOW())`,
      [ADMIN_EMAIL, "freegeny_admin", hash, ADMIN_NAME, "+33000000000"]
    );
    console.log("✅ Admin créé:", ADMIN_EMAIL);
  }

  console.log("   Mot de passe:", ADMIN_PASSWORD);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
