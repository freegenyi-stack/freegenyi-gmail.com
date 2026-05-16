const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixDbAll() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to DB to add missing columns");
    
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS theme_settings TEXT;');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_config TEXT;');
    
    console.log("✅ Columns 'username', 'theme_settings', and 'avatar_config' added successfully.");
    
  } catch (err) {
    console.error("❌ Error fixing DB:", err);
  } finally {
    await client.end();
  }
}

fixDbAll();
