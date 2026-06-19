/**
 * Importe un niveau curriculum en base.
 * Usage: npm run curriculum:import -- DZ 1AP
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import pg from "pg";
import { fileURLToPath } from "url";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ROOT = path.resolve(__dirname, "../../../curriculum");
const BUNDLE_FILES = ["curriculum.json", "competences.json", "exercise_bank.json", "evaluations.json"];

const [country, level] = process.argv.slice(2);
if (!country || !level) {
  console.error("Usage: node scripts/curriculum/import-bundle.mjs DZ 1AP");
  process.exit(1);
}

function readBundle(subjectPath) {
  const snapshot = {};
  for (const f of BUNDLE_FILES) {
    snapshot[f.replace(".json", "")] = JSON.parse(fs.readFileSync(path.join(subjectPath, f), "utf8"));
  }
  return snapshot;
}

function extractNodes(curriculum) {
  const nodes = [];
  for (const mq of curriculum.maqaate ?? []) {
    for (const n of mq.nodes ?? []) {
      nodes.push({ ...n, maqtaId: n.maqtaId ?? mq.maqtaId });
    }
  }
  for (const tr of curriculum.trimesters ?? []) {
    for (const n of tr.nodes ?? []) {
      nodes.push(n);
    }
  }
  return nodes.sort((a, b) => a.order - b.order);
}

async function main() {
  const levelPath = path.join(ROOT, "countries", country, "levels", level);
  const subjects = fs.readdirSync(levelPath).filter((name) => {
    const p = path.join(levelPath, name);
    return fs.statSync(p).isDirectory() && BUNDLE_FILES.every((f) => fs.existsSync(path.join(p, f)));
  });

  if (subjects.length === 0) {
    console.error(`Aucun subject complet sous ${levelPath}`);
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL manquant (.env.local)");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const subject of subjects) {
      const subjectPath = path.join(levelPath, subject);
      const snapshot = readBundle(subjectPath);
      const curriculum = snapshot.curriculum;
      const meta = curriculum.metadata ?? {};
      const moduleId = meta.moduleId ?? `${country}-${level}-${subject}`;
      const version = meta.version ?? 1;
      const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(snapshot))
        .digest("hex")
        .slice(0, 16);

      const { rows: existing } = await client.query(
        `SELECT id FROM curriculum_bundles
         WHERE country_code = $1 AND level_code = $2 AND subject_code = $3 AND version = $4`,
        [country, level, subject, version]
      );

      let bundleId;
      if (existing[0]) {
        bundleId = existing[0].id;
        await client.query(`DELETE FROM curriculum_nodes WHERE bundle_id = $1`, [bundleId]);
        await client.query(`DELETE FROM curriculum_exercises WHERE bundle_id = $1`, [bundleId]);
        await client.query(
          `UPDATE curriculum_bundles SET snapshot_json = $1, source_hash = $2, imported_at = NOW() WHERE id = $3`,
          [JSON.stringify(snapshot), hash, bundleId]
        );
      } else {
        const ins = await client.query(
          `INSERT INTO curriculum_bundles
            (country_code, level_code, subject_code, module_id, version, source_hash, snapshot_json)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [country, level, subject, moduleId, version, hash, JSON.stringify(snapshot)]
        );
        bundleId = ins.rows[0].id;
      }

      for (const n of extractNodes(curriculum)) {
        await client.query(
          `INSERT INTO curriculum_nodes
            (bundle_id, node_id, competency_id, domaine, sort_order, title_fr, title_ar, meta_json)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            bundleId,
            n.nodeId,
            n.nodeId,
            n.domaine ?? null,
            n.order ?? 0,
            n.titreFr,
            n.titreAr ?? null,
            JSON.stringify(n),
          ]
        );
      }

      for (const item of snapshot.exercise_bank.items ?? []) {
        await client.query(
          `INSERT INTO curriculum_exercises
            (bundle_id, item_id, competency_id, variant_group, item_json)
           VALUES ($1,$2,$3,$4,$5)`,
          [bundleId, item.id, item.competencyId, item.variantGroup, JSON.stringify(item)]
        );
      }

      console.log(
        `✓ import ${country}/${level}/${subject} → bundle #${bundleId} (${(snapshot.exercise_bank.items ?? []).length} exos)`
      );
    }

    await client.query("COMMIT");
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
