import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Tamil
ta_translations = {
    "Le Pont de l’Excellence est ouvert": "சிறந்த விளங்கும் பாலம் திறக்கப்பட்டுள்ளது",
    "Libérez le": "வெளிப்படுத்துங்கள்",
    "génie": "திறமை",
    "de votre enfant.": "உங்கள் குழந்தையின்.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "சிறந்த வளர்ச்சியை நோக்கி முழுமையான ஆதரவை வழங்க பெற்றோர், பள்ளிகள் மற்றும் குழந்தைகளுக்கு இடையே தொழில்நுட்பப் பாலத்தை FreeGeny அமைக்கிறது.",
    "Commencer l’aventure": "பயணத்தைத் தொடங்குங்கள்",
    "Notre approche": "எங்கள் அணுகுமுறை",
    "Notre Approche": "எங்கள் அணுகுமுறை",
    "Génies": "மேதைகள்",
    "Pays": "நாடுகள்",
    "Écoles": "பள்ளிகள்",
    "Langues": "மொழிகள்",
    "Cours & Exercices": "பாடங்கள் & பயிற்சிகள்",
    "Portail Mondial": "உலகளாவிய போர்டல்",
    "Arène Magique": "மந்திர அரங்கம்",
    "Entrer dans l'arène →": "அரங்கிற்குள் நுழையுங்கள் →",
    "Des solutions pour chacun.": "அனைவருக்கும் தீர்வுகள்.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "சிறந்த தரம் என்பது அனைத்து தரப்பினரிடையே சரியான ஒத்திசைவை அவசியமாக்குகிறது.",
    "En savoir plus →": "மேலும் அறிய →",
    "Transformation numérique complète.": "முழுமையான டிஜிட்டல் மாற்றம்.",
    "Boost Émotionnel": "உணர்ச்சி ஊக்கம்",
    "Vocal de maman enregistré": "அம்மாவின் குரல் பதிவு செய்யப்பட்டது",
    "Félicitations Amine !": "வாழ்த்துகள் அமீன்!",
    "Innovation": "புதுமை",
    "Un pilotage d'exception.": "சிறந்த நிர்வாகம்.",
    "Motivez votre enfant avec votre propre voice.": "உங்கள் சொந்தக் குரலில் உங்கள் குழந்தையை ஊக்குவிக்கவும்.",
    "Motivez votre enfant avec votre propre voix.": "உங்கள் சொந்தக் குரலில் உங்கள் குழந்தையை ஊக்குவிக்கவும்.",
    "Parcours IA Adaptatif": "தழுவல் IA பாதை",
    "Chaque clic réajuste le programme.": "ஒவ்வொரு கிளிக்கும் பாடத்திட்டத்தை மாற்றியமைக்கிறது.",
    "Prêt à libérer le génie ?": "திறமையை வெளிப்படுத்த தயாரா?",
    "S'inscrire gratuitement": "இலவசமாகப் பதிவு செய்யுங்கள்",
    "Connexion": "உள்நுழைய",
    "Rejoindre": "சேருங்கள்",
    "À propos": "எங்களைப் பற்றி",
    "Approche": "அணுகுமுறை",
    "Parents": "பெற்றோர்",
    "ONG": "தன்னார்வ நிறுவனங்கள்",
    "Science": "அறிவியல்",
    "Découvrir": "கண்டறியுங்கள்",
    "Solutions": "தீர்வுகள்",
    "Ressources": "ஆதாரங்கள்",
    "Légal": "சட்டப்பூர்வ",
    "FAQ": "கேள்விகள்",
    "Blog": "வலைப்பதிவு",
    "Contact": "தொடர்பு",
    "Confidentialité": "தனியுரிமை",
    "Conditions": "விதிமுறைகள்",
    "Tous droits réservés.": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "உலகெங்கிலும் கல்வி மற்றும் பள்ளி வெற்றியில் புரட்சியை ஏற்படுத்தும் எட்டெக். சிறப்பும் தாக்கமும்.",
    "Soon on": "விரைவில்",
    "Bientôt sur": "விரைவில்",
    "Région": "மண்டலம்",
    "Explorez les Portails": "போர்டல்களை ஆராயுங்கள்",
    "Une immersion totale.": "முழுமையான ஈடுபாடு.",
    "Trois univers interconnectés pour une progression sans limites.": "எல்லையற்ற முன்னேற்றத்திற்காக இணைக்கப்பட்ட மூன்று உலகங்கள்.",
    "Portail Local": "உள்ளூர் போர்டல்",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "அதிகாரப்பூர்வ பாடத்திட்டத்தில் தேர்ச்சி. AI மூலம் பலப்படுத்தப்பட்ட கல்வி அடித்தளங்கள்.",
    "Découvrir l'univers →": "பிரபஞ்சத்தைக் கண்டறியுங்கள் →",
    "Explorer le monde →": "உலகத்தை ஆராயுங்கள் →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "எல்லையற்ற லட்சியத்திற்காக சிங்கப்பூர் கணிதம் மற்றும் ஆக்ஸ்போர்டு ஆங்கிலம்.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "விளையாட்டின் மூலம் ஒவ்வொரு திறனையும் வளர்க்க மாறும் வகையில் மாற்றியமைக்கப்பட்ட சவால்கள்.",
    "L’Écosystème FreeGeny": "FreeGeny சுற்றுச்சூழல்",
    "Espace Parents": "பெற்றோர் பகுதி",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "வெற்றியின் துல்லியமான நிர்வாகம். முன்னேற்றத்தைக் கண்காணிக்கவும், குரல் ஊக்கங்களை அனுப்பவும் மற்றும் வெகுமதிகளை நிர்வகிக்கவும்.",
    "FreeGeny Écoles": "FreeGeny பள்ளிகள்",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 26 to 27 arguments)
    content = content.replace(
        'sv: string = "") => {',
        'sv: string = "", ta: string = "") => {'
    )
    content = content.replace(
        'sv: string) => {',
        'sv: string, ta: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "sv") return sv;',
        'if (selectedLang === "ta") return ta;\n    if (selectedLang === "sv") return sv;'
    )

    # 3. Update t() calls
    def add_ta_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 26-arg call
        if len(args) == 26:
            first_arg = args[0].strip('"\'')
            ta_val = ta_translations.get(first_arg, "")
            
            if not ta_val:
                clean_key = first_arg.split(" →")[0].strip()
                ta_val = ta_translations.get(clean_key, "")
            
            if ta_val:
                return full_call.replace(args_str, args_str + f', "{ta_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_ta_arg, content, flags=re.DOTALL)

    # Special handling for Header/Footer loops
    new_content = new_content.replace(
        '(item as any).sv || "")',
        '(item as any).sv || "", (item as any).ta || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'sv: "Om oss", href: "/about"',
            'sv: "Om oss", ta: "எங்களைப் பற்றி", href: "/about"'
        )
        new_content = new_content.replace(
            'sv: "Metod", href: "/approach"',
            'sv: "Metod", ta: "அணுகுமுறை", href: "/approach"'
        )
        new_content = new_content.replace(
            'sv: "Föräldrar", href: "/parents"',
            'sv: "Föräldrar", ta: "பெற்றோர்", href: "/parents"'
        )
        new_content = new_content.replace(
            'sv: "Skolor", href: "/schools"',
            'sv: "Skolor", ta: "பள்ளிகள்", href: "/schools"'
        )
        new_content = new_content.replace(
            'sv: "NGO", href: "/ngos"',
            'sv: "NGO", ta: "தன்னார்வ நிறுவனங்கள்", href: "/ngos"'
        )
        new_content = new_content.replace(
            'sv: "Vetenskap", href: "/science"',
            'sv: "Vetenskap", ta: "அறிவியல்", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
