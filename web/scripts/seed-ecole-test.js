/**

 * Compte école pré-approuvé pour tests locaux (sans passer par l'inscription).

 * Usage: npm run db:seed:ecole-test

 */

require("dotenv").config({ path: ".env.local" });

require("dotenv").config();

const { Pool } = require("pg");

const bcrypt = require("bcryptjs");



const EMAIL = "ecole-test@freegeny.com";

const PASSWORD = "Test@FreeGeny2026!";

const USERNAME = "ecole_test";

const FULL_NAME = "École Test FreeGeny";



async function main() {

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const hash = await bcrypt.hash(PASSWORD, 12);

  const trackingCode = `FG-${new Date().getFullYear()}-TEST`;



  const metadata = JSON.stringify({

    institutionType: "Publique",

    institutionAddress: "الجزائر — test",

    institutionManager: "Directeur Test",

    institutionSchoolName: FULL_NAME,

    verificationStatus: "approved",

    trackingCode,

  });



  let userId;

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [EMAIL]);

  if (existing.rows.length > 0) {

    userId = existing.rows[0].id;

    await pool.query(

      `UPDATE users SET password_hash = $1, full_name = $2, username = $3, role = 'ecole',

       onboarding_step = 4, metadata = $4, phone = '+213550000000', updated_at = NOW() WHERE id = $5`,

      [hash, FULL_NAME, USERNAME, metadata, userId]

    );

    console.log("✅ Compte école test mis à jour:", EMAIL);

  } else {

    const ins = await pool.query(

      `INSERT INTO users (email, username, password_hash, full_name, phone, role, onboarding_step, metadata, created_at, updated_at)

       VALUES ($1, $2, $3, $4, '+213550000000', 'ecole', 4, $5, NOW(), NOW()) RETURNING id`,

      [EMAIL, USERNAME, hash, FULL_NAME, metadata]

    );

    userId = ins.rows[0].id;

    console.log("✅ Compte école test créé:", EMAIL);

  }



  const ver = await pool.query(

    "SELECT id FROM organization_verifications WHERE user_id = $1",

    [userId]

  );

  const docs = JSON.stringify({ devMode: "seed_ecole_test" });

  if (ver.rows.length > 0) {

    await pool.query(

      `UPDATE organization_verifications SET status = 'approved', tracking_code = $1,

       institution_subtype = 'Publique', documents = $2,

       reviewed_at = NOW(), reviewed_by = 'seed-ecole-test', updated_at = NOW()

       WHERE user_id = $3`,

      [trackingCode, docs, userId]

    );

  } else {

    await pool.query(

      `INSERT INTO organization_verifications (user_id, org_type, tracking_code, institution_subtype, status, documents, reviewed_at, reviewed_by, created_at, updated_at)

       VALUES ($1, 'ecole', $2, 'Publique', 'approved', $3, NOW(), 'seed-ecole-test', NOW(), NOW())`,

      [userId, trackingCode, docs]

    );

  }



  console.log("   Mot de passe:", PASSWORD);

  console.log("   Dashboard: /DZ-fr/dashboard/ecole");

  await pool.end();

}



main().catch((e) => {

  console.error(e);

  process.exit(1);

});


