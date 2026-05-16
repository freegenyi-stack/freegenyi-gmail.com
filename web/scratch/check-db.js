const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users';
    `);
    console.log("=== COLUMNS IN 'users' TABLE ===");
    res.rows.forEach(r => console.log("- " + r.column_name));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

checkDb();
