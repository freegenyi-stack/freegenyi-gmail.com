/**
 * FreeGeny Internationalization (i18n) Engine
 * Handles translation, language persistence, and RTL direction.
 */

const translations = {
    'en': {
        'nav_home': 'Home', 'nav_about': 'About', 'nav_method': 'Method', 'nav_pricing': 'Pricing', 'nav_contact': 'Contact', 'nav_login': 'Login',
        'nav_app': 'The App', 'nav_parents': 'For Parents', 'nav_schools': 'For Schools', 'nav_org': 'Organizations', 'nav_mission': 'Our Mission',
        'hero_title_1': 'Unlocking Every Child’s', 'hero_title_2': 'Genius Within', 'hero_subtitle': 'The most advanced educational platform for children aged 3-12. Mastering Logic, Math, and Code through play.',
        'btn_start_adventure': 'Start the Adventure 🚀', 'btn_learn_more': 'Learn More',
        'slogan_magic': 'It\'s like magic. But with more logic.',
        'desc_app': 'FreeGeny simplifies learning through gamification, adaptive logic puzzles, and emotional intelligence monitoring. Designed for the geniuses of tomorrow, available today on all platforms.',
        'title_insights': 'Insights', 'desc_insights': 'Track your child\'s progress with detailed analytics and weekly reports sent directly to you.',
        'title_safety': 'Safety', 'desc_safety': '100% Ad-free and COPPA compliant environment. Your child\'s data is encrypted and never sold.',
        'title_control': 'Control', 'desc_control': 'Manage screen time effectively. Set daily limits and schedule "focus hours" effortlessly.',
        'desc_schools': 'Classroom management tools, curriculum alignment, and bulk student accounts. Bring FreeGeny to your institution to boost student engagement in STEM subjects.',
        'desc_org': 'Partner with FreeGeny to empower children in your community. We offer custom prices and support for non-profits and educational initiatives globally.',
        'ft_product': 'Product', 'ft_company': 'Company', 'ft_resources': 'Resources', 'ft_legal': 'Legal', 'ft_rights': '© 2026 FreeGeny. All rights reserved.',
        'ft_about': 'About', 'ft_contact': 'Contact Us', 'ft_careers': 'Careers', 'ft_press': 'Press', 'ft_solutions': 'Solutions', 'ft_help': 'Help Center', 'ft_blog': 'Blog', 'ft_safety': 'Safety Center', 'ft_terms': 'Terms & Conditions', 'ft_privacy': 'Privacy Policy', 'ft_cookies': 'Cookies', 'ft_access': 'Accessibility',
        'hiw_title': 'How it works?', 'hiw_step1_title': 'The child plays', 'hiw_step1_desc': 'Logic puzzles, programming challenges, and age-appropriate mini-games. They don\'t just consume content; they solve it.',
        'hiw_step2_title': 'AI adapts', 'hiw_step2_desc': 'Our algorithm adjusts difficulty in real-time based on the child\'s pace and emotions. No frustration, just progress.',
        'hiw_step3_title': 'Parents guide', 'hiw_step3_desc': 'Access clear dashboards, personalized tips, and track the evolution of your child\'s strengths.',
        'btn_start_session': 'Start a child session',
        'preview_title': 'An immersive experience', 'preview_desc': 'Discover an interface designed to capture attention without over-stimulating the child. A peaceful harbor for cognitive growth.',
        'vision_title': 'More than an application', 'vision_q': '"Will my child log off? Are they on screens too much?"',
        'vision_highlight': 'What if learning became a game again, not a pressure?',
        'vision_text': 'We believe every child is born with potential. Our mission is to provide the tools to unlock it.',
        'vision_desc': 'FreeGeny isn\'t just another application. It is the intellectual foundation of a generation that learns how to think, not what to think.',
        'test_title': 'Social Proof', 'test1_text': '"My 7-year-old son regained confidence in math in just 2 weeks. The approach is so different from school."', 'test1_author': 'Sarah Johnson', 'test1_role': 'Mother of two',
        'test2_text': '"Used in class as a remediation tool, FreeGeny allows students to explore programming concepts without fear of error."', 'test2_author': 'Marc Tremblay', 'test2_role': 'Primary teacher',
        'stat_users': 'Happy Learners', 'stat_countries': 'Countries', 'stat_rating': 'Store Rating',
        'stat_kids': 'Happy children', 'stat_psych': 'Psychologists involved', 'stat_puzzles': 'Logic puzzles', 'stat_ads': 'Ad-free',
        'badge_appstore': 'App Store', 'badge_googleplay': 'Google Play', 'badge_macstore': 'Mac Store', 'badge_huawei': 'AppGallery',
        'feat_zero': 'Zero Distraction Design', 'feat_soft': 'Soft Color Palettes', 'feat_focus': 'Focus-First Engineering',
        'lbl_mission': 'MISSION', 'mission_title': 'Unlock the potential', 'mission_desc': 'To unlock the full potential of every child, fostering critical thinking, creativity, and a lifelong love for learning through innovative technology.',
        'lbl_who': 'WHO WE ARE', 'about_title': 'Reimagining Education', 'about_desc': 'FreeGeny was founded by a team of educators, engineers, and child psychologists dedicated to reimagining early childhood education for the 21st century.',
        'role_educators': '👨‍🏫 Educators', 'role_engineers': '💻 Engineers', 'role_psych': '🧠 Psychologists',
        'ready_title': 'Ready to Start?', 'ready_desc': 'Join over 10,000+ tiny geniuses learning with FreeGeny today.',
        'loading': 'Loading...',
        'login_welcome': 'Welcome Back!', 'login_subtitle': 'Unlock your magic world.',
        'signup_title': 'Create Account', 'signup_subtitle': 'Join the FreeGeny family.',
        'login_fname_label': 'First Name', 'login_fname_ph': 'Geny',
        'login_lname_label': 'Last Name', 'login_lname_ph': 'Spark',
        'login_user_label': 'Username or Email', 'login_user_ph': 'genius@freegeny.com', 'login_pass_label': 'Password',
        'login_forgot': 'Forgot password?', 'btn_login_submit': 'Start Learning', 'btn_signup_submit': 'Join Now',
        'login_or': 'Or connect with', 'login_no_acc': 'Don\'t have an account?',
        'login_signup_link': 'Sign up', 'login_has_acc': 'Already a member?', 'login_signin_link': 'Log in',
        'login_legal_text': 'By joining, you agree to our',
        'login_connecting': 'Securely connecting...',
        'reset_title': 'Reset Password', 'reset_subtitle': 'Enter your new password below.',
        'reset_pass_label': 'New Password', 'reset_pass_ph': 'Minimum 6 characters',
        'reset_confirm_label': 'Confirm Password', 'reset_confirm_ph': 'Re-enter password',
        'reset_btn': 'Change Password', 'reset_btn_updating': 'Updating...', 'reset_btn_retry': 'Try Again',
        'reset_success': 'Password updated successfully!', 'reset_back_link': 'Back to Login',
        'err_pass_mismatch': 'Passwords do not match!', 'err_invalid_token': 'Invalid link. Missing token.',
        'db_dashboard': 'Dashboard', 'db_children': 'Children', 'db_analytics': 'Analytics', 'db_settings': 'Settings', 'db_logout': 'Logout',
        'db_welcome': 'Welcome back', 'db_explorers': 'Here is what your explorers are doing today.',
        'db_premium': 'Premium Member', 'db_accuracy': 'Accuracy Score', 'db_session': 'Avg. Daily Session', 'db_consistency': 'Consistency Grade',
        'db_velocity': 'Learning Velocity', 'db_mastery': 'Mastery by Subject', 'db_heatmap': 'Focus Areas (Error Heatmap)',
        'db_recent': 'Recent Activity', 'tag_logic': 'Logic', 'tag_math': 'Math', 'tag_memory': 'Memory',
        'low_errors': 'Low Errors', 'med_errors': 'Med Errors', 'high_errors': 'High Errors',
        'db_teachers': 'Teachers', 'db_classes': 'Classes', 'db_search_ph': 'Search...',
        'tag_admin': 'Admin', 'db_students': 'Students',
        'db_overview': 'Overview', 'db_institutions': 'Institutions', 'db_finance': 'Finance',
        'db_oversight': 'Global Oversight',
    },
    'fr': {
        'nav_home': 'Accueil', 'nav_about': 'À propos', 'nav_method': 'Méthode', 'nav_pricing': 'Tarifs', 'nav_contact': 'Contact', 'nav_login': 'Connexion',
        'nav_app': 'L\'App', 'nav_parents': 'Parents', 'nav_schools': 'Écoles', 'nav_org': 'Organisations', 'nav_mission': 'Mission',
        'hero_title_1': 'Révélez le Génie de', 'hero_title_2': 'Chaque Enfant', 'hero_subtitle': 'La plateforme éducative la plus avancée pour les 3-12 ans. Maîtrisez la Logique, les Maths et le Code par le jeu.',
        'btn_start_adventure': 'Commencer l\'Aventure 🚀', 'btn_learn_more': 'En savoir plus',
        'slogan_magic': 'C\'est comme de la magie. mais avec plus de logique !',
        'desc_app': 'FreeGeny simplifie l\'apprentissage grâce à la gamification, des puzzles logiques adaptatifs et un suivi de l\'intelligence émotionnelle. Conçu pour les génies de demain.',
        'title_insights': 'Analyses', 'desc_insights': 'Suivez les progrès de votre enfant avec des analyses détaillées et des rapports hebdomadaires envoyés directement.',
        'title_safety': 'Sécurité', 'desc_safety': 'Environnement 100% sans publicité et conforme COPPA. Les données de votre enfant sont chiffrées et jamais vendues.',
        'title_control': 'Contrôle', 'desc_control': 'Gérez le temps d\'écran efficacement. Définissez des limites quotidiennes et des "heures de concentration" sans effort.',
        'desc_schools': 'Outils de gestion de classe, alignement avec le programme scolaire et comptes étudiants en masse. Apportez FreeGeny à votre établissement.',
        'desc_org': 'Associez-vous à FreeGeny pour responsabiliser les enfants de votre communauté. Nous offrons des prix personnalisés pour les OBNL.',
        'ft_product': 'Produit', 'ft_company': 'Entreprise', 'ft_resources': 'Ressources', 'ft_legal': 'Légal', 'ft_rights': '© 2026 FreeGeny. Tous droits réservés.',
        'ft_about': 'À propos', 'ft_contact': 'Nous contacter', 'ft_careers': 'Carrières', 'ft_press': 'Presse', 'ft_solutions': 'Solutions', 'ft_help': 'Centre d\'aide', 'ft_blog': 'Blog', 'ft_safety': 'Sécurité', 'ft_terms': 'Conditions générales', 'ft_privacy': 'Confidentialité', 'ft_cookies': 'Cookies', 'ft_access': 'Accessibilité',
        'hiw_title': 'Comment ça marche ?', 'hiw_step1_title': 'L\'enfant joue', 'hiw_step1_desc': 'Des puzzles logiques, des défis de programmation et des mini-jeux adaptés à son âge. Il ne subit pas le contenu, il le résout.',
        'hiw_step2_title': 'L\'IA s\'adapte', 'hiw_step2_desc': 'Notre algorithme ajuste la difficulté en temps réel selon le rythme et les émotions de l\'enfant. Pas de frustration, juste du progrès.',
        'hiw_step3_title': 'Les parents guident', 'hiw_step3_desc': 'Accédez à des tableaux de bord clairs, des conseils personnalisés et suivez l\'évolution des points forts de votre enfant.',
        'btn_start_session': 'Démarrer une session enfant',
        'preview_title': 'Une expérience immersive', 'preview_desc': 'Découvrez une interface pensée pour captiver l\'attention sans sur-stimuler l\'enfant. Un havre de paix pour la croissance cognitive.',
        'vision_title': 'Plus qu\'une application', 'vision_q': '"Mon enfant va-t-il décrocher ? Est-il trop sur les écrans ?"',
        'vision_highlight': 'Et si apprendre redevenait un jeu, pas une pression ?',
        'vision_text': 'Nous croyons que chaque enfant a un potentiel infini. Notre mission est de donner les clés pour l\'ouvrir.',
        'vision_desc': 'FreeGeny n\'est pas une application de plus. C\'est la fondation intellectuelle d\'une génération qui apprend comment penser, pas quoi penser.',
        'test_title': 'Preuves de confiance', 'test1_text': '"Mon fils de 7 ans a repris confiance en maths en seulement 2 semaines. L\'approche est si différente de l\'école."', 'test1_author': 'Sarah Johnson', 'test1_role': 'Maman de deux enfants',
        'test2_text': '"Utilisé en classe comme outil de remédiation, FreeGeny permet aux élèves d\'explorer les concepts de programmation sans peur de l\'erreur."', 'test2_author': 'Marc Tremblay', 'test2_role': 'Enseignant de primaire',
        'stat_users': 'Apprenants Heureux', 'stat_countries': 'Pays', 'stat_rating': 'Note Store',
        'stat_kids': 'Enfants épanouis', 'stat_psych': 'Psychologues impliqués', 'stat_puzzles': 'Puzzles logic', 'stat_ads': 'Sans publicité',
        'badge_appstore': 'App Store', 'badge_googleplay': 'Google Play', 'badge_macstore': 'Mac Store', 'badge_huawei': 'AppGallery',
        'feat_zero': 'Design Zéro Distraction', 'feat_soft': 'Palettes de Couleurs Douces', 'feat_focus': 'Ingénierie de la Concentration',
        'lbl_mission': 'MISSION', 'mission_title': 'Libérer le potentiel', 'mission_desc': 'Libérer le plein potentiel de chaque enfant, en favorisant la pensée critique, la créativité et l\'amour de l\'apprentissage grâce à une technologie innovante.',
        'lbl_who': 'QUI SOMMES-NOUS', 'about_title': 'Réimaginer l\'Éducation', 'about_desc': 'FreeGeny a été fondé par une équipe d\'éducateurs, d\'ingénieurs et de psychologues pour enfants dévoués à réimaginer l\'éducation préscolaire pour le 21e siècle.',
        'role_educators': '👨‍🏫 Éducateurs', 'role_engineers': '💻 Ingénieurs', 'role_psych': '🧠 Psychologues',
        'ready_title': 'Prêt à commencer ?', 'ready_desc': 'Rejoignez plus de 10 000 petits génies apprenant avec FreeGeny dès aujourd\'hui.',
        'loading': 'Chargement...',
        'login_welcome': 'Bon retour !', 'login_subtitle': 'Ouvrez votre monde magique.',
        'signup_title': 'Créer un compte', 'signup_subtitle': 'Rejoignez la famille FreeGeny.',
        'login_fname_label': 'Prénom', 'login_fname_ph': 'Geny',
        'login_lname_label': 'Nom', 'login_lname_ph': 'Spark',
        'login_user_label': 'Utilisateur ou Email', 'login_user_ph': 'genie@freegeny.com', 'login_pass_label': 'Mot de passe',
        'login_forgot': 'Mot de passe oublié ?', 'btn_login_submit': 'Commencer à apprendre', 'btn_signup_submit': 'Rejoindre',
        'login_or': 'Ou connectez-vous avec', 'login_no_acc': 'Pas encore de compte ?',
        'login_signup_link': 'S\'inscrire', 'login_has_acc': 'Déjà membre ?', 'login_signin_link': 'Connexion',
        'login_legal_text': 'En rejoignant, vous acceptez nos',
        'login_connecting': 'Connexion sécurisée...',
        'reset_title': 'Réinitialiser le mot de passe', 'reset_subtitle': 'Entrez votre nouveau mot de passe.',
        'reset_pass_label': 'Nouveau mot de passe', 'reset_pass_ph': 'Minimum 6 caractères',
        'reset_confirm_label': 'Confirmer le mot de passe', 'reset_confirm_ph': 'Ressaisir le mot de passe',
        'reset_btn': 'Changer le mot de passe', 'reset_btn_updating': 'Mise à jour...', 'reset_btn_retry': 'Réessayer',
        'reset_success': 'Mot de passe mis à jour avec succès !', 'reset_back_link': 'Retour à la connexion',
        'err_pass_mismatch': 'Les mots de passe ne correspondent pas !', 'err_invalid_token': 'Lien invalide. Jeton manquant.',
        'db_dashboard': 'Tableau de bord', 'db_children': 'Enfants', 'db_analytics': 'Analyses', 'db_settings': 'Paramètres', 'db_logout': 'Déconnexion',
        'db_welcome': 'Bon retour', 'db_explorers': 'Voici ce que vos explorateurs font aujourd\'hui.',
        'db_premium': 'Membre Premium', 'db_accuracy': 'Taux de précision', 'db_session': 'Session quotidienne moy.', 'db_consistency': 'Niveau d\'assiduité',
        'db_velocity': 'Vitesse d\'apprentissage', 'db_mastery': 'Maîtrise par sujet', 'db_heatmap': 'Zones d\'attention (Erreurs)',
        'db_recent': 'Activité récente', 'tag_logic': 'Logique', 'tag_math': 'Maths', 'tag_memory': 'Mémoire',
        'low_errors': 'Peu d\'erreurs', 'med_errors': 'Erreurs moyennes', 'high_errors': 'Erreurs élevées',
        'db_teachers': 'Enseignants', 'db_classes': 'Classes', 'db_search_ph': 'Rechercher...',
        'tag_admin': 'Admin', 'db_students': 'Étudiants',
        'db_overview': 'Aperçu', 'db_institutions': 'Institutions', 'db_finance': 'Finance',
        'db_oversight': 'Supervision Globale',
    },
    'ar': {
        'nav_home': 'الرئيسية', 'nav_about': 'عن التطبيق', 'nav_method': 'المنهجية', 'nav_pricing': 'الأسعار', 'nav_contact': 'اتصل بنا', 'nav_login': 'دخول',
        'nav_app': 'التطبيق', 'nav_parents': 'للأباء', 'nav_schools': 'للمدارس', 'nav_org': 'المنظمات', 'nav_mission': 'مهمتنا',
        'hero_title_1': 'أطلق العنان لعبقرية', 'hero_title_2': 'طفلك الكامنة', 'hero_subtitle': 'المنصة التعليمية الأكثر تطوراً للأطفال من عمر 3 إلى 12 سنة. إتقان المنطق والرياضيات والبرمجة من خلال اللعب.',
        'btn_start_adventure': 'ابدأ المغامرة 🚀', 'btn_learn_more': 'اعرف المزيد',
        'vision_highlight': 'التعليم ليس ملء دلو، بل إيقاد شعلة.',
        'vision_text': 'نؤمن أن كل طفل يولد بإمكانيات هائلة. مهمتنا هي توفير الأدوات لإطلاق هذه القدرات.',
        'stat_users': 'متعلم سعيد', 'stat_countries': 'دولة', 'stat_rating': 'تقييم المتجر',
        'ft_product': 'المنتج', 'ft_company': 'الشركة', 'ft_resources': 'الموارد', 'ft_legal': 'قانوني', 'ft_rights': '© 2026 FreeGeny. جميع الحقوق محفوظة.',
        'badge_appstore': 'متجر التطبيقات', 'badge_googleplay': 'جوجل بلاي', 'badge_macstore': 'متجر ماك', 'badge_huawei': 'متجر هواوي',
        'feat_zero': 'تصميم خالٍ من المشتتات', 'feat_soft': 'لوحات ألوان ناعمة', 'feat_focus': 'هندسة التركيز أولاً',
        'lbl_mission': 'مهمتنا', 'mission_title': 'أطلق العنان للإمكانيات', 'mission_desc': 'لإطلاق العنان للإمكانات الكاملة لكل طفل.',
        'lbl_who': 'من نحن', 'about_title': 'إعادة تصور التعليم', 'about_desc': 'تأسست من قبل فريق من المعلمين والمهندسين وعلماء النفس.',
        'role_educators': '👨‍🏫 المعلمون', 'role_engineers': '💻 المهندسون', 'role_psych': '🧠 علماء النفس',
        'ready_title': 'جاهز للبدء؟', 'ready_desc': 'انضم إلى أكثر من 10,000 عبقرى صغير اليوم.',
        'preview_title': 'تجربة غامرة', 'preview_desc': 'اكتشف واجهة مصممة لجذب الانتباه دون تحفيز مفرط.',
        'vision_title': 'أكثر من مجرد تطبيق', 'vision_q': '"هل سيقوم طفلي بتسجيل الخروج؟"', 'vision_desc': 'FreeGeny هو الأساس الفكري لجيل يتعلم كيف يفكر.',
        'stat_kids': 'أطفال سعداء', 'stat_psych': 'علماء النفس', 'stat_puzzles': 'ألغاز منطقية', 'stat_ads': 'بدون إعلانات',
        'loading': 'جاري التحميل...',
        'login_welcome': 'مرحباً بعودتك!', 'login_subtitle': 'افتح عالمك السحري.',
        'signup_title': 'إنشاء حساب', 'signup_subtitle': 'انضم إلى عائلة FreeGeny.',
        'login_fname_label': 'الاسم الأول', 'login_fname_ph': 'عبقري',
        'login_lname_label': 'اسم العائلة', 'login_lname_ph': 'متألق',
        'login_user_label': 'المستخدم أو البريد', 'login_user_ph': 'genius@freegeny.com', 'login_pass_label': 'كلمة المرور',
        'login_forgot': 'نسيت كلمة المرور؟', 'btn_login_submit': 'ابدأ التعلم', 'btn_signup_submit': 'انضم الآن',
        'login_or': 'أو تواصل عبر', 'login_no_acc': 'ليس لديك حساب؟',
        'login_signup_link': 'اشترك الآن', 'login_has_acc': 'هل لديك حساب بالفعل؟', 'login_signin_link': 'دخول',
        'login_legal_text': 'بانضمامك، فإنك توافق على',
        'login_connecting': 'اتصال آمن جاري...',
        'reset_title': 'إعادة تعيين كلمة المرور', 'reset_subtitle': 'أدخل كلمة المرور الجديدة أدناه.',
        'reset_pass_label': 'كلمة المرور الجديدة', 'reset_pass_ph': '6 أحرف على الأقل',
        'reset_confirm_label': 'تأكيد كلمة المرور', 'reset_confirm_ph': 'أعد إدخال كلمة المرور',
        'reset_btn': 'تغيير كلمة المرور', 'reset_btn_updating': 'جاري التحديث...', 'reset_btn_retry': 'حاول مرة أخرى',
        'reset_success': 'تم تحديث كلمة المرور بنجاح!', 'reset_back_link': 'العودة إلى تسجيل الدخول',
        'err_pass_mismatch': 'كلمات المرور غير متطابقة!', 'err_invalid_token': 'رابط غير صالح. الرمز مفقود.',
        'db_dashboard': 'لوحة التحكم', 'db_children': 'الأطفال', 'db_analytics': 'التحليلات', 'db_settings': 'الإعدادات', 'db_logout': 'تسجيل الخروج',
        'db_welcome': 'مرحباً بعودتك', 'db_explorers': 'إليك ما يفعله مستكشفوك اليوم.',
        'db_premium': 'عضو مميز', 'db_accuracy': 'درجة الدقة', 'db_session': 'متوسط الجلسة اليومية', 'db_consistency': 'درجة الاستمرارية',
        'db_velocity': 'سرعة التعلم', 'db_mastery': 'الإتقان حسب الموضوع', 'db_heatmap': 'مناطق التركيز (خارطة الأخطاء)',
        'db_recent': 'النشاط الأخير', 'tag_logic': 'منطق', 'tag_math': 'رياضيات', 'tag_memory': 'ذاكرة',
        'low_errors': 'أخطاء قليلة', 'med_errors': 'أخطاء متوسطة', 'high_errors': 'أخطاء كثيرة',
        'db_teachers': 'المعلمون', 'db_classes': 'الصفوف', 'db_search_ph': 'بحث...',
        'tag_admin': 'مسؤول', 'db_students': 'الطلاب',
        'db_overview': 'نظرة عامة', 'db_institutions': 'المؤسسات', 'db_finance': 'المالية',
        'db_oversight': 'الرقابة العالمية',
    },
    'es': {
        'nav_home': 'Inicio', 'nav_about': 'Nosotros', 'nav_method': 'Método', 'nav_pricing': 'Precios', 'nav_contact': 'Contacto', 'nav_login': 'Entrar',
        'hero_title_1': 'Desbloquea el Genio', 'hero_title_2': 'Interior', 'hero_subtitle': 'La plataforma educativa más avanzada para niños. Lógica, Matemáticas y Código.',
        'btn_start_adventure': 'Iniciar Aventura 🚀',
        'vision_highlight': 'La educación es encender un fuego.',
        'loading': 'Cargando...',
    },
    'zh': {
        'nav_home': '首页', 'nav_about': '关于', 'nav_method': '方法', 'nav_pricing': '价格', 'nav_contact': '联系', 'nav_login': '登录',
        'hero_title_1': '激发每个孩子的', 'hero_title_2': '内在天赋', 'hero_subtitle': '专为3-12岁儿童打造。通过游戏掌握逻辑、数学和编程。',
        'btn_start_adventure': '开始冒险 🚀',
        'loading': '加载中...',
    }
};


function setLang(lang) {
    if (!translations[lang]) lang = 'en';
    localStorage.setItem('fg_lang', lang);

    const rtlLangs = ['ar', 'fa', 'he', 'ur', 'dv', 'ps', 'sd', 'ug', 'yi'];
    const isRTL = rtlLangs.includes(lang);

    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';

    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.flexDirection = isRTL ? 'row-reverse' : 'row';

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    updateLanguageUI(lang);
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
}

function updateLanguageUI(lang) {
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('onclick') && opt.getAttribute('onclick').includes(`'${lang}'`)) {
            opt.classList.add('active');
            const display = document.getElementById('currentLangDisplay');
            if (display) {
                const label = opt.innerText.split('(')[0].trim();
                display.innerText = " 🌍 " + label;
            }
        }
    });
}

function getLang() {
    return localStorage.getItem('fg_lang') || 'en';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = getLang();
    setLang(savedLang);
});
