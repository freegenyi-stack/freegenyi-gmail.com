import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Maori
mi_translations = {
    "Le Pont de l’Excellence est ouvert": "Kua tuwhera te Ara o te Rakitū",
    "Libérez le": "Whakawāteatia te",
    "génie": "pūmanawa",
    "de votre enfant.": "o tō tamaiti.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "Ka hanga a FreeGeny i tētahi piriti hangarau i waenga i ngā Mātua, ngā Kura me ngā Tamariki mō tētahi ārahitanga katoa ki te rawe.",
    "Commencer l’aventure": "Tīmata i te haerenga",
    "Notre approche": "Tā mātou huarahi",
    "Notre Approche": "Tā mātou huarahi",
    "Génies": "Pūmanawa",
    "Pays": "Whenua",
    "Écoles": "Kura",
    "Langues": "Reo",
    "Cours & Exercices": "Ngā Akoranga & Ngā Mahi",
    "Portail Mondial": "Pūtomu Ao",
    "Arène Magique": "Papa Tākaro Makutu",
    "Entrer dans l'arène →": "Tomu ki te papa →",
    "Des solutions pour chacun.": "He rongoā mō te katoa.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Nō te mea e hiahia ana te rawe ki tētahi whakakotahitanga tino pai i waenga i te katoa.",
    "En savoir plus →": "Whai mōhiotanga anō →",
    "Transformation numérique complète.": "Te huringa matihiko katoa.",
    "Boost Émotionnel": "Hāpaitanga Kare-ā-roto",
    "Vocal de maman enregistré": "Reo o māmā kua hopukina",
    "Félicitations Amine !": "Ngā mihi, Amine!",
    "Innovation": "Auahatanga",
    "Un pilotage d'exception.": "He whakahaerenga motuhake.",
    "Motivez votre enfant avec votre propre voix.": "Whakamanawa i tō tamaiti ki tō ake reo.",
    "Parcours IA Adaptatif": "Ara AI Whakarerekē",
    "Chaque clic réajuste le programme.": "Ka whakarerekē te rorohiko i ngā wā katoa.",
    "Prêt à libérer le génie ?": "Kua rite ki te whakawātea i te pūmanawa?",
    "S'inscrire gratuitement": "Waitohu mō te kore utu",
    "Connexion": "Whakauru",
    "Rejoindre": "Hūono",
    "À propos": "Mō mātou",
    "Approche": "Huarahi",
    "Parents": "Mātua",
    "ONG": "NGO",
    "Science": "Pūtaiao",
    "Découvrir": "Tuhura",
    "Solutions": "Rongoā",
    "Ressources": "Rauemi",
    "Légal": "Ture",
    "FAQ": "Pātai",
    "Blog": "Pukapuka",
    "Contact": "Whakapā",
    "Confidentialité": "Tūmataititanga",
    "Conditions": "Tikanga",
    "Tous droits réservés.": "Pūmau te mana.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "He EdTech e huri ana i te ako me te angitu kura puta noa i te ao. Te rawe me te pānga.",
    "Login": "Whakauru",
    "Join": "Hūono",
    "About": "Mō",
    "Approach": "Huarahi",
    "Schools": "Kura",
    "NGOs": "NGO",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature
    content = content.replace(
        'no: string = "") => {',
        'no: string = "", mi: string = "") => {'
    )
    content = content.replace(
        'no: string) => {',
        'no: string, mi: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "no" && no) return no;',
        'if (selectedLang === "mi" && mi) return mi;\n    if (selectedLang === "no" && no) return no;'
    )
    content = content.replace(
        'if (selectedLang === "no") return no;',
        'if (selectedLang === "mi") return mi;\n    if (selectedLang === "no") return no;'
    )

    # 3. Update t() calls
    def add_mi_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 21-arg call or 8-arg call
        if len(args) == 21 or len(args) == 8:
            first_arg = args[0].strip('"\'')
            mi_val = mi_translations.get(first_arg, "")
            
            if not mi_val:
                clean_key = first_arg.split(" →")[0].strip()
                mi_val = mi_translations.get(clean_key, "")
            
            if mi_val:
                return full_call.replace(args_str, args_str + f', "{mi_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_mi_arg, content, flags=re.DOTALL)

    # Update dynamic loops
    new_content = new_content.replace(
        '(item as any).no)',
        '(item as any).no, (item as any).mi)'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'no: "Om oss", href: "/about"',
            'no: "Om oss", mi: "Mō mātou", href: "/about"'
        )
        new_content = new_content.replace(
            'no: "Tilnærming", href: "/approach"',
            'no: "Tilnærming", mi: "Huarahi", href: "/approach"'
        )
        new_content = new_content.replace(
            'no: "Foreldre", href: "/parents"',
            'no: "Foreldre", mi: "Mātua", href: "/parents"'
        )
        new_content = new_content.replace(
            'no: "Skoler", href: "/schools"',
            'no: "Skoler", mi: "Kura", href: "/schools"'
        )
        new_content = new_content.replace(
            'no: "NGO", href: "/ngos"',
            'no: "NGO", mi: "NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'no: "Vitenskap", href: "/science"',
            'no: "Vitenskap", mi: "Pūtaiao", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
