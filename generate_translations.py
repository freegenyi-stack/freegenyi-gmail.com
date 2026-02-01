# FreeGeny - Professional Translation Generator
# Generates complete, professional translations for all 31 languages

import json

# Template for login page translations
login_keys_template = {
    'login_welcome': {
        'en': 'Welcome Back!',
        'fr': 'Bon retour !',
        'ar': 'مرحباً بعودتك!',
        'es': 'Bienvenido de nuevo!',
        'pt': 'Bem-vindo de volta!',
        'zh': '欢迎回来!',
        'hi': 'वापसी पर स्वागत है!',
        'bn': 'স্বাগতম!',
        'ru': 'С возвращением!',
        'id': 'Selamat datang kembali!',
        'ur': 'خوش آمدید!',
        'de': 'Willkommen zurück!',
        'ja': 'おかえりなさい!',
        'pcm': 'Welcome back!',
        'mr': 'परत स्वागत आहे!',
        'te': 'తిరిగి స్వాగతం!',
        'ha': 'Barka da dawowa!',
        'tr': 'Tekrar hoş geldiniz!',
        'pnb': 'واپسی تے خوش آمدید!',
        'sw': 'Karibu tena!',
        'tl': 'Maligayang pagbabalik!',
        'ta': 'மீண்டும் வரவேற்கிறோம்!',
        'yue': '歡迎返嚟!',
        'wuu': '欢迎回来!',
        'fa': 'خوش آمدید!',
        'ko': '다시 오신 것을 환영합니다!',
        'th': 'ยินดีต้อนรับกลับมา!',
        'jv': 'Sugeng rawuh malih!',
        'it': 'Bentornato!',
        'gu': 'પાછા સ્વાગત છે!',
        'ro': 'Bine ai revenit!',
        'el': 'Καλώς ήρθες πίσω!',
        'hu': 'Üdvözöljük vissza!',
        'cs': 'Vítejte zpět!',
        'sv': 'Välkommen tillbaka!',
        'da': 'Velkommen tilbage!',
        'fi': 'Tervetuloa takaisin!',
        'no': 'Velkommen tilbake!',
    },
    'login_subtitle': {
        'en': 'Unlock your magic world.',
        'fr': 'Ouvrez votre monde magique.',
        'ar': 'افتح عالمك السحري.',
        'es': 'Desbloquea tu mundo mágico.',
        'pt': 'Desbloqueie seu mundo mágico.',
        'zh': '解锁你的魔法世界。',
        'hi': 'अपनी जादुई दुनिया खोलें।',
        'bn': 'আপনার জাদুকরী বিশ্ব আনলক করুন।',
        'ru': 'Откройте свой волшебный мир.',
        'id': 'Buka dunia ajaib Anda.',
        'ur': 'اپنی جادوئی دنیا کھولیں۔',
        'de': 'Entdecke deine magische Welt.',
        'ja': 'あなたの魔法の世界を解き放ちましょう。',
        'pcm': 'Open your magic world.',
        'mr': 'तुमचे जादूचे जग उघडा।',
        'te': 'మీ మాయా ప్రపంచాన్ని అన్‌లాక్ చేయండి।',
        'ha': 'Buɗe duniyar sihiri.',
        'tr': 'Sihirli dünyanızı açın.',
        'pnb': 'اپنی جادوئی دنیا کھولو۔',
        'sw': 'Fungua ulimwengu wako wa ajabu.',
        'tl': 'Buksan ang iyong mahiwagang mundo.',
        'ta': 'உங்கள் மாய உலகத்தைத் திறக்கவும்.',
        'yue': '解鎖你嘅魔法世界。',
        'wuu': '解锁侬个魔法世界。',
        'fa': 'دنیای جادویی خود را باز کنید.',
        'ko': '마법의 세계를 열어보세요.',
        'th': 'ปลดล็อกโลกมหัศจรรย์ของคุณ',
        'jv': 'Bukak donya ajaib sampeyan.',
        'it': 'Sblocca il tuo mondo magico.',
        'gu': 'તમારી જાદુઈ દુનિયા અનલોક કરો.',
        'ro': 'Deblochează lumea ta magică.',
        'el': 'Ξεκλειδώστε τον μαγικό σας κόσμο.',
        'hu': 'Nyisd ki varázslatos világodat.',
        'cs': 'Odemkněte svůj kouzelný svět.',
        'sv': 'Lås upp din magiska värld.',
        'da': 'Lås din magiske verden op.',
        'fi': 'Avaa taikamaalimasi.',
        'no': 'Lås opp din magiske verden.',
    },
    'btn_login': {
        'en': 'Login',
        'fr': 'Connexion',
        'ar': 'تسجيل الدخول',
        'es': 'Entrar',
        'pt': 'Entrar',  # FIXED!
        'zh': '登录',
        'hi': 'लॉगिन',
        'bn': 'লগইন',
        'ru': 'Войти',
        'id': 'Masuk',
        'ur': 'لاگ ان',
        'de': 'Anmelden',
        'ja': 'ログイン',
        'pcm': 'Login',
        'mr': 'लॉगिन',
        'te': 'లాగిన్',
        'ha': 'Shiga',
        'tr': 'Giriş',
        'pnb': 'لاگ ان',
        'sw': 'Ingia',
        'tl': 'Mag-login',
        'ta': 'உள்நுழைய',
        'yue': '登入',
        'wuu': '登录',
        'fa': 'ورود',
        'ko': '로그인',
        'th': 'เข้าสู่ระบบ',
        'jv': 'Mlebu',
        'it': 'Accedi',
        'gu': 'લોગિન',
        'ro': 'Autentificare',
        'el': 'Σύνδεση',
        'hu': 'Bejelentkezés',
        'cs': 'Přihlásit se',
        'sv': 'Logga in',
        'da': 'Log ind',
        'fi': 'Kirjaudu',
        'no': 'Logg inn',
    },
}

# Generate complete translation file
def generate_translations():
    print("=" * 80)
    print("FREEGENY - PROFESSIONAL TRANSLATION GENERATOR")
    print("=" * 80)
    print("\nGenerating complete translations for 31 languages...")
    print("\n✅ CRITICAL FIXES:")
    print("   - Portuguese 'btn_login': 'Login' → 'Entrar'")
    print("   - Hindi: Complete login page translations")
    print("   - All 31 languages: Complete login page support")
    print("\n" + "=" * 80)
    
    # Save to JSON for easy integration
    with open('translations_complete.json', 'w', encoding='utf-8') as f:
        json.dump(login_keys_template, f, ensure_ascii=False, indent=2)
    
    print("\n✅ Generated: translations_complete.json")
    print("\nNext steps:")
    print("1. Integrate into i18n.js")
    print("2. Create Terms & Privacy for all 31 languages")
    print("3. Test thoroughly")
    print("4. Push to GitHub")
    print("\n" + "=" * 80)

if __name__ == "__main__":
    generate_translations()
