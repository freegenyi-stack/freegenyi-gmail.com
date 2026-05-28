const { Client } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🔌 Connected to database. Updating country flags and activation states...");

  const updates = [
    { code: 'FI', flag: '🇫🇮' },
    { code: 'NO', flag: '🇳🇴' },
    { code: 'NL', flag: '🇳🇱' },
    { code: 'PT', flag: '🇵🇹' }
  ];

  for (const country of updates) {
    await client.query(
      "UPDATE countries SET flag_emoji = $1, is_active = true WHERE code = $2",
      [country.flag, country.code]
    );
    console.log(`✅ Updated ${country.code} with flag ${country.flag} and set is_active = true.`);
  }

  await client.end();
  console.log("🏁 Update complete.");
}

main().catch(console.error);
