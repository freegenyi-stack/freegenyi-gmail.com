import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Romanian
ro_translations = {
    "Le Pont de l’Excellence est ouvert": "Podul Excelenței este deschis",
    "Libérez le": "Eliberați",
    "génie": "geniul",
    "de votre enfant.": "copilului dumneavoastră.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny construiește un pod tehnologic între Părinți, Școli și Copii pentru o îndrumare holistică spre excelență.",
    "Commencer l’aventure": "Începe aventura",
    "Notre approche": "Abordarea noastră",
    "Notre Approche": "Abordarea noastră",
    "Génies": "Genii",
    "Pays": "Țări",
    "Écoles": "Școli",
    "Langues": "Limbi",
    "Cours & Exercices": "Cursuri și Exerciții",
    "Portail Mondial": "Portal Mondial",
    "Arène Magique": "Arena Magică",
    "Entrer dans l'arène →": "Intră în arenă →",
    "Des solutions pour chacun.": "Soluții pentru fiecare.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Deoarece excelența necesită o sinergie perfectă între toți actorii.",
    "En savoir plus →": "Află mai multe →",
    "Transformation numérique complète.": "Transformare digitală completă.",
    "Boost Émotionnel": "Impuls Emoțional",
    "Vocal de maman enregistré": "Mesaj vocal de la mamă înregistrat",
    "Félicitations Amine !": "Felicitări Amine!",
    "Innovation": "Inovație",
    "Un pilotage d'exception.": "Un management de excepție.",
    "Motivează-ți copilul cu propria voce.": "Motivează-ți copilul cu propria voce.",
    "Motivez votre enfant avec votre propre voix.": "Motivează-ți copilul cu propria voce.",
    "Parcours IA Adaptatif": "Traseu IA Adaptiv",
    "Chaque clic réajuste le programme.": "Fiecare clic reajustează programul.",
    "Prêt à libérer le génie ?": "Ești gata să eliberezi geniul?",
    "S'inscrire gratuitement": "Înscrie-te gratuit",
    "Connexion": "Autentificare",
    "Rejoindre": "Alătură-te",
    "À propos": "Despre noi",
    "Approche": "Abordare",
    "Parents": "Părinți",
    "ONG": "ONG",
    "Science": "Știință",
    "Découvrir": "Descoperă",
    "Solutions": "Soluții",
    "Ressources": "Resurse",
    "Légal": "Legal",
    "FAQ": "FAQ",
    "Blog": "Blog",
    "Contact": "Contact",
    "Confidentialité": "Confidențialitate",
    "Conditions": "Termeni",
    "Tous droits réservés.": "Toate drepturile rezervate.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech care revoluționează educația și succesul școlar în întreaga lume. Excelență și impact.",
    "Soon on": "În curând pe",
    "Bientôt sur": "În curând pe",
    "Région": "Regiune",
    "Explorez les Portails": "Explorează Portalele",
    "Une immersion totale.": "O imersiune totală.",
    "Trois univers interconnectés pour une progression sans limites.": "Trei universuri interconectate pentru un progres fără limite.",
    "Portail Local": "Portal Local",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "Stăpânirea programei oficiale. Fundamentele școlare consolidate prin IA.",
    "Découvrir l'univers →": "Descoperă universul →",
    "Explorer le monde →": "Explorează lumea →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "Matematică Singapore și Engleză Oxford pentru o ambiție fără frontiere.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "Provocări ludice adaptate dinamic pentru a fixa fiecare competență prin joc.",
    "L’Écosystème FreeGeny": "Ecosistemul FreeGeny",
    "Espace Parents": "Spațiu Părinți",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "Management precis al succesului. Urmărește progresul, trimite impulsuri emoționale vocale și gestionează recompensele.",
    "FreeGeny Écoles": "FreeGeny Școli",
    "Saber más →": "Află mai multe →",
    "Saiba mais →": "Află mai multe →",
    "Mehr erfahren →": "Află mai multe →",
    "Learn more →": "Află mai multe →",
    "Meer informatie →": "Află mai multe →",
    "Află mai multe →": "Află mai multe →",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 23 to 24 arguments)
    content = content.replace(
        'pl: string = "") => {',
        'pl: string = "", ro: string = "") => {'
    )
    content = content.replace(
        'pl: string) => {',
        'pl: string, ro: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "pl") return pl;',
        'if (selectedLang === "ro") return ro;\n    if (selectedLang === "pl") return pl;'
    )

    # 3. Update t() calls
    def add_ro_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 23-arg call
        if len(args) == 23:
            first_arg = args[0].strip('"\'')
            ro_val = ro_translations.get(first_arg, "")
            
            if not ro_val:
                clean_key = first_arg.split(" →")[0].strip()
                ro_val = ro_translations.get(clean_key, "")
            
            if ro_val:
                return full_call.replace(args_str, args_str + f', "{ro_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_ro_arg, content, flags=re.DOTALL)

    # Special handling for loops
    new_content = new_content.replace(
        '(item as any).pl || "")',
        '(item as any).pl || "", (item as any).ro || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'pl: "O nas", href: "/about"',
            'pl: "O nas", ro: "Despre noi", href: "/about"'
        )
        new_content = new_content.replace(
            'pl: "Podejście", href: "/approach"',
            'pl: "Podejście", ro: "Abordare", href: "/approach"'
        )
        new_content = new_content.replace(
            'pl: "Rodzice", href: "/parents"',
            'pl: "Rodzice", ro: "Părinți", href: "/parents"'
        )
        new_content = new_content.replace(
            'pl: "Szkoły", href: "/schools"',
            'pl: "Szkoły", ro: "Școli", href: "/schools"'
        )
        new_content = new_content.replace(
            'pl: "NGO", href: "/ngos"',
            'pl: "NGO", ro: "ONG", href: "/ngos"'
        )
        new_content = new_content.replace(
            'pl: "Nauka", href: "/science"',
            'pl: "Nauka", ro: "Știință", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
