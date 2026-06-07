/**
 * Nettoie les comptes école/ONG de test et remet un e-mail en parent.
 * Usage: node scripts/cleanup-test-org-users.js
 *        node scripts/cleanup-test-org-users.js fk.bahloul@gmail.com
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

const RESET_TO_PARENT = (process.argv[2] || "fk.bahloul@gmail.com").toLowerCase();

const DELETE_EMAILS = [
  "ecole-test@freegeny.com",
  "colloque.entrepreneuriat6@gmail.com",
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const email of DELETE_EMAILS) {
      const r = await client.query(`DELETE FROM users WHERE email = $1 RETURNING id`, [email]);
      if (r.rowCount) console.log("🗑 Supprimé:", email);
    }

    const dev = await client.query(
      `DELETE FROM users WHERE email LIKE 'ecole.dev.%@freegeny.local' RETURNING email`
    );
    dev.rows.forEach((row) => console.log("🗑 Supprimé:", row.email));

    const reset = await client.query(
      `UPDATE users SET role = 'parent', onboarding_step = 1, metadata = NULL, updated_at = NOW()
       WHERE email = $1 RETURNING id, email, role, onboarding_step`,
      [RESET_TO_PARENT]
    );
    if (reset.rowCount) {
      console.log("✅ Remis en parent:", reset.rows[0]);
    } else {
      console.log("⚠ Aucun utilisateur trouvé pour:", RESET_TO_PARENT);
    }

    await client.query("COMMIT");

    const list = await pool.query(
      `SELECT id, email, role, onboarding_step FROM users WHERE role IN ('ecole', 'ong', 'school', 'ngo') ORDER BY id`
    );
    console.log("\nComptes école/ONG restants:");
    console.table(list.rows);
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
