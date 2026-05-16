import os

def fix_page():
    path = 'src/app/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replacements = [
        ('t("Innovation", "??????",', 't("Innovation", "ابتكار",'),
        ('t("Un pilotage d\'exception.", "????? ?????????.",', 't("Un pilotage d\'exception.", "قيادة استثنائية.",'),
        ('t("Boost motionnel", "???? ?????",', 't("Boost émotionnel", "دفعة عاطفية",'),
        ('t("Motivez votre enfant avec votre propre voix.", "????? ????? ?????? ?????.",', 't("Motivez votre enfant avec votre propre voix.", "حفز طفلك بصوتك الخاص.",'),
        ('t("Parcours IA Adaptatif", "???? ???? ??????? ?????",', 't("Parcours IA Adaptatif", "مسار ذكاء اصطناعي تكيفي",'),
        ('t("Chaque clic rajuste le programme.", "?? ???? ???? ??? ????????.",', 't("Chaque clic réajuste le programme.", "كل نقرة تعيد ضبط البرنامج.",'),
        ('t("Prt  librer le gnie ?", "?? ??? ????? ?????? ?????????",', 't("Prêt à libérer le génie ?", "مستعد لتحرير العبقرية؟",'),
        ('t("S\'inscrire gratuitement", "??? ??????",', 't("S\'inscrire gratuitement", "سجل مجاناً",'),
        ('t("Vocal de maman enregistr", "????? ???? ????",', 't("Vocal de maman enregistré", "صوت الأم مسجل",'),
        ('t("Flicitations Amine !", "??????? ????!",', 't("Félicitations Amine !", "تهانينا أمين!",'),
        ('t("Pilotage prcis de la russite. Suivez les progrs, envoyez des boosts motionnels vocaux et grez les rcompenses.", "????? ????? ??????. ?????? ??????? ?????? ?????? ?????? ????? ?????? ????????.",', 't("Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.", "قيادة دقيقة للنجاح. تتبع التقدم، أرسل دفعات عاطفية صوتية وادر المكافآت.",'),
        ('t("Transformation numrique complte.", "???? ???? ????.",', 't("Transformation numérique complète.", "تحول رقمي كامل.",'),
        ('t("En savoir plus ?", "????? ?????? ?",', 't("En savoir plus ?", "اكتشف المزيد؟",'),
        ('Cahier 1AP Gnr ?', 'كراس 1AP مولد'),
        ('t("Espace Parents", "فضاء الأولياء",', 't("Espace Parents", "فضاء الأولياء",'), # Already half-fixed but ensuring consistency
        ('t("FreeGeny écoles", "مدارس فري جيني",', 't("FreeGeny écoles", "مدارس فري جيني",')
    ]
    
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

fix_page()
print("Fixed remaining Arabic corruptions in page.tsx.")
