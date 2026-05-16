import sys
import re

# File paths
files = [
    r'c:\Users\Yousr\freegonya\web\src\app\page.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx',
    r'c:\Users\Yousr\freegonya\web\src\components\Footer.tsx'
]

# Translation map for Vietnamese
vi_translations = {
    "Le Pont de l’Excellence est ouvert": "Cây cầu xuất sắc đã mở",
    "Libérez le": "Giải phóng",
    "génie": "thiên tài",
    "de votre enfant.": "của con bạn.",
    "FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.": "FreeGeny xây dựng cây cầu công nghệ giữa Phụ huynh, Nhà trường và Trẻ em để hỗ trợ toàn diện hướng tới sự xuất sắc.",
    "Commencer l’aventure": "Bắt đầu cuộc phiêu lưu",
    "Notre approche": "Cách tiếp cận của chúng tôi",
    "Notre Approche": "Cách tiếp cận của chúng tôi",
    "Génies": "Thiên tài",
    "Pays": "Quốc gia",
    "Écoles": "Trường học",
    "Langues": "Ngôn ngữ",
    "Cours & Exercices": "Khóa học & Bài tập",
    "Portail Mondial": "Cổng thông tin thế giới",
    "Arène Magique": "Đấu trường ma thuật",
    "Entrer dans l'arène →": "Vào đấu trường →",
    "Des solutions pour chacun.": "Giải pháp cho mọi người.",
    "Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.": "Bởi vì sự xuất sắc đòi hỏi sự cộng hưởng hoàn hảo giữa tất cả các bên.",
    "En savoir plus →": "Tìm hiểu thêm →",
    "Transformation numérique complète.": "Chuyển đổi số toàn diện.",
    "Boost Émotionnel": "Thúc đẩy cảm xúc",
    "Vocal de maman enregistré": "Đã ghi âm giọng nói của mẹ",
    "Félicitations Amine !": "Chúc mừng Amine!",
    "Innovation": "Đổi mới",
    "Un pilotage d'exception.": "Quản lý xuất sắc.",
    "Motivez votre enfant avec votre propre voix.": "Khuyến khích con bạn bằng chính giọng nói của bạn.",
    "Parcours IA Adaptatif": "Lộ trình AI thích ứng",
    "Chaque clic réajuste le programme.": "Mỗi lần nhấp sẽ điều chỉnh lại chương trình.",
    "Prêt à libérer le génie ?": "Sẵn sàng giải phóng thiên tài?",
    "S'inscrire gratuitement": "Đăng ký miễn phí",
    "Connexion": "Đăng nhập",
    "Rejoindre": "Tham gia",
    "À propos": "Về chúng tôi",
    "Approche": "Cách tiếp cận",
    "Parents": "Phụ huynh",
    "ONG": "NGO",
    "Science": "Khoa học",
    "Découvrir": "Khám phá",
    "Solutions": "Giải pháp",
    "Ressources": "Tài nguyên",
    "Légal": "Pháp lý",
    "FAQ": "Câu hỏi thường gặp",
    "Blog": "Blog",
    "Contact": "Liên hệ",
    "Confidentialité": "Bảo mật",
    "Conditions": "Điều khoản",
    "Tous droits réservés.": "Đã đăng ký bản quyền.",
    "L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.": "EdTech cách mạng hóa giáo dục và thành công học đường trên toàn thế giới. Xuất sắc và tác động.",
    "Soon on": "Sắp có trên",
    "Bientôt sur": "Sắp có trên",
    "Région": "Khu vực",
    "Explorez les Portails": "Khám phá các Cổng thông tin",
    "Une immersion totale.": "Sự đắm chìm hoàn toàn.",
    "Trois univers interconnectés pour une progression sans limites.": "Ba thế giới liên kết để phát triển không giới hạn.",
    "Portail Local": "Cổng thông tin địa phương",
    "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "Làm chủ chương trình học chính thức. Nền tảng học đường của bạn được củng cố bởi AI.",
    "Découvrir l'univers →": "Khám phá vũ trụ →",
    "Explorer le monde →": "Khám phá thế giới →",
    "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "Toán Singapore và Tiếng Anh Oxford cho khát vọng không biên giới.",
    "Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.": "Thử thách thú vị được điều chỉnh linh hoạt để củng cố mọi kỹ năng thông qua trò chơi.",
    "L’Écosystème FreeGeny": "Hệ sinh thái FreeGeny",
    "Espace Parents": "Khu vực Phụ huynh",
    "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "Quản lý thành công chính xác. Theo dõi tiến trình, gửi thúc đẩy cảm xúc bằng giọng nói và quản lý phần thưởng.",
    "FreeGeny Écoles": "FreeGeny Trường học",
    "Learn more →": "Tìm hiểu thêm →",
    "Saber más →": "Tìm hiểu thêm →",
    "Saiba mais →": "Tìm hiểu thêm →",
    "Mehr erfahren →": "Tìm hiểu thêm →",
    "Meer informatie →": "Tìm hiểu thêm →",
    "Află mai multe →": "Tìm hiểu thêm →",
    "เรียนรู้เพิ่มเติม →": "Tìm hiểu thêm →",
    "Дізнатися більше →": "Tìm hiểu thêm →",
}

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update t() function signature (from 29 to 30 arguments)
    content = content.replace(
        'uk: string = "") => {',
        'uk: string = "", vi: string = "") => {'
    )
    content = content.replace(
        'uk: string) => {',
        'uk: string, vi: string) => {'
    )
    
    # 2. Update t() logic
    content = content.replace(
        'if (selectedLang === "uk") return uk;',
        'if (selectedLang === "vi") return vi;\n    if (selectedLang === "uk") return uk;'
    )

    # 3. Update t() calls
    def add_vi_arg(match):
        full_call = match.group(0)
        args_str = match.group(1)
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', args_str)
        
        # Check if it's a 29-arg call
        if len(args) == 29:
            first_arg = args[0].strip('"\'')
            vi_val = vi_translations.get(first_arg, "")
            
            if not vi_val:
                clean_key = first_arg.split(" →")[0].strip()
                vi_val = vi_translations.get(clean_key, "")
            
            if vi_val:
                return full_call.replace(args_str, args_str + f', "{vi_val}"')
            else:
                return full_call.replace(args_str, args_str + ', ""')
        return full_call

    new_content = re.sub(r't\((.*?)\)', add_vi_arg, content, flags=re.DOTALL)

    # Special handling for loops
    new_content = new_content.replace(
        '(item as any).uk || "")',
        '(item as any).uk || "", (item as any).vi || "")'
    )

    if 'navLinks' in new_content:
        new_content = new_content.replace(
            'uk: "Про нас", href: "/about"',
            'uk: "Про нас", vi: "Về chúng tôi", href: "/about"'
        )
        new_content = new_content.replace(
            'uk: "Підхід", href: "/approach"',
            'uk: "Підхід", vi: "Cách tiếp cận", href: "/approach"'
        )
        new_content = new_content.replace(
            'uk: "Батьки", href: "/parents"',
            'uk: "Батьки", vi: "Phụ huynh", href: "/parents"'
        )
        new_content = new_content.replace(
            'uk: "Школи", href: "/schools"',
            'uk: "Школи", vi: "Trường học", href: "/schools"'
        )
        new_content = new_content.replace(
            'uk: "НУО", href: "/ngos"',
            'uk: "НУО", vi: "NGO", href: "/ngos"'
        )
        new_content = new_content.replace(
            'uk: "Наука", href: "/science"',
            'uk: "Наука", vi: "Khoa học", href: "/science"'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

for f in files:
    update_file(f)
