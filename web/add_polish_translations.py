import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Polish
pl_translations = {
    "Le Pont de l’Excellence est ouvert": "Most Doskonałości jest otwarty",
    "Libérez le": "Uwólnij",
    "génie": "geniusz",
    "de votre enfant.": "swojego dziecka.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny buduje most technologiczny między Rodzicami, Szkołami i Dziećmi dla holistycznego wsparcia w drodze do doskonałości.",
    "Commencer l’aventure": "Rozpocznij przygodę",
    "Notre approche": "Nasze podejście",
    "Notre Approche": "Nasze podejście",
    "Génies": "Geniusze",
    "Pays": "Kraje",
    "Écoles": "Szkoły",
    "Langues": "Języki",
    "Cours & Exercices": "Kursy i Ćwiczenia",
    "Portail Mondial": "Portal Globalny",
    "Arène Magique": "Magiczna Arena",
    "Entrer dans l'arène →": "Wejdź na arenę →",
    "Des solutions pour chacun.": "Rozwiązania dla każdego.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Ponieważ doskonałość wymaga idealnej synergii między wszystkimi uczestnikami.",
    "En savoir plus →": "Dowiedz się więcej →",
    "Transformation numérique complète.": "Kompletna transformacja cyfrowa.",
    "Boost Émotionnel": "Wsparcie Emocjonalne",
    "Vocal de maman enregistré": "Głos mamy nagrany",
    "Félicitations Amine !": "Gratulacje Amine!",
    "Innovation": "Innowacja",
    "Un pilotage d'exception.": "Wyjątkowe sterowanie.",
    "Motivez votre enfant avec votre propre voix.": "Motywuj swoje dziecko własnym głosem.",
    "Parcours IA Adaptatif": "Adaptacyjna Ścieżka AI",
    "Chaque clic réajuste le programme.": "Każde kliknięcie koryguje program.",
    "Prêt à libérer le génie ?": "Gotowy na uwolnienie geniuszu?",
    "S'inscrire gratuitement": "Zarejestruj się za darmo",
    "Connexion": "Zaloguj się",
    "Rejoindre": "Dołącz",
    "À propos": "O nas",
    "Approche": "Podejście",
    "Parents": "Rodzice",
    "ONG": "NGO",
    "Science": "Nauka",
    "Découvrir": "Odkryj",
    "Solutions": "Rozwiązania",
    "Ressources": "Zasoby",
    "Légal": "Informacje prawne",
    "FAQ": "FAQ",
    "Blog": "Blog",
    "Contact": "Kontakt",
    "Confidentialité": "Prywatność",
    "Conditions": "Regulamin",
    "Tous droits réservés.": "Wszelkie prawa zastrzeżone.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech, który rewolucjonizuje naukę i sukcesy szkolne na całym świecie. Doskonałość i wpływ.",
    "Soon on": "Wkrótce w",
    "Bientôt sur": "Wkrótce w",
    "Région": "Region",
    "Explorez les Portails": "Eksploruj Portale",
    "Une immersion totale.": "Całkowite zanurzenie.",
    "Trois univers interconnectés pour une progression sans limites.": "Trzy wzajemnie powiązane światy dla nieograniczonego postępu.",
    "Portail Local": "Portal Lokalny",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "Mistrzostwo w oficjalnym programie. Twoje fundamenty szkolne wzmocnione przez AI.",
    "Découvrir l'univers →": "Odkryj świat →",
    "Explorer le monde →": "Eksploruj świat →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "Matematyka z Singapuru i angielski z Oxfordu dla ambicji bez granic.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "Wyzwania edukacyjne dostosowywane dynamicznie, aby utrwalić każdą umiejętność poprzez zabawę.",
    "L’Écosystème FreeGeny": "Ekosystem FreeGeny",
    "Espace Parents": "Strefa Rodzica",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "Precyzyjne sterowanie sukcesem. Śledź postępy, wysyłaj głosowe wsparcie emocjonalne i zarządzaj nagrodami.",
    "FreeGeny Écoles": "FreeGeny dla Szkół",
    "Saber más →": "Dowiedz się więcej →",
    "Saiba mais →": "Dowiedz się więcej →",
    "Mehr erfahren →": "Dowiedz się więcej →",
    "Learn more →": "Dowiedz się więcej →",
    "Meer informatie →": "Dowiedz się więcej →",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 22 to 23 arguments)
    content = content.replace(
        'mi: string = "") => {',
        'mi: string = "", pl: string = "") => {'
    )
    content = content.replace(
        'mi: string) => {',
        'mi: string, pl: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "mi") return mi;',
        'if (selectedLang === "pl") return pl;\n    if (selectedLang === "mi") return mi;'
    )

    # 3. Update t() calls
    def add_pl_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        # Handle complex arguments (nested calls etc)
        # For simplicity, we look for strings
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 22-arg call
        if len(args) == 22:
            first_arg = args[0].strip('"\'')
            pl_val = pl_translations.get(first_arg, "")
            
            if not pl_val:
                # Try cleaning key
                clean_key = first_arg.split(" →")[0].strip()
                pl_val = pl_translations.get(clean_key, "")
            
            if pl_val:
                return full_call.replace(args_str, args_str + f', "{pl_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_pl_arg, content, flags=re.DOTALL)

    # Special handling for loops in Header/Footer if they exist
    new_content = new_content.replace(
        '(item as any).mi || "")',
        '(item as any).mi || "", (item as any).pl || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'mi: "Mō mātou", href: "/about"',
            'mi: "Mō mātou", pl: "O nas", href: "/about"'
        )
        new_content = new_content.replace(
            'mi: "Huarahi", href: "/approach"',
            'mi: "Huarahi", pl: "Podejście", href: "/approach"'
        )
        new_content = new_content.replace(
            'mi: "Mātua", href: "/parents"',
            'mi: "Mātua", pl: "Rodzice", href: "/parents"'
        )
        new_content = new_content.replace(
            'mi: "Kura", href: "/schools"',
            'mi: "Kura", pl: "Szkoły", href: "/schools"'
        )
        new_content = new_content.replace(
            'mi: "NGO", href: "/ngos"',
            'mi: "NGO", pl: "NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'mi: "Pūtaiao", href: "/science"',
            'mi: "Pūtaiao", pl: "Nauka", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
