import sys
import re

# File path
file_path = r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx'

# Spanish translations map
es_map = {
    "À propos": "Sobre nosotros",
    "Approche": "Nuestro enfoque",
    "Parents": "Padres",
    "Écoles": "Escuelas",
    "ONG": "ONG",
    "Science": "Ciencia",
    "Connexion": "Iniciar sesión",
    "Rejoindre": "Unirse",
    "Région": "Región"
}

def update_header():
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() signature to match Footer (22 arguments)
    new_signature = 'const t = (fr: string, ar: string, pt: string, es: string, de: string, en: string, nl: string, be: string, ru: string, it: string, zh: string, cs: string, da: string, fi: string, el: string, hu: string, hi: string, ja: string, ko: string, ms: string, no: string, mi: string) => {'
    content = re.sub(r'const t = \(.*?\)\s*=>\s*\{', new_signature, content, flags=re.DOTALL)

    # 2. Update t() logic
    new_logic = """    if (selectedLang === "mi") return mi;
    if (selectedLang === "no") return no;
    if (selectedLang === "ms") return ms;
    if (selectedLang === "ko") return ko;
    if (selectedLang === "ja") return ja;
    if (selectedLang === "hi") return hi;
    if (selectedLang === "ar") return ar;
    if (selectedLang === "pt") return pt;
    if (selectedLang === "es") return es;
    if (selectedLang === "de") return de;
    if (selectedLang === "en") return en;
    if (selectedLang === "nl") return nl;
    if (selectedLang === "be") return be;
    if (selectedLang === "ru") return ru;
    if (selectedLang === "it") return it;
    if (selectedLang === "zh") return zh;
    if (selectedLang === "cs") return cs;
    if (selectedLang === "da") return da;
    if (selectedLang === "fi") return fi;
    if (selectedLang === "el") return el;
    if (selectedLang === "hu") return hu;
    return fr;"""
    
    # Replace the old logic block
    content = re.sub(r'if \(selectedLang === "mi".*?return fr;', new_logic, content, flags=re.DOTALL)

    # 3. Update navLinks to include all translations (empty for unused)
    # We'll inject them as extra keys for now or just rely on the map function
    content = content.replace('mi: "Mō mātou", href: "/about"', 'es: "Sobre nosotros", pt: "", de: "", nl: "", be: "", ru: "", it: "", zh: "", cs: "", da: "", fi: "", el: "", hu: "", mi: "Mō mātou", href: "/about"')
    content = content.replace('mi: "Huarahi", href: "/approach"', 'es: "Nuestro enfoque", pt: "", de: "", nl: "", be: "", ru: "", it: "", zh: "", cs: "", da: "", fi: "", el: "", hu: "", mi: "Huarahi", href: "/approach"')
    content = content.replace('mi: "Mātua", href: "/parents"', 'es: "Padres", pt: "", de: "", nl: "", be: "", ru: "", it: "", zh: "", cs: "", da: "", fi: "", el: "", hu: "", mi: "Mātua", href: "/parents"')
    content = content.replace('mi: "Kura", href: "/schools"', 'es: "Escuelas", pt: "", de: "", nl: "", be: "", ru: "", it: "", zh: "", cs: "", da: "", fi: "", el: "", hu: "", mi: "Kura", href: "/schools"')
    content = content.replace('mi: "NGO", href: "/ngos"', 'es: "ONG", pt: "", de: "", nl: "", be: "", ru: "", it: "", zh: "", cs: "", da: "", fi: "", el: "", hu: "", mi: "NGO", href: "/ngos"')
    content = content.replace('mi: "Pūtaiao", href: "/science"', 'es: "Ciencia", pt: "", de: "", nl: "", be: "", ru: "", it: "", zh: "", cs: "", da: "", fi: "", el: "", hu: "", mi: "Pūtaiao", href: "/science"')

    # 4. Update the map loop t() call to pass all 22 args
    content = content.replace(
        't(item.label, item.ar, (item as any).en, (item as any).hi, (item as any).ja, (item as any).ko, (item as any).ms, (item as any).no, (item as any).mi)',
        't(item.label, item.ar, (item as any).pt || "", (item as any).es || "", (item as any).de || "", (item as any).en || "", (item as any).nl || "", (item as any).be || "", (item as any).ru || "", (item as any).it || "", (item as any).zh || "", (item as any).cs || "", (item as any).da || "", (item as any).fi || "", (item as any).el || "", (item as any).hu || "", (item as any).hi || "", (item as any).ja || "", (item as any).ko || "", (item as any).ms || "", (item as any).no || "", (item as any).mi || "")'
    )

    # 5. Update Connexion and Rejoindre manual calls
    content = content.replace(
        't("Connexion", "تسجيل الدخول", "Login", "لॉगिन", "ログイン", "로그인", "Log masuk", "Logg inn", "Whakauru")',
        't("Connexion", "تسجيل الدخول", "", "Iniciar sesión", "", "Login", "", "", "", "", "", "", "", "", "", "", "لॉगिन", "ログイン", "로그인", "Log masuk", "Logg inn", "Whakauru")'
    )
    content = content.replace(
        't("Rejoindre", "انضم إلينا", "Join", "हमसे जुड़ें", "参加する", "가입하기", "Sertai", "Bli med", "Hūono")',
        't("Rejoindre", "انضم إلينا", "", "Unirse", "", "Join", "", "", "", "", "", "", "", "", "", "", "हमसे जुड़ें", "参加する", "가입하기", "Sertai", "Bli med", "Hūono")'
    )
    
    # 6. Update Region label
    content = content.replace(
        't("Région", "المنطقة", "Region", "क्षेत्र", "地域", "지역", "Wilayah", "Region", "Rohe")',
        't("Région", "المنطقة", "", "Región", "", "Region", "", "", "", "", "", "", "", "", "", "", "क्षेत्र", "地域", "지역", "Wilayah", "Region", "Rohe")'
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Header synchronized with Footer translations.")

update_header()
