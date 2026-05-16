import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Malay
ms_translations = {
    "Le Pont de l’Excellence est ouvert": "Jambatan Kecemerlangan kini dibuka",
    "Libérez le": "Bebaskan",
    "génie": "genius",
    "de votre enfant.": "anak anda.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny membina jambatan teknologi antara Ibu Bapa, Sekolah dan Kanak-kanak untuk bimbingan holistik ke arah kecemerlangan.",
    "Commencer l’aventure": "Mulakan pengembaraan",
    "Notre approche": "Pendekatan kami",
    "Notre Approche": "Pendekatan kami",
    "Génies": "Genius",
    "Pays": "Negara",
    "Écoles": "Sekolah",
    "Langues": "Bahasa",
    "Cours & Exercices": "Kursus & Latihan",
    "Portail Mondial": "Portal Dunia",
    "Arène Magique": "Arena Magik",
    "Entrer dans l'arène →": "Masuk ke arena →",
    "Des solutions pour chacun.": "Penyelesaian untuk semua.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Kerana kecemerlangan memerlukan sinergi sempurna antara semua pihak.",
    "En savoir plus →": "Ketahui lebih lanjut →",
    "Transformation numérique complète.": "Transformasi digital lengkap.",
    "Boost Émotionnel": "Suntikan Emosi",
    "Vocal de maman enregistré": "Vokal ibu dirakam",
    "Félicitations Amine !": "Tahniah Amine!",
    "Innovation": "Inovasi",
    "Un pilotage d'exception.": "Pengurusan luar biasa.",
    "Motivez votre enfant avec votre propre voix.": "Motivasikan anak anda dengan suara anda sendiri.",
    "Parcours IA Adaptatif": "Laluan AI Adaptif",
    "Chaque clic réajuste le programme.": "Setiap klik melaras semula program.",
    "Prêt à libérer le génie ?": "Bersedia untuk membebaskan genius?",
    "S'inscrire gratuitement": "Daftar secara percuma",
    "Connexion": "Log masuk",
    "Rejoindre": "Sertai",
    "À propos": "Mengenai kami",
    "Approche": "Pendekatan",
    "Parents": "Ibu Bapa",
    "ONG": "NGO",
    "Science": "Sains",
    "Découvrir": "Teroka",
    "Solutions": "Penyelesaian",
    "Ressources": "Sumber",
    "Légal": "Undang-undang",
    "FAQ": "FAQ",
    "Blog": "Blog",
    "Contact": "Hubungi",
    "Confidentialité": "Privasi",
    "Conditions": "Terma",
    "Tous droits réservés.": "Hak cipta terpelihara.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech yang merevolusikan kesedaran dan kejayaan sekolah di seluruh dunia. Kecemerlangan dan impak.",
    "Login": "Log masuk",
    "Join": "Sertai",
    "About": "Mengenai",
    "Approach": "Pendekatan",
    "Schools": "Sekolah",
    "NGOs": "NGO",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature
    content = content.replace(
        'ko: string = "") => {',
        'ko: string = "", ms: string = "") => {'
    )
    content = content.replace(
        'ko: string) => {',
        'ko: string, ms: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "ko" && ko) return ko;',
        'if (selectedLang === "ms" && ms) return ms;\n    if (selectedLang === "ko" && ko) return ko;'
    )
    content = content.replace(
        'if (selectedLang === "ko") return ko;',
        'if (selectedLang === "ms") return ms;\n    if (selectedLang === "ko") return ko;'
    )

    # 3. Update t() calls
    def add_ms_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 19-arg call or 6-arg call
        if len(args) == 19 or len(args) == 6:
            first_arg = args[0].strip('"\'')
            ms_val = ms_translations.get(first_arg, "")
            
            if not ms_val:
                clean_key = first_arg.split(" →")[0].strip()
                ms_val = ms_translations.get(clean_key, "")
            
            if ms_val:
                return full_call.replace(args_str, args_str + f', "{ms_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_ms_arg, content, flags=re.DOTALL)

    # Update dynamic loops
    new_content = new_content.replace(
        '(item as any).ko)',
        '(item as any).ko, (item as any).ms)'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'ko: "소개", href: "/about"',
            'ko: "소개", ms: "Mengenai kami", href: "/about"'
        )
        new_content = new_content.replace(
            'ko: "접근 방식", href: "/approach"',
            'ko: "접근 방식", ms: "Pendekatan", href: "/approach"'
        )
        new_content = new_content.replace(
            'ko: "학부모", href: "/parents"',
            'ko: "학부모", ms: "Ibu Bapa", href: "/parents"'
        )
        new_content = new_content.replace(
            'ko: "학교", href: "/schools"',
            'ko: "학교", ms: "Sekolah", href: "/schools"'
        )
        new_content = new_content.replace(
            'ko: "비정부 기구", href: "/ngos"',
            'ko: "비정부 기구", ms: "NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'ko: "과학", href: "/science"',
            'ko: "과학", ms: "Sains", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
