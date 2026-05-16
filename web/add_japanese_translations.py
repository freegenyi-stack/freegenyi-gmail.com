import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Japanese
ja_translations = {
    "Le Pont de l’Excellence est ouvert": "卓越への架け橋が開かれました",
    "Libérez le": "解き放つ",
    "génie": "天才",
    "de votre enfant.": "お子様の才能を。",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGenyは、保護者、学校、子供たちの間にテクノロジーの架け橋を築き、卓越性へのホリスティックな導きを提供します。",
    "Commencer l’aventure": "冒険を始める",
    "Notre approche": "私たちの取り組み",
    "Notre Approche": "私たちの取り組み",
    "Génies": "天才",
    "Pays": "国",
    "Écoles": "学校",
    "Langues": "言語",
    "Cours & Exercices": "コースと演習",
    "Portail Mondial": "グローバルポータル",
    "Arène Magique": "マジックアリーナ",
    "Entrer dans l'arène →": "アリーナに入る →",
    "Des solutions pour chacun.": "すべての人にソリューションを。",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "卓越性には、すべての関係者の完璧な相乗効果が必要だからです。",
    "En savoir plus →": "詳細はこちら →",
    "Transformation numérique complète.": "完全なデジタルトランスフォーメーション。",
    "Boost Émotionnel": "エモーショナルブースト",
    "Vocal de maman enregistré": "ママの録音済みボイス",
    "Félicitations Amine !": "おめでとう、アミン！",
    "Innovation": "イノベーション",
    "Un pilotage d'exception.": "卓越した管理。",
    "Motivez votre enfant avec votre propre voix.": "あなた自身の声でお子様を動機付けましょう。",
    "Parcours IA Adaptatif": "アダプティブAIパス",
    "Chaque clic réajuste le programme.": "クリックするたびにプログラムが再調整されます。",
    "Prêt à libérer le génie ?": "天才を解き放つ準備はできていますか？",
    "S'inscrire gratuitement": "無料で登録する",
    "Connexion": "ログイン",
    "Rejoindre": "参加する",
    "À propos": "会社概要",
    "Approche": "アプローチ",
    "Parents": "保護者",
    "ONG": "NGO",
    "Science": "科学",
    "Découvrir": "発見する",
    "Solutions": "ソリューション",
    "Ressources": "リソース",
    "Légal": "法的情報",
    "FAQ": "よくある質問",
    "Blog": "ブログ",
    "Contact": "お問い合わせ",
    "Confidentialité": "プライバシー",
    "Conditions": "利用規約",
    "Tous droits réservés.": "全著作権所有。",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "世界中の目覚めと学校の成功に革命を起こす教育技術。卓越性とインパクト。",
    "Login": "ログイン",
    "Join": "参加する",
    "About": "会社概要",
    "Approach": "アプローチ",
    "Schools": "学校",
    "NGOs": "NGO",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature
    # Case for Header.tsx (simpler)
    content = content.replace(
        'const t = (fr: string, ar: string, en: string = "", hi: string = "") => {',
        'const t = (fr: string, ar: string, en: string = "", hi: string = "", ja: string = "") => {'
    )
    # Case for page.tsx and Footer.tsx (complex)
    content = content.replace(
        'hu: string, hi: string) => {',
        'hu: string, hi: string, ja: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "hi" && hi) return hi;',
        'if (selectedLang === "ja" && ja) return ja;\n    if (selectedLang === "hi" && hi) return hi;'
    )
    content = content.replace(
        'if (selectedLang === "hi") return hi;',
        'if (selectedLang === "ja") return ja;\n    if (selectedLang === "hi") return hi;'
    )

    # 3. Update t() calls
    # We find all t(...) calls and add the 18th argument if they have 17, or 5th if they have 4.
    
    def add_ja_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        # Split args respecting nested parens and quotes
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 17-arg call (page/footer) or 4-arg call (header)
        if len(args) == 17 or len(args) == 4:
            first_arg = args[0].strip('"\'')
            ja_val = ja_translations.get(first_arg, "")
            
            # If we don't have a specific translation, we might want a placeholder or fallback
            if not ja_val:
                # Try to clean up the first_arg a bit for better matching
                clean_key = first_arg.split(" →")[0].strip()
                ja_val = ja_translations.get(clean_key, "")
            
            if ja_val:
                return full_call.replace(args_str, args_str + f', "{ja_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    # Pattern for t("...", "...", ...)
    new_content = re.sub(r't\((.*?)\)', add_ja_arg, content, flags=re.DOTALL)

    # Special case for navLinks in Header.tsx which is an array of objects
    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'hi: "हमारे बारे में", href: "/about"',
            'hi: "हमारे बारे में", ja: "会社概要", href: "/about"'
        )
        new_content = new_content.replace(
            'hi: "हमारा दृष्टिकोण", href: "/approach"',
            'hi: "हमारा दृष्टिकोण", ja: "アプローチ", href: "/approach"'
        )
        new_content = new_content.replace(
            'hi: "माता-पिता", href: "/parents"',
            'hi: "माता-पिता", ja: "保護者", href: "/parents"'
        )
        new_content = new_content.replace(
            'hi: "स्कूल", href: "/schools"',
            'hi: "स्कूल", ja: "学校", href: "/schools"'
        )
        new_content = new_content.replace(
            'hi: "गैर सरकारी संगठन", href: "/ngos"',
            'hi: "गैर सरकारी संगठन", ja: "NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'hi: "विज्ञान", href: "/science"',
            'hi: "विज्ञान", ja: "科学", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
