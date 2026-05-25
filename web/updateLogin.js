const fs = require('fs');
const path = 'app/[locale]/auth/login/LoginClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add isMaori definition
content = content.replace(
  'const isArabic = selectedLang === "ar" || locale === "ar" || locale.endsWith("-ar");',
  'const isArabic = selectedLang === "ar" || locale === "ar" || locale.endsWith("-ar");\n  const isMaori = selectedLang === "mi" || locale === "mi" || locale.endsWith("-mi");'
);

// Replace ternaries
content = content.replace(
  /isEnglish\s*\?\s*"Incorrect email or password\."\s*:\s*isArabic\s*\?\s*"[^"]+"\s*:\s*"Email ou mot de passe incorrect\."/g,
  'isMaori ? "Hē te īmēra, te kupuhipa rānei." : isEnglish ? "Incorrect email or password." : isArabic ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : "Email ou mot de passe incorrect."'
);

content = content.replace(
  /isEnglish\s*\?\s*"Welcome back!"\s*:\s*isArabic\s*\?\s*"[^"]+"\s*:\s*"Bon retour !"/g,
  'isMaori ? "Nau mai hoki mai!" : isEnglish ? "Welcome back!" : isArabic ? "أهلاً بك من جديد!" : "Bon retour !"'
);

content = content.replace(
  /isEnglish \? \(\s*<>Awakening <span className="text-orange-500">Minds<\/span><\/>\s*\) : isArabic \? \(\s*<>صحوة <span className="text-orange-500\">العقول<\/span><\/>\s*\) : \(\s*<>L'Éveil des <span className="text-orange-500\">Esprits<\/span><\/>\s*\)/g,
  'isMaori ? (<>Te Whakaara <span className="text-orange-500">Hinengaro</span></>) : isEnglish ? (<>Awakening <span className="text-orange-500">Minds</span></>) : isArabic ? (<>صحوة <span className="text-orange-500">العقول</span></>) : (<>L\\'Éveil des <span className="text-orange-500">Esprits</span></>)'
);

content = content.replace(
  /isEnglish\s*\?\s*"Every step towards excellence shapes an exceptional destiny\."\s*:\s*isArabic\s*\?\s*"[^"]+"\s*:\s*"Chaque pas vers l'excellence dessine un destin d'exception\."/g,
  'isMaori ? "Ko ia kaupae ki te kairangi he hanga i tētahi ahunga whakamua motuhake." : isEnglish ? "Every step towards excellence shapes an exceptional destiny." : isArabic ? "كل خطوة نحو التميز ترسم قدرًا استثنائيًا." : "Chaque pas vers l\\'excellence dessine un destin d\\'exception."'
);

content = content.replace(
  /isEnglish \? "Welcome" : isArabic \? "مرحبًا" : "Bienvenue"/g,
  'isMaori ? "Nau mai" : isEnglish ? "Welcome" : isArabic ? "مرحبًا" : "Bienvenue"'
);

content = content.replace(
  /isEnglish \? "Your Credentials" : isArabic \? "بيانات الاتصال" : "Vos identifiants de Connexion"/g,
  'isMaori ? "Pārongo Takiuru" : isEnglish ? "Your Credentials" : isArabic ? "بيانات الاتصال" : "Vos identifiants de Connexion"'
);

content = content.replace(
  /isEnglish \? "No account\? Start the adventure" : isArabic \? "ليس لديك حساب\؟ ابدأ المغامرة" : "Vous n'avez pas de compte \? Commencez l'aventure"/g,
  'isMaori ? "Kāore he pūkete? Tīmata i te haerenga" : isEnglish ? "No account? Start the adventure" : isArabic ? "ليس لديك حساب؟ ابدأ المغامرة" : "Vous n\\'avez pas de compte ? Commencez l\\'aventure"'
);

content = content.replace(
  /isEnglish \? "E-mail" : isArabic \? "البريد الإلكتروني" : "E-mail"/g,
  'isMaori ? "Īmēra" : isEnglish ? "E-mail" : isArabic ? "البريد الإلكتروني" : "E-mail"'
);

content = content.replace(
  /isEnglish \? "email@example\.com" : isArabic \? "mail@example\.com" : "nom@exemple\.com"/g,
  'isMaori ? "hemi@example.co.nz" : isEnglish ? "email@example.com" : isArabic ? "mail@example.com" : "nom@exemple.com"'
);

content = content.replace(
  /isEnglish \? "Password" : isArabic \? "كلمة المرور" : "Mot de passe"/g,
  'isMaori ? "Kupuhipa" : isEnglish ? "Password" : isArabic ? "كلمة المرور" : "Mot de passe"'
);

content = content.replace(
  /isEnglish \? "Forgot\?" : isArabic \? "نسيت كلمة المرور\؟" : "Oublié \?"/g,
  'isMaori ? "Kua wareware?" : isEnglish ? "Forgot?" : isArabic ? "نسيت كلمة المرور؟" : "Oublié ?"'
);

content = content.replace(
  /isEnglish \? "Google Sign In" : isArabic \? "اتصال بجوجل" : "Connexion Google"/g,
  'isMaori ? "Takiuru Google" : isEnglish ? "Google Sign In" : isArabic ? "اتصال بجوجل" : "Connexion Google"'
);

content = content.replace(
  /isEnglish \? "Connecting\.\.\." : isArabic \? "جاري الاتصال\.\.\." : "Accès\.\.\."/g,
  'isMaori ? "E hono ana..." : isEnglish ? "Connecting..." : isArabic ? "جاري الاتصال..." : "Accès..."'
);

content = content.replace(
  /isEnglish \? "Sign In" : isArabic \? "تسجيل الدخول" : "Se connecter"/g,
  'isMaori ? "Takiuru" : isEnglish ? "Sign In" : isArabic ? "تسجيل الدخول" : "Se connecter"'
);

fs.writeFileSync(path, content);
console.log('LoginClient.tsx updated with isMaori support.');
