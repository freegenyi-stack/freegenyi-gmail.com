import sys
import re

file_path = r'c:\Users\Yousr\freegonya\web\src\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the start and end of the corrupted h1 block.
# We'll use the start of the h1 and look for the next </p> or similar.
pattern = re.compile(r'<h1 className=\{cn\("text-4xl md:text-6xl lg:text-7xl font-black text-slate-900.*?</p>', re.DOTALL)

new_content = """<h1 className={cn("text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-8 font-title", isRTL && "font-amiri text-5xl md:text-7xl lg:text-8xl tracking-normal")}>
                {t("Libérez le", "أطلقوا عنان", "Liberte o", "Libere el", "Entfesseln Sie das", "Unleash the", "Ontketen het", "Раскрыйце", "Раскройте", "Libera il", "释放", "Uvolněte", "Frigør", "Vapauta", "Απελευθερώστε το", "Szabadítsa fel a", "मुक्त करें")}{" "}
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  {t("génie", "العبقرية", "génio", "genio", "Genie", "genius", "genie", "генія", "гения", "genio", "天才", "génia", "geniet", "neron", "ταλέντο", "zsenit", "प्रतिभा")}
                </span><br />
                {t("de votre enfant.", "لطفلكم.", "do seu filho.", "de su hijo.", "Ihres Kindes.", "of your child.", "van uw kind.", "вашага дзіцяці.", "вашего ребенка.", "di tuo figlio.", "您的孩子。", "vašeho dítěte.", "dit barn.", "lapsesi.", "του παιδιού σας.", "gyermekének.", "आपके बच्चे की।")}
              </h1>
              
              <p className={cn("text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12 font-light", isRTL && "font-lateef text-3xl leading-snug")}>
                {t("FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.", "فري جيني تبني جسراً تقنياً بين الأولياء والمدارس والأطفال لمرافقة شاملة نحو التميز.", "FreeGeny constrói uma ponte tecnológica entre Pais, Escolas e Crianças para um accompagnement holístico rumo à excelência.", "FreeGeny construye un puente tecnológico entre Padres, Colegios y Niños para un accompagnement holístico hacia la excelencia.", "FreeGeny schlägt eine technologische Brücke zwischen Eltern, Schulen und Kindern für eine ganzheitliche Begleitung zur Exzellenz.", "FreeGeny builds a technological bridge between Parents, Schools, and Children for holistic guidance toward excellence.", "FreeGeny bouwt een technologische brug tussen Ouders, Scholen en Kinderen voor holistische begeleiding naar uitmuntendheid.", "FreeGeny будуе тэхналагічны мост паміж бацькамі, школамі і дзецьмі для цэласнага суправаджэння да дасканаласці.", "FreeGeny строит технологический мост между родителями, школамі и детьми для целостного сопровождения к совершенству.", "FreeGeny costruisce un ponte tecnologico tra genitori, scuole e bambini per une guida olistica verso l'eccellenza.", "FreeGeny在家长、学校和孩子之间架起了一座技术桥梁，为追求卓越提供全方位指导。", "FreeGeny staví technologický most mezi rodiče, školy a děti pro holistické vedení k výjimečnosti.", "FreeGeny bygger en teknologisk bro mellem forældre, skoler og børn for holistisk vejledning mod ekspertise.", "FreeGeny rakentaa teknolologisen sillan vanhempien, koulujen ja lasten välille kokonaisvaltaista ohjausta varten kohti huippuosaamista.", "Η FreeGeny χτίζει μια τεχνολογική γέφυρα μεταξύ Γονέων, Σχολείων και Παιδιών για ολιστική καθοδήγηση προς την αριστεία.", "A FreeGeny technológiai hidat épít a σülők, az iskolák et a gyermekek között a kiválóság felé vezető holisztikus útmutatás érdekében.", "FreeGeny उत्कृष्ट शिक्षा के लिए माता-पिता, स्कूलों और बच्चों के बीच एक तकनीकी सेतु का निर्माण करता है।")}
              </p>"""

if pattern.search(content):
    fixed_content = pattern.sub(new_content, content)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    print("Hero section fixed with regex.")
else:
    print("Pattern not found.")
