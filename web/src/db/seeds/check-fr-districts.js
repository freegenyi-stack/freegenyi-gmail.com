const { Client } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  
  const res = await client.query(`
    SELECT d.id, d.code, d.name_local, r.code as reg_code, r.name_local as reg_name
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'FR'
    ORDER BY d.id ASC
    LIMIT 100
  `);
  
  console.log("--- FIRST 100 FRENCH DISTRICTS ---");
  console.table(res.rows);

  const res2 = await client.query(`
    SELECT COUNT(*), r.name_local
    FROM districts d
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'FR'
    GROUP BY r.name_local
  `);
  console.log("--- DISTRICT COUNTS BY REGION ---");
  console.table(res2.rows);

  await client.end();
}
main().catch(console.error);
