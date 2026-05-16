import sys

file_path = r'c:\Users\Yousr\freegonya\web\src\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We want to replace the section from the "Libérez le" t() call to the start of the buttons.
# This corresponds roughly to lines 105 to 110 in the previous view_file.

new_hero_content = """                {t("Libérez le", "أطلقوا عنان", "Liberte o", "Libere el", "Entfesseln Sie das", "Unleash the", "Ontketen het", "Раскрыйце", "Раскройте", "Libera il", "释放", "Uvolněte", "Frigør", "Vapauta", "Απελευθερώστε το", "Szabadítsa fel a", "मुक्त करें")}{" "}
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  {t("génie", "العبقرية", "génio", "genio", "Genie", "genius", "genie", "генія", "гения", "genio", "天才", "génia", "geniet", "neron", "ταλέντο", "zsenit", "प्रतिभा")}
                </span><br />
                {t("de votre enfant.", "لطفلكم.", "do seu filho.", "de su hijo.", "Ihres Kindes.", "of your child.", "van uw kind.", "вашага дзіцяці.", "вашего ребенка.", "di tuo figlio.", "您的孩子。", "vašeho dítěte.", "dit barn.", "lapsesi.", "του παιδιού σας.", "gyermekének.", "आपके बच्चे की।")}
              </h1>
              
              <p className={cn("text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12 font-light", isRTL && "font-lateef text-3xl leading-snug")}>
                {t("FreeGeny érige un pont technologique entre Parents, Écoles et Enfants pour un accompagnement holistique vers l’excellence.", "فري جيني تبني جسراً تقنياً بين الأولياء والمدارس والأطفال لمرافقة شاملة نحو التميز.", "FreeGeny constrói uma ponte tecnológica entre Pais, Escolas e Crianças para um acompanhamento holístico rumo à excelência.", "FreeGeny construye un puente tecnológico entre Padres, Colegios y Niños para un acompañamiento holístico hacia la excelencia.", "FreeGeny schlägt eine technologische Brücke zwischen Eltern, Schulen und Kindern für eine ganzheitliche Begleitung zur Exzellenz.", "FreeGeny builds a technological bridge between Parents, Schools, and Children for holistic guidance toward excellence.", "FreeGeny bouwt een technologische brug tussen Ouders, Scholen en Kinderen voor holistische begeleiding naar uitmuntendheid.", "FreeGeny будуе тэхналагічны мост паміж бацькамі, школамі і дзецьмі для цэласнага суправаджэння да дасканаласці.", "FreeGeny строит технологический мост между родителями, школами и детьми для целостного сопровождения к совершенству.", "FreeGeny costruisce un ponte tecnologico tra genitori, scuole e bambini per une guida olistica verso l'eccellenza.", "FreeGeny在家长、学校和孩子之间架起了一座技术桥梁，为追求卓越提供全方位指导。", "FreeGeny staví technologický most mezi rodiče, školy a děti pro holistické vedení k výjimečnosti.", "FreeGeny bygger en teknologisk bro mellem forældre, skoler og børn for holistisk vejledning mod ekspertise.", "FreeGeny rakentaa teknolologisen sillan vanhempien, koulujen ja lasten välille kokonaisvaltaista ohjausta varten kohti huippuosaamista.", "Η FreeGeny χτίζει μια τεχνολογική γέφυρα μεταξύ Γονέων, Σχολείων και Παιδιών για ολιστική καθοδήγηση προς την αριστεία.", "A FreeGeny technológiai hidat épít a szülők, az iskolák et a gyermekek között a kiválóság felé vezető holisztikus útmutatás érdekében.", "FreeGeny उत्कृष्ट शिक्षा के लिए माता-पिता, स्कूलों और बच्चों के बीच एक तकनीकी सेतु का निर्माण करता है।")}
              </p>
"""

# Find the indices of lines to replace.
# Start line: where "Libérez le" is (line 105)
# End line: where line 110 ends (before the buttons)

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '{t("Libérez le"' in line:
        start_idx = i
    if '</div>' in line and i > start_idx and start_idx != -1:
        # We need to find the specific </div> that ends the header block, 
        # but it's easier to just find the next <div className={cn("flex flex-col sm:flex-row
        if 'flex flex-col sm:flex-row gap-4' in line:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    # We want to replace from start_idx to end_idx (exclusive of end_idx which is the buttons div)
    # The buttons div starts at line 112 in the previous view_file.
    # So we replace up to line 111.
    
    # Let's refine the range.
    # The </h1> is at the end of the first block.
    # The <p> is the second block.
    
    lines[start_idx:end_idx] = [new_hero_content]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Hero section fixed successfully.")
else:
    print(f"Could not find start or end index. start={start_idx}, end={end_idx}")
