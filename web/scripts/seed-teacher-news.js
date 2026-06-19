/**
 * Seed actualités depuis le mock initial
 * Usage: npm run db:seed:teacher-news
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

const ARTICLES = [
  {
    topic: "policy",
    interest_tags: JSON.stringify(["news", "education"]),
    title_fr: "Réforme des programmes : ce qui change en primaire",
    title_ar: "إصلاح البرامج: ما الذي يتغير في التعليم الابتدائي",
    excerpt_fr: "Synthèse des annonces du ministère et impacts concrets en classe.",
    excerpt_ar: "ملخص إعلانات الوزارة وتأثيراتها المباشرة في القسم.",
    body_fr: "Le ministère a détaillé les ajustements prévus pour le cycle primaire : progression par compétences, renforcement de la lecture et nouvelles grilles d'évaluation.\n\nEn classe, les enseignants disposeront de repères trimestriels plus clairs. Les parents recevront des bulletins simplifiés avec des indicateurs de maîtrise.\n\nFreeGeny vous proposera des fiches de synthèse par niveau dans les prochaines semaines.",
    body_ar: "أكدت الوزارة التعديلات المرتقبة للتعليم الابتدائي: التدرج بالكفاءات، تعزيز القراءة وشبكات تقييم جديدة.\n\nفي القسم، سيتوفر للأساتذة مرجع فصلي أوضح. وسيتلقى الأولياء تقارير مبسطة بمؤشرات الإتقان.",
    published_at: "2026-06-05",
  },
  {
    topic: "ai",
    interest_tags: JSON.stringify(["technology", "education"]),
    title_fr: "IA générative : 5 usages responsables en correction",
    title_ar: "الذكاء الاصطناعي: 5 استخدامات مسؤولة في التصحيح",
    excerpt_fr: "Gagner du temps sans déléguer votre jugement pédagogique.",
    excerpt_ar: "توفير الوقت دون التفريط في حكمك التربوي.",
    published_at: "2026-06-04",
  },
  {
    topic: "pedagogy",
    interest_tags: JSON.stringify(["education"]),
    title_fr: "Différenciation : une séance type en 45 minutes",
    title_ar: "التمايز البيداغوجي: حصة نموذجية في 45 دقيقة",
    excerpt_fr: "Trame prête à adapter selon votre niveau.",
    excerpt_ar: "إطار جاهز للتكييف حسب مستواك.",
    published_at: "2026-06-02",
  },
  {
    topic: "wellbeing",
    interest_tags: JSON.stringify(["health", "education"]),
    title_fr: "Prévenir l'épuisement : routines courtes entre deux cours",
    title_ar: "منع الإرهاق: عادات قصيرة بين الحصص",
    excerpt_fr: "Cinq minutes qui changent la fin de journée.",
    excerpt_ar: "خمس دقائق تغيّر نهاية يومك.",
    published_at: "2026-05-28",
  },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT COUNT(*)::int AS c FROM teacher_news_articles");
    if (rows[0].c > 0) {
      console.log("Articles déjà présents — seed ignoré.");
      return;
    }
    for (const a of ARTICLES) {
      await client.query(
        `INSERT INTO teacher_news_articles
          (topic, interest_tags, title_fr, title_ar, excerpt_fr, excerpt_ar, body_fr, body_ar, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::date)`,
        [a.topic, a.interest_tags, a.title_fr, a.title_ar, a.excerpt_fr, a.excerpt_ar, a.body_fr || null, a.body_ar || null, a.published_at]
      );
    }
    console.log(`OK — ${ARTICLES.length} articles insérés`);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
