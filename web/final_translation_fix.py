import sys
import re

# File paths
header_path = r'c:\Users\Yousr\freegonya\web\src\components\Header.tsx'
page_path = r'c:\Users\Yousr\freegonya\web\src\app\page.tsx'

def fix_header():
    with open(header_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix Connexion call
    content = content.replace(
        '{t("Connexion", "تسجيل الدخول", "Login", "लॉगिन", "ログイン", "로그인", "Log masuk", "Logg inn", "Whakauru")}',
        '{t("Connexion", "تسجيل الدخول", "Iniciar sessão", "Iniciar sesión", "Anmelden", "Login", "Inloggen", "Увайсці", "Войти", "Accedi", "登录", "Přihlásit se", "Log ind", "Kirjaudu sisään", "Σύνδεση", "Bejelentkezés", "लॉगिन", "ログイン", "로그인", "Log masuk", "Logg inn", "Whakauru")}'
    )
    
    with open(header_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Header.tsx calls fixed.")

def fix_page():
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the 22 translations for "En savoir plus →"
    # fr, ar, pt, es, de, en, nl, be, ru, it, zh, cs, da, fi, el, hu, hi, ja, ko, ms, no, mi
    learn_more_22 = 't("En savoir plus →", "اكتشف المزيد ←", "Saiba mais →", "Saber más →", "Mehr erfahren →", "Learn more →", "Meer informatie →", "Даведайцеся больш →", "Узнать больше →", "Scopri di più →", "了解更多 →", "Dozvědět se více →", "Læs mere →", "Lue lisää →", "Μάθετε περισσότερα →", "Tudjon meg többet →", "और जानें →", "詳細はこちら →", "더 알아보기 →", "Ketahui lebih lanjut →", "Lær mer →", "Whai mōhiotanga anō →")'
    
    # Replace the broken hardcoded calls
    content = content.replace(
        't("En savoir plus →", "اكتشف المزيد ←", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "Learn more →", "और जानें →", "詳細はこちら →", "더 알아보기 →", "Ketahui lebih lanjut →", "Lær mer →", "Whai mōhiotanga anō →")',
        learn_more_22
    )
    
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("page.tsx 'Learn more' calls fixed.")

fix_header()
fix_page()
