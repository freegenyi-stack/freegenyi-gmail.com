import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Korean
ko_translations = {
    "Le Pont de l’Excellence est ouvert": "우수함의 가교가 열렸습니다",
    "Libérez le": "해방시키세요",
    "génie": "천재성",
    "de votre enfant.": "우리 아이의",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny는 학부모, 학교, 아이들 사이에 기술의 가교를 세워 탁월함을 향한 총체적인 안내를 제공합니다.",
    "Commencer l’aventure": "모험 시작하기",
    "Notre approche": "우리의 접근 방식",
    "Notre Approche": "우리의 접근 방식",
    "Génies": "천재들",
    "Pays": "국가",
    "Écoles": "학교",
    "Langues": "언어",
    "Cours & Exercices": "강의 및 연습",
    "Portail Mondial": "글로벌 포털",
    "Arène Magique": "매직 아레나",
    "Entrer dans l'arène →": "아레나 입장 →",
    "Des solutions pour chacun.": "모두를 위한 솔루션",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "탁월함은 모든 관계자 사이의 완벽한 시너지를 필요로 하기 때문입니다.",
    "En savoir plus →": "더 알아보기 →",
    "Transformation numérique complète.": "완전한 디지털 전환",
    "Boost Émotionnel": "정서적 부스트",
    "Vocal de maman enregistré": "엄마의 녹음된 목소리",
    "Félicitations Amine !": "축하해 아민!",
    "Innovation": "혁신",
    "Un pilotage d'exception.": "탁월한 운영",
    "Motivez votre enfant avec votre propre voice.": "자신의 목소리로 아이를 격려하세요.",
    "Motivez votre enfant avec votre propre voix.": "자신의 목소리로 아이를 격려하세요.",
    "Parcours IA Adaptatif": "적응형 AI 경로",
    "Chaque clic réajuste le programme.": "클릭할 때마다 프로그램이 재조정됩니다.",
    "Prêt à libérer le génie ?": "천재성을 해방시킬 준비가 되셨나요?",
    "S'inscrire gratuitement": "무료 가입하기",
    "Connexion": "로그인",
    "Rejoindre": "가입하기",
    "À propos": "소개",
    "Approche": "접근 방식",
    "Parents": "학부모",
    "ONG": "비정부 기구",
    "Science": "과학",
    "Découvrir": "발견하기",
    "Solutions": "솔루션",
    "Ressources": "리소스",
    "Légal": "법적 정보",
    "FAQ": "자주 묻는 질문",
    "Blog": "블로그",
    "Contact": "문의하기",
    "Confidentialité": "개인정보 보호",
    "Conditions": "이용 약관",
    "Tous droits réservés.": "모든 권리 보유.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "전 세계의 교육과 학업 성취에 혁신을 일으키는 에듀테크. 탁월함과 영향력.",
    "Login": "로그인",
    "Join": "가입하기",
    "About": "소개",
    "Approach": "접근 방식",
    "Schools": "학교",
    "NGOs": "비정부 기구",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature
    content = content.replace(
        'ja: string = "") => {',
        'ja: string = "", ko: string = "") => {'
    )
    content = content.replace(
        'ja: string) => {',
        'ja: string, ko: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "ja" && ja) return ja;',
        'if (selectedLang === "ko" && ko) return ko;\n    if (selectedLang === "ja" && ja) return ja;'
    )
    content = content.replace(
        'if (selectedLang === "ja") return ja;',
        'if (selectedLang === "ko") return ko;\n    if (selectedLang === "ja") return ja;'
    )

    # 3. Update t() calls
    def add_ko_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 18-arg call or 5-arg call
        if len(args) == 18 or len(args) == 5:
            first_arg = args[0].strip('"\'')
            ko_val = ko_translations.get(first_arg, "")
            
            if not ko_val:
                clean_key = first_arg.split(" →")[0].strip()
                ko_val = ko_translations.get(clean_key, "")
            
            if ko_val:
                return full_call.replace(args_str, args_str + f', "{ko_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_ko_arg, content, flags=re.DOTALL)

    # Update dynamic loops
    new_content = new_content.replace(
        '(item as any).ja)',
        '(item as any).ja, (item as any).ko)'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'ja: "会社概要", href: "/about"',
            'ja: "会社概要", ko: "소개", href: "/about"'
        )
        new_content = new_content.replace(
            'ja: "アプローチ", href: "/approach"',
            'ja: "アプローチ", ko: "접근 방식", href: "/approach"'
        )
        new_content = new_content.replace(
            'ja: "保護者", href: "/parents"',
            'ja: "保護者", ko: "학부모", href: "/parents"'
        )
        new_content = new_content.replace(
            'ja: "学校", href: "/schools"',
            'ja: "学校", ko: "학교", href: "/schools"'
        )
        new_content = new_content.replace(
            'ja: "非政府組織", href: "/ngos"',
            'ja: "非政府組織", ko: "비정부 기구", href: "/ngos"'
        )
        new_content = new_content.replace(
            'ja: "科学", href: "/science"',
            'ja: "科学", ko: "과학", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
