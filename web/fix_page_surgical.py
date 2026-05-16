import os
import re

def fix_all_corruptions():
    path = 'src/app/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Mapping of (French String, Correct Arabic String)
    mapping = {
        "Explorez les Portails": "استكشف البوابات",
        "Une immersion totale.": "انغماس كامل.",
        "Trois univers interconnects pour une progression sans limites.": "ثلاثة عوالم مترابطة لتقدم بلا حدود.",
        "Trois univers interconnectés pour une progression sans limites.": "ثلاثة عوالم مترابطة لتقدم بلا حدود.",
        "Portail Local": "البوابة المحلية",
        "Matrise du programme officiel. Vos fondations scolaires renforces par l?IA.": "إتقان البرنامج الرسمي. أسسك الدراسية معززة بالذكاء الاصطناعي.",
        "Maîtrise du programme officiel. Vos fondations scolaires renforcées par l’IA.": "إتقان البرنامج الرسمي. أسسك الدراسية معززة بالذكاء الاصطناعي.",
        "Dcouvrir l'univers ?": "اكتشف العالم؟",
        "Découvrir l'univers ?": "اكتشف العالم؟",
        "Portail Mondial": "البوابة العالمية",
        "Maths de Singapour et Anglais Oxford pour une ambition sans frontires.": "رياضيات سنغافورة وإنجليزي أكسفورد لطموح بلا حدود.",
        "Maths de Singapour et Anglais Oxford pour une ambition sans frontières.": "رياضيات سنغافورة وإنجليزي أكسفورد لطموح بلا حدود.",
        "Explorer le monde ?": "اكتشف العالم؟",
        "Portail FreeGeny Spirit": "بوابة روح فري جيني",
        "L'IA au service du cur. Nous dcodons le potentiel pour offrir  chaque enfant la cl de son propre destin.": "الذكاء الاصطناعي في خدمة القلب. نحن نفك شفرة الإمكانات لنمنح كل طفل مفتاح قدره.",
        "L'IA au service du cœur. Nous décodons le potentiel pour offrir à chaque enfant la clé de son propre destin.": "الذكاء الاصطناعي في خدمة القلب. نحن نفك شفرة الإمكانات لنمنح كل طفل مفتاح قدره.",
        "Ouvrir son esprit ?": "فتح عقله؟",
        "Innovation": "ابتكار",
        "Un pilotage d'exception.": "قيادة استثنائية.",
        "Boost émotionnel": "دفعة عاطفية",
        "Boost motionnel": "دفعة عاطفية",
        "Motivez votre enfant avec votre propre voix.": "حفز طفلك بصوتك الخاص.",
        "Parcours IA Adaptatif": "مسار ذكاء اصطناعي تكيفي",
        "Chaque clic rajuste le programme.": "كل نقرة تعيد ضبط البرنامج.",
        "Chaque clic réajuste le programme.": "كل نقرة تعيد ضبط البرنامج.",
        "Prt  librer le gnie ?": "مستعد لتحرير العبقرية؟",
        "Prêt à libérer le génie ?": "مستعد لتحرير العبقرية؟",
        "S'inscrire gratuitement": "سجل مجاناً",
        "Le Pont de l?Excellence est ouvert": "جسر التميز مفتوح",
        "Le Pont de l'Excellence est ouvert": "جسر التميز مفتوح",
        "Gnies": "عباقرة",
        "Génies": "عباقرة",
        "Pays": "دول",
        "Écoles": "مدارس",
        "Langues": "لغات",
        "Cours & Exercices": "دروس وتمارين",
        "En savoir plus ?": "اكتشف المزيد؟",
        "Espace Parents": "فضاء الأولياء",
        "FreeGeny écoles": "مدارس فري جيني",
        "Transformation numrique complte.": "تحول رقمي كامل.",
        "Transformation numérique complète.": "تحول رقمي كامل.",
        "Vocal de maman enregistr": "صوت الأم مسجل",
        "Vocal de maman enregistré": "صوت الأم مسجل",
        "Flicitations Amine !": "تهانينا أمين!",
        "Félicitations Amine !": "تهانينا أمين!",
        "Pilotage prcis de la russite. Suivez les progrs, envoyez des boosts motionnels vocaux et grez les rcompenses.": "قيادة دقيقة للنجاح. تتبع التقدم، أرسل دفعات عاطفية صوتية وادر المكافآت.",
        "Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.": "قيادة دقيقة للنجاح. تتبع التقدم، أرسل دفعات عاطفية صوتية وادر المكافآت.",
        "Connexion": "تسجيل الدخول",
        "Rejoindre": "انضم إلينا",
    }

    def replace_t_call(match):
        full_call = match.group(0)
        fr_text = match.group(1)
        ar_text = match.group(2)
        
        if fr_text in mapping:
            # Replace the corrupted Arabic text (second argument)
            correct_ar = mapping[fr_text]
            # Replace precisely the second argument
            # We look for the first comma after the first argument
            parts = full_call.split('"', 4) # Split around quotes
            if len(parts) >= 5:
                # parts[0] is 't('
                # parts[1] is fr_text
                # parts[2] is ', "'
                # parts[3] is ar_text
                # parts[4] is '", ...'
                return f'{parts[0]}"{parts[1]}"{parts[2]}{correct_ar}"{parts[4]}'
        
        return full_call

    # Pattern to find t("...", "...")
    pattern = r't\("([^"]+)",\s*"([^"]+)"'
    
    new_content = re.sub(pattern, replace_t_call, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

fix_all_corruptions()
print("Surgically fixed all Arabic corruptions in page.tsx using mapping.")
