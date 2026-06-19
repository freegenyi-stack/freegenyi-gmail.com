/**
 * Seed catalogue bibliothèque (métadonnées — fichiers via admin ou seed-platform)
 * Usage: npm run db:seed:library
 */
require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

const BOOKS = [
  {
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    subject: "Littérature",
    language: "fr",
    audience: "family",
    description: "Conte philosophique — lecture famille.",
  },
  {
    title: "حكايات قبل النوم",
    author: "FreeGeny",
    subject: "Contes",
    language: "ar",
    audience: "family",
    description: "Contes du soir en arabe.",
  },
  {
    title: "Découvrir la science",
    author: "FreeGeny",
    subject: "Sciences",
    language: "fr",
    audience: "family",
    description: "Vulgarisation scientifique pour enfants.",
  },
  {
    title: "Pédagogie différenciée",
    author: "FreeGeny",
    subject: "Pédagogie",
    language: "fr",
    audience: "teachers",
    description: "Ressource enseignants — différenciation.",
  },
  {
    title: "Guide parents — lecture à la maison",
    author: "FreeGeny",
    subject: "Parentalité",
    language: "fr",
    audience: "parents",
    description: "Conseils lecture parent-enfant.",
  },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let inserted = 0;
    for (const b of BOOKS) {
      const { rows } = await client.query(
        `SELECT id FROM library_books WHERE title = $1 LIMIT 1`,
        [b.title]
      );
      if (rows.length) continue;
      await client.query(
        `INSERT INTO library_books
          (title, author, description, format, subject, language, audience, is_published, created_at, updated_at)
         VALUES ($1, $2, $3, 'epub', $4, $5, $6, false, NOW(), NOW())`,
        [b.title, b.author, b.description, b.subject, b.language, b.audience]
      );
      inserted++;
    }
    await client.query("COMMIT");
    console.log(`OK — ${inserted} livre(s) seed (brouillon — ajoutez l'EPUB via admin)`);
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
