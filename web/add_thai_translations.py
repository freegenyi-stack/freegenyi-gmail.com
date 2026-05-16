import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Thai
th_translations = {
    "Le Pont de l’Excellence est ouvert": "สะพานแห่งความเป็นเลิศเปิดแล้ว",
    "Libérez le": "ปลดปล่อย",
    "génie": "พรสวรรค์",
    "de votre enfant.": "ในตัวบุตรหลานของคุณ",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny สร้างสะพานเทคโนโลยีระหว่างผู้ปกครอง โรงเรียน และเด็กๆ เพื่อการสนับสนุนที่ครอบคลุมสู่ความเป็นเลิศ",
    "Commencer l’aventure": "เริ่มการเดินทาง",
    "Notre approche": "แนวทางของเรา",
    "Notre Approche": "แนวทางของเรา",
    "Génies": "อัจฉริยะ",
    "Pays": "ประเทศ",
    "Écoles": "โรงเรียน",
    "Langues": "ภาษา",
    "Cours & Exercices": "หลักสูตร & แบบฝึกหัด",
    "Portail Mondial": "พอร์ทัลระดับโลก",
    "Arène Magique": "สนามเวทมนตร์",
    "Entrer dans l'arène →": "เข้าสู่สนาม →",
    "Des solutions pour chacun.": "โซลูชั่นสำหรับทุกคน",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "เพราะความเป็นเลิศต้องการการทำงานร่วมกันที่สมบูรณ์แบบระหว่างผู้ที่เกี่ยวข้องทุกคน",
    "En savoir plus →": "เรียนรู้เพิ่มเติม →",
    "Transformation numérique complète.": "การเปลี่ยนแปลงทางดิจิทัลที่สมบูรณ์",
    "Boost Émotionnel": "แรงกระตุ้นทางอารมณ์",
    "Vocal de maman enregistré": "บันทึกเสียงของคุณแม่แล้ว",
    "Félicitations Amine !": "ยินดีด้วยอามีน!",
    "Innovation": "นวัตกรรม",
    "Un pilotage d'exception.": "การจัดการที่ยอดเยี่ยม",
    "Motivez votre enfant avec votre propre voix.": "สร้างแรงจูงใจให้บุตรหลานของคุณด้วยเสียงของคุณเอง",
    "Parcours IA Adaptatif": "เส้นทาง AI ที่ปรับเปลี่ยนได้",
    "Chaque clic réajuste le programme.": "ทุกการคลิกจะปรับปรุงโปรแกรมใหม่",
    "Prêt à libérer le génie ?": "พร้อมที่จะปลดปล่อยพรสวรรค์หรือยัง?",
    "S'inscrire gratuitement": "ลงทะเบียนฟรี",
    "Connexion": "เข้าสู่ระบบ",
    "Rejoindre": "เข้าร่วม",
    "À propos": "เกี่ยวกับเรา",
    "Approche": "แนวทาง",
    "Parents": "ผู้ปกครอง",
    "ONG": "องค์กรเอกชน",
    "Science": "วิทยาศาสตร์",
    "Découvrir": "ค้นพบ",
    "Solutions": "โซลูชั่น",
    "Ressources": "ทรัพยากร",
    "Légal": "กฎหมาย",
    "FAQ": "คำถามที่พบบ่อย",
    "Blog": "บล็อก",
    "Contact": "ติดต่อ",
    "Confidentialité": "ความเป็นส่วนตัว",
    "Conditions": "ข้อกำหนด",
    "Tous droits réservés.": "สงวนลิขสิทธิ์",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech ที่ปฏิวัติการเรียนรู้และความสำเร็จในโรงเรียนทั่วโลก ความเป็นเลิศและผลกระทบ",
    "Soon on": "เร็วๆ นี้ทาง",
    "Bientôt sur": "เร็วๆ นี้ทาง",
    "Région": "ภูมิภาค",
    "Explorez les Portails": "Utforska portalerna",
    "Une immersion totale.": "Total fördjupning.",
    "Trois univers interconnectés pour une progression sans limites.": "Tre sammankopplade universum för gränslös utveckling.",
    "Portail Local": "Lokal portal",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "Mästring av den officiella läroplanen. Dina skolgrunder förstärkta av AI.",
    "Découvrir l'univers →": "Upptäck universumet →",
    "Explorer le monde →": "Utforska världen →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "Singapore Matte och Oxford Engelska för gränslös ambition.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "Lekfulla utmaningar anpassade dynamiskt för att förankra varje färdighet genom lek.",
    "L’Écosystème FreeGeny": "FreeGeny-ekosystemet",
    "Espace Parents": "Föräldraområde",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "Exakt styrning av framgång. Följ framsteg, skicka röstbaserade emotionella boostar och hantera belöningar.",
    "FreeGeny Écoles": "FreeGeny Skolor",
    "Află mai multe →": "เรียนรู้เพิ่มเติม →",
    "Saber más →": "เรียนรู้เพิ่มเติม →",
    "Saiba mais →": "เรียนรู้เพิ่มเติม →",
    "Mehr erfahren →": "เรียนรู้เพิ่มเติม →",
    "Learn more →": "เรียนรู้เพิ่มเติม →",
    "Meer informatie →": "เรียนรู้เพิ่มเติม →",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 27 to 28 arguments)
    content = content.replace(
        'ta: string = "") => {',
        'ta: string = "", th: string = "") => {'
    )
    content = content.replace(
        'ta: string) => {',
        'ta: string, th: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "ta") return ta;',
        'if (selectedLang === "th") return th;\n    if (selectedLang === "ta") return ta;'
    )

    # 3. Update t() calls
    def add_th_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 27-arg call
        if len(args) == 27:
            first_arg = args[0].strip('"\'')
            th_val = th_translations.get(first_arg, "")
            
            if not th_val:
                clean_key = first_arg.split(" →")[0].strip()
                th_val = th_translations.get(clean_key, "")
            
            if th_val:
                return full_call.replace(args_str, args_str + f', "{th_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_th_arg, content, flags=re.DOTALL)

    # Special handling for loops
    new_content = new_content.replace(
        '(item as any).ta || "")',
        '(item as any).ta || "", (item as any).th || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'ta: "எங்களைப் பற்றி", href: "/about"',
            'ta: "எங்களைப் பற்றி", th: "เกี่ยวกับเรา", href: "/about"'
        )
        new_content = new_content.replace(
            'ta: "அணுகுமுறை", href: "/approach"',
            'ta: "அணுகுமுறை", th: "แนวทาง", href: "/approach"'
        )
        new_content = new_content.replace(
            'ta: "பெற்றோர்", href: "/parents"',
            'ta: "பெற்றோர்", th: "ผู้ปกครอง", href: "/parents"'
        )
        new_content = new_content.replace(
            'ta: "பள்ளிகள்", href: "/schools"',
            'ta: "பள்ளிகள்", th: "โรงเรียน", href: "/schools"'
        )
        new_content = new_content.replace(
            'ta: "தன்னார்வ நிறுவனங்கள்", href: "/ngos"',
            'ta: "தன்னார்வ நிறுவனங்கள்", th: "องค์กรเอกชน", href: "/ngos"'
        )
        new_content = new_content.replace(
            'ta: "அறிவியல்", href: "/science"',
            'ta: "அறிவியல்", th: "วิทยาศาสตร์", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
