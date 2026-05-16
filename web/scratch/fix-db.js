const { Client } = require('pg');

async function fixDb() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5433/freegenydb?schema=public",
  });

  try {
    await client.connect();
    console.log("Connected to DB on port 5433 (freegenydb)");
    
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata TEXT;');
    console.log("✅ Column 'metadata' added successfully.");
    
  } catch (err) {
    console.error("❌ Error fixing DB:", err);
  } finally {
    await client.end();
  }
}

fixDb();
