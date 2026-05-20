const { Client } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  
  const res = await client.query(`
    SELECT code, name_fr, flag_emoji, is_active
    FROM countries
    ORDER BY name_fr ASC
  `);
  
  console.log(`--- definitive list of ${res.rows.length} countries ---`);
  res.rows.forEach((row, i) => {
    console.log(`${i + 1}. ${row.flag_emoji} ${row.name_fr} (${row.code}) - ${row.is_active ? 'Active' : 'Inactive'}`);
  });

  await client.end();
}
main().catch(console.error);
