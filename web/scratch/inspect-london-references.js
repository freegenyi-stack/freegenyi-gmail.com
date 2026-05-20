const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // Check districts referencing London id 227 or 228
    const dists = await client.query(`
      SELECT region_id, COUNT(*) as count 
      FROM districts 
      WHERE region_id IN (227, 228) 
      GROUP BY region_id;
    `);
    
    console.log("=== DISTRICTS LINKED TO LONDON ===");
    console.table(dists.rows);

    // If there are districts, find the schools linked to them
    const schools = await client.query(`
      SELECT d.region_id, COUNT(s.id) as count
      FROM schools s
      JOIN districts d ON s.district_id = d.id
      WHERE d.region_id IN (227, 228)
      GROUP BY d.region_id;
    `);
    
    console.log("=== SCHOOLS LINKED TO LONDON ===");
    console.table(schools.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
