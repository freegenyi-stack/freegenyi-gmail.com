/**
 * FreeGeny — Script d'import des écoles algériennes
 * 
 * Utilise la même connexion PostgreSQL que l'application Next.js.
 * 
 * USAGE:
 *   node import-schools.js
 * 
 * PRÉREQUIS: Docker doit être lancé avec `docker-compose up -d`
 */

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// --- CONFIG (même que .env.local) ---
const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://postgres:postgres@localhost:5433/freegenydb";

const CSV_PUBLIC  = path.join(__dirname, "ecoles_primaires_algerie.csv");
const CSV_PRIVATE = path.join(__dirname, "ecoles_privees_algerie.csv");

// --- CONNEXION ---
const client = new Client({ connectionString: DATABASE_URL });

// --- HELPERS ---
function log(msg) { console.log(`  ✅ ${msg}`); }
function warn(msg) { console.log(`  ⚠️  ${msg}`); }
function info(msg) { console.log(`\n🔵 ${msg}`); }

async function readCSV(filePath) {
  const rows = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  let headers = [];

  for await (const line of rl) {
    if (!line.trim()) continue;

    // Parse CSV (simple comma-split, handles quoted fields)
    const cols = parseCsvLine(line);

    if (isFirstLine) {
      headers = cols.map(h => h.toLowerCase().trim());
      isFirstLine = false;
      continue;
    }

    const row = {};
    headers.forEach((h, i) => { row[h] = (cols[i] || "").trim(); });
    rows.push(row);
  }

  return rows;
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// --- TRADUCTIONS AUTOMATIQUES ---
function translateArabic(nameAr) {
  if (!nameAr) return null;

  // Dates historiques
  const dateReplacements = [
    ["إبتدائية", "École"],
    ["١ نوفمبر ١٩٥٤", "1er Novembre 1954"],
    ["1 نوفمبر 1954", "1er Novembre 1954"],
    ["نوفمبر", "Novembre"],
    ["19 مارس 1962", "19 Mars 1962"],
    ["5 جويلية 1962", "5 Juillet 1962"],
    ["مارس", "Mars"],
    ["جويلية", "Juillet"],
    ["فيفري", "Février"],
    ["جانفي", "Janvier"],
    ["أكتوبر", "Octobre"],
  ];

  // Noms communs
  const nameMap = [
    ["السلام",      "École de la Paix"],
    ["النصر",       "École de la Victoire"],
    ["الأمل",       "École de l'Espoir"],
    ["النور",       "École de la Lumière"],
    ["الفجر",       "École de l'Aube"],
    ["الوحدة",      "École de l'Unité"],
    ["الاستقلال",   "École de l'Indépendance"],
    ["التحرير",     "École de la Libération"],
    ["العلم",       "École du Savoir"],
    ["المعرفة",     "École de la Connaissance"],
    ["الشباب",      "École de la Jeunesse"],
    ["الوطن",       "École de la Patrie"],
    ["التضامن",     "École de la Solidarité"],
    ["ابن رشد",     "École Ibn Rochd"],
    ["ابن سينا",    "École Ibn Sina"],
    ["ابن باديس",   "École Ibn Badis"],
    ["ابن خلدون",   "École Ibn Khaldoun"],
    ["الثورة",      "École de la Révolution"],
    ["الشهيد",      null], // martyrs → needs_review
  ];

  // Check dates
  const hasDate = /نوفمبر|مارس|فيفري|جويلية|جانفي|أكتوبر/.test(nameAr);
  if (hasDate) {
    let translated = nameAr;
    for (const [ar, fr] of dateReplacements) {
      translated = translated.split(ar).join(fr);
    }
    return { nameFr: translated, status: "auto" };
  }

  // Check martyrs → needs review
  if (nameAr.includes("الشهيد") || nameAr.includes("الشهداء")) {
    return { nameFr: nameAr.replace("إبتدائية", "École"), status: "needs_review" };
  }

  // Check common names
  for (const [ar, fr] of nameMap) {
    if (nameAr.includes(ar) && fr) {
      return { nameFr: fr, status: "auto" };
    }
  }

  // Fallback: replace prefix only
  return {
    nameFr: nameAr.replace("إبتدائية", "École").replace("ابتدائية", "École"),
    status: "needs_review"
  };
}

// --- MAIN ---
async function main() {
  console.log("\n🚀 FreeGeny — Import des écoles algériennes\n");

  await client.connect();
  log("Connexion à la base de données établie");

  // --- ÉTAPE 0 : Créer les tables si elles n'existent pas ---
  info("Étape 0/6 : Création des tables");
  await client.query(`
    CREATE TABLE IF NOT EXISTS countries (
      id          SERIAL PRIMARY KEY,
      code        CHAR(2)       NOT NULL UNIQUE,
      name_fr     VARCHAR(100)  NOT NULL,
      name_ar     VARCHAR(100),
      name_en     VARCHAR(100)  NOT NULL DEFAULT '',
      name_local  VARCHAR(100),
      flag_emoji  VARCHAR(10),
      langs       VARCHAR(20)   NOT NULL DEFAULT 'fr',
      is_active   BOOLEAN       DEFAULT FALSE,
      created_at  TIMESTAMP     DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS regions (
      id           SERIAL PRIMARY KEY,
      country_code CHAR(2)       NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
      code         VARCHAR(10)   NOT NULL,
      name_local   VARCHAR(200)  NOT NULL,
      name_fr      VARCHAR(200),
      name_en      VARCHAR(200),
      UNIQUE (country_code, code)
    );
    CREATE TABLE IF NOT EXISTS districts (
      id         SERIAL PRIMARY KEY,
      region_id  INTEGER       NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      code       VARCHAR(10)   NOT NULL,
      name_local VARCHAR(200)  NOT NULL,
      name_fr    VARCHAR(200),
      name_en    VARCHAR(200),
      UNIQUE (region_id, code)
    );
    CREATE TABLE IF NOT EXISTS schools (
      id                  SERIAL PRIMARY KEY,
      district_id         INTEGER       NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
      code                VARCHAR(20)   UNIQUE,
      name_local          VARCHAR(400)  NOT NULL,
      name_fr             VARCHAR(400),
      name_en             VARCHAR(400),
      type                SMALLINT      NOT NULL DEFAULT 1,
      is_active           BOOLEAN       DEFAULT TRUE,
      lat                 DECIMAL(10,7),
      lng                 DECIMAL(10,7),
      translation_status  VARCHAR(20)   DEFAULT 'needs_review',
      source              VARCHAR(100)  DEFAULT 'awlyaa.education.dz',
      created_at          TIMESTAMP     DEFAULT NOW(),
      updated_at          TIMESTAMP     DEFAULT NOW()
    );
    -- Add school fields to children table if they don't exist
    ALTER TABLE children ADD COLUMN IF NOT EXISTS school_id INTEGER;
    ALTER TABLE children ADD COLUMN IF NOT EXISTS school_name TEXT;
  `);
  log("Tables créées / vérifiées");

  // --- ÉTAPE 1 : Pays ---
  info("Étape 1/6 : Pays");
  await client.query(`
    INSERT INTO countries (code, name_fr, name_ar, name_en, name_local, flag_emoji, langs, is_active)
    VALUES ('DZ', 'Algérie', 'الجزائر', 'Algeria', 'الجزائر', '🇩🇿', 'ar,fr', TRUE)
    ON CONFLICT (code) DO UPDATE SET is_active = TRUE
  `);
  log("Algérie enregistrée");

  // --- ÉTAPE 2 : Wilayas ---
  info("Étape 2/6 : 58 Wilayas");
  const wilayas = [
    ['01','أدرار','Adrar'],['02','الشلف','Chlef'],['03','الأغواط','Laghouat'],
    ['04','أم البواقي','Oum El Bouaghi'],['05','باتنة','Batna'],['06','بجاية','Béjaïa'],
    ['07','بسكرة','Biskra'],['08','بشار','Béchar'],['09','البليدة','Blida'],
    ['10','البويرة','Bouira'],['11','تمنراست','Tamanrasset'],['12','تبسة','Tébessa'],
    ['13','تلمسان','Tlemcen'],['14','تيارت','Tiaret'],['15','تيزي وزو','Tizi Ouzou'],
    ['16','الجزائر','Alger'],['17','الجلفة','Djelfa'],['18','جيجل','Jijel'],
    ['19','سطيف','Sétif'],['20','سعيدة','Saïda'],['21','سكيكدة','Skikda'],
    ['22','سيدي بلعباس','Sidi Bel Abbès'],['23','عنابة','Annaba'],['24','قالمة','Guelma'],
    ['25','قسنطينة','Constantine'],['26','المدية','Médéa'],['27','مستغانم','Mostaganem'],
    ['28','المسيلة',"M'Sila"],['29','معسكر','Mascara'],['30','ورقلة','Ouargla'],
    ['31','وهران','Oran'],['32','البيض','El Bayadh'],['33','إليزي','Illizi'],
    ['34','برج بوعريريج','Bordj Bou Arréridj'],['35','بومرداس','Boumerdès'],
    ['36','الطارف','El Tarf'],['37','تندوف','Tindouf'],['38','تيسمسيلت','Tissemsilt'],
    ['39','الوادي','El Oued'],['40','خنشلة','Khenchela'],['41','سوق أهراس','Souk Ahras'],
    ['42','تيبازة','Tipaza'],['43','ميلة','Mila'],['44','عين الدفلى','Aïn Defla'],
    ['45','النعامة','Naâma'],['46','عين تموشنت','Aïn Témouchent'],['47','غرداية','Ghardaïa'],
    ['48','غليزان','Relizane'],['49','تيميمون','Timimoun'],['50','برج باجي مختار','Bordj Badji Mokhtar'],
    ['51','أولاد جلال','Ouled Djellal'],['52','بني عباس','Beni Abbès'],['53','إن صالح','In Salah'],
    ['54','إن قزام','In Guezzam'],['55','تقرت','Touggourt'],['56','جانت','Djanet'],
    ["57",'المغير',"El M'Ghair"],['58','المنيعة','El Meniaa'],
  ];

  for (const [code, nameLocal, nameFr] of wilayas) {
    await client.query(
      `INSERT INTO regions (country_code, code, name_local, name_fr, name_en)
       VALUES ('DZ', $1, $2, $3, $3)
       ON CONFLICT DO NOTHING`,
      [code, nameLocal, nameFr]
    );
  }
  log("58 wilayas insérées");

  // --- ÉTAPE 3 : Lire les CSV ---
  info("Étape 3/6 : Lecture des fichiers CSV");

  const publicSchools = await readCSV(CSV_PUBLIC);
  log(`${publicSchools.length.toLocaleString()} écoles publiques lues`);

  const privateSchools = await readCSV(CSV_PRIVATE);
  log(`${privateSchools.length.toLocaleString()} écoles privées lues`);

  const allSchools = [
    ...publicSchools.map(s => ({ ...s, type: 1 })),
    ...privateSchools.map(s => ({ ...s, type: 2 })),
  ];

  // --- ÉTAPE 4 : Communes (districts) ---
  info("Étape 4/6 : Import des communes");

  // Collect unique communes
  const communes = new Map();
  for (const s of allSchools) {
    const code = s.commune_code || s["commune_code"];
    const name = s.commune_name || s["commune_name"];
    const wilayaCode = (s.wilaya_code || s["wilaya_code"] || "").padStart(2, "0");
    if (code && !communes.has(code)) {
      communes.set(code, { name, wilayaCode });
    }
  }

  let communesInserted = 0;
  for (const [code, { name, wilayaCode }] of communes) {
    // Skip if no wilaya code
    if (!wilayaCode || wilayaCode === "00") continue;

    const regionRes = await client.query(
      `SELECT id FROM regions WHERE country_code = 'DZ' AND code = $1`,
      [wilayaCode]
    );
    if (regionRes.rows.length > 0) {
      // Use code as fallback name if name is empty
      const safeName = (name && name.trim()) ? name.trim() : `Commune ${code}`;
      await client.query(
        `INSERT INTO districts (region_id, code, name_local, name_fr)
         VALUES ($1, $2, $3, $3)
         ON CONFLICT DO NOTHING`,
        [regionRes.rows[0].id, code, safeName]
      );
      communesInserted++;
    }
  }
  log(`${communesInserted} communes insérées`);

  // --- ÉTAPE 5 : Écoles ---
  info("Étape 5/6 : Import des écoles (cela peut prendre quelques minutes...)");

  let inserted = 0;
  let skipped = 0;
  const batchSize = 500;
  
  for (let i = 0; i < allSchools.length; i += batchSize) {
    const batch = allSchools.slice(i, i + batchSize);
    
    for (const s of batch) {
      const code       = s.ecole_code  || s["ecole_code"];
      const nameAr     = s.nom_ecole   || s.nom_ar   || s["nom_ar"] || s["nom_ecole"];
      const communeCode= s.commune_code|| s["commune_code"];
      const wilayaCode = (s.wilaya_code || s["wilaya_code"] || "").padStart(2, "0");
      const type       = s.type || 1;

      if (!nameAr || !communeCode) { skipped++; continue; }

      // Find district
      const distRes = await client.query(
        `SELECT d.id FROM districts d
         JOIN regions r ON r.id = d.region_id
         WHERE d.code = $1 AND r.code = $2 AND r.country_code = 'DZ'`,
        [communeCode, wilayaCode]
      );
      
      if (!distRes.rows.length) { skipped++; continue; }

      const { nameFr, status } = translateArabic(nameAr);

      await client.query(
        `INSERT INTO schools (district_id, code, name_local, name_fr, type, translation_status, source)
         VALUES ($1, $2, $3, $4, $5, $6, 'awlyaa.education.dz')
         ON CONFLICT (code) DO UPDATE SET
           name_local = EXCLUDED.name_local,
           name_fr = EXCLUDED.name_fr,
           updated_at = NOW()`,
        [distRes.rows[0].id, code || null, nameAr, nameFr, type, status]
      );
      inserted++;
    }

    process.stdout.write(`\r  📊 Progression: ${Math.min(i + batchSize, allSchools.length)}/${allSchools.length} écoles traitées...`);
  }

  console.log("");
  log(`${inserted.toLocaleString()} écoles importées avec succès`);
  if (skipped > 0) warn(`${skipped} lignes ignorées (données manquantes)`);

  // --- ÉTAPE 6 : Stats ---
  info("Étape 6/6 : Statistiques finales");
  const stats = await client.query(`
    SELECT r.name_fr AS wilaya, COUNT(*) AS total,
      SUM(CASE WHEN s.type = 1 THEN 1 ELSE 0 END) AS publiques,
      SUM(CASE WHEN s.type = 2 THEN 1 ELSE 0 END) AS privees
    FROM schools s
    JOIN districts d ON s.district_id = d.id
    JOIN regions r ON d.region_id = r.id
    WHERE r.country_code = 'DZ'
    GROUP BY r.name_fr
    ORDER BY total DESC
    LIMIT 10
  `);

  console.log("\n  📊 Top 10 wilayas par nombre d'écoles :\n");
  for (const row of stats.rows) {
    console.log(`     ${row.wilaya.padEnd(25)} : ${String(row.total).padStart(5)} écoles  (${row.publiques} pub. / ${row.privees} priv.)`);
  }

  const total = await client.query("SELECT COUNT(*) FROM schools");
  console.log(`\n  ✅ TOTAL : ${parseInt(total.rows[0].count).toLocaleString()} écoles dans la base de données`);

  await client.end();
  console.log("\n🎉 Import terminé avec succès !\n");
}

main().catch(err => {
  console.error("\n❌ Erreur :", err.message);
  console.error(err.stack);
  process.exit(1);
});
