import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Ukrainian
uk_translations = {
    "Le Pont de l’Excellence est ouvert": "Міст досконалості відкрито",
    "Libérez le": "Розкрийте",
    "génie": "геній",
    "de votre enfant.": "вашої дитини.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny будує технологічний міст між батьками, школами та дітьми для всебічної підтримки на шляху до досконалості.",
    "Commencer l’aventure": "Почати пригоду",
    "Notre approche": "Наш підхід",
    "Notre Approche": "Наш підхід",
    "Génies": "Генії",
    "Pays": "Країни",
    "Écoles": "Школи",
    "Langues": "Мови",
    "Cours & Exercices": "Курси та вправи",
    "Portail Mondial": "Світовий портал",
    "Arène Magique": "Магічна арена",
    "Entrer dans l'arène →": "Увійти на арену →",
    "Des solutions pour chacun.": "Рішення для кожного.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Тому що досконалість потребує ідеальної синергії між усіма учасниками.",
    "En savoir plus →": "Дізнатися більше →",
    "Transformation numérique complète.": "Повна цифрова трансформація.",
    "Boost Émotionnel": "Емоційний імпульс",
    "Vocal de maman enregistré": "Голосове повідомлення мами записано",
    "Félicitations Amine !": "Вітаємо, Аміне!",
    "Innovation": "Інновації",
    "Un pilotage d'exception.": "Виняткове управління.",
    "Motivez votre enfant avec votre propre voix.": "Мотивуйте свою дитину власним голосом.",
    "Parcours IA Adaptatif": "Адаптивний шлях ШІ",
    "Chaque clic реajuste le programme.": "Кожен клік коригує програму.",
    "Chaque clic réajuste le programme.": "Кожен клік коригує програму.",
    "Prêt à libérer le génie ?": "Готові розкрити геній?",
    "S'inscrire gratuitement": "Зареєструватися безкоштовно",
    "Connexion": "Увійти",
    "Rejoindre": "Приєднатися",
    "À propos": "Про нас",
    "Approche": "Підхід",
    "Parents": "Батьки",
    "ONG": "НУО",
    "Science": "Наука",
    "Découvrir": "Відкрити",
    "Solutions": "Рішення",
    "Ressources": "Ресурси",
    "Légal": "Юридична інформація",
    "FAQ": "FAQ",
    "Blog": "Блог",
    "Contact": "Контакти",
    "Confidentialité": "Конфіденційність",
    "Conditions": "Умови",
    "Tous droits réservés.": "Всі права захищені.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech, що революціонізує навчання та успішність у школах по всьому світу. Досконалість та вплив.",
    "Soon on": "Незабаром на",
    "Bientôt sur": "Незабаром на",
    "Région": "Регіон",
    "Explorez les Portails": "Досліджуйте портали",
    "Une immersion totale.": "Повне занурення.",
    "Trois univers interconnectés pour une progression sans limites.": "Три взаємопов'язані світи для безмежного розвитку.",
    "Portail Local": "Локальний портал",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "Оволодіння офіційною програмою. Ваші шкільні основи, посилені ШІ.",
    "Découvrir l'univers →": "Відкрийте всесвіт →",
    "Explorer le monde →": "Досліджуйте світ →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "Сінгапурська математика та Оксфордська англійська для безмежних амбіцій.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "Ігрові завдання, динамічно адаптовані для закріплення кожної навички через гру.",
    "L’Écosystème FreeGeny": "Екосистема FreeGeny",
    "Espace Parents": "Простір для батьків",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "Точне управління успіхом. Слідкуйте за прогресом, надсилайте голосові емоційні імпульси та керуйте винагородами.",
    "FreeGeny Écoles": "FreeGeny Школи",
    "Learn more →": "Дізнатися більше →",
    "Saber más →": "Дізнатися більше →",
    "Saiba mais →": "Дізнатися більше →",
    "Mehr erfahren →": "Дізнатися більше →",
    "Meer informatie →": "Дізнатися більше →",
    "Află mai multe →": "Дізнатися більше →",
    "เรียนรู้เพิ่มเติม →": "Дізнатися більше →",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 28 to 29 arguments)
    content = content.replace(
        'th: string = "") => {',
        'th: string = "", uk: string = "") => {'
    )
    content = content.replace(
        'th: string) => {',
        'th: string, uk: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "th") return th;',
        'if (selectedLang === "uk") return uk;\n    if (selectedLang === "th") return th;'
    )

    # 3. Update t() calls
    def add_uk_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 28-arg call
        if len(args) == 28:
            first_arg = args[0].strip('"\'')
            uk_val = uk_translations.get(first_arg, "")
            
            if not uk_val:
                clean_key = first_arg.split(" →")[0].strip()
                uk_val = uk_translations.get(clean_key, "")
            
            if uk_val:
                return full_call.replace(args_str, args_str + f', "{uk_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_uk_arg, content, flags=re.DOTALL)

    # Special handling for loops
    new_content = new_content.replace(
        '(item as any).th || "")',
        '(item as any).th || "", (item as any).uk || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'th: "เกี่ยวกับเรา", href: "/about"',
            'th: "เกี่ยวกับเรา", uk: "Про нас", href: "/about"'
        )
        new_content = new_content.replace(
            'th: "แนวทาง", href: "/approach"',
            'th: "แนวทาง", uk: "Підхід", href: "/approach"'
        )
        new_content = new_content.replace(
            'th: "ผู้ปกครอง", href: "/parents"',
            'th: "ผู้ปกครอง", uk: "Батьки", href: "/parents"'
        )
        new_content = new_content.replace(
            'th: "โรงเรียน", href: "/schools"',
            'th: "โรงเรียน", uk: "Школи", href: "/schools"'
        )
        new_content = new_content.replace(
            'th: "องค์กรเอกชน", href: "/ngos"',
            'th: "องค์กรเอกชน", uk: "НУО", href: "/ngos"'
        )
        new_content = new_content.replace(
            'th: "วิทยาศาสตร์", href: "/science"',
            'th: "วิทยาศาสตร์", uk: "Наука", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
