export interface RegionVariant {
  heroImage: string;
  heroQuote: string;
  scienceImage: string;
  scienceQuote: string;
}

export const REGION_VARIANTS: Record<string, Record<string, RegionVariant> | RegionVariant> = {
  // Valeurs par défaut (International)
  default: {
    heroImage: "/assets/img/hero_elite.png",
    heroQuote: "L'excellence n'est pas un acte, c'est une habitude que nous cultivons chaque jour dans le cœur de chaque génie.",
    scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    scienceQuote: "La science au service du cœur : nous décodons le potentiel pour offrir à chaque enfant la clé de son propre destin."
  },
  
  // ALGERIA
  DZ: {
    ar: {
      heroImage: "/assets/img/regions/DZ/ar/hero.png",
      heroQuote: "ما نقشه الشهداء في الحجر، يكتبه أبناؤكم اليوم في النجوم.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "الابتكار التعليمي والذكاء الاصطناعي في خدمة طموح أبنائنا."
    },
    fr: {
      heroImage: "/assets/img/regions/DZ/fr/hero.png",
      heroQuote: "Ce que les martyrs ont gravé dans la pierre, vos enfants l'écrivent aujourd'hui dans les étoiles.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "L'innovation technologique au service de l'excellence académique algérienne."
    }
  },

  // MOROCCO
  MA: {
    ar: {
      heroImage: "/assets/img/regions/MA/ar/hero.png",
      heroQuote: "حرفيو فاس يحوّلون الخام إلى تحفة فنية — نحن نفعل الشيء ذاته مع مواهب كل طفل.",
      scienceImage: "/assets/img/regions/MA/ar/science.png",
      scienceQuote: "التكنولوجيا في خدمة التعليم الأصيل."
    },
    fr: {
      heroImage: "/assets/img/regions/MA/fr/hero.png",
      heroQuote: "Les artisans de Fès transforment la matière brute en chef-d'œuvre — nous faisons de même avec les talents de chaque enfant.",
      scienceImage: "/assets/img/regions/MA/fr/science.png",
      scienceQuote: "La technologie au service d'une éducation d'excellence."
    }
  },

  // TUNISIA
  TN: {
    ar: {
      heroImage: "/assets/img/regions/TN/ar/hero.png",
      heroQuote: "الجم تردّد أصداء القصص لقرون — نحن نجعل قصة طفلك الأجمل على الإطلاق.",
      scienceImage: "/assets/img/regions/TN/ar/science.png",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل تونسي."
    },
    fr: {
      heroImage: "/assets/img/regions/TN/fr/hero.png",
      heroQuote: "El Jem fait écho aux histoires depuis des siècles — nous faisons de l'histoire de votre enfant la plus belle de toutes.",
      scienceImage: "/assets/img/regions/TN/fr/science.png",
      scienceQuote: "L'excellence éducative pour l'avenir de chaque enfant tunisien."
    }
  },



  // SAUDI ARABIA
  SA: {
    ar: {
      heroImage: "/assets/img/regions/SA/ar/hero.png",
      heroQuote: "العُلا أخفت أسرارها في الصخر آلاف السنين — ومواهب طفلك تستحق نفس الكشف الرائع.",
      scienceImage: "/assets/img/regions/SA/ar/science.png",
      scienceQuote: "نحو ريادة تعليمية عالمية بروح سعودية."
    }
  },

  // UAE
  AE: {
    ar: {
      heroImage: "/assets/img/regions/AE/ar/hero.png",
      heroQuote: "في أرض اللا مستحيل، نربي جيل الريادة.",
      scienceImage: "/assets/img/regions/AE/ar/science.png",
      scienceQuote: "التكنولوجيا والتميز لمستقبل أطفال الإمارات."
    }
  },

  // FRANCE
  FR: {
    fr: {
      heroImage: "/assets/img/regions/FR/fr/hero.png",
      heroQuote: "Paris se contemple mieux à l'aube — les talents de votre enfant se révèlent mieux quand on prend le temps de les observer",
      scienceImage: "/assets/img/regions/FR/fr/science.png",
      scienceQuote: "Une méthode rigoureuse pour les citoyens de demain."
    }
  },



  // SENEGAL
  SN: {
    fr: {
      heroImage: "/assets/img/regions/SN/fr/hero.png",
      heroQuote: "Le savoir et la vérité grandissent ensemble — servons-nous-en pour l'avenir de chaque enfant.",
      scienceImage: "/assets/img/regions/SN/fr/science.png",
      scienceQuote: "L'excellence technologique au service du talent africain."
    }
  },



  // SPAIN
  ES: {
    es: {
      heroImage: "/assets/img/regions/ES/es/hero.png",
      heroQuote: "Gaudí construyó toda su vida un sueño que no vería terminado — nosotros también trabajamos para un futuro que pertenece a vuestros hijos",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovación y pasión para el futuro de cada niño español."
    }
  },

  // GERMANY
  DE: {
    de: {
      heroImage: "/assets/img/regions/DE/de/hero.png",
      heroQuote: "Hinter jedem großen Durchgang wartet eine noch größere Geschichte — die Ihres Kindes",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Deutsche Präzision für die Entfaltung des Potenzials jedes Kindes."
    }
  },

  // AUSTRALIA
  AU: {
    en: {
      heroImage: "/assets/img/regions/AU/en/hero.png",
      heroQuote: "The Songlines people have mapped their routes into the earth for 65,000 years — some knowledge goes deeper than any technology.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Deep wisdom and modern science uniting for the boundless potential of every Australian child."
    }
  },

  // BELGIUM
  BE: {
    fr: {
      heroImage: "/assets/img/regions/BE/fr/hero.png",
      heroQuote: "Des générations de mains ont bâti le même rêve — nous participons à celui de votre enfant.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "La science et l'innovation au service de l'excellence de chaque enfant belge."
    },
    nl: {
      heroImage: "/assets/img/regions/BE/nl/hero.png",
      heroQuote: "Generaties lang bouwden handen aan dezelfde droom — wij bouwen mee aan die van uw kind.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Wetenschap en innovatie ten dienste van de uitmuntendheid van elk Belgisch kind."
    }
  },

  // BAHRAIN
  BH: {
    ar: {
      heroImage: "/assets/img/regions/BH/ar/hero.png",
      heroQuote: "حضارة بنت القلاع لتحمي كنوزها — ونحن نبني بنفس الرسوخ مستقبل أبنائكم",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "علم وأصالة من أجل مستقبل كل طفل بحريني."
    }
  },

  // BRAZIL
  BR: {
    pt: {
      heroImage: "/assets/img/regions/BR/pt/hero.png",
      heroQuote: "O Cristo Redentor abre os braços para toda a cidade sem exceção — nossa ambição é a mesma: acolher cada criança exatamente como ela é",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "A energia do Brasil unida à inovação educacional para o futuro do seu filho."
    }
  },

  // BELARUS
  BY: {
    be: {
      heroImage: "/assets/img/regions/BY/ru/hero.png",
      heroQuote: "Васілёк расце вольна на палях — ваша дзіця таксама расквітнее, калі яму даць прастору для развіцця",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Навука і інавацыі для гарманічнага развіцця кожнага беларускага дзіцяці."
    },
    ru: {
      heroImage: "/assets/img/regions/BY/ru/hero.png",
      heroQuote: "Василек растет свободно в полях — ваш ребенок тоже расцветет, если дать ему пространство для развития",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Наука и инновации для гармоничного развития каждого белорусского ребенка."
    }
  },

  // CANADA
  CA: {
    en: {
      heroImage: "/assets/img/regions/CA/en/hero.png",
      heroQuote: "Some lessons have no classroom. Some classrooms have no ceiling.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Science and open-mindedness for every Canadian child's limitless potential."
    },
    fr: {
      heroImage: "/assets/img/regions/CA/fr/hero.png",
      heroQuote: "Certaines leçons n'ont pas de salle de classe. Certaines salles de classe n'ont pas de plafond.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "La science et l'ouverture d'esprit pour le potentiel illimité de chaque enfant canadien."
    }
  },

  // SWITZERLAND
  CH: {
    de: {
      heroImage: "/assets/img/regions/CH/de/hero.png",
      heroQuote: "Das Edelweiss wächst nur in der Höhe, wo die Luft rein ist — Exzellenz verlangt dasselbe: jemanden, der den Weg kennt.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Schweizer Präzision und Innovation für die Bildung jedes Kindes."
    },
    fr: {
      heroImage: "/assets/img/regions/CH/fr/hero.png",
      heroQuote: "L'edelweiss ne pousse qu'en altitude, là où l'air est pur — l'excellence exige la même chose : quelqu'un qui connaît le chemin.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Précision suisse et innovation pour l'éducation de chaque enfant."
    },
    it: {
      heroImage: "/assets/img/regions/CH/it/hero.png",
      heroQuote: "La stella alpina cresce solo in quota, dove l'aria è pura — l'eccellenza esige lo stesso: qualcuno che conosce la via.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Precisione e innovazione svizzere per l'educazione di ogni bambino."
    }
  },

  // CHILE
  CL: {
    es: {
      heroImage: "/assets/img/regions/CL/es/hero.png",
      heroQuote: "Los moáis de Rapa Nui llevan siglos mirando hacia el horizonte — al igual que nosotros, que siempre tenemos los ojos puestos en el futuro de tu hijo",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "De los Andes a la excelencia: innovación pedagógica para el futuro de cada niño chileno."
    }
  },

  // SOUTH AFRICA
  ZA: {
    en: {
      heroImage: "/assets/img/regions/ZA/en/hero.png",
      heroQuote: "Where two oceans meet, something unique is born — just like children who are given the right attention.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovative education for the limitless potential of every South African child."
    },
    zu: {
      heroImage: "/assets/img/regions/ZA/en/hero.png",
      heroQuote: "Lapho izizwe ezimbili zezilwandle zihlangana, kukhiqizeka into ekhethekile — njengezingane ezinikezwa ukunakwa okufanelekile.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Imfundo entsha yamandla angenamkhawulo wayo yonke ingane yaseNingizimu Afrika."
    },
    xh: {
      heroImage: "/assets/img/regions/ZA/en/hero.png",
      heroQuote: "Apho iilwandle ezimbini zidibana khona, kuzalwa into ekhethekileyo — njengabantwana abakhathalelwe ngokufanelekileyo.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Imfundo entsha yobuchule obungenamida kuwo wonke umntwana waseMzantsi Afrika."
    },
    af: {
      heroImage: "/assets/img/regions/ZA/en/hero.png",
      heroQuote: "Die Brug van Uitnemendheid is oop — ontketen die genie van u kind.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Wetenskap en innovasie vir die toekoms van elke Suid-Afrikaanse kind."
    }
  },

  // CHINA
  CN: {
    zh: {
      heroImage: "/assets/img/regions/CN/zh/hero.png",
      heroQuote: "中国龙集力量、智慧与优雅于一身——这三种品质，我们用心在每个孩子身上培育。",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "科学与创新的力量，点亮每个中国孩子的未来。"
    }
  },

  // COLOMBIA
  CO: {
    es: {
      heroImage: "/assets/img/regions/CO/es/hero.png",
      heroQuote: "Cartagena brilla con mil colores porque muchas manos la construyeron — tu hijo también florece con la diversidad de miradas que lo cuidan",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Pasión e innovación para el florecimiento de cada niño colombiano."
    }
  },

  // CZECH REPUBLIC
  CZ: {
    cs: {
      heroImage: "/assets/img/regions/CZ/cs/hero.png",
      heroQuote: "Praha se odhaluje těm, kteří vstávají dříve než ostatní — a tak je to i s nejrozvinutějšími dětmi.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Inovace a tradice pro budoucnost každého českého dítěte."
    }
  },

  // DENMARK
  DK: {
    da: {
      heroImage: "/assets/img/regions/DK/da/hero.png",
      heroQuote: "Danskerne har gjort hverdagsglæden til en form for ekspertise — vi dyrker den samme omsorg for hvert barns trivsel",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Dansk innovation og trivsel for hvert barns fremtid."
    }
  },

  // EGYPT
  EG: {
    ar: {
      heroImage: "/assets/img/regions/EG/ar/hero.png",
      heroQuote: "لبناء هرم احتاجوا ملايين الأحجار — لبناء عبقري واحد تكفي رعاية واحدة صادقة",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل مصري."
    }
  },

  // FINLAND
  FI: {
    fi: {
      heroImage: "/assets/img/regions/FI/fi/hero.png",
      heroQuote: "Suomalainen sisu on hiljainen voima, joka ei koskaan antaudu — me annamme sen jokaiselle lapselle oppimisen kautta.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Suomalainen innovaatio ja sisu jokaisen lapsen tulevaisuudelle."
    },
    sv: {
      heroImage: "/assets/img/regions/FI/fi/hero.png",
      heroQuote: "Den svenska midnattssolen bevisar att ljuset finns även där vi minst anar det — vi söker det ljuset i varje barn.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovativ utbildning för den gränslösa potentialen hos varje finskt barn."
    }
  },

  // UNITED KINGDOM
  GB: {
    en: {
      heroImage: "/assets/img/regions/GB/en/hero.png",
      heroQuote: "Big Ben has struck the hour with absolute precision for generations — our commitment to your child is made of the very same substance",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "British excellence and precision for every child's future."
    },
    fr: {
      heroImage: "/assets/img/regions/GB/fr/hero.png",
      heroQuote: "Big Ben sonne l'heure avec une précision absolue depuis des générations — notre engagement envers votre enfant est fait de la même substance.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "L'excellence et la précision britanniques pour l'avenir de chaque enfant."
    },
    ar: {
      heroImage: "/assets/img/regions/GB/ar/hero.png",
      heroQuote: "دقّت ساعة بيغ بن بدقة متناهية لأجيال متعاقبة — والتزامنا تجاه طفلك ينبع من الجودة والحرص ذاتهما.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "التميز والدقة البريطانية من أجل مستقبل كل طفل."
    }
  },

  // GREECE
  GR: {
    el: {
      heroImage: "/assets/img/regions/GR/el/hero.png",
      heroQuote: "Οι Έλληνες εφηύραν τη φιλοσοφία περπατώντας — σε εμάς, κάθε ερώτηση ενός παιδιού είναι η αρχή μιας μεγάλης σκέψης.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Ελληνική καινοτομία και σοφία για το μέλλον κάθε παιδιού."
    }
  },

  // HUNGARY
  HU: {
    hu: {
      heroImage: "/assets/img/regions/HU/hu/hero.png",
      heroQuote: "A budapesti Parlament tökéletesen tükröződik a Dunában — módszereink átláthatósága ugyanígy tükröződik gyermeke fejlődésében",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Magyar innováció and átláthatóság minden gyermek jövőjéért."
    }
  },

  // INDONESIA
  ID: {
    id: {
      heroImage: "/assets/img/regions/ID/id/hero.png",
      heroQuote: "Terasering Jatiluwih diukir dengan sabar di lereng gunung — anak yang berkembang sepenuhnya juga adalah mahakarya dari sebuah kesabaran yang indah.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Inovasi pendidikan untuk masa depan cemerlang setiap anak Indonesia."
    }
  },

  // IRELAND
  IE: {
    en: {
      heroImage: "/assets/img/regions/IE/en/hero.png",
      heroQuote: "The Irish survived history's fiercest storms through words and songs — nothing withstands a child armed with knowledge",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "The power of knowledge and Irish resilience for every child's future."
    },
    ga: {
      heroImage: "/assets/img/regions/IE/en/hero.png",
      heroQuote: "Tá Droichead an Fheabhais oscailte — scaoil saor buanna do pháiste.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Eolaíocht agus nuálaíocht do gach páiste in Éirinn."
    }
  },

  // INDIA
  IN: {
    hi: {
      heroImage: "/assets/img/regions/IN/hi/hero.png",
      heroQuote: "ताज महल प्रेम और उत्कृष्टता से बना — हमारी रचनाएँ भी इन्हीं दोनों शक्तियों से प्रेरित हैं।",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "विज्ञान और प्रेम के साथ हर भारतीय बच्चे के उज्ज्वल भविष्य की ओर।"
    },
    en: {
      heroImage: "/assets/img/regions/IN/en/hero.png",
      heroQuote: "The Taj Mahal was built with love and excellence — our creations are also inspired by these two powers.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Leading every Indian child towards a bright future with science and love."
    }
  },

  // IRAQ
  IQ: {
    ar: {
      heroImage: "/assets/img/regions/IQ/ar/hero.png",
      heroQuote: "بين نهرين وُلدت الكتابة — وبين يديكم يولد مستقبل طفلكم.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل عراقي."
    },
    ku: {
      heroImage: "/assets/img/regions/IQ/ar/hero.png",
      heroQuote: "Pira Serkeftinê vekirî ye — her zarokek xwedî hunerek e.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Zanist û nûjenî ji bo pêşeroja her zarokekî Kurd."
    }
  },

  // ITALY
  IT: {
    it: {
      heroImage: "/assets/img/regions/IT/it/hero.png",
      heroQuote: "Roma non fu costruita in un giorno — e nemmeno un bambino che fiorisce pienamente. Noi lavoriamo nel tempo lungo, quello che conta davvero",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "La scienza e l'innovazione al servizio del futuro di ogni bambino italiano."
    }
  },

  // JAPAN
  JP: {
    ja: {
      heroImage: "/assets/img/regions/JP/ja/hero.png",
      heroQuote: "日本人は儚いものの中に美の哲学を見出した——私たちもまた、お子様の成長の一瞬一瞬を大切にしています。",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "日本独自の感性と最新テクノロジーを融合し、お子様の未来を拓きます。"
    }
  },

  // SOUTH KOREA
  KR: {
    ko: {
      heroImage: "/assets/img/regions/KR/ko/hero.png",
      heroQuote: "한국은 많은 이들이 실패한 곳에서 성공했습니다: 과거를 존중하면서 미래를 창조하는 것 — 우리도 그 같은 균형 위를 걷습니다",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "전통과 첨단 기술의 조화로 우리 아이들의 잠재력을 깨웁니다."
    }
  },

  // KUWAIT
  KW: {
    ar: {
      heroImage: "/assets/img/regions/KW/ar/hero.png",
      heroQuote: "حيث يرى غيره أفقًا، نرى نحن نقطة انطلاق — تلك هي بداية عبقرية طفلك",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل كويتي."
    }
  },

  // LEBANON
  LB: {
    ar: {
      heroImage: "/assets/img/regions/LB/ar/hero.png",
      heroQuote: "ألفا عام من الأعمدة الشامخة — ونفس الصمود في كل وعد نقطعه لطفلك.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل لبناني."
    },
    fr: {
      heroImage: "/assets/img/regions/LB/fr/hero.png",
      heroQuote: "Deux mille ans de colonnes majestueuses — et la même résilience dans chaque promesse faite à votre enfant.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "L'excellence académique au service du talent libanais."
    }
  },

  // LIBYA
  LY: {
    ar: {
      heroImage: "/assets/img/regions/LY/ar/hero.png",
      heroQuote: "أعمدة لبدة الكبرى صمدت لقرون أمام العواصف — وجودة ما نصنعه لأبنائكم هي من المعدن ذاته",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل ليبي."
    }
  },

  // MEXICO
  MX: {
    es: {
      heroImage: "/assets/img/regions/MX/es/hero.png",
      heroQuote: "En México se honra a los que partieron para celebrar mejor a quienes quedan — nosotros llevamos esa misma mirada de gratitud hacia cada niño que nos es confiado",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovación y pasión para el futuro de cada niño mexicano."
    }
  },

  // NETHERLANDS
  NL: {
    nl: {
      heroImage: "/assets/img/regions/NL/nl/hero.png",
      heroQuote: "De Nederlanders bouwden kassen zodat bloemen in elk seizoen konden bloeien — wij doen hetzelfde voor uw kinderen",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Nederlandse innovatie voor de ontplooiing van het potentieel van elk kind."
    }
  },

  // MALAYSIA
  MY: {
    ms: {
      heroImage: "/assets/img/regions/MY/ms/hero.png",
      heroQuote: "Menara Petronas dihubungkan di puncak oleh jambatan yang tidak kelihatan dari bawah — seperti ikatan yang kami jalin antara potensi anak anda dengan pencapaiannya",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Inovasi pendidikan untuk masa depan cemerlang setiap anak Malaysia."
    }
  },

  // TURKEY
  TR: {
    tr: {
      heroImage: "/assets/img/regions/TR/tr/hero.png",
      heroQuote: "İstanbul iki kıtaya yayılıyor ve ikisi arasında seçim yapmıyor — senin çocuğun da kökleri ile hayalleri arasında seçim yapmak zorunda değil.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Her Türk çocuğunun sınırsız potansiyeli için yenilikçi eğitim."
    }
  },

  // NORWAY
  NO: {
    no: {
      heroImage: "/assets/img/regions/NO/no/hero.png",
      heroQuote: "Vikingene navigerte uten GPS med presisjonen til en indre vitenskap — vi utvikler den samme intelligensen i hvert barn.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Norsk innovasjon for å utvikle potensialet til hvert barn."
    }
  },

  // NEW ZEALAND
  NZ: {
    en: {
      heroImage: "/assets/img/regions/NZ/en/hero.png",
      heroQuote: "The koru is a symbol of growth and nurturing — a perfect image for a child ready to spread their own skills",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovative education for the limitless potential of every New Zealand child."
    },
    mi: {
      heroImage: "/assets/img/regions/NZ/mi/hero.png",
      heroQuote: "Ko te koru he tohu o te tipu me te whakatipu — he whakaahua tino tika mō te tamaiti kei te rite ana ki te hora i ōna ake pūkenga",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "He auahatanga mātauranga mō te pūmanawa mutunga kore o ia tamaiti o Aotearoa."
    }
  },

  // OMAN
  OM: {
    ar: {
      heroImage: "/assets/img/regions/OM/ar/hero.png",
      heroQuote: "قلاع عُمان بُنيت لتحمي ما له قيمة — ونحن نحرس بنفس الدقة مستقبل طفلك.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل عماني."
    }
  },

  // PERU
  PE: {
    es: {
      heroImage: "/assets/img/regions/PE/es/hero.png",
      heroQuote: "Machu Picchu fue erigido sin mortero ni clavos — solo la precisión unió esas piedras, igual que nuestros métodos unen los aprendizajes de tu hijo",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovación y tradición para el futuro de cada niño peruano."
    }
  },

  // POLAND
  PL: {
    pl: {
      heroImage: "/assets/img/regions/PL/pl/hero.png",
      heroQuote: "Polska odbudowała swój zamek z popiołów — to samo wytrwanie szczepimy w każde dziecko, które nam powierzasz",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innowacyjna edukacja dla nieograniczonego potencjału każdego polskiego dziecka."
    }
  },

  // PORTUGAL
  PT: {
    pt: {
      heroImage: "/assets/img/regions/PT/pt/hero.png",
      heroQuote: "Os azulejos portugueses contam histórias que desafiam os séculos — cada criança merece uma história igualmente duradoura.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Inovação educativa para o potencial ilimitado de cada criança portuguesa."
    }
  },

  // ANGOLA
  AO: {
    pt: {
      heroImage: "/assets/img/regions/AO/pt/hero.png",
      heroQuote: "As raízes mais profundas sustentam as copas mais altas — cuidamos do que cresce dentro do seu filho",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Inovação educativa para o futuro de cada criança angolana."
    }
  },

  // ARGENTINA
  AR: {
    es: {
      heroImage: "/assets/img/regions/AR/es/hero.png",
      heroQuote: "El tango no improvisa — exige técnica perfecta para parecer espontáneo. Nosotros también dominamos cada detalle para que todo parezca natural.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovación y pasión para el futuro de cada niño argentino."
    }
  },

  // QATAR
  QA: {
    ar: {
      heroImage: "/assets/img/regions/QA/ar/hero.png",
      heroQuote: "يستشعر الصقّار الريح قبل انطلاق الصقر — وكذلك نحن، نستبق كل خطوة في رحلة طفلك",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل قطري."
    }
  },

  // JORDAN
  JO: {
    ar: {
      heroImage: "/assets/img/regions/JO/ar/hero.png",
      heroQuote: "تشمخ جبال البتراء الشاهدة على عظمة الأجداد — ونحن نصنع لجيل الغد همماً تعانق السحاب.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والريادة لمستقبل كل طفل أردني."
    }
  },

  // ROMANIA
  RO: {
    ro: {
      heroImage: "/assets/img/regions/RO/ro/hero.png",
      heroQuote: "Poveștile din Transilvania ne-au învățat că în spatele fiecărei frici se ascunde o comoară — iar cea mai mare comoară este întotdeauna copilul.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Inovație și tradiție pentru viitorul fiecărui copil român."
    }
  },

  // RUSSIA
  RU: {
    ru: {
      heroImage: "/assets/img/regions/RU/ru/hero.png",
      heroQuote: "Храм Василия Блаженного бросает вызов всем традициям и стоит уже столетиями — неповторимость ребёнка тоже является его главной силой.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Инновации и традиции для будущего каждого российского ребенка."
    }
  },

  // SUDAN
  SD: {
    ar: {
      heroImage: "/assets/img/regions/SD/ar/hero.png",
      heroQuote: "أهرامات مروي تُثبت أن العظمة لا تحتاج أن تكون في المركز — بل تحتاج أن تكون متقنة.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل سوداني."
    }
  },

  // SWEDEN
  SE: {
    sv: {
      heroImage: "/assets/img/regions/SE/sv/hero.png",
      heroQuote: "Den svenska midnattssolen bevisar att ljuset finns även där vi minst anar det — vi söker det ljuset i varje barn.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovativ utbildning för den gränslösa potentialen hos varje svenskt barn."
    }
  },

  // SINGAPORE — hero par langue (public/assets/img/regions/SG/{en|zh|ms|ta}/hero.png)
  SG: {
    en: {
      heroImage: "/assets/img/regions/SG/ms/hero.png",
      heroQuote: "Singapore proved that with will and rigour, even an island without resources becomes a global beacon — your child holds the same potential.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovative education for the limitless potential of every Singaporean child."
    },
    zh: {
      heroImage: "/assets/img/regions/SG/zh/hero.png",
      heroQuote: "新加坡证明了，凭借意志和严谨，即使是一个没有资源的岛屿也能成为全球的灯塔——您的孩子也拥有同样的潜力。",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "为每个新加坡孩子的无限潜力提供创新教育。"
    },
    ms: {
      heroImage: "/assets/img/regions/SG/ms/hero.png",
      heroQuote: "Singapura membuktikan bahawa dengan kehendak dan ketelitian, walaupun sebuah pulau tanpa sumber boleh menjadi suar global — anak anda memegang potensi yang sama.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Pendidikan inovatif untuk potensi tanpa had setiap kanak-kanak Singapura."
    },
    ta: {
      heroImage: "/assets/img/regions/SG/ta/hero.png",
      heroQuote: "சிங்கப்பூர் நிரூபித்தது, விருப்பம் மற்றும் கண்டிப்புடன், வளங்கள் இல்லாத தீவு கூட உலகளாவிய கலங்கரை விளக்கமாக மாறும் — உங்கள் குழந்தையும் அதே திறனைப் பெற்றுள்ளார்.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "ஒவ்வொரு சிங்கப்பூர் குழந்தையின் எல்லையற்ற திறனுக்கும் புதுமையான கல்வி."
    }
  },

  // SYRIA
  SY: {
    ar: {
      heroImage: "/assets/img/regions/SY/ar/hero.png",
      heroQuote: "تدمر أُسقطت لكنها لم تُنسَ أبدًا — وذاكرة الأطفال هي الوحيدة التي لا تُهزَم.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل سوري."
    }
  },

  // THAILAND
  TH: {
    th: {
      heroImage: "/assets/img/regions/TH/th/hero.png",
      heroQuote: "ชิ้นส่วนกระจกนับพันชิ้นประกอบกันเป็นความงามของวัดมรกต — ทุกประสบการณ์ของเด็กคือเศษแก้วที่ประกอบขึ้นเป็นตัวตนของเขา",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "นวัตกรรมทางการศึกษาเพื่ออนาคตของเด็กไทยทุกคน"
    }
  },

  // TAIWAN
  TW: {
    zh: {
      heroImage: "/assets/img/regions/TW/zh/hero.png",
      heroQuote: "蓮花從淤泥中生長，卻開得純潔無瑕——同樣的煉金術，將孩子所面臨的挑戰轉化為內在的力量。",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "為每個台灣孩子的無限潛力提供創新教育。"
    }
  },

  // UKRAINE
  UA: {
    uk: {
      heroImage: "/assets/img/regions/UA/uk/hero.png",
      heroQuote: "Соняшник завжди тягнеться до світла, навіть у найтемніші дні — ваші діти теж заслуговують на цю незмінність.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Інноваційна освіта для безмежного потенціалу кожної української дитини."
    }
  },

  // USA
  US: {
    en: {
      heroImage: "/assets/img/regions/US/en/hero.png",
      heroQuote: "Liberty is not a destination — it is a space built every single day. We build that space for every child",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Innovative education for the limitless potential of every American child."
    }
  },

  // VIETNAM
  VN: {
    vi: {
      heroImage: "/assets/img/regions/VN/vi/hero.png",
      heroQuote: "Những thửa ruộng bậc thang ở Việt Nam được bàn tay con người tạo ra qua nhiều thế hệ — sự kiên nhẫn đó cũng là trái tim của mọi việc chúng tôi làm.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Giáo dục đổi mới cho tiềm năng vô hạn của mọi trẻ em Việt Nam."
    }
  },

  // YEMEN
  YE: {
    ar: {
      heroImage: "/assets/img/regions/YE/ar/hero.png",
      heroQuote: "أبراج صنعاء تتحدّى الجاذبية منذ قرون — وطموح طفل تحت الرعاية الصحيحة يتحدّى هو الآخر كل الحدود.",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "العلم والابتكار من أجل مستقبل كل طفل يمني."
    }
  },

  // AUSTRIA
  AT: {
    de: {
      heroImage: "/assets/img/regions/AT/de/hero.png",
      heroQuote: "In den Kaiserpalästen lernte man: Exzellenz ist eine Gewohnheit, kein Zufall — das gilt für uns genauso",
      scienceImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      scienceQuote: "Österreichische Tradition und moderne Wissenschaft für die Entfaltung des Potenzials jedes Kindes."
    }
  }
};

export function getVariant(country: string, lang: string): RegionVariant {
  const countryData = REGION_VARIANTS[country] || REGION_VARIANTS.default;
  
  if (typeof countryData === 'object' && !('heroImage' in countryData)) {
    // Extract base language (e.g. 'fr' from 'fr-CA')
    const baseLang = lang.split('-')[0];
    
    // Try exact match first
    if ((countryData as Record<string, RegionVariant>)[lang]) {
      return (countryData as Record<string, RegionVariant>)[lang];
    }
    
    // Try base language
    if ((countryData as Record<string, RegionVariant>)[baseLang]) {
      return (countryData as Record<string, RegionVariant>)[baseLang];
    }
    
    // Fallback à la première langue disponible pour ce pays
    const firstLang = Object.keys(countryData)[0];
    return (countryData as Record<string, RegionVariant>)[firstLang];
  }
  
  return countryData as RegionVariant;
}
