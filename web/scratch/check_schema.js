require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function checkSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    
    const regionCols = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'regions'
    `);
    console.log("Regions columns:");
    console.table(regionCols.rows);

    const districtCols = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'districts'
    `);
    console.log("\nDistricts columns:");
    console.table(districtCols.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
checkSchema();
