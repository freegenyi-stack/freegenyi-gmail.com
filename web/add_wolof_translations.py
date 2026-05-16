import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Wolof
wo_translations = {
    "Le Pont de l’Excellence est ouvert": "Punt Excellence bi ubi na",
    "Libérez le": "Bebb le",
    "génie": "génie",
    "de votre enfant.": "ci sa doom.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny dëgaral na punt bi digante waajur yi, ekool yi ak doom yi ngir màggal xam-xam.",
    "Commencer l’aventure": "Tambali aventure bi",
    "Notre approche": "Sunu anam",
    "Notre Approche": "Sunu anam",
    "Génies": "Genius yi",
    "Pays": "Réew yi",
    "Écoles": "Ekool yi",
    "Langues": "Lakk yi",
    "Cours & Exercices": "Njàng ak tàggatu",
    "Portail Mondial": "Portal Aduna bi",
    "Arène Magique": "Arène Magique",
    "Entrer dans l'arène →": "Dugg ci arène bi →",
    "Des solutions pour chacun.": "Anam yépp ñu ngi fi.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Ndaxte rafet-rafetal xam-xam danga bëgg ñépp ànd.",
    "En savoir plus →": "Xam lu ëpp →",
    "Transformation numérique complète.": "Soppi anam bi ci numérique.",
    "Boost Émotionnel": "Kàttan ci xol",
    "Vocal de maman enregistré": "Kàddu yaay bi dugga na",
    "Félicitations Amine !": "Rafet na Amine!",
    "Innovation": "Innovassion",
    "Un pilotage d'exception.": "Njiit bu rafet.",
    "Motivez votre enfant avec votre propre voix.": "Kàttanal sa doom ak sa kàddu bopp.",
    "Parcours IA Adaptatif": "Anam IA bu rafet",
    "Chaque clic réajuste le programme.": "Bés bu nekk soppi na njàng mi.",
    "Prêt à libérer le génie ?": "Pare nga ngir bebb génie bi?",
    "S'inscrire gratuitement": "Bindu ci anam bu yomb",
    "Connexion": "Ubbi compte",
    "Rejoindre": "Ànd ak nun",
    "À propos": "Ci sunu mbir",
    "Approche": "Sunu anam",
    "Parents": "Waajur yi",
    "ONG": "ONG yi",
    "Science": "Xam-xam",
    "Découvrir": "Xam",
    "Solutions": "Anam yi",
    "Ressources": "Ligéey yi",
    "Légal": "Yelleef",
    "FAQ": "Laaj yi",
    "Blog": "Blog",
    "Contact": "Jokkoodé",
    "Confidentialité": "Sutura",
    "Conditions": "Sart yi",
    "Tous droits réservés.": "Yelleef yépp ñu ngi ci loxoom.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech biy soppi njàng mi ci aduna bi. Rafet-rafetal ak kàttan.",
    "Soon on": "Léegi ci",
    "Bientôt sur": "Léegi ci",
    "Région": "Réew",
    "Explorez les Portails": "Xool Portal yi",
    "Une immersion totale.": "Dugg ci anam bu ràyy.",
    "Trois univers interconnectés pour une progression sans limites.": "Ñatti aduna yu ànd ngir màggal xam-xam.",
    "Portail Local": "Portal Réew mi",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "Xam njàngu réew mi. Sa tàggatu dëgaral ak IA.",
    "Découvrir l'univers →": "Xam aduna bi →",
    "Explorer le monde →": "Xool aduna bi →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "Matematik Singapour ak Angalé Oxford ngir kàttan gu bare.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "Jéego yu neex ngir dëgaral xam-xam bi ci po.",
    "L’Écosystème FreeGeny": "Anam FreeGeny",
    "Espace Parents": "Espace Waajur yi",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "Njiit bu dëggu ci njàng mi. Xool màggal gi, yónnee kàddu yaay ak faye sa doom.",
    "FreeGeny Écoles": "FreeGeny Ekool yi",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 24 to 25 arguments)
    content = content.replace(
        'ro: string = "") => {',
        'ro: string = "", wo: string = "") => {'
    )
    content = content.replace(
        'ro: string) => {',
        'ro: string, wo: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "ro") return ro;',
        'if (selectedLang === "wo") return wo;\n    if (selectedLang === "ro") return ro;'
    )

    # 3. Update t() calls
    def add_wo_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 24-arg call
        if len(args) == 24:
            first_arg = args[0].strip('"\'')
            wo_val = wo_translations.get(first_arg, "")
            
            if not wo_val:
                clean_key = first_arg.split(" →")[0].strip()
                wo_val = wo_translations.get(clean_key, "")
            
            if wo_val:
                return full_call.replace(args_str, args_str + f', "{wo_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_wo_arg, content, flags=re.DOTALL)

    # Special handling for Header/Footer
    new_content = new_content.replace(
        '(item as any).ro || "")',
        '(item as any).ro || "", (item as any).wo || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'ro: "Despre noi", href: "/about"',
            'ro: "Despre noi", wo: "Ci sunu mbir", href: "/about"'
        )
        new_content = new_content.replace(
            'ro: "Abordare", href: "/approach"',
            'ro: "Abordare", wo: "Sunu anam", href: "/approach"'
        )
        new_content = new_content.replace(
            'ro: "Părinți", href: "/parents"',
            'ro: "Părinți", wo: "Waajur yi", href: "/parents"'
        )
        new_content = new_content.replace(
            'ro: "Școli", href: "/schools"',
            'ro: "Școli", wo: "Ekool yi", href: "/schools"'
        )
        new_content = new_content.replace(
            'ro: "ONG", href: "/ngos"',
            'ro: "ONG", wo: "ONG yi", href: "/ngos"'
        )
        new_content = new_content.replace(
            'ro: "Știință", href: "/science"',
            'ro: "Știință", wo: "Xam-xam", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
