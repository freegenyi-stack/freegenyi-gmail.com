const SUPPORTED_REGIONS = {
  'DZ': { 'name': 'Algeria', 'langs': ['ar', 'fr'] },
  'MA': { 'name': 'Morocco', 'langs': ['ar', 'fr'] },
  'TN': { 'name': 'Tunisia', 'langs': ['ar', 'fr'] },
  'EG': { 'name': 'Egypt', 'langs': ['ar'] },
  'SA': { 'name': 'Saudi Arabia', 'langs': ['ar'] },
  'AE': { 'name': 'United Arab Emirates', 'langs': ['ar'] },
  'QA': { 'name': 'Qatar', 'langs': ['ar'] },
  'KW': { 'name': 'Kuwait', 'langs': ['ar'] },
  'LB': { 'name': 'Lebanon', 'langs': ['ar', 'fr'] },
  'LY': { 'name': 'Libya', 'langs': ['ar'] },
  'SY': { 'name': 'Syria', 'langs': ['ar'] },
  'IQ': { 'name': 'Iraq', 'langs': ['ar', 'ku'] },
  'JO': { 'name': 'Jordan', 'langs': ['ar'] },
  'OM': { 'name': 'Oman', 'langs': ['ar'] },
  'BH': { 'name': 'Bahrain', 'langs': ['ar'] },
  'YE': { 'name': 'Yemen', 'langs': ['ar'] },
  'SD': { 'name': 'Sudan', 'langs': ['ar'] },
  'FR': { 'name': 'France', 'langs': ['fr'] },
  'BE': { 'name': 'Belgium', 'langs': ['fr', 'nl'] },
  'CH': { 'name': 'Switzerland', 'langs': ['fr', 'de', 'it'] },
  'CA': { 'name': 'Canada', 'langs': ['fr', 'en'] },
  'US': { 'name': 'USA', 'langs': ['en'] },
  'GB': { 'name': 'United Kingdom', 'langs': ['en'] },
  'DE': { 'name': 'Germany', 'langs': ['de'] },
  'ES': { 'name': 'Spain', 'langs': ['es'] },
  'IT': { 'name': 'Italy', 'langs': ['it'] },
  'PT': { 'name': 'Portugal', 'langs': ['pt'] },
  'BR': { 'name': 'Brazil', 'langs': ['pt'] },
  'TR': { 'name': 'Turkey', 'langs': ['tr'] },
  'RU': { 'name': 'Russia', 'langs': ['ru'] },
  'BY': { 'name': 'Belarus', 'langs': ['be', 'ru'] },
  'UA': { 'name': 'Ukraine', 'langs': ['uk'] },
  'PL': { 'name': 'Poland', 'langs': ['pl'] },
  'RO': { 'name': 'Romania', 'langs': ['ro'] },
  'GR': { 'name': 'Greece', 'langs': ['el'] },
  'HU': { 'name': 'Hungary', 'langs': ['hu'] },
  'CZ': { 'name': 'Czech Republic', 'langs': ['cs'] },
  'DK': { 'name': 'Denmark', 'langs': ['da'] },
  'NO': { 'name': 'Norway', 'langs': ['no'] },
  'SE': { 'name': 'Sweden', 'langs': ['sv'] },
  'FI': { 'name': 'Finland', 'langs': ['fi', 'sv'] },
  'NL': { 'name': 'Netherlands', 'langs': ['nl'] },
  'IE': { 'name': 'Ireland', 'langs': ['en', 'ga'] },
  'AT': { 'name': 'Austria', 'langs': ['de'] },
  'MX': { 'name': 'Mexico', 'langs': ['es'] },
  'AR': { 'name': 'Argentina', 'langs': ['es'] },
  'CO': { 'name': 'Colombia', 'langs': ['es'] },
  'CL': { 'name': 'Chile', 'langs': ['es'] },
  'PE': { 'name': 'Peru', 'langs': ['es'] },
  'SN': { 'name': 'Senegal', 'langs': ['fr'] },
  'AO': { 'name': 'Angola', 'langs': ['pt'] },
  'ZA': { 'name': 'South Africa', 'langs': ['en', 'af', 'zu', 'xh'] },
  'CN': { 'name': 'China', 'langs': ['zh'] },
  'SG': { 'name': 'Singapore', 'langs': ['en', 'zh', 'ms', 'ta'] },
  'TW': { 'name': 'Taiwan', 'langs': ['zh'] },
  'JP': { 'name': 'Japan', 'langs': ['ja'] },
  'KR': { 'name': 'South Korea', 'langs': ['ko'] },
  'IN': { 'name': 'India', 'langs': ['hi', 'en'] },
  'AU': { 'name': 'Australia', 'langs': ['en'] },
  'NZ': { 'name': 'New Zealand', 'langs': ['en', 'mi'] },
  'TH': { 'name': 'Thailand', 'langs': ['th'] },
  'VN': { 'name': 'Vietnam', 'langs': ['vi'] },
  'ID': { 'name': 'Indonesia', 'langs': ['id'] },
  'MY': { 'name': 'Malaysia', 'langs': ['ms'] },
};

const FRENCH_NAMES = {
  'DZ': 'Algérie', 'MA': 'Maroc', 'TN': 'Tunisie', 'EG': 'Égypte',
  'SA': 'Arabie Saoudite', 'AE': 'Émirats Arabes Unis', 'QA': 'Qatar',
  'KW': 'Koweït', 'LB': 'Liban', 'LY': 'Libye', 'SY': 'Syrie',
  'IQ': 'Irak', 'JO': 'Jordanie', 'OM': 'Oman', 'BH': 'Bahreïn',
  'YE': 'Yémen', 'SD': 'Soudan', 'FR': 'France', 'BE': 'Belgique',
  'CH': 'Suisse', 'CA': 'Canada', 'US': 'États-Unis', 'GB': 'Royaume-Uni',
  'DE': 'Allemagne', 'ES': 'Espagne', 'IT': 'Italie', 'PT': 'Portugal',
  'BR': 'Brésil', 'TR': 'Turquie', 'RU': 'Russie', 'BY': 'Biélorussie',
  'UA': 'Ukraine', 'PL': 'Pologne', 'RO': 'Roumanie', 'GR': 'Grèce',
  'HU': 'Hongrie', 'CZ': 'République Tchèque', 'DK': 'Danemark',
  'NO': 'Norvège', 'SE': 'Suède', 'FI': 'Finlande', 'NL': 'Pays-Bas',
  'IE': 'Irlande', 'AT': 'Autriche', 'MX': 'Mexique', 'AR': 'Argentine',
  'CO': 'Colombie', 'CL': 'Chili', 'PE': 'Pérou', 'SN': 'Sénégal',
  'AO': 'Angola', 'ZA': 'Afrique du Sud', 'CN': 'Chine', 'SG': 'Singapour',
  'TW': 'Taïwan', 'JP': 'Japon', 'KR': 'Corée du Sud', 'IN': 'Inde',
  'AU': 'Australie', 'NZ': 'Nouvelle-Zélande', 'TH': 'Thaïlande',
  'VN': 'Vietnam', 'ID': 'Indonésie', 'MY': 'Malaisie'
};

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const list = Object.entries(SUPPORTED_REGIONS).map(([code, data]) => {
  const nameFr = FRENCH_NAMES[code] || data.name;
  return {
    code,
    nameFr,
    nameEn: data.name,
    flag: getFlagEmoji(code),
    langs: data.langs.join(', ').toUpperCase()
  };
});

list.sort((a, b) => a.nameFr.localeCompare(b.nameFr, 'fr'));

list.forEach((c, idx) => {
  console.log(`| ${idx + 1} | ${c.flag} | **${c.nameFr}** | ${c.nameEn} | \`${c.code}\` | \`${c.langs}\` |`);
});
