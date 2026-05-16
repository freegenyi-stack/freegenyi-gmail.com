import os

def fix_page():
    path = 'src/app/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replacements = [
        # Line 237
        ('t("Le Pont de l?Excellence est ouvert", "??? ?????? ?????",', 't("Le Pont de l\'Excellence est ouvert", "جسر التميز مفتوح",'),
        
        # Section titles and buttons
        ('t("Espace Parents", "فضاء الأولياء",', 't("Espace Parents", "فضاء الأولياء",'),
        ('t("FreeGeny écoles", "مدارس فري جيني",', 't("FreeGeny écoles", "مدارس فري جيني",'),
        ('t("Boost émotionnel", "دفعة عاطفية",', 't("Boost émotionnel", "دفعة عاطفية",'),
        ('t("Innovation", "ابتكار",', 't("Innovation", "ابتكار",'),
        ('t("Un pilotage d\'exception.", "قيادة استثنائية.",', 't("Un pilotage d\'exception.", "قيادة استثنائية.",'),
        
        # Impact Counter labels (ensuring we don't have corrupted ones)
        ('label={t("Gnies", "?????",', 'label={t("Génies", "عباقرة",'),
        ('label={t("Pays", "???",', 'label={t("Pays", "دول",'),
        
        # Descriptions
        ('t("Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.", "قيادة دقيقة للنجاح. تتبع التقدم، أرسل دفعات عاطفية صوتية وادر المكافآت.",', 't("Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses.", "قيادة دقيقة للنجاح. تتبع التقدم، أرسل دفعات عاطفية صوتية وادر المكافآت.",'),
        ('t("Transformation numérique complète.", "تحول رقمي كامل.",', 't("Transformation numérique complète.", "تحول رقمي كامل.",'),
        ('t("Motivez votre enfant avec votre propre voix.", "حفز طفلك بصوتك الخاص.",', 't("Motivez votre enfant avec votre propre voix.", "حفز طفلك بصوتك الخاص.",'),
        ('t("Parcours IA Adaptatif", "مسار ذكاء اصطناعي تكيفي",', 't("Parcours IA Adaptatif", "مسار ذكاء اصطناعي تكيفي",'),
        ('t("Chaque clic réajuste le programme.", "كل نقرة تعيد ضبط البرنامج.",', 't("Chaque clic réajuste le programme.", "كل نقرة تعيد ضبط البرنامج.",'),
        
        # Endings
        ('t("Prêt à libérer le génie ?", "مستعد لتحرير العبقرية؟",', 't("Prêt à libérer le génie ?", "مستعد لتحرير العبقرية؟",'),
        ('t("S\'inscrire gratuitement", "سجل مجاناً",', 't("S\'inscrire gratuitement", "سجل مجاناً",'),
    ]
    
    new_content = content
    
    # Surgical removal of the duplicates in ImpactCounter
    # We want to remove lines 284-285 (which are now Génies/Pays cleaned but still duplicates)
    # Let's find the first two ImpactCounter calls and remove them if they are duplicates.
    lines = new_content.split('\n')
    new_lines = []
    impact_count = 0
    for line in lines:
        if '<ImpactCounter' in line:
            impact_count += 1
            if impact_count <= 2:
                continue # Skip the first two duplicates
        new_lines.append(line)
    
    final_content = '\n'.join(new_lines)
    
    # Apply replacements on the result
    for old, new in replacements:
        final_content = final_content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(final_content)

fix_page()
print("Fixed Arabic corruptions and removed duplicates in page.tsx.")
