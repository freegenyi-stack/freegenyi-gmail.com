require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function checkDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("--- Database Verification ---");
    
    const countries = await client.query("SELECT code, name_en FROM countries");
    console.log(`Countries: ${countries.rows.length}`);
    console.log("Codes:", countries.rows.map(c => c.code).join(", "));
    
    const regions = await client.query("SELECT COUNT(*) as count FROM regions");
    console.log(`Regions: ${regions.rows[0].count}`);
    
    const districts = await client.query("SELECT COUNT(*) as count FROM districts");
    console.log(`Districts: ${districts.rows[0].count}`);
    
    const schools = await client.query("SELECT COUNT(*) as count FROM schools");
    console.log(`Schools: ${schools.rows[0].count}`);
    console.log("-----------------------------");
    
  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await client.end();
  }
}
checkDB();
