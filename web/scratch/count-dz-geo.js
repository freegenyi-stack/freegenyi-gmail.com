const fs = require("fs");
const readline = require("readline");

async function countCsv(file) {
  if (!fs.existsSync(file)) return null;
  const wilayas = new Set();
  const communes = new Set();
  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });
  let first = true;
  for await (const line of rl) {
    if (!line.trim()) continue;
    if (first) {
      first = false;
      continue;
    }
    const cols = line.split(",");
    const w = (cols[0] || "").replace(/"/g, "").padStart(2, "0");
    const c = (cols[2] || "").replace(/"/g, "");
    if (w && w !== "00") wilayas.add(w);
    if (w && c) communes.add(`${w}_${c}`);
  }
  return { wilayas: wilayas.size, communes: communes.size };
}

async function main() {
  const files = [
    "c:/Users/Yousr/freegonya/base/ecoles_primaires_algerie.csv",
    "c:/Users/Yousr/freegonya/base/ecoles_privees_algerie.csv",
    "c:/Users/Yousr/freegonya/web/src/db/seeds/data/ecoles_primaires_algerie.csv",
    "c:/Users/Yousr/freegonya/web/src/db/seeds/data/ecoles_privees_algerie.csv",
  ];

  for (const f of files) {
    const r = await countCsv(f);
    if (!r) {
      console.log("MISSING:", f);
    } else {
      console.log(f, "→", r);
    }
  }

  // schema wilayas
  const schema = fs.readFileSync("c:/Users/Yousr/freegonya/base/freegeny_schema_v1.sql", "utf8");
  const wilayaInserts = (schema.match(/\('DZ','\d{2}'/g) || []).length;
  console.log("Wilayas in schema SQL:", wilayaInserts);

  try {
    const { Client } = require("pg");
    const client = new Client({
      connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb",
    });
    await client.connect();
    const w = await client.query("SELECT COUNT(*)::int AS n FROM regions WHERE country_code = 'DZ'");
    const d = await client.query(
      "SELECT COUNT(*)::int AS n FROM districts d JOIN regions r ON d.region_id = r.id WHERE r.country_code = 'DZ'"
    );
    console.log("DB regions (wilayas):", w.rows[0].n);
    console.log("DB districts (communes):", d.rows[0].n);
    await client.end();
  } catch (e) {
    console.log("DB:", e.message);
  }
}

main();
