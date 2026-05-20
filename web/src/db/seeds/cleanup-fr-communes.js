const { Client } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("🔌 Connected to database for cleanup.");

  // Clean up leading/trailing symbols in districts name_local, name_fr, name_en
  // In postgres, we can use BTRIM or REGEXP_REPLACE for advanced regex trimming.
  // Using regexp_replace to strip leading/trailing spaces, commas, dashes, dots
  console.log("🧼 Cleaning up leading/trailing symbols in French communes...");
  
  await client.query(`
    UPDATE districts 
    SET 
      name_local = REGEXP_REPLACE(REGEXP_REPLACE(name_local, '^\\s*[,.-]+\\s*', ''), '\\s*[,.-]+\\s*$', ''),
      name_fr = REGEXP_REPLACE(REGEXP_REPLACE(name_fr, '^\\s*[,.-]+\\s*', ''), '\\s*[,.-]+\\s*$', ''),
      name_en = REGEXP_REPLACE(REGEXP_REPLACE(name_en, '^\\s*[,.-]+\\s*', ''), '\\s*[,.-]+\\s*$', '')
    WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'FR');
  `);

  console.log("✅ Cleanup complete!");

  // Let's run a select to check if any still have leading commas
  const res = await client.query(`
    SELECT id, name_local 
    FROM districts 
    WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'FR')
      AND (name_local LIKE ',%' OR name_local LIKE '-%')
    LIMIT 20
  `);
  
  if (res.rows.length > 0) {
    console.log("⚠️ Still found some dirty communes:");
    console.table(res.rows);
  } else {
    console.log("🎉 Perfect! Zero dirty communes remain in the database!");
  }

  await client.end();
}
main().catch(console.error);
