/** Libellés FR/AR pour les types d'activités interactives (hub H5P). */
export type H5pTypeLabel = {
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
};

export const H5P_TYPE_LABELS: Record<string, H5pTypeLabel> = {
  "H5P.Accordion": {
    titleFr: "Accordéon",
    titleAr: "أكورديون",
    descriptionFr: "Sections repliables pour présenter du contenu par étapes.",
    descriptionAr: "أقسام قابلة للطي لعرض المحتوى على مراحل.",
  },
  "H5P.ArithmeticQuiz": {
    titleFr: "Quiz de calcul",
    titleAr: "اختبار حساب",
    descriptionFr: "Exercices de calcul chronométrés.",
    descriptionAr: "تمارين حسابية مؤقتة.",
  },
  "H5P.Chart": {
    titleFr: "Graphique",
    titleAr: "مخطط",
    descriptionFr: "Diagrammes en barres ou circulaires à partir de vos données.",
    descriptionAr: "مخططات شريطية أو دائرية من بياناتك.",
  },
  "H5P.Collage": {
    titleFr: "Collage",
    titleAr: "كولاج",
    descriptionFr: "Assemblez plusieurs images en une composition.",
    descriptionAr: "اجمع عدة صور في تكوين واحد.",
  },
  "H5P.Column": {
    titleFr: "Page composite",
    titleAr: "صفحة مركّبة",
    descriptionFr: "Organisez plusieurs activités sur une même page.",
    descriptionAr: "نظّم عدة أنشطة في صفحة واحدة.",
  },
  "H5P.CoursePresentation": {
    titleFr: "Présentation de cours",
    titleAr: "عرض تقديمي",
    descriptionFr: "Diapositives interactives avec questions intégrées.",
    descriptionAr: "شرائح تفاعلية مع أسئلة مدمجة.",
  },
  "H5P.Dialogcards": {
    titleFr: "Cartes dialoguées",
    titleAr: "بطاقات حوار",
    descriptionFr: "Cartes retournables pour vocabulaire ou dialogues.",
    descriptionAr: "بطاقات قابلة للقلب للمفردات أو الحوار.",
  },
  "H5P.DocumentationTool": {
    titleFr: "Outil de documentation",
    titleAr: "أداة توثيق",
    descriptionFr: "Assistant pas à pas avec export texte.",
    descriptionAr: "معالج خطوة بخطوة مع تصدير نصي.",
  },
  "H5P.DragQuestion": {
    titleFr: "Glisser-déposer",
    titleAr: "سحب وإفلات",
    descriptionFr: "Associer des éléments à des zones sur une image.",
    descriptionAr: "اربط عناصر بمناطق على صورة.",
  },
  "H5P.DragText": {
    titleFr: "Glisser les mots",
    titleAr: "اسحب الكلمات",
    descriptionFr: "Replacer des mots dans une phrase par glisser-déposer.",
    descriptionAr: "أعد وضع كلمات في جملة بالسحب والإفلات.",
  },
  "H5P.Blanks": {
    titleFr: "Texte à trous",
    titleAr: "نص بفراغات",
    descriptionFr: "Compléter un texte avec les mots manquants.",
    descriptionAr: "أكمل نصاً بالكلمات الناقصة.",
  },
  "H5P.ImageHotspotQuestion": {
    titleFr: "Trouver la zone",
    titleAr: "اعثر على المنطقة",
    descriptionFr: "Cliquer sur la bonne zone d'une image.",
    descriptionAr: "انقر على المنطقة الصحيحة في صورة.",
  },
  "H5P.GuessTheAnswer": {
    titleFr: "Deviner la réponse",
    titleAr: "خمّن الإجابة",
    descriptionFr: "Image avec question puis révélation de la solution.",
    descriptionAr: "صورة مع سؤال ثم كشف الحل.",
  },
  "H5P.IFrameEmbed": {
    titleFr: "Intégration web",
    titleAr: "تضمين ويب",
    descriptionFr: "Intégrer une page ou ressource externe.",
    descriptionAr: "ضمّن صفحة أو مورداً خارجياً.",
  },
  "H5P.InteractiveVideo": {
    titleFr: "Vidéo interactive",
    titleAr: "فيديو تفاعلي",
    descriptionFr: "Vidéo enrichie de questions et repères.",
    descriptionAr: "فيديو مع أسئلة وعلامات تفاعلية.",
  },
  "H5P.MarkTheWords": {
    titleFr: "Surligner les mots",
    titleAr: "حدّد الكلمات",
    descriptionFr: "Repérer les bons mots dans un texte.",
    descriptionAr: "حدّد الكلمات الصحيحة في نص.",
  },
  "H5P.MemoryGame": {
    titleFr: "Jeu de mémoire",
    titleAr: "لعبة الذاكرة",
    descriptionFr: "Retrouver les paires d'images identiques.",
    descriptionAr: "اعثر على أزواج الصور المتطابقة.",
  },
  "H5P.MultiChoice": {
    titleFr: "Choix multiple",
    titleAr: "اختيار متعدد",
    descriptionFr: "Question à réponses multiples configurables.",
    descriptionAr: "سؤال بإجابات متعددة قابلة للتخصيص.",
  },
  "H5P.PersonalityQuiz": {
    titleFr: "Quiz de personnalité",
    titleAr: "اختبار شخصية",
    descriptionFr: "Questionnaire aboutissant à un profil ou résultat.",
    descriptionAr: "استبيان يؤدي إلى ملف أو نتيجة.",
  },
  "H5P.Questionnaire": {
    titleFr: "Questionnaire",
    titleAr: "استبيان",
    descriptionFr: "Recueillir des avis ou retours structurés.",
    descriptionAr: "اجمع آراء أو ملاحظات منظمة.",
  },
  "H5P.QuestionSet": {
    titleFr: "Série de questions",
    titleAr: "مجموعة أسئلة",
    descriptionFr: "Enchaîner quiz, QCM et vrai/faux dans une évaluation.",
    descriptionAr: "سلسلة من الاختبارات وQCM وصح/خطأ.",
  },
  "H5P.SingleChoiceSet": {
    titleFr: "Choix unique",
    titleAr: "اختيار واحد",
    descriptionFr: "Série de questions à une seule bonne réponse.",
    descriptionAr: "سلسلة أسئلة بإجابة صحيحة واحدة.",
  },
  "H5P.Summary": {
    titleFr: "Résumé / classement",
    titleAr: "ملخص / تصنيف",
    descriptionFr: "Classer ou regrouper des affirmations.",
    descriptionAr: "صنّف أو جمّع العبارات.",
  },
  "H5P.Timeline": {
    titleFr: "Frise chronologique",
    titleAr: "خط زمني",
    descriptionFr: "Présenter des événements dans le temps avec médias.",
    descriptionAr: "اعرض أحداثاً زمنياً مع وسائط.",
  },
  "H5P.TrueFalse": {
    titleFr: "Vrai / Faux",
    titleAr: "صح / خطأ",
    descriptionFr: "Valider ou infirmer une affirmation.",
    descriptionAr: "صحّح أو انفِ عبارة.",
  },
  "H5P.ImageHotspots": {
    titleFr: "Points d'info sur image",
    titleAr: "نقاط معلومات على صورة",
    descriptionFr: "Zones cliquables expliquant une illustration.",
    descriptionAr: "مناطق قابلة للنقر تشرح رسمة.",
  },
  "H5P.ImageMultipleHotspotQuestion": {
    titleFr: "Trouver plusieurs zones",
    titleAr: "اعثر على عدة مناطق",
    descriptionFr: "Repérer plusieurs zones correctes sur une image.",
    descriptionAr: "حدّد عدة مناطق صحيحة على صورة.",
  },
  "H5P.ImageJuxtaposition": {
    titleFr: "Comparaison d'images",
    titleAr: "مقارنة صور",
    descriptionFr: "Comparer deux images avec un curseur interactif.",
    descriptionAr: "قارن صورتين بمؤشر تفاعلي.",
  },
  "H5P.Audio": {
    titleFr: "Audio",
    titleAr: "صوت",
    descriptionFr: "Intégrer un enregistrement audio.",
    descriptionAr: "ضمّن تسجيلاً صوتياً.",
  },
  "H5P.AudioRecorder": {
    titleFr: "Enregistreur audio",
    titleAr: "مسجّل صوت",
    descriptionFr: "Permettre à l'élève d'enregistrer sa voix.",
    descriptionAr: "اسمح للتلميذ بتسجيل صوته.",
  },
  "H5P.SpeakTheWords": {
    titleFr: "Parler les mots",
    titleAr: "انطق الكلمات",
    descriptionFr: "Répondre à voix haute (navigateur compatible).",
    descriptionAr: "أجب بصوتك (متصفح متوافق).",
  },
  "H5P.Agamotto": {
    titleFr: "Agamotto",
    titleAr: "أغامotto",
    descriptionFr: "Enchaîner images et explications en slider.",
    descriptionAr: "سلسلة صور وشروحات بمنزلق.",
  },
  "H5P.ImageSequencing": {
    titleFr: "Ordre des images",
    titleAr: "ترتيب الصور",
    descriptionFr: "Remettre des images dans le bon ordre.",
    descriptionAr: "رتّب الصور بالترتيب الصحيح.",
  },
  "H5P.Flashcards": {
    titleFr: "Flashcards",
    titleAr: "بطاقات",
    descriptionFr: "Cartes recto/verso pour mémoriser.",
    descriptionAr: "بطاقات أمام/خلف للحفظ.",
  },
  "H5P.SpeakTheWordsSet": {
    titleFr: "Série orale",
    titleAr: "سلسلة شفوية",
    descriptionFr: "Plusieurs questions à répondre à l'oral.",
    descriptionAr: "أسئلة متعددة تُجاب شفهياً.",
  },
  "H5P.ImageSlider": {
    titleFr: "Diaporama",
    titleAr: "عرض صور",
    descriptionFr: "Carrousel d'images simple.",
    descriptionAr: "عرض دوّار للصور.",
  },
  "H5P.Essay": {
    titleFr: "Rédaction",
    titleAr: "مقال",
    descriptionFr: "Production écrite avec retour automatique.",
    descriptionAr: "إنتاج كتابي مع تغذية راجعة.",
  },
  "H5P.ImagePair": {
    titleFr: "Paires d'images",
    titleAr: "أزواج صور",
    descriptionFr: "Associer des images par glisser-déposer.",
    descriptionAr: "اربط الصور بالسحب والإفلات.",
  },
  "H5P.Dictation": {
    titleFr: "Dictée",
    titleAr: "إملاء",
    descriptionFr: "Dictée avec correction instantanée.",
    descriptionAr: "إملاء مع تصحيح فوري.",
  },
  "H5P.BranchingScenario": {
    titleFr: "Scénario ramifié",
    titleAr: "سيناريو متفرع",
    descriptionFr: "Parcours avec choix et conséquences.",
    descriptionAr: "مسار بخيارات ونتائج.",
  },
  "H5P.ThreeImage": {
    titleFr: "Visite 360°",
    titleAr: "جولة 360°",
    descriptionFr: "Environnement panoramique interactif.",
    descriptionAr: "بيئة بانorama تفاعلية.",
  },
  "H5P.InteractiveBook": {
    titleFr: "Livre interactif",
    titleAr: "كتاب تفاعلي",
    descriptionFr: "Mini-cours ou chapitre avec activités intégrées.",
    descriptionAr: "دورة مصغرة أو فصل بأنشطة مدمجة.",
  },
  "H5P.KewArCode": {
    titleFr: "Code QR",
    titleAr: "رمز QR",
    descriptionFr: "Générer des QR codes pour vos ressources.",
    descriptionAr: "أنشئ رموز QR لمواردك.",
  },
  "H5P.AdventCalendar": {
    titleFr: "Calendrier de l'Avent",
    titleAr: "تقويم الم advent",
    descriptionFr: "Révéler une surprise chaque jour.",
    descriptionAr: "اكشف مفاجأة كل يوم.",
  },
  "H5P.Crossword": {
    titleFr: "Mots croisés",
    titleAr: "كلمات متقاطعة",
    descriptionFr: "Grille de mots croisés personnalisable.",
    descriptionAr: "شبكة كلمات متقاطعة قابلة للتخصيص.",
  },
  "H5P.SortParagraphs": {
    titleFr: "Ordonner les paragraphes",
    titleAr: "رتّب الفقرات",
    descriptionFr: "Remettre des paragraphes dans le bon ordre.",
    descriptionAr: "أعد ترتيب الفقرات بالشكل الصحيح.",
  },
  "H5P.MultiMediaChoice": {
    titleFr: "Choix multimédia",
    titleAr: "اختيار متعدد الوسائط",
    descriptionFr: "Réponses avec images, audio ou vidéo.",
    descriptionAr: "إجابات بصور أو صوت أو فيديو.",
  },
  "H5P.Cornell": {
    titleFr: "Notes Cornell",
    titleAr: "ملاحظات Cornell",
    descriptionFr: "Prise de notes structurée méthode Cornell.",
    descriptionAr: "تدوين ملاحظات بطريقة Cornell.",
  },
  "H5P.ARScavenger": {
    titleFr: "Chasse au trésor RA",
    titleAr: "م scavenger واقع معزز",
    descriptionFr: "Activité de découverte en réalité augmentée.",
    descriptionAr: "نشاط اكتشاف بالواقع المعزز.",
  },
  "H5P.StructureStrip": {
    titleFr: "Bandeau structuré",
    titleAr: "شريط بنيوي",
    descriptionFr: "Aider à structurer une production écrite.",
    descriptionAr: "ساعد على بناء إنتاج كتابي.",
  },
  "H5P.InfoWall": {
    titleFr: "Mur d'information",
    titleAr: "جدار معلومات",
    descriptionFr: "Panneaux filtrables par mots-clés.",
    descriptionAr: "لوحات قابلة للتصفية بالكلمات المفتاحية.",
  },
  "H5P.GameMap": {
    titleFr: "Carte de jeu",
    titleAr: "خريطة لعب",
    descriptionFr: "Parcours ludique où l'élève choisit ses exercices.",
    descriptionAr: "مسار lúdico يختار فيه التلميذ تمارينه.",
  },
  "H5P.FindTheWords": {
    titleFr: "Mots cachés",
    titleAr: "البحث عن كلمات",
    descriptionFr: "Grille de mots à trouver.",
    descriptionAr: "شبكة للعثور على كلمات.",
  },
};

export function getH5pTypeLabel(
  machineName: string,
  locale: string,
  fallbackTitle = machineName,
  fallbackDescription = ""
): { title: string; description: string } {
  const labels = H5P_TYPE_LABELS[machineName];
  const isAr = locale.endsWith("-ar") || locale === "ar";
  if (labels) {
    return {
      title: isAr ? labels.titleAr : labels.titleFr,
      description: isAr ? labels.descriptionAr : labels.descriptionFr,
    };
  }
  return { title: fallbackTitle, description: fallbackDescription };
}
