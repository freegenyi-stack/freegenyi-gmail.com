/**
 * Seed livre test + cours enseignant + templates
 * Usage: npm run db:seed:platform
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");
const { execSync } = require("child_process");
const path = require("path");

const DIRECT = [
  ["d1", "Gérer une classe hétérogène en 45 minutes", "إدارة قسم متنوع في 45 دقيقة", "25 min", 25, 2, "Classe", "قسم", "https://www.youtube.com/watch?v=BaW_jenozKc"],
  ["d2", "Évaluer sans stresser : quiz et rubriques", "التقييم دون إجهاد", "18 min", 18, 1, "Évaluation", "تقويم", "https://www.youtube.com/watch?v=aqz-KE-bpKQ"],
  ["d3", "L'IA en classe : usages responsables", "الذكاء الاصطناعي في القسم", "32 min", 32, 3, "Numérique", "رقمي", "https://www.youtube.com/watch?v=aircAruvnKk"],
  ["d4", "Communication parents : messages clairs", "التواصل مع الأولياء", "15 min", 15, 1, "Relation", "علاقات", "https://www.youtube.com/watch?v=LXb3EKWsInQ"],
];

const SERIES = [
  [
    "s1",
    "Rentrée sereine (4 épisodes)",
    "عودة هادئة للمدرسة",
    4,
    90,
    1,
    JSON.stringify({
      episodes: [
        { url: "https://www.youtube.com/watch?v=BaW_jenozKc", titleFr: "Préparer la rentrée", titleAr: "الاستعداد للعودة" },
        { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", titleFr: "Organiser l'espace", titleAr: "تنظيم الفضاء" },
        { url: "https://www.youtube.com/watch?v=aircAruvnKk", titleFr: "Accueillir les élèves", titleAr: "استقبال التلاميذ" },
        { url: "https://www.youtube.com/watch?v=LXb3EKWsInQ", titleFr: "Première semaine", titleAr: "الأسبوع الأول" },
      ],
    }),
  ],
  [
    "s2",
    "Enseignant data-informed (6 épisodes)",
    "أستاذ يقرأ بياناته",
    6,
    120,
    2,
    JSON.stringify({
      episodes: [
        { url: "https://www.youtube.com/watch?v=BaW_jenozKc", titleFr: "Lire ses résultats", titleAr: "قراءة النتائج" },
        { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", titleFr: "Identifier les écarts", titleAr: "تحديد الفجوات" },
        { url: "https://www.youtube.com/watch?v=aircAruvnKk", titleFr: "Adapter la leçon", titleAr: "تكييف الدرس" },
        { url: "https://www.youtube.com/watch?v=LXb3EKWsInQ", titleFr: "Suivi individuel", titleAr: "متابعة فردية" },
        { url: "https://www.youtube.com/watch?v=BaW_jenozKc", titleFr: "Partager avec l'équipe", titleAr: "المشاركة مع الفريق" },
        { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", titleFr: "Boucler le cycle", titleAr: "إغلاق الدورة" },
      ],
    }),
  ],
  [
    "s3",
    "Classe inclusive (5 épisodes)",
    "قسم شامل",
    5,
    100,
    2,
    JSON.stringify({
      episodes: [
        { url: "https://www.youtube.com/watch?v=aircAruvnKk", titleFr: "Comprendre l'inclusion", titleAr: "فهم الشمول" },
        { url: "https://www.youtube.com/watch?v=LXb3EKWsInQ", titleFr: "Différencier sans stigmatiser", titleAr: "التمايز دون وصم" },
        { url: "https://www.youtube.com/watch?v=BaW_jenozKc", titleFr: "Outils concrets", titleAr: "أدوات عملية" },
        { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", titleFr: "Travailler avec les AESH", titleAr: "العمل مع المرافقين" },
        { url: "https://www.youtube.com/watch?v=aircAruvnKk", titleFr: "Évaluer équitablement", titleAr: "تقييم عادل" },
      ],
    }),
  ],
];

async function main() {
  execSync("node scripts/create-sample-epub.js", { cwd: path.join(__dirname, ".."), stdio: "inherit" });

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query(
      `SELECT id FROM library_books WHERE title = 'FreeGeny — Livre test' LIMIT 1`
    );
    if (existing.rows.length === 0) {
      await client.query(
        `INSERT INTO library_books (title, author, format, file_url, subject, language, is_published, updated_at)
         VALUES ($1, $2, 'epub', '/test/sample.epub', 'Test', 'fr', true, NOW())`,
        ["FreeGeny — Livre test", "FreeGeny"]
      );
      console.log("Livre test ajouté au catalogue.");
    }

    for (let i = 0; i < DIRECT.length; i++) {
      const [slug, fr, ar, durLabel, durMin, diff, tagFr, tagAr, externalUrl] = DIRECT[i];
      await client.query(
        `INSERT INTO teacher_courses (kind, slug, title_fr, title_ar, duration_label, duration_minutes, difficulty_level, tag_fr, tag_ar, external_url, sort_order, is_published)
         VALUES ('direct', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
         ON CONFLICT (slug) DO UPDATE SET
           title_fr = EXCLUDED.title_fr,
           title_ar = EXCLUDED.title_ar,
           duration_label = EXCLUDED.duration_label,
           duration_minutes = EXCLUDED.duration_minutes,
           difficulty_level = EXCLUDED.difficulty_level,
           tag_fr = EXCLUDED.tag_fr,
           tag_ar = EXCLUDED.tag_ar,
           external_url = EXCLUDED.external_url,
           sort_order = EXCLUDED.sort_order,
           is_published = true`,
        [slug, fr, ar, durLabel, durMin, diff, tagFr, tagAr, externalUrl, i]
      );
    }

    for (let i = 0; i < SERIES.length; i++) {
      const [slug, fr, ar, total, durMin, diff, externalUrl] = SERIES[i];
      await client.query(
        `INSERT INTO teacher_courses (kind, slug, title_fr, title_ar, total_episodes, duration_minutes, difficulty_level, tag_fr, tag_ar, external_url, sort_order, is_published)
         VALUES ('series', $1, $2, $3, $4, $5, $6, 'Parcours', 'مسار', $7, $8, true)
         ON CONFLICT (slug) DO UPDATE SET
           title_fr = EXCLUDED.title_fr,
           title_ar = EXCLUDED.title_ar,
           total_episodes = EXCLUDED.total_episodes,
           duration_minutes = EXCLUDED.duration_minutes,
           difficulty_level = EXCLUDED.difficulty_level,
           external_url = EXCLUDED.external_url,
           sort_order = EXCLUDED.sort_order,
           is_published = true`,
        [slug, fr, ar, total, durMin, diff, externalUrl, 100 + i]
      );
    }

    await client.query("COMMIT");
    console.log("OK — seed platform content (formations avec vidéos démo + difficulté + durée)");
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
