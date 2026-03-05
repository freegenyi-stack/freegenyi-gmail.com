const fs = require('fs');
const path = require('path');

// Traductions pour tous les langages
const translations = {
    es: {
        cookies: {
            title: "Gestión de cookies",
            description: "Utilizamos cookies para mejorar su experiencia.",
            learnMore: "Saber más",
            rejectAll: "Rechazar todo",
            customize: "Personalizar",
            acceptAll: "Aceptar todo"
        },
        footer: {
            baseline: "Revolucionando la educación para todos",
            rights: "Todos los derechos reservados.",
            about: {
                title: "Acerca de",
                education: "Educación",
                nationalCurriculum: "Contenido del Currículo Nacional",
                internationalCurriculum: "Contenido del Currículo Internacional",
                mission: "Nuestra Misión",
                methodology: "Metodología",
                research: "Investigación Educativa",
                brand: "Acerca de la Marca",
                news: "Noticias",
                press: "Prensa",
                contact: "Contáctenos"
            },
            apps: {
                title: "Nuestras Apps",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Ayuda y Soporte",
                faqGeneral: "Preguntas frecuentes sobre FreeGeny",
                faqSchools: "Preguntas frecuentes para Escuelas",
                faqNgos: "Preguntas frecuentes para ONG"
            },
            legal: {
                title: "Legal",
                guidelines: "Directrices de Usuario",
                terms: "Términos de Servicio",
                privacy: "Política de Privacidad",
                communityRules: "Reglas de la Comunidad",
                cookiePreferences: "Centro de Preferencias de Cookies",
                accessibility: "Declaración de Accesibilidad",
                sitemap: "Mapa del Sitio"
            }
        }
    },
    de: {
        cookies: {
            title: "Cookie-Verwaltung",
            description: "Wir verwenden Cookies, um Ihr Erlebnis zu verbessern.",
            learnMore: "Mehr erfahren",
            rejectAll: "Alle ablehnen",
            customize: "Anpassen",
            acceptAll: "Alle akzeptieren"
        },
        footer: {
            baseline: "Bildung für alle revolutionieren",
            rights: "Alle Rechte vorbehalten.",
            about: {
                title: "Über uns",
                education: "Bildung",
                nationalCurriculum: "Nationale Lehrplaninhalte",
                internationalCurriculum: "Internationale Lehrplaninhalte",
                mission: "Unsere Mission",
                methodology: "Methodik",
                research: "Bildungsforschung",
                brand: "Über die Marke",
                news: "Neuigkeiten",
                press: "Presse",
                contact: "Kontaktieren Sie uns"
            },
            apps: {
                title: "Unsere Apps",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Hilfe & Support",
                faqGeneral: "FAQ zu FreeGeny",
                faqSchools: "FAQ für Schulen",
                faqNgos: "FAQ für NGOs"
            },
            legal: {
                title: "Rechtliches",
                guidelines: "Benutzerrichtlinien",
                terms: "Nutzungsbedingungen",
                privacy: "Datenschutzrichtlinie",
                communityRules: "Community-Regeln",
                cookiePreferences: "Cookie-Einstellungen",
                accessibility: "Barrierefreiheitserklärung",
                sitemap: "Sitemap"
            }
        }
    },
    it: {
        cookies: {
            title: "Gestione dei cookie",
            description: "Utilizziamo i cookie per migliorare la tua esperienza.",
            learnMore: "Scopri di più",
            rejectAll: "Rifiuta tutto",
            customize: "Personalizza",
            acceptAll: "Accetta tutto"
        },
        footer: {
            baseline: "Rivoluzionare l'istruzione per tutti",
            rights: "Tutti i diritti riservati.",
            about: {
                title: "Chi siamo",
                education: "Istruzione",
                nationalCurriculum: "Contenuti del Curriculum Nazionale",
                internationalCurriculum: "Contenuti del Curriculum Internazionale",
                mission: "La Nostra Missione",
                methodology: "Metodologia",
                research: "Ricerca Educativa",
                brand: "Informazioni sul Brand",
                news: "Notizie",
                press: "Stampa",
                contact: "Contattaci"
            },
            apps: {
                title: "Le Nostre App",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Aiuto e Supporto",
                faqGeneral: "FAQ su FreeGeny",
                faqSchools: "FAQ per le Scuole",
                faqNgos: "FAQ per le ONG"
            },
            legal: {
                title: "Legale",
                guidelines: "Linee Guida per gli Utenti",
                terms: "Termini di Servizio",
                privacy: "Informativa sulla Privacy",
                communityRules: "Regole della Community",
                cookiePreferences: "Centro Preferenze Cookie",
                accessibility: "Dichiarazione di Accessibilità",
                sitemap: "Mappa del Sito"
            }
        }
    },
    pt: {
        cookies: {
            title: "Gestão de cookies",
            description: "Usamos cookies para melhorar sua experiência.",
            learnMore: "Saiba mais",
            rejectAll: "Rejeitar todos",
            customize: "Personalizar",
            acceptAll: "Aceitar todos"
        },
        footer: {
            baseline: "Revolucionando a educação para todos",
            rights: "Todos os direitos reservados.",
            about: {
                title: "Sobre",
                education: "Educação",
                nationalCurriculum: "Conteúdo do Currículo Nacional",
                internationalCurriculum: "Conteúdo do Currículo Internacional",
                mission: "Nossa Missão",
                methodology: "Metodologia",
                research: "Pesquisa Educacional",
                brand: "Sobre a Marca",
                news: "Notícias",
                press: "Imprensa",
                contact: "Fale Conosco"
            },
            apps: {
                title: "Nossos Apps",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Ajuda e Suporte",
                faqGeneral: "Perguntas frequentes sobre FreeGeny",
                faqSchools: "Perguntas frequentes para Escolas",
                faqNgos: "Perguntas frequentes para ONGs"
            },
            legal: {
                title: "Legal",
                guidelines: "Diretrizes do Usuário",
                terms: "Termos de Serviço",
                privacy: "Política de Privacidade",
                communityRules: "Regras da Comunidade",
                cookiePreferences: "Centro de Preferências de Cookies",
                accessibility: "Declaração de Acessibilidade",
                sitemap: "Mapa do Site"
            }
        }
    },
    ar: {
        cookies: {
            title: "إدارة ملفات تعريف الارتباط",
            description: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك.",
            learnMore: "تعلم المزيد",
            rejectAll: "رفض الكل",
            customize: "تخصيص",
            acceptAll: "قبول الكل"
        },
        footer: {
            baseline: "إحداث ثورة في التعليم للجميع",
            rights: "جميع الحقوق محفوظة.",
            about: {
                title: "حول",
                education: "التعليم",
                nationalCurriculum: "محتوى المنهج الوطني",
                internationalCurriculum: "محتوى المنهج الدولي",
                mission: "مهمتنا",
                methodology: "المنهجية",
                research: "البحث التربوي",
                brand: "حول العلامة التجارية",
                news: "الأخبار",
                press: "الصحافة",
                contact: "اتصل بنا"
            },
            apps: {
                title: "تطبيقاتنا",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "المساعدة والدعم",
                faqGeneral: "الأسئلة الشائعة حول FreeGeny",
                faqSchools: "الأسئلة الشائعة للمدارس",
                faqNgos: "الأسئلة الشائعة للمنظمات غير الحكومية"
            },
            legal: {
                title: "قانوني",
                guidelines: "إرشادات المستخدم",
                terms: "شروط الخدمة",
                privacy: "سياسة الخصوصية",
                communityRules: "قواعد المجتمع",
                cookiePreferences: "مركز تفضيلات ملفات تعريف الارتباط",
                accessibility: "بيان إمكانية الوصول",
                sitemap: "خريطة الموقع"
            }
        }
    },
    zh: {
        cookies: {
            title: "Cookie管理",
            description: "我们使用cookie来增强您的体验。",
            learnMore: "了解更多",
            rejectAll: "拒绝全部",
            customize: "自定义",
            acceptAll: "接受全部"
        },
        footer: {
            baseline: "为所有人革新教育",
            rights: "保留所有权利。",
            about: {
                title: "关于",
                education: "教育",
                nationalCurriculum: "国家课程内容",
                internationalCurriculum: "国际课程内容",
                mission: "我们的使命",
                methodology: "方法论",
                research: "教育研究",
                brand: "关于品牌",
                news: "新闻",
                press: "新闻发布",
                contact: "联系我们"
            },
            apps: {
                title: "我们的应用",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "帮助与支持",
                faqGeneral: "关于FreeGeny的常见问题",
                faqSchools: "学校常见问题",
                faqNgos: "非政府组织常见问题"
            },
            legal: {
                title: "法律",
                guidelines: "用户指南",
                terms: "服务条款",
                privacy: "隐私政策",
                communityRules: "社区规则",
                cookiePreferences: "Cookie偏好设置中心",
                accessibility: "无障碍声明",
                sitemap: "网站地图"
            }
        }
    },
    ja: {
        cookies: {
            title: "Cookieの管理",
            description: "私たちはあなたの体験を向上させるためにCookieを使用しています。",
            learnMore: "詳細を見る",
            rejectAll: "すべて拒否",
            customize: "カスタマイズ",
            acceptAll: "すべて受け入れる"
        },
        footer: {
            baseline: "すべての人のために教育を革新する",
            rights: "全著作権所有。",
            about: {
                title: "について",
                education: "教育",
                nationalCurriculum: "国家カリキュラムコンテンツ",
                internationalCurriculum: "国際カリキュラムコンテンツ",
                mission: "私たちの使命",
                methodology: "方法論",
                research: "教育研究",
                brand: "ブランドについて",
                news: "ニュース",
                press: "プレス",
                contact: "お問い合わせ"
            },
            apps: {
                title: "私たちのアプリ",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "ヘルプとサポート",
                faqGeneral: "FreeGenyに関するFAQ",
                faqSchools: "学校向けFAQ",
                faqNgos: "NGO向けFAQ"
            },
            legal: {
                title: "法的情報",
                guidelines: "ユーザーガイドライン",
                terms: "利用規約",
                privacy: "プライバシーポリシー",
                communityRules: "コミュニティルール",
                cookiePreferences: "Cookie設定センター",
                accessibility: "アクセシビリティ声明",
                sitemap: "サイトマップ"
            }
        }
    },
    ko: {
        cookies: {
            title: "쿠키 관리",
            description: "우리는 귀하의 경험을 향상시키기 위해 쿠키를 사용합니다.",
            learnMore: "더 알아보기",
            rejectAll: "모두 거부",
            customize: "사용자 정의",
            acceptAll: "모두 수락"
        },
        footer: {
            baseline: "모두를 위한 교육 혁신",
            rights: "모든 권리 보유.",
            about: {
                title: "소개",
                education: "교육",
                nationalCurriculum: "국가 교육과정 내용",
                internationalCurriculum: "국제 교육과정 내용",
                mission: "우리의 사명",
                methodology: "방법론",
                research: "교육 연구",
                brand: "브랜드 소개",
                news: "뉴스",
                press: "언론",
                contact: "문의하기"
            },
            apps: {
                title: "우리의 앱",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "도움말 및 지원",
                faqGeneral: "FreeGeny에 대한 FAQ",
                faqSchools: "학교를 위한 FAQ",
                faqNgos: "NGO를 위한 FAQ"
            },
            legal: {
                title: "법적 고지",
                guidelines: "사용자 가이드라인",
                terms: "서비스 약관",
                privacy: "개인정보 보호정책",
                communityRules: "커뮤니티 규칙",
                cookiePreferences: "쿠키 설정 센터",
                accessibility: "접근성 선언",
                sitemap: "사이트맵"
            }
        }
    },
    ru: {
        cookies: {
            title: "Управление файлами cookie",
            description: "Мы используем файлы cookie для улучшения вашего опыта.",
            learnMore: "Узнать больше",
            rejectAll: "Отклонить все",
            customize: "Настроить",
            acceptAll: "Принять все"
        },
        footer: {
            baseline: "Революция в образовании для всех",
            rights: "Все права защищены.",
            about: {
                title: "О нас",
                education: "Образование",
                nationalCurriculum: "Национальная учебная программа",
                internationalCurriculum: "Международная учебная программа",
                mission: "Наша миссия",
                methodology: "Методология",
                research: "Образовательные исследования",
                brand: "О бренде",
                news: "Новости",
                press: "Пресса",
                contact: "Связаться с нами"
            },
            apps: {
                title: "Наши приложения",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Помощь и поддержка",
                faqGeneral: "Часто задаваемые вопросы о FreeGeny",
                faqSchools: "Часто задаваемые вопросы для школ",
                faqNgos: "Часто задаваемые вопросы для НПО"
            },
            legal: {
                title: "Юридическая информация",
                guidelines: "Руководство пользователя",
                terms: "Условия обслуживания",
                privacy: "Политика конфиденциальности",
                communityRules: "Правила сообщества",
                cookiePreferences: "Центр настроек файлов cookie",
                accessibility: "Заявление о доступности",
                sitemap: "Карта сайта"
            }
        }
    },
    hi: {
        cookies: {
            title: "कुकी प्रबंधन",
            description: "हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं।",
            learnMore: "और जानें",
            rejectAll: "सभी अस्वीकार करें",
            customize: "अनुकूलित करें",
            acceptAll: "सभी स्वीकार करें"
        },
        footer: {
            baseline: "सभी के लिए शिक्षा में क्रांति",
            rights: "सर्वाधिकार सुरक्षित।",
            about: {
                title: "के बारे में",
                education: "शिक्षा",
                nationalCurriculum: "राष्ट्रीय पाठ्यक्रम सामग्री",
                internationalCurriculum: "अंतर्राष्ट्रीय पाठ्यक्रम सामग्री",
                mission: "हमारा मिशन",
                methodology: "कार्यप्रणाली",
                research: "शैक्षिक अनुसंधान",
                brand: "ब्रांड के बारे में",
                news: "समाचार",
                press: "प्रेस",
                contact: "हमसे संपर्क करें"
            },
            apps: {
                title: "हमारे ऐप्स",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "सहायता और समर्थन",
                faqGeneral: "FreeGeny के बारे में FAQ",
                faqSchools: "स्कूलों के लिए FAQ",
                faqNgos: "NGO के लिए FAQ"
            },
            legal: {
                title: "कानूनी",
                guidelines: "उपयोगकर्ता दिशानिर्देश",
                terms: "सेवा की शर्तें",
                privacy: "गोपनीयता नीति",
                communityRules: "समुदाय नियम",
                cookiePreferences: "कुकी प्राथमिकताएं केंद्र",
                accessibility: "पहुंच योग्यता विवरण",
                sitemap: "साइट मैप"
            }
        }
    },
    bn: {
        cookies: {
            title: "কুকি ব্যবস্থাপনা",
            description: "আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করি।",
            learnMore: "আরও জানুন",
            rejectAll: "সব প্রত্যাখ্যান করুন",
            customize: "কাস্টমাইজ করুন",
            acceptAll: "সব গ্রহণ করুন"
        },
        footer: {
            baseline: "সবার জন্য শিক্ষায় বিপ্লব",
            rights: "সর্বস্বত্ব সংরক্ষিত।",
            about: {
                title: "সম্পর্কে",
                education: "শিক্ষা",
                nationalCurriculum: "জাতীয় পাঠ্যক্রম বিষয়বস্তু",
                internationalCurriculum: "আন্তর্জাতিক পাঠ্যক্রম বিষয়বস্তু",
                mission: "আমাদের মিশন",
                methodology: "পদ্ধতি",
                research: "শিক্ষা গবেষণা",
                brand: "ব্র্যান্ড সম্পর্কে",
                news: "সংবাদ",
                press: "প্রেস",
                contact: "আমাদের সাথে যোগাযোগ করুন"
            },
            apps: {
                title: "আমাদের অ্যাপস",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "সাহায্য এবং সহায়তা",
                faqGeneral: "FreeGeny সম্পর্কে FAQ",
                faqSchools: "স্কুলের জন্য FAQ",
                faqNgos: "NGO-এর জন্য FAQ"
            },
            legal: {
                title: "আইনি",
                guidelines: "ব্যবহারকারী নির্দেশিকা",
                terms: "সেবার শর্তাবলী",
                privacy: "গোপনীয়তা নীতি",
                communityRules: "সম্প্রদায়ের নিয়ম",
                cookiePreferences: "কুকি পছন্দ কেন্দ্র",
                accessibility: "অ্যাক্সেসযোগ্যতা বিবৃতি",
                sitemap: "সাইট ম্যাপ"
            }
        }
    },
    // For remaining languages, use English as fallback with language-specific adjustments
    tr: {
        cookies: {
            title: "Çerez Yönetimi",
            description: "Deneyiminizi geliştirmek için çerezler kullanıyoruz.",
            learnMore: "Daha fazla bilgi",
            rejectAll: "Tümünü Reddet",
            customize: "Özelleştir",
            acceptAll: "Tümünü Kabul Et"
        },
        footer: {
            baseline: "Herkes için eğitimde devrim",
            rights: "Tüm hakları saklıdır.",
            about: {
                title: "Hakkında",
                education: "Eğitim",
                nationalCurriculum: "Ulusal Müfredat İçeriği",
                internationalCurriculum: "Uluslararası Müfredat İçeriği",
                mission: "Misyonumuz",
                methodology: "Metodoloji",
                research: "Eğitim Araştırması",
                brand: "Marka Hakkında",
                news: "Haberler",
                press: "Basın",
                contact: "Bize Ulaşın"
            },
            apps: {
                title: "Uygulamalarımız",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Yardım ve Destek",
                faqGeneral: "FreeGeny hakkında SSS",
                faqSchools: "Okullar için SSS",
                faqNgos: "STK'lar için SSS"
            },
            legal: {
                title: "Yasal",
                guidelines: "Kullanıcı Kılavuzu",
                terms: "Hizmet Şartları",
                privacy: "Gizlilik Politikası",
                communityRules: "Topluluk Kuralları",
                cookiePreferences: "Çerez Tercihleri Merkezi",
                accessibility: "Erişilebilirlik Beyanı",
                sitemap: "Site Haritası"
            }
        }
    },
    nl: {
        cookies: {
            title: "Cookiebeheer",
            description: "We gebruiken cookies om uw ervaring te verbeteren.",
            learnMore: "Meer informatie",
            rejectAll: "Alles afwijzen",
            customize: "Aanpassen",
            acceptAll: "Alles accepteren"
        },
        footer: {
            baseline: "Onderwijs revolutioneren voor iedereen",
            rights: "Alle rechten voorbehouden.",
            about: {
                title: "Over",
                education: "Onderwijs",
                nationalCurriculum: "Nationale Curriculum Inhoud",
                internationalCurriculum: "Internationale Curriculum Inhoud",
                mission: "Onze Missie",
                methodology: "Methodologie",
                research: "Onderwijsonderzoek",
                brand: "Over het Merk",
                news: "Nieuws",
                press: "Pers",
                contact: "Neem contact op"
            },
            apps: {
                title: "Onze Apps",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Hulp en Ondersteuning",
                faqGeneral: "Veelgestelde vragen over FreeGeny",
                faqSchools: "Veelgestelde vragen voor scholen",
                faqNgos: "Veelgestelde vragen voor NGO's"
            },
            legal: {
                title: "Juridisch",
                guidelines: "Gebruikersrichtlijnen",
                terms: "Servicevoorwaarden",
                privacy: "Privacybeleid",
                communityRules: "Gemeenschapsregels",
                cookiePreferences: "Cookievoorkeuren Centrum",
                accessibility: "Toegankelijkheidsverklaring",
                sitemap: "Sitemap"
            }
        }
    },
    pl: {
        cookies: {
            title: "Zarządzanie plikami cookie",
            description: "Używamy plików cookie, aby poprawić Twoje doświadczenia.",
            learnMore: "Dowiedz się więcej",
            rejectAll: "Odrzuć wszystkie",
            customize: "Dostosuj",
            acceptAll: "Zaakceptuj wszystkie"
        },
        footer: {
            baseline: "Rewolucja w edukacji dla wszystkich",
            rights: "Wszelkie prawa zastrzeżone.",
            about: {
                title: "O nas",
                education: "Edukacja",
                nationalCurriculum: "Treści Programu Narodowego",
                internationalCurriculum: "Treści Programu Międzynarodowego",
                mission: "Nasza Misja",
                methodology: "Metodologia",
                research: "Badania Edukacyjne",
                brand: "O Marce",
                news: "Aktualności",
                press: "Prasa",
                contact: "Skontaktuj się z nami"
            },
            apps: {
                title: "Nasze Aplikacje",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Pomoc i Wsparcie",
                faqGeneral: "FAQ o FreeGeny",
                faqSchools: "FAQ dla szkół",
                faqNgos: "FAQ dla NGO"
            },
            legal: {
                title: "Prawne",
                guidelines: "Wytyczne dla użytkowników",
                terms: "Warunki usługi",
                privacy: "Polityka prywatności",
                communityRules: "Zasady społeczności",
                cookiePreferences: "Centrum preferencji plików cookie",
                accessibility: "Oświadczenie o dostępności",
                sitemap: "Mapa strony"
            }
        }
    },
    sv: {
        cookies: {
            title: "Cookie-hantering",
            description: "Vi använder cookies för att förbättra din upplevelse.",
            learnMore: "Läs mer",
            rejectAll: "Avvisa alla",
            customize: "Anpassa",
            acceptAll: "Acceptera alla"
        },
        footer: {
            baseline: "Revolutionera utbildning för alla",
            rights: "Alla rättigheter förbehållna.",
            about: {
                title: "Om",
                education: "Utbildning",
                nationalCurriculum: "Nationellt Läroplaninnehåll",
                internationalCurriculum: "Internationellt Läroplaninnehåll",
                mission: "Vårt Uppdrag",
                methodology: "Metodik",
                research: "Utbildningsforskning",
                brand: "Om Varumärket",
                news: "Nyheter",
                press: "Press",
                contact: "Kontakta oss"
            },
            apps: {
                title: "Våra Appar",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Hjälp och Support",
                faqGeneral: "Vanliga frågor om FreeGeny",
                faqSchools: "Vanliga frågor för skolor",
                faqNgos: "Vanliga frågor för NGO:er"
            },
            legal: {
                title: "Juridiskt",
                guidelines: "Användarriktlinjer",
                terms: "Användarvillkor",
                privacy: "Integritetspolicy",
                communityRules: "Gemenskapsregler",
                cookiePreferences: "Cookie-inställningscenter",
                accessibility: "Tillgänglighetsförklaring",
                sitemap: "Webbplatskarta"
            }
        }
    },
    uk: {
        cookies: {
            title: "Управління файлами cookie",
            description: "Ми використовуємо файли cookie для покращення вашого досвіду.",
            learnMore: "Дізнатися більше",
            rejectAll: "Відхилити все",
            customize: "Налаштувати",
            acceptAll: "Прийняти все"
        },
        footer: {
            baseline: "Революція в освіті для всіх",
            rights: "Усі права захищені.",
            about: {
                title: "Про нас",
                education: "Освіта",
                nationalCurriculum: "Національна навчальна програма",
                internationalCurriculum: "Міжнародна навчальна програма",
                mission: "Наша місія",
                methodology: "Методологія",
                research: "Освітні дослідження",
                brand: "Про бренд",
                news: "Новини",
                press: "Преса",
                contact: "Зв'яжіться з нами"
            },
            apps: {
                title: "Наші додатки",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Допомога та підтримка",
                faqGeneral: "Поширені запитання про FreeGeny",
                faqSchools: "Поширені запитання для шкіл",
                faqNgos: "Поширені запитання для НУО"
            },
            legal: {
                title: "Юридична інформація",
                guidelines: "Керівництво користувача",
                terms: "Умови обслуговування",
                privacy: "Політика конфіденційності",
                communityRules: "Правила спільноти",
                cookiePreferences: "Центр налаштувань файлів cookie",
                accessibility: "Заява про доступність",
                sitemap: "Карта сайту"
            }
        }
    },
    vi: {
        cookies: {
            title: "Quản lý Cookie",
            description: "Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn.",
            learnMore: "Tìm hiểu thêm",
            rejectAll: "Từ chối tất cả",
            customize: "Tùy chỉnh",
            acceptAll: "Chấp nhận tất cả"
        },
        footer: {
            baseline: "Cách mạng hóa giáo dục cho tất cả mọi người",
            rights: "Đã đăng ký bản quyền.",
            about: {
                title: "Về chúng tôi",
                education: "Giáo dục",
                nationalCurriculum: "Nội dung Chương trình Quốc gia",
                internationalCurriculum: "Nội dung Chương trình Quốc tế",
                mission: "Sứ mệnh của chúng tôi",
                methodology: "Phương pháp luận",
                research: "Nghiên cứu Giáo dục",
                brand: "Về Thương hiệu",
                news: "Tin tức",
                press: "Báo chí",
                contact: "Liên hệ chúng tôi"
            },
            apps: {
                title: "Ứng dụng của chúng tôi",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Trợ giúp và Hỗ trợ",
                faqGeneral: "Câu hỏi thường gặp về FreeGeny",
                faqSchools: "Câu hỏi thường gặp cho Trường học",
                faqNgos: "Câu hỏi thường gặp cho NGO"
            },
            legal: {
                title: "Pháp lý",
                guidelines: "Hướng dẫn Người dùng",
                terms: "Điều khoản Dịch vụ",
                privacy: "Chính sách Bảo mật",
                communityRules: "Quy tắc Cộng đồng",
                cookiePreferences: "Trung tâm Tùy chọn Cookie",
                accessibility: "Tuyên bố Khả năng Tiếp cận",
                sitemap: "Sơ đồ Trang web"
            }
        }
    },
    th: {
        cookies: {
            title: "การจัดการคุกกี้",
            description: "เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ",
            learnMore: "เรียนรู้เพิ่มเติม",
            rejectAll: "ปฏิเสธทั้งหมด",
            customize: "ปรับแต่ง",
            acceptAll: "ยอมรับทั้งหมด"
        },
        footer: {
            baseline: "ปฏิวัติการศึกษาสำหรับทุกคน",
            rights: "สงวนลิขสิทธิ์",
            about: {
                title: "เกี่ยวกับ",
                education: "การศึกษา",
                nationalCurriculum: "เนื้อหาหลักสูตรแห่งชาติ",
                internationalCurriculum: "เนื้อหาหลักสูตรนานาชาติ",
                mission: "พันธกิจของเรา",
                methodology: "วิธีการ",
                research: "การวิจัยทางการศึกษา",
                brand: "เกี่ยวกับแบรนด์",
                news: "ข่าวสาร",
                press: "สื่อมวลชน",
                contact: "ติดต่อเรา"
            },
            apps: {
                title: "แอปของเรา",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "ความช่วยเหลือและการสนับสนุน",
                faqGeneral: "คำถามที่พบบ่อยเกี่ยวกับ FreeGeny",
                faqSchools: "คำถามที่พบบ่อยสำหรับโรงเรียน",
                faqNgos: "คำถามที่พบบ่อยสำหรับ NGO"
            },
            legal: {
                title: "กฎหมาย",
                guidelines: "แนวทางผู้ใช้",
                terms: "เงื่อนไขการให้บริการ",
                privacy: "นโยบายความเป็นส่วนตัว",
                communityRules: "กฎของชุมชน",
                cookiePreferences: "ศูนย์การตั้งค่าคุกกี้",
                accessibility: "แถลงการณ์การเข้าถึง",
                sitemap: "แผนผังเว็บไซต์"
            }
        }
    },
    id: {
        cookies: {
            title: "Manajemen Cookie",
            description: "Kami menggunakan cookie untuk meningkatkan pengalaman Anda.",
            learnMore: "Pelajari lebih lanjut",
            rejectAll: "Tolak Semua",
            customize: "Sesuaikan",
            acceptAll: "Terima Semua"
        },
        footer: {
            baseline: "Merevolusi pendidikan untuk semua",
            rights: "Hak cipta dilindungi.",
            about: {
                title: "Tentang",
                education: "Pendidikan",
                nationalCurriculum: "Konten Kurikulum Nasional",
                internationalCurriculum: "Konten Kurikulum Internasional",
                mission: "Misi Kami",
                methodology: "Metodologi",
                research: "Penelitian Pendidikan",
                brand: "Tentang Merek",
                news: "Berita",
                press: "Pers",
                contact: "Hubungi Kami"
            },
            apps: {
                title: "Aplikasi Kami",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Bantuan & Dukungan",
                faqGeneral: "FAQ tentang FreeGeny",
                faqSchools: "FAQ untuk Sekolah",
                faqNgos: "FAQ untuk NGO"
            },
            legal: {
                title: "Hukum",
                guidelines: "Pedoman Pengguna",
                terms: "Ketentuan Layanan",
                privacy: "Kebijakan Privasi",
                communityRules: "Aturan Komunitas",
                cookiePreferences: "Pusat Preferensi Cookie",
                accessibility: "Pernyataan Aksesibilitas",
                sitemap: "Peta Situs"
            }
        }
    },
    fa: {
        cookies: {
            title: "مدیریت کوکی",
            description: "ما از کوکی‌ها برای بهبود تجربه شما استفاده می‌کنیم.",
            learnMore: "بیشتر بدانید",
            rejectAll: "رد همه",
            customize: "سفارشی‌سازی",
            acceptAll: "پذیرش همه"
        },
        footer: {
            baseline: "انقلاب در آموزش برای همه",
            rights: "تمامی حقوق محفوظ است.",
            about: {
                title: "درباره",
                education: "آموزش",
                nationalCurriculum: "محتوای برنامه درسی ملی",
                internationalCurriculum: "محتوای برنامه درسی بین‌المللی",
                mission: "ماموریت ما",
                methodology: "روش‌شناسی",
                research: "تحقیقات آموزشی",
                brand: "درباره برند",
                news: "اخبار",
                press: "مطبوعات",
                contact: "تماس با ما"
            },
            apps: {
                title: "اپلیکیشن‌های ما",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "راهنما و پشتیبانی",
                faqGeneral: "سوالات متداول درباره FreeGeny",
                faqSchools: "سوالات متداول برای مدارس",
                faqNgos: "سوالات متداول برای سازمان‌های غیردولتی"
            },
            legal: {
                title: "قانونی",
                guidelines: "راهنمای کاربر",
                terms: "شرایط خدمات",
                privacy: "سیاست حفظ حریم خصوصی",
                communityRules: "قوانین جامعه",
                cookiePreferences: "مرکز تنظیمات کوکی",
                accessibility: "بیانیه دسترسی",
                sitemap: "نقشه سایت"
            }
        }
    },
    ur: {
        cookies: {
            title: "کوکی کا انتظام",
            description: "ہم آپ کے تجربے کو بہتر بنانے کے لیے کوکیز استعمال کرتے ہیں۔",
            learnMore: "مزید جانیں",
            rejectAll: "سب مسترد کریں",
            customize: "حسب ضرورت بنائیں",
            acceptAll: "سب قبول کریں"
        },
        footer: {
            baseline: "سب کے لیے تعلیم میں انقلاب",
            rights: "تمام حقوق محفوظ ہیں۔",
            about: {
                title: "کے بارے میں",
                education: "تعلیم",
                nationalCurriculum: "قومی نصاب کا مواد",
                internationalCurriculum: "بین الاقوامی نصاب کا مواد",
                mission: "ہمارا مشن",
                methodology: "طریقہ کار",
                research: "تعلیمی تحقیق",
                brand: "برانڈ کے بارے میں",
                news: "خبریں",
                press: "پریس",
                contact: "ہم سے رابطہ کریں"
            },
            apps: {
                title: "ہماری ایپس",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "مدد اور معاونت",
                faqGeneral: "FreeGeny کے بارے میں عمومی سوالات",
                faqSchools: "اسکولوں کے لیے عمومی سوالات",
                faqNgos: "این جی اوز کے لیے عمومی سوالات"
            },
            legal: {
                title: "قانونی",
                guidelines: "صارف کی رہنمائی",
                terms: "سروس کی شرائط",
                privacy: "رازداری کی پالیسی",
                communityRules: "کمیونٹی کے قوانین",
                cookiePreferences: "کوکی کی ترجیحات کا مرکز",
                accessibility: "رسائی کا بیان",
                sitemap: "سائٹ میپ"
            }
        }
    }
};

// Add simple English-based translations for remaining languages
const simpleLanguages = ['cs', 'da', 'el', 'fi', 'fil', 'ga', 'ha', 'hu', 'no', 'pcm', 'ro', 'sw', 'ca'];

simpleLanguages.forEach(lang => {
    translations[lang] = {
        cookies: {
            title: "Cookie Management",
            description: "We use cookies to enhance your experience.",
            learnMore: "Learn more",
            rejectAll: "Reject All",
            customize: "Customize",
            acceptAll: "Accept All"
        },
        footer: {
            baseline: "Revolutionizing education for all",
            rights: "All rights reserved.",
            about: {
                title: "About",
                education: "Education",
                nationalCurriculum: "National Curriculum Content",
                internationalCurriculum: "International Curriculum Content",
                mission: "Our Mission",
                methodology: "Methodology",
                research: "Educational Research",
                brand: "About the Brand",
                news: "News",
                press: "Press",
                contact: "Contact Us"
            },
            apps: {
                title: "Our Apps",
                android: "FreeGeny Android",
                ios: "FreeGeny iOS"
            },
            support: {
                title: "Help & Support",
                faqGeneral: "FAQ about FreeGeny",
                faqSchools: "FAQ for Schools",
                faqNgos: "FAQ for NGOs"
            },
            legal: {
                title: "Legal",
                guidelines: "User Guidelines",
                terms: "Terms of Service",
                privacy: "Privacy Policy",
                communityRules: "Community Rules",
                cookiePreferences: "Cookie Preferences Center",
                accessibility: "Accessibility Statement",
                sitemap: "Site Map"
            }
        }
    };
});

// Process each language file
const messagesDir = path.join(__dirname, 'messages');

Object.keys(translations).forEach(lang => {
    const filePath = path.join(messagesDir, `${lang}.json`);

    try {
        // Read existing file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        // Add cookies and footer sections
        data.cookies = translations[lang].cookies;
        data.footer = translations[lang].footer;

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\r\n', 'utf8');
        console.log(`✓ Updated ${lang}.json`);
    } catch (error) {
        console.error(`✗ Error updating ${lang}.json:`, error.message);
    }
});

console.log('\nTranslation update complete!');
