import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Zulu
zu_translations = {
    "Le Pont de l’Excellence est ouvert": "Ibhulorho Yokugqwesa ivuliwe",
    "Libérez le": "Khulula",
    "génie": "ingqondi",
    "de votre enfant.": "yomntwana wakho.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "I-FreeGeny yakha ibhuloho lobuchwepheshe phakathi kwabazali, izikole nezingane ukuze kutholakale impumelelo.",
    "Commencer l’aventure": "Qala uhambo",
    "Notre approche": "Indlela yethu",
    "Notre Approche": "Indlela yethu",
    "Génies": "Izihlakaniphi",
    "Pays": "Amazwe",
    "Écoles": "Izikole",
    "Langues": "Izilimi",
    "Cours & Exercices": "Izifundo Nemisebenzi",
    "Portail Mondial": "Iphothali Yomhlaba",
    "Arène Magique": "I-Arena Yomlingo",
    "Entrer dans l'arène →": "Ngena enkundleni →",
    "Des solutions pour chacun.": "Izixazululo zawo wonke umuntu.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Ngoba ukugqwesa kudinga ukusebenzisana okuhle phakathi kwabo bonke.",
    "En savoir plus →": "Funda kabanzi →",
    "Transformation numérique complète.": "Uguquko lwedijithali oluphelele.",
    "Boost Émotionnel": "Ukukhuthazwa Ngokomzwelo",
    "Vocal de maman enregistré": "Izwi likamama liqॉर्डiwe",
    "Félicitations Amine !": "Siyakuhalalisela Amine!",
    "Innovation": "I-Innovation",
    "Un pilotage d'exception.": "Ukuphatha okungafani nokunye.",
    "Motivez votre enfant avec votre propre voix.": "Khuthaza ingane yakho ngezwi lakho.",
    "Parcours IA Adaptatif": "Indlela ye-IA eguqukayo",
    "Chaque clic réajuste le programme.": "Konke ukuchofoza kulungisa uhlelo.",
    "Prêt à libérer le génie ?": "Ingabe ukulungele ukukhulula ingqondi?",
    "S'inscrire gratuitement": "Bhalisa mahhala",
    "Connexion": "Ngena",
    "Rejoindre": "Joyina",
    "À propos": "Mayelana nathi",
    "Approche": "Indlela yethu",
    "Parents": "Abazali",
    "ONG": "Ama-NGO",
    "Science": "Isayensi",
    "Découvrir": "Thola",
    "Solutions": "Izixazululo",
    "Ressources": "Izinsiza",
    "Légal": "Okusemthethweni",
    "FAQ": "Imibuzo Evame Ukubuzwa",
    "Blog": "Ibhulogi",
    "Contact": "Thintana nathi",
    "Confidentialité": "Ubumfihlo",
    "Conditions": "Imigomo",
    "Tous droits réservés.": "Wonke amalungelo agodliwe.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "I-EdTech eguqula ukufunda nempumelelo yesikole emhlabeni jikelele.",
    "Soon on": "Kuyeza maduze",
    "Bientôt sur": "Kuyeza maduze",
    "Région": "Isifunda",
    "Explorez les Portails": "Hlola amaphothali",
}

# Translation map for Xhosa
xh_translations = {
    "Le Pont de l’Excellence est ouvert": "Ibhulorho Yokugqwesa ivuliwe",
    "Libérez le": "Khulula",
    "génie": "ingqondi",
    "de votre enfant.": "yomntwana wakho.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "I-FreeGeny yakha ibhulorho yobuchwepheshe phakathi kwabazali, izikolo nabantwana ukuze baphumelele.",
    "Commencer l’aventure": "Qala uhambo",
    "Notre approche": "Indlela yethu",
    "Notre Approche": "Indlela yethu",
    "Génies": "Izihlakaniphi",
    "Pays": "Amazwe",
    "Écoles": "Izikolo",
    "Langues": "Iilwimi",
    "Cours & Exercices": "Izifundo Nemisebenzi",
    "Portail Mondial": "Iphothali yeHlabathi",
    "Arène Magique": "IArena yoMlingo",
    "Entrer dans l'arène →": "Ngena enkundleni →",
    "Des solutions pour chacun.": "Izisombululo zomntu wonke.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Kuba ukugqwesa kufuna ukusebenzisana okugqibeleleyo phakathi kwabo bonke.",
    "En savoir plus →": "Funda ngakumbi →",
    "Transformation numérique complète.": "Utshintsho lwedijithali olupheleleyo.",
    "Boost Émotionnel": "Inkxaso ngokweemvakalelo",
    "Vocal de maman enregistré": "Ilizwi likamama lishoshiwe",
    "Félicitations Amine !": "Sivuyisana nawe Amine!",
    "Innovation": "I-Innovation",
    "Un pilotage d'exception.": "Ulawulo olungaphaya kokuqhelekileyo.",
    "Motivez votre enfant avec votre propre voix.": "Khuthaza umntwana wakho ngelizwi lakho.",
    "Parcours IA Adaptatif": "Indlela ye-IA eguqukayo",
    "Chaque clic réajuste le programme.": "Unqakrazo ngalunye lulungelelanisa inkqubo.",
    "Prêt à libérer le génie ?": "Ingaba ukulungele ukukhulula ingqondi?",
    "S'inscrire gratuitement": "Bhalisa simahla",
    "Connexion": "Ngena",
    "Rejoindre": "Joyina",
    "À propos": "Malunga nathi",
    "Approche": "Indlela yethu",
    "Parents": "Abazali",
    "ONG": "Ii-NGO",
    "Science": "Inzululwazi",
    "Découvrir": "Fumana",
    "Solutions": "Izisombululo",
    "Ressources": "Izixhobo",
    "Légal": "Ezomthetho",
    "FAQ": "Imibuzo exhaphakileyo",
    "Blog": "Ibhulogi",
    "Contact": "Nxibelelana nathi",
    "Confidentialité": "Ubumfihlo",
    "Conditions": "Imiqathango",
    "Tous droits réservés.": "Onke amalungelo agciniwe.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "I-EdTech eguqula ukufunda nempumelelo yesikolo kwihlabathi liphela.",
    "Soon on": "Kuyeza kamsinya",
    "Bientôt sur": "Kuyeza kamsinya",
    "Région": "Ummandla",
    "Explorez les Portails": "Phonononga amaphothali",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 30 to 32 arguments)
    content = content.replace(
        'vi: string = "") => {',
        'vi: string = "", zu: string = "", xh: string = "") => {'
    )
    content = content.replace(
        'vi: string) => {',
        'vi: string, zu: string, xh: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "vi") return vi;',
        'if (selectedLang === "xh") return xh;\n    if (selectedLang === "zu") return zu;\n    if (selectedLang === "vi") return vi;'
    )

    # 3. Update t() calls
    def add_args(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 30-arg call
        if len(args) == 30:
            first_arg = args[0].strip('"\'')
            zu_val = zu_translations.get(first_arg, "")
            xh_val = xh_translations.get(first_arg, "")
            
            if not zu_val:
                clean_key = first_arg.split(" →")[0].strip()
                zu_val = zu_translations.get(clean_key, "")
            if not xh_val:
                clean_key = first_arg.split(" →")[0].strip()
                xh_val = xh_translations.get(clean_key, "")
            
            return full_call.replace(args_str, args_str + f', "{zu_val}", "{xh_val}"')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_args, content, flags=re.DOTALL)

    # Special handling for loops
    new_content = new_content.replace(
        '(item as any).vi || "")',
        '(item as any).vi || "", (item as any).zu || "", (item as any).xh || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'vi: "Về chúng tôi", href: "/about"',
            'vi: "Về chúng tôi", zu: "Mayelana nathi", xh: "Malunga nathi", href: "/about"'
        )
        new_content = new_content.replace(
            'vi: "Cách tiếp cận", href: "/approach"',
            'vi: "Cách tiếp cận", zu: "Indlela yethu", xh: "Indlela yethu", href: "/approach"'
        )
        new_content = new_content.replace(
            'vi: "Phụ huynh", href: "/parents"',
            'vi: "Phụ huynh", zu: "Abazali", xh: "Abazali", href: "/parents"'
        )
        new_content = new_content.replace(
            'vi: "Trường học", href: "/schools"',
            'vi: "Trường học", zu: "Izikole", xh: "Izikolo", href: "/schools"'
        )
        new_content = new_content.replace(
            'vi: "NGO", href: "/ngos"',
            'vi: "NGO", zu: "Ama-NGO", xh: "Ii-NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'vi: "Khoa học", href: "/science"',
            'vi: "Khoa học", zu: "Isayensi", xh: "Inzululwazi", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
