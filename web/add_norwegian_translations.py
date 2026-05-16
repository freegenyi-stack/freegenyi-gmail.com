import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Norwegian
no_translations = {
    "Le Pont de l’Excellence est ouvert": "Broen til fortreffelighet er åpen",
    "Libérez le": "Slipp løs",
    "génie": "geniet",
    "de votre enfant.": "i barnet ditt.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny bygger en teknologisk bro mellom foreldre, skoler og barn for helhetlig veiledning mot fortreffelighet.",
    "Commencer l’aventure": "Start eventyret",
    "Notre approche": "Vår tilnærming",
    "Notre Approche": "Vår tilnærming",
    "Génies": "Genier",
    "Pays": "Land",
    "Écoles": "Skoler",
    "Langues": "Språk",
    "Cours & Exercices": "Kurs & øvelser",
    "Portail Mondial": "Global portal",
    "Arène Magique": "Magisk arena",
    "Entrer dans l'arène →": "Gå inn i arenaen →",
    "Des solutions pour chacun.": "Løsninger for alle.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Fordi fortreffelighet krever en perfekt synergi mellom alle aktører.",
    "En savoir plus →": "Lær mer →",
    "Transformation numérique complète.": "Fullstendig digital transformasjon.",
    "Boost Émotionnel": "Emosjonelt løft",
    "Vocal de maman enregistré": "Mors stemme lagret",
    "Félicitations Amine !": "Gratulerer Amine!",
    "Innovation": "Innovasjon",
    "Un pilotage d'exception.": "Eksepsjonell styring.",
    "Motivez votre enfant with your own voice.": "Motiver barnet ditt med din egen stemme.",
    "Motivez votre enfant avec votre propre voix.": "Motiver barnet ditt med din egen stemme.",
    "Parcours IA Adaptatif": "Adaptiv AI-vei",
    "Chaque clic réajuste le programme.": "Hvert klikk justerer programmet.",
    "Prêt à libérer le génie ?": "Klar for å slippe løs geniet?",
    "S'inscrire gratuitement": "Registrer deg gratis",
    "Connexion": "Logg inn",
    "Rejoindre": "Bli med",
    "À propos": "Om oss",
    "Approche": "Tilnærming",
    "Parents": "Foreldre",
    "ONG": "NGO",
    "Science": "Vitenskap",
    "Découvrir": "Oppdag",
    "Solutions": "Løsninger",
    "Ressources": "Ressurser",
    "Légal": "Juridisk",
    "FAQ": "FAQ",
    "Blog": "Blogg",
    "Contact": "Kontakt",
    "Confidentialité": "Personvern",
    "Conditions": "Vilkår",
    "Tous droits réservés.": "Alle rettigheter forbeholdt.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech som revolusurerer læring og skolegang over hele verden. Fortreffelighet og påvirkning.",
    "Login": "Logg inn",
    "Join": "Bli med",
    "About": "Om",
    "Approach": "Tilnærming",
    "Schools": "Skoler",
    "NGOs": "NGO",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature
    content = content.replace(
        'ms: string = "") => {',
        'ms: string = "", no: string = "") => {'
    )
    content = content.replace(
        'ms: string) => {',
        'ms: string, no: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "ms" && ms) return ms;',
        'if (selectedLang === "no" && no) return no;\n    if (selectedLang === "ms" && ms) return ms;'
    )
    content = content.replace(
        'if (selectedLang === "ms") return ms;',
        'if (selectedLang === "no") return no;\n    if (selectedLang === "ms") return ms;'
    )

    # 3. Update t() calls
    def add_no_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 20-arg call or 7-arg call
        if len(args) == 20 or len(args) == 7:
            first_arg = args[0].strip('"\'')
            no_val = no_translations.get(first_arg, "")
            
            if not no_val:
                clean_key = first_arg.split(" →")[0].strip()
                no_val = no_translations.get(clean_key, "")
            
            if no_val:
                return full_call.replace(args_str, args_str + f', "{no_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_no_arg, content, flags=re.DOTALL)

    # Update dynamic loops
    new_content = new_content.replace(
        '(item as any).ms)',
        '(item as any).ms, (item as any).no)'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'ms: "Mengenai kami", href: "/about"',
            'ms: "Mengenai kami", no: "Om oss", href: "/about"'
        )
        new_content = new_content.replace(
            'ms: "Pendekatan", href: "/approach"',
            'ms: "Pendekatan", no: "Tilnærming", href: "/approach"'
        )
        new_content = new_content.replace(
            'ms: "Ibu Bapa", href: "/parents"',
            'ms: "Ibu Bapa", no: "Foreldre", href: "/parents"'
        )
        new_content = new_content.replace(
            'ms: "Sekolah", href: "/schools"',
            'ms: "Sekolah", no: "Skoler", href: "/schools"'
        )
        new_content = new_content.replace(
            'ms: "NGO", href: "/ngos"',
            'ms: "NGO", no: "NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'ms: "Sains", href: "/science"',
            'ms: "Sains", no: "Vitenskap", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
