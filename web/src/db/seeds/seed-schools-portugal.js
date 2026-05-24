const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
const CSV_PT = path.join(__dirname, "data", "ecoles_primaires_portugal.csv");

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("🚀 FreeGeny — Seeding Portugal schools database...");
  console.log("🔌 Connected to database.");

  // 1. Ensure Portugal exists in countries table
  const countryRes = await client.query("SELECT id FROM countries WHERE code = 'PT'");
  if (countryRes.rows.length === 0) {
    await client.query(
      "INSERT INTO countries (code, name_local, name_fr, name_en) VALUES ('PT', 'Portugal', 'Portugal', 'Portugal')"
    );
    console.log("🇵🇹 Added Portugal to countries table.");
  } else {
    console.log("🇵🇹 Portugal already exists in countries table.");
  }

  // 2. Load CSV using comma separator (Portuguese CSV format)
  console.log("📖 Loading ecoles_primaires_portugal.csv...");
  const csvContent = fs.readFileSync(CSV_PT, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const schools = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line handling quoted fields with commas
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length !== headers.length) continue;

    const school = {};
    headers.forEach((header, index) => {
      // Remove quotes from values if present
      let value = values[index];
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      school[header] = value;
    });

    // Filter for valid schools: codigo_escola_dgeec must be a numeric value
    const schoolCode = school.codigo_escola_dgeec;
    if (!schoolCode) continue;
    if (schoolCode === '*' || schoolCode === '-') continue;
    if (isNaN(parseInt(schoolCode))) continue; // Skip non-numeric codes

    schools.push(school);
  }

  console.log(`✅ Loaded ${lines.length - 1} rows from CSV.`);
  console.log(`📊 Total schools: ${schools.length}.`);

  // 3. Collect unique districts (distritos) and municipalities (municipios)
  // Map municipalities to their districts manually
  const districtsMap = new Map(); // distrito -> { code, nameLocal, nameFr }
  const municipalitiesMap = new Map(); // municipio -> { districtCode, municipalityCode, municipalityName }
  const validSchools = [];

  // Define the 18 districts + 2 autonomous regions of Portugal
  const portugalDistricts = [
    { code: "AVEIRO", name: "Aveiro" },
    { code: "BEJA", name: "Beja" },
    { code: "BRAGA", name: "Braga" },
    { code: "BRAGANCA", name: "Bragança" },
    { code: "CASTELO", name: "Castelo Branco" },
    { code: "COIMBRA", name: "Coimbra" },
    { code: "EVORA", name: "Évora" },
    { code: "FARO", name: "Faro" },
    { code: "GUARDA", name: "Guarda" },
    { code: "LEIRIA", name: "Leiria" },
    { code: "LISBOA", name: "Lisboa" },
    { code: "PORTALE", name: "Portalegre" },
    { code: "PORTO", name: "Porto" },
    { code: "SANTARE", name: "Santarém" },
    { code: "SETUBAL", name: "Setúbal" },
    { code: "VIANA", name: "Viana do Castelo" },
    { code: "VILARE", name: "Vila Real" },
    { code: "VISEU", name: "Viseu" },
    { code: "ACORES", name: "Açores" },
    { code: "MADEIRA", name: "Madeira" }
  ];

  // Add all districts to the map
  for (const district of portugalDistricts) {
    districtsMap.set(district.code, {
      code: district.code,
      nameLocal: district.name,
      nameFr: district.name
    });
  }

  // Municipality to district mapping (278 municipalities of continental Portugal)
  const municipalityToDistrict = {
    // District de Aveiro
    "Águeda": "AVEIRO", "Albergaria-a-Velha": "AVEIRO", "Anadia": "AVEIRO", "Arouca": "AVEIRO",
    "Aveiro": "AVEIRO", "Castelo de Paiva": "AVEIRO", "Espinho": "AVEIRO", "Estarreja": "AVEIRO",
    "Ílhavo": "AVEIRO", "Mealhada": "AVEIRO", "Murtosa": "AVEIRO", "Oliveira de Azeméis": "AVEIRO",
    "Oliveira do Bairro": "AVEIRO", "Ovar": "AVEIRO", "Santa Maria da Feira": "AVEIRO",
    "São João da Madeira": "AVEIRO", "Sever do Vouga": "AVEIRO", "Vagos": "AVEIRO", "Vale de Cambra": "AVEIRO",

    // District de Beja
    "Aljustrel": "BEJA", "Almodôvar": "BEJA", "Alvito": "BEJA", "Barrancos": "BEJA",
    "Beja": "BEJA", "Castro Verde": "BEJA", "Cuba": "BEJA", "Ferreira do Alentejo": "BEJA",
    "Mértola": "BEJA", "Moura": "BEJA", "Mourão": "BEJA", "Ourique": "BEJA", "Serpa": "BEJA",
    "Vidigueira": "BEJA",

    // District de Braga
    "Amares": "BRAGA", "Barcelos": "BRAGA", "Braga": "BRAGA", "Cabeceiras de Basto": "BRAGA",
    "Celorico de Basto": "BRAGA", "Esposende": "BRAGA", "Fafe": "BRAGA", "Guimarães": "BRAGA",
    "Póvoa de Lanhoso": "BRAGA", "Terras de Bouro": "BRAGA", "Vieira do Minho": "BRAGA",
    "Vila Nova de Famalicão": "BRAGA", "Vila Verde": "BRAGA", "Vizela": "BRAGA",

    // District de Bragança
    "Alfândega da Fé": "BRAGANCA", "Bragança": "BRAGANCA", "Carrazeda de Ansiães": "BRAGANCA",
    "Freixo de Espada à Cinta": "BRAGANCA", "Macedo de Cavaleiros": "BRAGANCA", "Mogadouro": "BRAGANCA",
    "Miranda do Douro": "BRAGANCA", "Mirandela": "BRAGANCA", "Mogadouro": "BRAGANCA",
    "Torre de Moncorvo": "BRAGANCA", "Vila Flor": "BRAGANCA", "Vimioso": "BRAGANCA",
    "Vinhais": "BRAGANCA",

    // District de Castelo Branco
    "Belmonte": "CASTELO", "Castelo Branco": "CASTELO", "Covilhã": "CASTELO", "Fundão": "CASTELO",
    "Idanha-a-Nova": "CASTELO", "Penamacor": "CASTELO", "Proença-a-Nova": "CASTELO",
    "Sertã": "CASTELO", "Vila Nova de Foz Côa": "CASTELO", "Vila Velha de Ródão": "CASTELO",

    // District de Coimbra
    "Arganil": "COIMBRA", "Cantanhede": "COIMBRA", "Coimbra": "COIMBRA", "Condeixa-a-Nova": "COIMBRA",
    "Figueira da Foz": "COIMBRA", "Góis": "COIMBRA", "Lousã": "COIMBRA", "Mira": "COIMBRA",
    "Miranda do Corvo": "COIMBRA", "Montemor-o-Velho": "COIMBRA", "Oliveira do Hospital": "COIMBRA",
    "Pampilhosa da Serra": "COIMBRA", "Penacova": "COIMBRA", "Penela": "COIMBRA",
    "Soure": "COIMBRA", "Tábua": "COIMBRA", "Vila Nova de Poiares": "COIMBRA",

    // District de Évora
    "Alandroal": "EVORA", "Arraiolos": "EVORA", "Borba": "EVORA", "Estremoz": "EVORA",
    "Évora": "EVORA", "Montemor-o-Novo": "EVORA", "Mora": "EVORA", "Mourão": "EVORA",
    "Portel": "EVORA", "Redondo": "EVORA", "Reguengos de Monsaraz": "EVORA",
    "Vendas Novas": "EVORA", "Viana do Alentejo": "EVORA", "Vila Viçosa": "EVORA",

    // District de Faro
    "Albufeira": "FARO", "Alcoutim": "FARO", "Aljezur": "FARO", "Castro Marim": "FARO",
    "Faro": "FARO", "Lagoa": "FARO", "Lagos": "FARO", "Loulé": "FARO", "Monchique": "FARO",
    "Olhão": "FARO", "Portimão": "FARO", "São Brás de Alportel": "FARO", "Silves": "FARO",
    "Tavira": "FARO", "Vila do Bispo": "FARO", "Vila Real de Santo António": "FARO",

    // District de Guarda
    "Aguiar da Beira": "GUARDA", "Almeida": "GUARDA", "Celorico da Beira": "GUARDA",
    "Figueira de Castelo Rodrigo": "GUARDA", "Fornos de Algodres": "GUARDA", "Guarda": "GUARDA",
    "Manteigas": "GUARDA", "Meda": "GUARDA", "Pinhel": "GUARDA", "Sabugal": "GUARDA",
    "Seia": "GUARDA", "Trancoso": "GUARDA", "Vila Nova de Paiva": "GUARDA",

    // District de Leiria
    "Alcobaça": "LEIRIA", "Alvaiázere": "LEIRIA", "Ansião": "LEIRIA", "Batalha": "LEIRIA",
    "Bombarral": "LEIRIA", "Caldas da Rainha": "LEIRIA", "Castanheira de Pêra": "LEIRIA",
    "Figueiró dos Vinhos": "LEIRIA", "Leiria": "LEIRIA", "Marinha Grande": "LEIRIA",
    "Nazaré": "LEIRIA", "Óbidos": "LEIRIA", "Pedrógão Grande": "LEIRIA", "Peniche": "LEIRIA",
    "Porto de Mós": "LEIRIA", "Pombal": "LEIRIA",

    // District de Lisboa
    "Alenquer": "LISBOA", "Amadora": "LISBOA", "Arruda dos Vinhos": "LISBOA", "Azambuja": "LISBOA",
    "Cadaval": "LISBOA", "Cascais": "LISBOA", "Lisboa": "LISBOA", "Loures": "LISBOA",
    "Lourinhã": "LISBOA", "Mafra": "LISBOA", "Odivelas": "LISBOA", "Oeiras": "LISBOA",
    "Sintra": "LISBOA", "Sobral de Monte Agraço": "LISBOA", "Torres Vedras": "LISBOA",
    "Vila Franca de Xira": "LISBOA",

    // District de Portalegre
    "Alter do Chão": "PORTALE", "Arronches": "PORTALE", "Avis": "PORTALE", "Campo Maior": "PORTALE",
    "Castelo de Vide": "PORTALE", "Crato": "PORTALE", "Elvas": "PORTALE", "Fronteira": "PORTALE",
    "Gavião": "PORTALE", "Marvão": "PORTALE", "Monforte": "PORTALE", "Nisa": "PORTALE",
    "Ponte de Sor": "PORTALE", "Portalegre": "PORTALE", "Sousel": "PORTALE",

    // District de Porto
    "Amarante": "PORTO", "Baião": "PORTO", "Felgueiras": "PORTO", "Gondomar": "PORTO",
    "Lousada": "PORTO", "Maia": "PORTO", "Marco de Canaveses": "PORTO", "Matosinhos": "PORTO",
    "Paços de Ferreira": "PORTO", "Paredes": "PORTO", "Penafiel": "PORTO", "Peso da Régua": "PORTO",
    "Porto": "PORTO", "Póvoa de Varzim": "PORTO", "Santo Tirso": "PORTO", "Trofa": "PORTO",
    "Valongo": "PORTO", "Vila do Conde": "PORTO", "Vila Nova de Gaia": "PORTO",

    // District de Santarém
    "Abrantes": "SANTARE", "Almeirim": "SANTARE", "Alpiarça": "SANTARE", "Azambuja": "SANTARE",
    "Benavente": "SANTARE", "Cartaxo": "SANTARE", "Chamusca": "SANTARE", "Coruche": "SANTARE",
    "Entroncamento": "SANTARE", "Ferreira do Zêzere": "SANTARE", "Golegã": "SANTARE",
    "Rio Maior": "SANTARE", "Salvaterra de Magos": "SANTARE", "Santarém": "SANTARE",
    "Sardoal": "SANTARE", "Tomar": "SANTARE", "Torres Novas": "SANTARE", "Vila Nova da Barquinha": "SANTARE",
    "Vila Nova da Barquinha": "SANTARE", "Ourém": "SANTARE",

    // District de Setúbal
    "Alcochete": "SETUBAL", "Almada": "SETUBAL", "Barreiro": "SETUBAL", "Grândola": "SETUBAL",
    "Moita": "SETUBAL", "Montijo": "SETUBAL", "Palmela": "SETUBAL", "Santiago do Cacém": "SETUBAL",
    "Seixal": "SETUBAL", "Sesimbra": "SETUBAL", "Setúbal": "SETUBAL", "Sines": "SETUBAL",

    // District de Viana do Castelo
    "Arcos de Valdevez": "VIANA", "Caminha": "VIANA", "Melgaço": "VIANA", "Monção": "VIANA",
    "Paredes de Coura": "VIANA", "Ponte da Barca": "VIANA", "Ponte de Lima": "VIANA",
    "Valença": "VIANA", "Viana do Castelo": "VIANA", "Vila Nova de Cerveira": "VIANA",

    // District de Vila Real
    "Alijó": "VILARE", "Boticas": "VILARE", "Chaves": "VILARE", "Mesão Frio": "VILARE",
    "Mondim de Basto": "VILARE", "Montalegre": "VILARE", "Murça": "VILARE", "Penedono": "VILARE",
    "Ribeira de Pena": "VILARE", "Sabrosa": "VILARE", "Santa Marta de Penaguião": "VILARE",
    "Valpaços": "VILARE", "Vila Pouca de Aguiar": "VILARE", "Vila Real": "VILARE",

    // District de Viseu
    "Armamar": "VISEU", "Carregal do Sal": "VISEU", "Castro Daire": "VISEU", "Cinfães": "VISEU",
    "Lamego": "VISEU", "Mangualde": "VISEU", "Moimenta da Beira": "VISEU", "Mortágua": "VISEU",
    "Nelas": "VISEU", "Oliveira de Frades": "VISEU", "Penalva do Castelo": "VISEU",
    "Penedono": "VISEU", "Resende": "VISEU", "Santa Comba Dão": "VISEU", "São Pedro do Sul": "VISEU",
    "Sátão": "VISEU", "Sernancelhe": "VISEU", "Tabuaço": "VISEU", "Tarouca": "VISEU",
    "Tondela": "VISEU", "Vila Nova de Paiva": "VISEU", "Viseu": "VISEU", "Vouzela": "VISEU"
  };

  for (const school of schools) {
    const municipalityName = school.municipio;
    const schoolName = school.nome_escola;
    const schoolCode = school.codigo_escola_dgeec;

    // Skip invalid entries - only require municipality and school name
    if (!municipalityName || !schoolName) continue;

    // Get district code from municipality mapping
    const districtCode = municipalityToDistrict[municipalityName];
    if (!districtCode) {
      console.warn(`⚠️  No district found for municipality: ${municipalityName}`);
      continue;
    }
    
    // Create municipality code from municipality name (take first 10 chars, uppercase, no spaces)
    const municipalityCode = municipalityName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '').substring(0, 10);

    // Add to municipalities map
    if (!municipalitiesMap.has(municipalityCode)) {
      municipalitiesMap.set(municipalityCode, {
        districtCode: districtCode,
        municipalityCode: municipalityCode,
        municipalityName: municipalityName
      });
    }

    validSchools.push({
      code: schoolCode,
      name: schoolName,
      districtCode: municipalityCode,
      regionCode: districtCode,
      type: 1, // All primary schools are public in Portugal
      lat: null,
      lng: null
    });
  }

  console.log(`📊 Collected ${districtsMap.size} districts and ${municipalitiesMap.size} municipalities.`);

  // 4. Seed Districts (Regions)
  console.log("📁 Seeding Districts...");
  const districtsArray = Array.from(districtsMap.values());
  
  // Delete existing PT regions
  await client.query("DELETE FROM regions WHERE country_code = 'PT'");
  
  // Insert districts with ON CONFLICT DO NOTHING
  for (const district of districtsArray) {
    await client.query(
      "INSERT INTO regions (code, name_local, name_fr, country_code) VALUES ($1, $2, $3, 'PT') ON CONFLICT (country_code, code) DO NOTHING",
      [district.code, district.nameLocal, district.nameFr]
    );
  }
  console.log("✅ Districts seeded and cached.");

  // 5. Seed Municipalities (Districts)
  console.log("📁 Seeding Municipalities...");
  const municipalitiesArray = Array.from(municipalitiesMap.values());
  
  // Get region IDs for mapping
  const regionIds = new Map();
  for (const district of districtsArray) {
    const res = await client.query("SELECT id FROM regions WHERE code = $1 AND country_code = 'PT'", [district.code]);
    if (res.rows.length > 0) {
      regionIds.set(district.code, res.rows[0].id);
    }
  }

  // Delete existing PT districts
  await client.query("DELETE FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'PT')");

  // Batch insert municipalities
  const batchSize = 100;
  for (let i = 0; i < municipalitiesArray.length; i += batchSize) {
    const batch = municipalitiesArray.slice(i, i + batchSize);
    const municipalityValues = batch.map(m => [
      m.municipalityCode,
      m.municipalityName,
      m.municipalityName,
      regionIds.get(m.districtCode)
    ]);

    for (const mv of municipalityValues) {
      await client.query(
        "INSERT INTO districts (code, name_local, name_fr, region_id) VALUES ($1, $2, $3, $4) ON CONFLICT (code, region_id) DO NOTHING",
        mv
      );
    }
  }
  console.log(`✅ Seeding of ${municipalitiesArray.length} municipalities complete.`);

  // 6. Clear existing PT schools
  console.log("🗑️ Clearing existing PT schools...");
  await client.query(`
    DELETE FROM schools
    WHERE district_id IN (
      SELECT d.id FROM districts d
      JOIN regions r ON d.region_id = r.id
      WHERE r.country_code = 'PT'
    )
  `);
  console.log("✅ Existing PT schools cleared.");

  // 7. Seed PT primary schools
  console.log("📥 Seeding PT primary schools...");
  let insertedCount = 0;
  const schoolBatchSize = 500;

  for (let i = 0; i < validSchools.length; i += schoolBatchSize) {
    const batch = validSchools.slice(i, i + schoolBatchSize);
    
    for (const school of batch) {
      // Get district ID
      const districtRes = await client.query(
        "SELECT id FROM districts WHERE code = $1 AND region_id = (SELECT id FROM regions WHERE code = $2 AND country_code = 'PT')",
        [school.districtCode, school.regionCode]
      );

      if (districtRes.rows.length > 0) {
        const districtId = districtRes.rows[0].id;
        
        await client.query(
          `INSERT INTO schools (code, name_local, name_fr, district_id, type, lat, lng) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [school.code, school.name, school.name, districtId, school.type, school.lat, school.lng]
        );
        insertedCount++;
      }
    }

    if ((i + schoolBatchSize) % 500 === 0 || i + schoolBatchSize >= validSchools.length) {
      console.log(`  📊 Progress: ${Math.min(i + schoolBatchSize, validSchools.length)}/${validSchools.length} schools imported...`);
    }
  }

  console.log("✅ Successfully imported Portugal primary schools!");
  console.log(`🎉 Total inserted: ${insertedCount} records`);
  console.log("🏁 Database seeding complete.");

  await client.end();
}

main().catch(err => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
