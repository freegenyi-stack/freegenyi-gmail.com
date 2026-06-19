/**
 * Mon Atelier v3 — activités React natives (kind activity, enveloppe v1)
 * Usage: npm run db:migrate:atelier-v3
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

const H5P_LIBRARY_TO_ACTIVITY = {
  "H5P.QuestionSet": "QCM",
  "H5P.MultiChoice": "QCM",
  "H5P.TrueFalse": "VRAI_FAUX",
  "H5P.Flashcards": "FLASHCARDS",
  "H5P.Blanks": "TEXTE_A_TROUS",
  "H5P.DragQuestion": "DRAG_DROP",
};

function resolveActivityType(h5pLibrary) {
  if (!h5pLibrary) return "QCM";
  const machine = String(h5pLibrary).split(" ")[0];
  return H5P_LIBRARY_TO_ACTIVITY[machine] || H5P_LIBRARY_TO_ACTIVITY[h5pLibrary] || "QCM";
}

function defaultContent(type, title) {
  switch (type) {
    case "VRAI_FAUX":
      return {
        type: "VRAI_FAUX",
        affirmation_fr: title || "Affirmation à valider",
        affirmation_ar: title || "عبارة للتحقق",
        reponse_correcte: true,
      };
    case "FLASHCARDS":
      return {
        type: "FLASHCARDS",
        cartes: [
          {
            id: "c1",
            recto_texte_fr: title || "Mot",
            recto_texte_ar: title || "كلمة",
            verso_texte_fr: "Définition",
            verso_texte_ar: "تعريف",
          },
        ],
      };
    case "TEXTE_A_TROUS":
      return {
        type: "TEXTE_A_TROUS",
        mode: "choix",
        texte_fr: "Le chat mange une ___.",
        texte_ar: "القطة تأكل ___.",
        trous: [{ id: "t1", reponse_correcte: "souris", position: 1 }],
        word_bank_fr: ["souris", "pain"],
        word_bank_ar: ["فأر", "خبز"],
      };
    case "DRAG_DROP":
      return {
        type: "DRAG_DROP",
        instruction_fr: "Classe chaque élément.",
        instruction_ar: "صنّف كل عنصر.",
        elements: [{ id: "e1", texte_fr: "Élément 1", texte_ar: "عنصر 1", zone_correcte: "z1" }],
        zones: [{ id: "z1", label_fr: "Zone 1", label_ar: "منطقة 1" }],
      };
    default:
      return {
        type: "QCM",
        question_fr: title || "Question 1",
        question_ar: title || "سؤال 1",
        choix: [
          { id: "a", texte_fr: "Réponse correcte", texte_ar: "إجابة صحيحة", correct: true },
          { id: "b", texte_fr: "Réponse incorrecte", texte_ar: "إجابة خاطئة", correct: false },
        ],
        explication_fr: "",
        explication_ar: "",
      };
  }
}

function buildEnvelope(activityType, title) {
  return {
    version: 1,
    activityType,
    titre_fr: title,
    titre_ar: title,
    instructions_fr: "",
    instructions_ar: "",
    contenu: defaultContent(activityType, title),
  };
}

function isV1Envelope(raw) {
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.version === 1 && parsed?.activityType && parsed?.contenu;
  } catch {
    return false;
  }
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(`
      SELECT id, title, kind, h5p_library, content_json
      FROM authoring_resources
      WHERE kind IN ('h5p', 'activity')
    `);

    let kindUpdated = 0;
    let envelopeUpdated = 0;
    let libraryUpdated = 0;

    for (const row of rows) {
      const activityType = resolveActivityType(row.h5p_library);
      const patches = [];

      if (row.kind === "h5p") {
        await client.query(`UPDATE authoring_resources SET kind = 'activity' WHERE id = $1`, [row.id]);
        kindUpdated++;
      }

      if (row.h5p_library && row.h5p_library.startsWith("H5P.")) {
        await client.query(`UPDATE authoring_resources SET h5p_library = $1 WHERE id = $2`, [
          activityType,
          row.id,
        ]);
        libraryUpdated++;
      }

      if (!isV1Envelope(row.content_json)) {
        const envelope = buildEnvelope(activityType, row.title);
        await client.query(
          `UPDATE authoring_resources SET content_json = $1, updated_at = NOW() WHERE id = $2`,
          [JSON.stringify(envelope), row.id]
        );
        envelopeUpdated++;
      }
    }

    await client.query("COMMIT");
    console.log(
      `OK — migration Mon Atelier v3 (${rows.length} rows, kind→activity: ${kindUpdated}, library: ${libraryUpdated}, envelope: ${envelopeUpdated})`
    );
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
