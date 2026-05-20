"use client";

import { Link } from "@/i18n/routing";
import React from "react";

import { useRegion } from "@/context/RegionContext";
import { 
  Globe, 
  Share2,
  Apple, 
  Play as PlayStore 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Footer() {
  const { selectedLang } = useRegion();
  const isRTL = selectedLang === "ar";

  const t = (fr: string, ar: string, pt: string, es: string, de: string, en: string, nl: string, be: string, ru: string, it: string, zh: string, cs: string, da: string, fi: string, el: string, hu: string, hi: string, ja: string, ko: string, ms: string, no: string, mi: string, pl: string, ro: string, wo: string, sv: string, ta: string, th: string, uk: string, vi: string, zu: string, xh: string, ku: string, ga: string, af: string, id: string) => {
    if (selectedLang === "id") return id;
    if (selectedLang === "af") return af;
    if (selectedLang === "ga") return ga;
    if (selectedLang === "ku") return ku;
    if (selectedLang === "xh") return xh;
    if (selectedLang === "zu") return zu;
    if (selectedLang === "vi") return vi;
    if (selectedLang === "uk") return uk;
    if (selectedLang === "th") return th;
    if (selectedLang === "ta") return ta;
    if (selectedLang === "sv") return sv;
    if (selectedLang === "wo") return wo;
    if (selectedLang === "ro") return ro;
    if (selectedLang === "pl") return pl;
    if (selectedLang === "mi") return mi;
    if (selectedLang === "no") return no;
    if (selectedLang === "ms") return ms;
    if (selectedLang === "ko") return ko;
    if (selectedLang === "ja") return ja;
    if (selectedLang === "hi") return hi;
    if (selectedLang === "ar") return ar;
    if (selectedLang === "pt") return pt;
    if (selectedLang === "es") return es;
    if (selectedLang === "de") return de;
    if (selectedLang === "en") return en;
    if (selectedLang === "nl") return nl;
    if (selectedLang === "be") return be;
    if (selectedLang === "ru") return ru;
    if (selectedLang === "it") return it;
    if (selectedLang === "zh") return zh;
    if (selectedLang === "cs") return cs;
    if (selectedLang === "da") return da;
    if (selectedLang === "fi") return fi;
    if (selectedLang === "el") return el;
    if (selectedLang === "hu") return hu;
    return fr;
  };

  return (
    <footer className="bg-white border-t border-slate-50 pt-32 pb-16 mt-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-[74%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          
          {/* Branding */}
          <div className="lg:col-span-1">
            <div className="relative inline-block mb-8">
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-title leading-none">FreeGeny</span>
              <span className="block text-lg font-bold text-orange-600 font-caveat mt-1">
                free the genius on your child
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light">
              {t("L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.", "تكنولوجيا التعليم التي تحدث ثورة في الاستيقاظ والنجاح المدرسي في جميع أنحاء العالم. التميز والتأثير.", "L'EdTech que revoluciona o despertar e o sucesso escolar em todo o mundo. Excelência e impacto.", "L'EdTech que revoluciona el despertar y el éxito escolar en todo el mundo. Excelencia e impacto.", "L'EdTech, die das Erwachen und den schulischen Erfolg weltweit revolutioniert. Exzellenz und Wirkung.", "The EdTech revolutionizing awakening and school success worldwide. Excellence and impact.", "De EdTech die het ontwaken en schoolsucces wereldwijd revolutioneert. Uitmuntendheid en impact.", "EdTech, якая рэвалюцыянізуе абуджэнне і школьны поспех ва ўсім свеце. Дасканаласць і ўплыў.", "EdTech, революционизирующая пробуждение и школьный успех во всем мире. Совершенство и влияние.", "L'EdTech che rivoluziona il risveglio e il successo scolastico in tutto il mondo. Eccellenza e impatto.", "革新全球觉醒和学业成功的教育科技。卓越与影响力。", "EdTech, která revolučně mění probouzení a školní úspěchy po celém světě. Výjimečnost a dopad.", "EdTech, der revolutionerer opvågnen og skole-succes verden over. Ekspertise og gennemslagskraft.", "EdTech, joka mullistaa heräämisen ja koulumenestyksen maailmanlaajuisesti. Huippuosaaminen ja vaikuttavuus.", "Η EdTech που φέρνει επανάσταση στην αφύπνιση και τη σχολική επιτυχία παγκοσμίως. Αριστεία και αντίκτυπος.", "Az EdTech, amely forradalmasítja az ébredést és az iskolai sikereket világszerte. Kiválóság et hatás.", "एडटेक जो दुनिया भर में शिक्षा और सफलता में क्रांति ला रहा है। उत्कृष्टता और प्रभाव।", "世界中の目覚めと学校の成功に革命を起こす教育技術。卓越性とインパクト。", "전 세계의 교육과 학업 성취에 혁신을 일으키는 에듀테크. 탁월함과 영향력.", "EdTech yang merevolusikan kesedaran dan kejayaan sekolah di seluruh dunia. Kecemerlangan dan impak.", "EdTech som revolusurerer læring og skolegang over hele verden. Fortreffelighet og påvirkning.", "He EdTech e huri ana i te ako me te angitu kura puta noa i te ao. Te rawe me te pānga.", "EdTech, który rewolucjonizuje naukę i sukcesy szkolne na całym świecie. Doskonałość i wpływ.", "EdTech care revoluționează educația și succesul școlar în întreaga lume. Excelență și impact.", "EdTech biy soppi njàng mi ci aduna bi. Rafet-rafetal ak kàttan.", "EdTech som revolutionerar lärande och skolframgång världen över. Spetskompetens och genomslagskraft.", "உலகெங்கிலும் கல்வி மற்றும் பள்ளி வெற்றியில் புரட்சியை ஏற்படுத்தும் எட்டெக். சிறப்பும் தாக்கமும்.", "EdTech ที่ปฏิวัติการเรียนรู้และความสำเร็จในโรงเรียนทั่วโลก ความเป็นเลิศและผลกระทบ", "EdTech, що революціонізує навчання та успішність у школах по всьому світу. Досконалість та вплив.", "EdTech cách mạng hóa giáo dục và thành công học đường trên toàn thế giới. Xuất sắc và tác động.", "I-EdTech eguqula ukufunda nempumelelo yesikole emhlabeni jikelele.", "I-EdTech eguqula ukufunda nempumelelo yesikolo kwihlabathi liphela.", "", "", "", "EdTech yang merevolusi perkembangan dan kesuksesan sekolah di seluruh dunia. Keunggulan dan dampak.")}
            </p>
            <div className="flex space-x-5 rtl:space-x-reverse">
              <a href="#" className="text-slate-300 hover:text-orange-600 transition-all"><Globe size={18} /></a>
              <a href="#" className="text-slate-300 hover:text-orange-600 transition-all"><Share2 size={18} /></a>
            </div>
          </div>

          {/* Liens */}
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 font-title">{t("Découvrir", "اكتشف", "Descobrir", "Descubrir", "Entdecken", "Discover", "Ontdek", "Адкрыць", "Открыть", "Scopri", "发现", "Objevte", "Oplev", "Tutustu", "Ανακαλύψτε", "Fedezze fel", "खोजें", "発見する", "발견하기", "Teroka", "Oppdag", "Tuhura", "Odkryj", "Descoperă", "Xam", "Upptäck", "கண்டறியுங்கள்", "ค้นพบ", "Відкрити", "Khám phá", "Thola", "Fumana", "", "", "", "Temukan")}</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("À propos", "من نحن", "Sobre", "Sobre", "Über uns", "About", "Over ons", "Пра нас", "О нас", "Chi siamo", "关于我们", "O nás", "Om os", "Tietoa meistä", "Σχετικά", "Rólunk", "हमारे बारे में", "会社概要", "소개", "Mengenai kami", "Om oss", "Mō mātou", "O nas", "Despre noi", "Ci sunu mbir", "Om oss", "எங்களைப் பற்றி", "เกี่ยวกับเรา", "Про нас", "Về chúng tôi", "Mayelana nathi", "Malunga nathi", "Derbarê me de", "Maidir linn", "Oor ons", "Tentang Kami")}</Link></li>
              <li><Link href="/approach" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Notre Approche", "منهجنا", "A nossa abordagem", "Nuestro enfoque", "Unser Ansatz", "Our Approach", "Onze aanpak", "Наш падыход", "Наш подход", "Il nostro approccio", "我们的方法", "Náš přístup", "Vores tilgang", "Lähestymistapamme", "Η προσέγγισή μας", "Megközelítésünk", "हमारा दृष्टिकोण", "私たちの取り組み", "우리의 접근 방식", "Pendekatan kami", "Vår tilnærming", "Tā mātou huarahi", "Nasze podejście", "Abordarea noastră", "Sunu anam", "Vårt tillvägagångssätt", "எங்கள் அணுகuமுறை", "แนวทางของเรา", "Наш підхід", "Cách tiếp cận của chúng tôi", "Indlela yethu", "Indlela yethu", "", "", "", "Pendekatan Kami")}</Link></li>
              <li><Link href="/science" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Science", "العلوم", "Ciência", "Ciencia", "Wissenschaft", "Science", "Wetenschap", "Навука", "Наука", "Scienza", "科学", "Věda", "Videnskab", "Tiede", "Επιστήμη", "Tudomány", "विज्ञान", "科学", "과학", "Sains", "Vitenskap", "Pūtaiao", "Nauka", "Știință", "Xam-xam", "Vetenskap", "அறிவியல்", "วิทยาศาสตร์", "Наука", "Khoa học", "Isayensi", "Inzululwazi", "Zanist", "Eolaíocht", "Wetenskap", "Sains")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 font-title">{t("Solutions", "حلول", "Soluções", "Soluciones", "Lösungen", "Solutions", "Oplossingen", "Рашэнні", "Решения", "Soluzioni", "解决方案", "Řešení", "Løsninger", "Ratkaisuja", "Λύσεις", "Megoldások", "समाधान", "ソリューション", "솔루션", "Penyelesaian", "Løsninger", "Rongoā", "Rozwiązania", "Soluții", "Anam yi", "Lösningar", "தீர்வுகள்", "โซลูชั่น", "Рішення", "Giải pháp", "Izixazululo", "Izisombululo", "", "", "", "Solusi")}</h4>
            <ul className="space-y-4">
              <li><Link href="/parents" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Parents", "الأولياء", "Pais", "Padres", "Eltern", "Parents", "Ouders", "Бацькі", "Родители", "Genitori", "家长", "Rodiče", "Forældre", "Vanhemmat", "Γονείς", "Szülők", "माता-पिता", "保護者", "학부모", "Ibu Bapa", "Foreldre", "Mātua", "Rodzice", "Părinți", "Waajur yi", "Föräldrar", "பெற்றோர்", "ผู้ปกครอง", "Батьки", "Phụ huynh", "Abazali", "Abazali", "Dê û Bav", "Tuismitheoirí", "Ouers", "Orang Tua")}</Link></li>
              <li><Link href="/schools" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Écoles", "المدارس", "Escolas", "Escuelas", "Schulen", "Schools", "Scholen", "Школы", "Школы", "Scuole", "学校", "Školy", "Skoler", "Koulut", "Σχολεία", "Iskolák", "स्कूल", "学校", "학교", "Sekolah", "Skoler", "Kura", "Szkoły", "Școli", "Ekool yi", "Skolor", "பள்ளிகள்", "โรงเรียน", "Школи", "Trường học", "Izikole", "Izikolo", "Dibistan", "Scoileanna", "Skole", "Sekolah")}</Link></li>
              <li><Link href="/ngos" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("ONG", "المنظمات", "ONG", "ONG", "NGOs", "NGOs", "NGO's", "НДА", "НКО", "ONG", "非政府组织", "NGO", "NGO'er", "NGO:t", "ΜΚΟ", "NGO-k", "गैर सरकारी संगठन", "非政府組織", "비정부 기구", "NGO", "NGO", "NGO", "NGO", "ONG", "ONG yi", "NGO", "தன்னார்வ நிறுவனங்கள்", "องค์กรเอกชน", "НУО", "NGO", "Ama-NGO", "Ii-NGO", "Saziyên Sivîl", "Eagraíochtaí", "NRO's", "LSM")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 font-title">{t("Ressources", "الموارد", "Recursos", "Recursos", "Ressourcen", "Resources", "Bronnen", "Рэсурсы", "Ресурсы", "Risorse", "资源", "Zdroje", "Ressourcer", "Resurssit", "Πόροι", "Erőforrások", "संसाधन", "リソース", "리소스", "Sumber", "Ressurser", "Rauemi", "Zasoby", "Resurse", "Ligéey yi", "Resurser", "ஆதாரங்கள்", "ทรัพยากร", "Ресурси", "Tài nguyên", "Izinsiza", "Izixhobo", "", "", "", "Sumber Daya")}</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("FAQ", "الأسئلة الشائعة", "FAQ", "FAQ", "FAQ", "FAQ", "FAQ", "Чапы", "FAQ", "FAQ", "常见问题", "FAQ", "FAQ", "UKK", "Συχνές Ερωτήσεις", "GYIK", "सामान्य प्रश्न", "よくある質問", "자주 묻는 질문", "FAQ", "FAQ", "Pātai", "FAQ", "FAQ", "Laaj yi", "FAQ", "கேள்விகள்", "คำถามที่พบบ่อย", "FAQ", "Câu hỏi thường gặp", "Imibuzo Evame Ukubuzwa", "Imibuzo exhaphakileyo", "", "", "", "FAQ")}</Link></li>
              <li><Link href="/blog" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Blog", "المدونة", "Blog", "Blog", "Blog", "Blog", "Blog", "Блог", "Блог", "Blog", "博客", "Blog", "Blog", "Blogi", "Ιστολόγιο", "Blog", "ब्लॉग", "ブログ", "블로그", "Blog", "Blogg", "Pukapuka", "Blog", "Blog", "Blog", "Blogg", "வலைப்பதிவு", "บล็อก", "Блог", "Blog", "Ibhulogi", "Ibhulogi", "", "", "", "Blog")}</Link></li>
              <li><Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Contact", "اتصل بنا", "Contacto", "Contacto", "Kontakt", "Contact", "Contact", "Кантакт", "Контакт", "Contatti", "联系我们", "Kontakt", "Kontakt", "Ota yhteyttä", "Επικοινωνία", "Kapcsolat", "संपर्क", "お問い合わせ", "문의하기", "Hubungi", "Kontakt", "Whakapā", "Kontakt", "Contact", "Jokkoodé", "Kontakt", "தொடர்பு", "ติดต่อ", "Контакти", "Liên hệ", "Thintana nathi", "Nxibelelana nathi", "", "", "", "Kontak")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 font-title">{t("Légal", "قانوني", "Legal", "Legal", "Rechtliches", "Legal", "Juridisch", "Юрыдычны", "Юридический", "Legale", "法律", "Právní", "Juridisk", "Lakitieto", "Νομικά", "Jogi", "कानूनी", "法的情報", "법적 정보", "Undang-undang", "Juridisk", "Ture", "Informacje prawne", "Legal", "Yelleef", "Juridisk information", "சட்டப்பூர்வ", "กฎหมาย", "Юридична інформація", "Pháp lý", "Okusemthethweni", "Ezomthetho", "", "", "", "Legal")}</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Confidentialité", "الخصوصية", "Confidencialidade", "Privacidad", "Datenschutz", "Privacy", "Privacy", "Канфідэнцыяльнасць", "Конфиденциальность", "Privacy", "隐私", "Soukromí", "Privatliv", "Tietosuoja", "Απόρρητο", "Adatvédelem", "गोपनीयता", "プライバシー", "개인정보 보호", "Privasi", "Personvern", "Tūmataititanga", "Prywatność", "Confidențialitate", "Sutura", "Integritetspolicy", "தனியுரிமை", "ความเป็นส่วนตัว", "Конфіденційність", "Bảo mật", "Ubumfihlo", "Ubumfihlo", "", "", "", "Privasi")}</Link></li>
              <li><Link href="/terms" className="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">{t("Conditions", "الشروط", "Termos", "Términos", "Bedingungen", "Terms", "Voorwaarden", "Умовы", "Условия", "Termini", "条款", "Podmínky", "Vilkår", "Ehdot", "Όροι", "Feltételek", "शर्तें", "利用規約", "이용 약관", "Terma", "Vilkår", "Tikanga", "Regulamin", "Termeni", "Sart yi", "Villkor", "விதிமுறைகள்", "ข้อกำหนด", "Умови", "Điều khoản", "Imigomo", "Imiqathango", "", "", "", "Syarat")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">© {new Date().getFullYear()} FreeGeny Inc. {t("Tous droits réservés.", "جميع الحقوق محفوظة.", "Todos os direitos reservados.", "Todos los derechos reservados.", "Alle Rechte vorbehalten.", "All rights reserved.", "Alle rechten voorbehouden.", "Усе правы абаронены.", "Все права защищены.", "Tutti i diritti riservati.", "版权所有。", "Všechna práva vyhrazena.", "Alle rettigheder forbeholdes.", "Kaikki oikeudet pidätetään.", "Με την επιφύλαξη παντός δικαιώματος.", "Minden jog fenntartva.", "सर्वाधिकार सुरक्षित।", "全著作権所有。", "모든 권리 보유.", "Hak cipta terpelihara.", "Alle rettigheter forbeholdt.", "Pūmau te mana.", "Wszelkie prawa zastrzeżone.", "Toate drepturile rezervate.", "Yelleef yépp ñu ngi ci loxoom.", "Alla rättigheter förbehållna.", "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.", "สงวนลิขสิทธิ์", "Всі права захищені.", "Đã đăng ký bản quyền.", "Wonke amalungelo agodliwe.", "Onke amalungelo agciniwe.", "", "", "", "Hak cipta dilindungi undang-undang.")}</p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
              <Apple size={20} />
              <div className="text-left rtl:text-right">
                <p className="text-[7px] uppercase font-black leading-none">
                  {t("Bientôt sur", "قريباً على", "Em breve na", "Próximamente en", "Bald auf", "Soon on", "Binnenkort op", "Хутка на", "Скоро в", "Prossimamente su", "即将登陆", "Již brzy na", "Kommer snart på", "Tulossa pian", "Σύντομα στο", "Hamarosan itt:", "जल्द ही", "まもなく登場", "곧 출시", "Segera di", "Snart på", "Akuanei i runga i", "Wkrótce w", "În curând pe", "Léegi ci", "Snart på", "விரைவில்", "เร็วๆ นี้ทาง", "Незабаром на", "Sắp có trên", "Kuyeza maduze", "Kuyeza kamsinya", "", "", "", "Segera hadir di")}
                </p>
                <p className="text-[10px] font-bold leading-none mt-0.5">App Store</p>
              </div>
            </div>
            <div className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
              <PlayStore size={18} />
              <div className="text-left rtl:text-right">
                <p className="text-[7px] uppercase font-black leading-none">
                  {t("Bientôt sur", "قريباً على", "Em breve na", "Próximamente en", "Bald auf", "Soon on", "Binnenkort op", "Хутка на", "Скоро в", "Prossimamente su", "即将登陆", "Již brzy na", "Kommer snart på", "Tulossa pian", "Σύντομα στο", "Hamarosan itt:", "जल्द ही", "まもなく登場", "곧 출시", "Segera di", "Snart på", "Akuanei i runga i", "Wkrótce w", "În curând pe", "Léegi ci", "Snart på", "விரைவில்", "เร็วๆ นี้ทาง", "Незабаром на", "Sắp có trên", "Kuyeza maduze", "Kuyeza kamsinya", "", "", "", "Segera hadir di")}
                </p>
                <p className="text-[10px] font-bold leading-none mt-0.5">Google Play</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
