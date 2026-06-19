/**
 * Mon Atelier v1 — ressources auteur (enseignant + futur parent), dossiers
 * Usage: npm run db:migrate:atelier-v1
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS authoring_folders (
        id SERIAL PRIMARY KEY,
        owner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        owner_role VARCHAR(20) NOT NULL DEFAULT 'enseignant',
        name TEXT NOT NULL,
        parent_id INT REFERENCES authoring_folders(id) ON DELETE CASCADE,
        school_year VARCHAR(12),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_folders_owner_idx
        ON authoring_folders (owner_user_id, owner_role, created_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS authoring_resources (
        id SERIAL PRIMARY KEY,
        owner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        owner_role VARCHAR(20) NOT NULL DEFAULT 'enseignant',
        kind VARCHAR(20) NOT NULL,
        title TEXT NOT NULL,
        resource_type VARCHAR(40) NOT NULL DEFAULT 'other',
        subject TEXT,
        school_level TEXT,
        school_year VARCHAR(12),
        folder_id INT REFERENCES authoring_folders(id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'draft',
        content_json TEXT NOT NULL DEFAULT '{}',
        h5p_content_id VARCHAR(128),
        h5p_library TEXT,
        template_id TEXT,
        tags TEXT,
        legacy_document_id INT REFERENCES teacher_documents(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_resources_owner_idx
        ON authoring_resources (owner_user_id, owner_role, updated_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_resources_kind_idx
        ON authoring_resources (kind, status, updated_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_resources_search_idx
        ON authoring_resources (owner_user_id, resource_type, subject);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS authoring_assignments (
        id SERIAL PRIMARY KEY,
        resource_id INT NOT NULL REFERENCES authoring_resources(id) ON DELETE CASCADE,
        assigned_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_type VARCHAR(20) NOT NULL DEFAULT 'class',
        target_json TEXT,
        due_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS authoring_assignments_resource_idx
        ON authoring_assignments (resource_id, created_at DESC);
    `);

    await client.query(`
      INSERT INTO authoring_resources (
        owner_user_id, owner_role, kind, title, resource_type, template_id,
        content_json, legacy_document_id, status, created_at, updated_at
      )
      SELECT
        user_id, 'enseignant', 'document', title,
        COALESCE(template_id, 'other'), template_id, content_json, id, 'draft',
        created_at, updated_at
      FROM teacher_documents td
      WHERE NOT EXISTS (
        SELECT 1 FROM authoring_resources ar WHERE ar.legacy_document_id = td.id
      );
    `);

    await client.query("COMMIT");
    console.log("OK — migration Mon Atelier v1");
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
