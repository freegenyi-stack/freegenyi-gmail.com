import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translations for new languages
ku_translations = {
    "Le Pont de l’Excellence est ouvert": "Pira Serkeftinê vekirî ye",
    "Libérez le": "Azad bike",
    "génie": "dahênan",
    "de votre enfant.": "zarokê xwe.",
    "À propos": "Derbarê me de",
    "Approche": "Rêbaz",
    "Parents": "Dê û Bav",
    "Écoles": "Dibistan",
    "ONG": "Saziyên Sivîl",
    "Science": "Zanist",
    "Connexion": "Têketin",
    "Rejoindre": "Tevlî bibe",
    "Région": "Herêm",
}

ga_translations = {
    "Le Pont de l’Excellence est ouvert": "Tá Droichead an Fheabhais oscailte",
    "Libérez le": "Scaoil saor",
    "génie": "buanna",
    "de votre enfant.": "do pháiste.",
    "À propos": "Maidir linn",
    "Approche": "Cur chuige",
    "Parents": "Tuismitheoirí",
    "Écoles": "Scoileanna",
    "ONG": "Eagraíochtaí",
    "Science": "Eolaíocht",
    "Connexion": "Logáil isteach",
    "Rejoindre": "Bí linn",
    "Région": "Réigiún",
}

af_translations = {
    "Le Pont de l’Excellence est ouvert": "Die Brug van Uitnemendheid is oop",
    "Libérez le": "Ontketen die",
    "génie": "genie",
    "de votre enfant.": "van u kind.",
    "À propos": "Oor ons",
    "Approche": "Benadering",
    "Parents": "Ouers",
    "Écoles": "Skole",
    "ONG": "NRO's",
    "Science": "Wetenskap",
    "Connexion": "Meld aan",
    "Rejoindre": "Sluit aan",
    "Région": "Streek",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 32 to 35 arguments)
    content = content.replace(
        'xh: string = "") => {',
        'xh: string = "", ku: string = "", ga: string = "", af: string = "") => {'
    )
    content = content.replace(
        'xh: string) => {',
        'xh: string, ku: string, ga: string, af: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "xh") return xh;',
        'if (selectedLang === "af") return af;\n    if (selectedLang === "ga") return ga;\n    if (selectedLang === "ku") return ku;\n    if (selectedLang === "xh") return xh;'
    )

    # 3. Update t() calls
    def add_args(match):
        full_call = match.group(0)
        args_str = match.group(1)
        # Handle complex nested arguments by counting quotes
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        if len(args) == 32:
            first_arg = args[0].strip('"\'')
            ku_val = ku_translations.get(first_arg, "")
            ga_val = ga_translations.get(first_arg, "")
            af_val = af_translations.get(first_arg, "")
            
            if not ku_val:
                clean_key = first_arg.split(" →")[0].strip()
                ku_val = ku_translations.get(clean_key, "")
            if not ga_val:
                clean_key = first_arg.split(" →")[0].strip()
                ga_val = ga_translations.get(clean_key, "")
            if not af_val:
                clean_key = first_arg.split(" →")[0].strip()
                af_val = af_translations.get(clean_key, "")
            
            return full_call.replace(args_str, args_str + f', "{ku_val}", "{ga_val}", "{af_val}"')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_args, content, flags=re.DOTALL)

    # Special handling for loops
    new_content = new_content.replace(
        '(item as any).xh || "")',
        '(item as any).xh || "", (item as any).ku || "", (item as any).ga || "", (item as any).af || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'xh: "Malunga nathi", href: "/about"',
            'xh: "Malunga nathi", ku: "Derbarê me de", ga: "Maidir linn", af: "Oor ons", href: "/about"'
        )
        new_content = new_content.replace(
            'xh: "Indlela yethu", href: "/approach"',
            'xh: "Indlela yethu", ku: "Rêbaz", ga: "Cur chuige", af: "Benadering", href: "/approach"'
        )
        new_content = new_content.replace(
            'xh: "Abazali", href: "/parents"',
            'xh: "Abazali", ku: "Dê û Bav", ga: "Tuismitheoirí", af: "Ouers", href: "/parents"'
        )
        new_content = new_content.replace(
            'xh: "Izikolo", href: "/schools"',
            'xh: "Izikolo", ku: "Dibistan", ga: "Scoileanna", af: "Skole", href: "/schools"'
        )
        new_content = new_content.replace(
            'xh: "Ii-NGO", href: "/ngos"',
            'xh: "Ii-NGO", ku: "Saziyên Sivîl", ga: "Eagraíochtaí", af: "NRO\'s", href: "/ngos"'
        )
        new_content = new_content.replace(
            'xh: "Inzululwazi", href: "/science"',
            'xh: "Inzululwazi", ku: "Zanist", ga: "Eolaíocht", af: "Wetenskap", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
