import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Swedish
sv_translations = {
    "Le Pont de l’Excellence est ouvert": "Spetskompetensens bro är öppen",
    "Libérez le": "Släpp loss",
    "génie": "geniet",
    "de votre enfant.": "hos ditt barn.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny bygger en teknisk bro mellan Föräldrar, Skolor och Barn för ett holistiskt stöd mot spetskompetens.",
    "Commencer l’aventure": "Börja äventyret",
    "Notre approche": "Vårt tillvägagångssätt",
    "Notre Approche": "Vårt tillvägagångssätt",
    "Génies": "Genier",
    "Pays": "Länder",
    "Écoles": "Skolor",
    "Langues": "Språk",
    "Cours & Exercices": "Kurser & Övningar",
    "Portail Mondial": "Global Portal",
    "Arène Magique": "Magisk Arena",
    "Entrer dans l'arène →": "Gå in i arenan →",
    "Des solutions pour chacun.": "Lösningar för alla.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Eftersom spetskompetens kräver perfekt synergi mellan alla aktörer.",
    "En savoir plus →": "Läs mer →",
    "Transformation numérique complète.": "Komplett digital transformation.",
    "Boost Émotionnel": "Emotionell Boost",
    "Vocal de maman enregistré": "Mammans röstmeddelande inspelat",
    "Félicitations Amine !": "Grattis Amine!",
    "Innovation": "Innovation",
    "Un pilotage d'exception.": "Enastående ledning.",
    "Motivez votre enfant avec votre propre voix.": "Motivera ditt barn med din egen röst.",
    "Parcours IA Adaptatif": "Adaptiv AI-väg",
    "Chaque clic réajuste le programme.": "Varje klick justerar programmet.",
    "Prêt à libérer le génie ?": "Redo att släppa loss geniet?",
    "S'inscrire gratuitement": "Registrera dig gratis",
    "Connexion": "Logga in",
    "Rejoindre": "Gå med",
    "À propos": "Om oss",
    "Approche": "Metod",
    "Parents": "Föräldrar",
    "ONG": "NGO",
    "Science": "Vetenskap",
    "Découvrir": "Upptäck",
    "Solutions": "Lösningar",
    "Ressources": "Resurser",
    "Légal": "Juridisk information",
    "FAQ": "FAQ",
    "Blog": "Blogg",
    "Contact": "Kontakt",
    "Confidentialité": "Integritetspolicy",
    "Conditions": "Villkor",
    "Tous droits réservés.": "Alla rättigheter förbehållna.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech som revolutionerar lärande och skolframgång världen över. Spetskompetens och genomslagskraft.",
    "Soon on": "Snart på",
    "Bientôt sur": "Snart på",
    "Région": "Region",
    "Explorez les Portails": "Utforska portalerna",
    "Une immersion totale.": "Total fördjupning.",
    "Trois univers interconnectés pour une progression sans limites.": "Tre sammankopplade universum för gränslös utveckling.",
    "Portail Local": "Lokal portal",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "Mästring av den officiella läroplanen. Dina skolgrunder förstärkta av AI.",
    "Découvrir l'univers →": "Upptäck universumet →",
    "Explorer le monde →": "Utforska världen →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "Singapore Matte och Oxford Engelska för gränslös ambition.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "Lekfulla utmaningar anpassade dynamiskt för att förankra varje färdighet genom lek.",
    "L’Écosystème FreeGeny": "FreeGeny-ekosystemet",
    "Espace Parents": "Föräldraområde",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "Exakt styrning av framgång. Följ framsteg, skicka röstbaserade emotionella boostar och hantera belöningar.",
    "FreeGeny Écoles": "FreeGeny Skolor",
    "Află mai multe →": "Läs mer →",
    "Saber más →": "Läs mer →",
    "Saiba mais →": "Läs mer →",
    "Mehr erfahren →": "Läs mer →",
    "Learn more →": "Läs mer →",
    "Meer informatie →": "Läs mer →",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 25 to 26 arguments)
    content = content.replace(
        'wo: string = "") => {',
        'wo: string = "", sv: string = "") => {'
    )
    content = content.replace(
        'wo: string) => {',
        'wo: string, sv: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "wo") return wo;',
        'if (selectedLang === "sv") return sv;\n    if (selectedLang === "wo") return wo;'
    )

    # 3. Update t() calls
    def add_sv_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 25-arg call
        if len(args) == 25:
            first_arg = args[0].strip('"\'')
            sv_val = sv_translations.get(first_arg, "")
            
            if not sv_val:
                clean_key = first_arg.split(" →")[0].strip()
                sv_val = sv_translations.get(clean_key, "")
            
            if sv_val:
                return full_call.replace(args_str, args_str + f', "{sv_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_sv_arg, content, flags=re.DOTALL)

    # Special handling for loops
    new_content = new_content.replace(
        '(item as any).wo || "")',
        '(item as any).wo || "", (item as any).sv || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'wo: "Ci sunu mbir", href: "/about"',
            'wo: "Ci sunu mbir", sv: "Om oss", href: "/about"'
        )
        new_content = new_content.replace(
            'wo: "Sunu anam", href: "/approach"',
            'wo: "Sunu anam", sv: "Metod", href: "/approach"'
        )
        new_content = new_content.replace(
            'wo: "Waajur yi", href: "/parents"',
            'wo: "Waajur yi", sv: "Föräldrar", href: "/parents"'
        )
        new_content = new_content.replace(
            'wo: "Ekool yi", href: "/schools"',
            'wo: "Ekool yi", sv: "Skolor", href: "/schools"'
        )
        new_content = new_content.replace(
            'wo: "ONG yi", href: "/ngos"',
            'wo: "ONG yi", sv: "NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'wo: "Xam-xam", href: "/science"',
            'wo: "Xam-xam", sv: "Vetenskap", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
