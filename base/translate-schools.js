const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";

const prefixMap = [
  [/^إبتدائية\s+/i, "École primaire "],
  [/^ابتدائية\s+/i, "École primaire "],
  [/^مدرسة\s+خاصة\s+/i, "École privée "],
  [/^مدرسة\s+/i, "École "],
];

const datesMap = [
  [/1\s+نوفمبر\s+1954/g, "1er Novembre 1954"],
  [/١\s+نوفمبر\s+١٩٥٤/g, "1er Novembre 1954"],
  [/19\s+مارس\s+1962/g, "19 Mars 1962"],
  [/١٩\s+مارس\s+١٩٦٢/g, "19 Mars 1962"],
  [/5\s+جويلية\s+1962/g, "5 Juillet 1962"],
  [/٥\s+جويلية\s+١٩٦٢/g, "5 Juillet 1962"],
  [/24\s+فيفري/g, "24 Février"],
  [/٢٤\s+فيفري/g, "24 Février"],
];

const commonNouns = {
  "السلام": "de la Paix",
  "النصر": "de la Victoire",
  "الأمل": "de l'Espoir",
  "النور": "de la Lumière",
  "الاستقلال": "de l'Indépendance",
  "التحرير": "de la Libération",
  "الوحدة": "de l'Unité",
  "الثورة": "de la Révolution",
  "الشباب": "de la Jeunesse",
  "الوطن": "de la Patrie",
  "النجاح": "du Succès",
  "الحرية": "de la Liberté",
  "الوفاء": "de la Fidélité",
  "التضامن": "de la Solidarité",
  "المستقبل": "de l'Avenir",
  "الازدهار": "de la Prospérité",
  "الطفولة": "de l'Enfance"
};

const historicalFigures = {
  "ابن باديس": "Ibn Badis",
  "ابن خلدون": "Ibn Khaldoun",
  "ابن رشد": "Ibn Rochd",
  "ابن سينا": "Ibn Sina",
  "المقراني": "El Mokrani",
  "عبد الحميد بن باديس": "Abdelhamid Ibn Badis",
  "الأمير عبد القادر": "L'Émir Abdelkader",
  "عبد القادر": "Abdelkader",
  "فاطمة نسومر": "Fatma N'Soumer",
  "لالة فاطمة نسومر": "Lalla Fatma N'Soumer",
};

const berberMap = {
  "لالة": "Lalla",
  "أيت": "Aït",
  "ايت": "Aït",
  "إغيل": "Ighil",
  "اغيل": "Ighil",
  "تاوريرت": "Taourirt",
  "تيزي": "Tizi",
  "أمالو": "Amalou",
  "امالو": "Amalou"
};

const commonNameDict = {
  "محمد": "Mohamed",
  "احمد": "Ahmed",
  "أحمد": "Ahmed",
  "علي": "Ali",
  "عمر": "Omar",
  "مصطفى": "Mustapha",
  "سليمان": "Slimane",
  "ابراهيم": "Ibrahim",
  "يوسف": "Youssef",
  "رشيد": "Rachid",
  "خالد": "Khaled",
  "جمال": "Djamel",
  "صالح": "Salah",
  "حسين": "Hocine",
  "بلقاسم": "Belkacem",
  "قاسم": "Kacem",
  "سعيد": "Said",
  "سعدي": "Saadi",
  "قدور": "Kaddour",
  "جيلالي": "Djilali",
  "طاهر": "Tahar",
  "مختار": "Mokhtar",
  "عزوز": "Azzouz",
  "رابح": "Rabah",
  "مسعود": "Messaoud",
  "امين": "Amine",
  "أمين": "Amine",
  "حميد": "Hamid",
  "ياسين": "Yacine",
  "سليم": "Selim",
  "كريم": "Karim",
  "مراد": "Mourad",
  "كمال": "Kamel",
  "خليل": "Khalil",
  "فريد": "Farid",
  "سمير": "Samir",
  "عادل": "Adel",
  "طارق": "Tarek",
  "هشام": "Hichem",
  "عبد الرحمن": "Abderrahmane",
  "عبد الحميد": "Abdelhamid",
  "عبد الله": "Abdellah",
  "عبد المجيد": "Abdelmadjid",
  "عبد العزيز": "Abdelaziz",
  "عبد الحليم": "Abdelhalim",
  "عبد السلام": "Abdesselam",
  "عبد الكريم": "Abdelkrim",
  "عبد الرزاق": "Abderrezak",
  "بن": "Ben",
  "بو": "Bou",
  "عزوق": "Azzoug"
};

function phoneticTransliterate(word) {
  let cleanWord = word.trim();
  if (!cleanWord) return "";

  let result = "";
  let i = 0;
  
  const chars = {
    'أ': 'A', 'ا': 'A', 'إ': 'I', 'آ': 'A',
    'ب': 'B',
    'ت': 'T', 'ث': 'Th',
    'ج': 'Dj',
    'ح': 'H', 'خ': 'Kh',
    'د': 'D', 'ذ': 'Dh',
    'ر': 'R', 'ز': 'Z',
    'س': 'S', 'ش': 'Ch',
    'ص': 'S', 'ض': 'D',
    'ط': 'T', 'ظ': 'Dh',
    'ع': 'A', 'غ': 'Gh',
    'ف': 'F', 'ق': 'K',
    'ك': 'K',
    'ل': 'L',
    'م': 'M', 'ن': 'N',
    'ه': 'H',
    'و': 'Ou',
    'ي': 'I', 'ى': 'A',
    'ء': '', 'ئ': 'I', 'ؤ': 'Ou', 'ة': 'e'
  };

  while (i < cleanWord.length) {
    const char = cleanWord[i];
    
    if (char === 'ّ') {
      if (result.length > 0) {
        const last = result[result.length - 1];
        if (/[a-zA-Z]/.test(last) && !['a','e','i','o','u','y'].includes(last.toLowerCase())) {
          result += last;
        }
      }
      i++;
      continue;
    }

    if (cleanWord.substring(i, i + 3) === "عبد") {
      result += "Abdel";
      i += 3;
      continue;
    }

    const trans = chars[char] || char;
    result += trans;
    i++;
  }

  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  }
  return result;
}

function translateSchoolName(arabicName) {
  if (!arabicName) return "";
  
  let name = arabicName.trim();
  let isUncertain = false;

  let prefix = "École primaire ";
  for (const [regex, replacement] of prefixMap) {
    if (regex.test(name)) {
      prefix = replacement;
      name = name.replace(regex, "");
      break;
    }
  }

  for (const [regex, replacement] of datesMap) {
    if (regex.test(name)) {
      name = name.replace(regex, replacement);
    }
  }

  let martyrPrefix = "";
  if (name.includes("الشهيد")) {
    martyrPrefix = "Chahid ";
    name = name.replace(/الشهيد\s+/g, "");
  } else if (name.includes("الشهداء")) {
    martyrPrefix = "Chouhada ";
    name = name.replace(/الشهداء\s+/g, "");
  }

  // Sliding matches
  for (const [ar, fr] of Object.entries(historicalFigures)) {
    if (name.includes(ar)) {
      name = name.replace(new RegExp(ar, 'g'), `__HIST_${fr}__`);
    }
  }

  for (const [ar, fr] of Object.entries(commonNouns)) {
    if (name.includes(ar)) {
      name = name.replace(new RegExp(ar, 'g'), `__NOUN_${fr}__`);
    }
  }

  const words = name.split(/\s+/).filter(Boolean);
  let frenchParts = [];

  for (let word of words) {
    if (word.startsWith("__HIST_") && word.endsWith("__")) {
      const fr = word.replace("__HIST_", "").replace("__", "");
      frenchParts.push(fr);
    } else if (word.startsWith("__NOUN_") && word.endsWith("__")) {
      const fr = word.replace("__NOUN_", "").replace("__", "");
      frenchParts.push(fr);
    } else if (/[a-zA-Z0-9]/.test(word)) {
      frenchParts.push(word);
    } else {
      let cleanWord = word.trim();
      if (commonNameDict[cleanWord]) {
        frenchParts.push(commonNameDict[cleanWord]);
      } else if (berberMap[cleanWord]) {
        frenchParts.push(berberMap[cleanWord]);
      } else {
        const phonetic = phoneticTransliterate(cleanWord);
        frenchParts.push(phonetic);
        isUncertain = true;
      }
    }
  }

  let finalName = prefix + martyrPrefix + frenchParts.join(" ");
  finalName = finalName.replace(/\s+/g, " ").trim();

  if (isUncertain) {
    finalName += " [À VÉRIFIER]";
  }

  return finalName;
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("Connected to database. Fetching schools...");
  const res = await client.query("SELECT id, name_local FROM schools LIMIT 10");
  
  console.log("\n--- TEST RUN (First 10 schools) ---");
  for (const row of res.rows) {
    console.log(`AR: ${row.name_local}`);
    console.log(`FR: ${translateSchoolName(row.name_local)}`);
    console.log("-------------------");
  }

  // If you are ready to update the entire DB:
  console.log("\nProcessing all schools in DB...");
  const allSchools = await client.query("SELECT id, name_local FROM schools");
  console.log(`Total schools to update: ${allSchools.rows.length}`);

  let updated = 0;
  for (const row of allSchools.rows) {
    const translated = translateSchoolName(row.name_local);
    await client.query("UPDATE schools SET name_fr = $1 WHERE id = $2", [translated, row.id]);
    updated++;
    if (updated % 5000 === 0) {
      console.log(`Updated ${updated}/${allSchools.rows.length}...`);
    }
  }

  console.log(`Successfully updated ${updated} schools with transliterated names!`);
  await client.end();
}

main().catch(console.error);
