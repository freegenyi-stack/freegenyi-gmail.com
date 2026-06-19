/**
 * Crée ou met à jour le compte super-admin Yousr + configure FREEGENY_ADMIN_EMAILS.
 * Usage: npm run db:seed:yousr-admin
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const YOUSR_EMAIL = (process.env.FREEGENY_YOUSR_EMAIL || "yousr@freegeny.com").toLowerCase();
const YOUSR_USERNAME = "Yousr";
const YOUSR_PASSWORD = process.env.FREEGENY_YOUSR_PASSWORD || "Yousr4568520&";
const YOUSR_NAME = "Yousr — Super admin";

function ensureAdminEmailsInEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, `FREEGENY_ADMIN_EMAILS=${YOUSR_EMAIL}\n`, "utf8");
    console.log("✅ .env.local créé avec FREEGENY_ADMIN_EMAILS");
    return;
  }

  let content = fs.readFileSync(envPath, "utf8");
  const key = "FREEGENY_ADMIN_EMAILS";
  const lineRe = new RegExp(`^${key}=.*$`, "m");

  if (lineRe.test(content)) {
    const current = content.match(lineRe)[0].split("=")[1].replace(/^["']|["']$/g, "");
    const emails = current
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (!emails.includes(YOUSR_EMAIL)) {
      emails.push(YOUSR_EMAIL);
      content = content.replace(lineRe, `${key}=${emails.join(",")}`);
      fs.writeFileSync(envPath, content, "utf8");
      console.log("✅ FREEGENY_ADMIN_EMAILS mis à jour:", emails.join(","));
    } else {
      console.log("✅ FREEGENY_ADMIN_EMAILS contient déjà", YOUSR_EMAIL);
    }
  } else {
    content = content.trimEnd() + `\n${key}=${YOUSR_EMAIL}\n`;
    fs.writeFileSync(envPath, content, "utf8");
    console.log("✅ FREEGENY_ADMIN_EMAILS ajouté à .env.local");
  }
}

async function main() {
  ensureAdminEmailsInEnv();

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash(YOUSR_PASSWORD, 12);

  const existing = await pool.query("SELECT id FROM users WHERE email = $1 OR username = $2", [
    YOUSR_EMAIL,
    YOUSR_USERNAME,
  ]);

  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE users SET email = $1, password_hash = $2, full_name = $3, username = $4, phone = $5, role = 'admin', onboarding_step = 4, updated_at = NOW()
       WHERE email = $1 OR username = $4`,
      [YOUSR_EMAIL, hash, YOUSR_NAME, YOUSR_USERNAME, "+33000000001"]
    );
    console.log("✅ Super-admin Yousr mis à jour:", YOUSR_EMAIL);
  } else {
    await pool.query(
      `INSERT INTO users (email, username, password_hash, full_name, phone, role, onboarding_step, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'admin', 4, NOW(), NOW())`,
      [YOUSR_EMAIL, YOUSR_USERNAME, hash, YOUSR_NAME, "+33000000001"]
    );
    console.log("✅ Super-admin Yousr créé:", YOUSR_EMAIL);
  }

  console.log("   Identifiant:", YOUSR_USERNAME);
  console.log("   E-mail connexion:", YOUSR_EMAIL);
  console.log("   Mot de passe:", YOUSR_PASSWORD);
  console.log("   Rôle: admin → /dashboard/admin");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
