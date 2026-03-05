<!--
================================================================================
  FICHIER : freegeny_algerie_1ap_arabe_lessons_v2.md
  PROJET  : FreeGeny EdTech Platform — Contenu Pédagogique Officiel
  MODULE  : Langue Arabe + Éducation Islamique + Éducation Civique
  NIVEAU  : 1ère Année Primaire (1AP) — Système Éducatif Algérien
  VERSION : 2.0.0
  DATE    : 2026-02-28
  AUTEUR  : Équipe Contenu FreeGeny (rewritten & annotated)
  LANGUE  : Arabe (contenu) / Français (annotations techniques)

  ─────────────────────────────────────────────────────────────────────────────
  DESCRIPTION GÉNÉRALE
  ─────────────────────────────────────────────────────────────────────────────
  Ce fichier constitue le contenu source complet du module "Langue Arabe,
  Éducation Islamique et Éducation Civique" pour la 1ère Année Primaire,
  conforme au programme officiel du Ministère de l'Éducation Nationale
  algérien.

  Il est structuré pour être :
    1. Parsé par le moteur de contenu FreeGeny (JSON-LD / YAML front-matter).
    2. Rendu par le composant <LessonRenderer /> du frontend React/Next.js.
    3. Indexé par le moteur de recherche ElasticSearch interne.
    4. Compatible avec le système de suivi de progression (LRS xAPI / SCORM 2004).
    5. Importé dans le CMS headless (Strapi / Sanity) via script d'ingestion.

  ─────────────────────────────────────────────────────────────────────────────
  CONVENTIONS D'ANNOTATIONS DANS CE FICHIER
  ─────────────────────────────────────────────────────────────────────────────
  <!-- DEV_NOTE: ... -->   → Note technique pour les développeurs backend/frontend
  <!-- ASSET: ... -->      → Référence à un asset média (image, audio, vidéo, SVG)
  <!-- EXERCISE_TYPE: --> → Type d'exercice interactif pour le moteur de gamification
  <!-- BLOOM: ... -->      → Niveau taxonomique de Bloom visé
  <!-- ACCESSIBILITY: -->  → Directives d'accessibilité (WCAG 2.1 AA, ARIA)
  <!-- I18N: ... -->       → Notes d'internationalisation / localisation
  <!-- AI_HINT: ... -->    → Hints pour le moteur d'IA adaptatif FreeGeny
  <!-- DATA_MODEL: ... --> → Suggestion de modèle de données pour la DB

  ─────────────────────────────────────────────────────────────────────────────
  STRUCTURE DES DONNÉES (YAML FRONT-MATTER) — PARSÉ PAR LE CMS
  ─────────────────────────────────────────────────────────────────────────────
-->

---
# ═══════════════════════════════════════════════════════════════
# YAML FRONT-MATTER — Métadonnées machine-readable
# Parsé par : freegeny-content-ingester v3.x
# ═══════════════════════════════════════════════════════════════

freegeny_content_id: "DZ-1AP-AR-001"
# DEV_NOTE: ID unique global. Format: {pays}-{niveau}-{matière}-{numéro séquentiel}
# Utilisé comme clé primaire dans la table `content_modules` de la DB PostgreSQL.

title_ar: "كتابي في اللغة العربية و التربية الإسلامية و المدنية — السنة الأولى ابتدائي"
title_fr: "Mon Livre d'Arabe, Éducation Islamique et Civique — 1ère Année Primaire"
title_en: "Arabic Language, Islamic & Civic Education — Grade 1 Primary"

country: "DZ"            # Code ISO 3166-1 alpha-2 (Algérie)
education_level: "1AP"   # 1ère Année Primaire
subject_primary: "arabic_language"
subjects_secondary:
  - "islamic_education"
  - "civic_education"
  - "health_education"    # Éducation à la santé (محور الصحة)

curriculum_alignment: "MEN-DZ-2016"
# DEV_NOTE: Aligné sur le référentiel du Ministère de l'Éducation Nationale (MEN)
# algérien, révision 2016. Vérifier les mises à jour éventuelles sur le portail
# officiel : https://www.education.gov.dz

language_of_instruction: "ar"   # BCP-47 : Arabe standard
text_direction: "rtl"           # Right-to-Left — CRITIQUE pour le CSS/Layout
font_recommendation: "Noto Naskh Arabic, Amiri, Cairo"
# DEV_NOTE: Ces polices sont open-source et supportent le texte arabe vocalisé
# (harakat). Privilégier Amiri pour les PDF imprimables (look académique).
# Cairo convient mieux pour l'interface web (lisibilité écran).

age_range:
  min: 5
  max: 7
  typical: 6

total_units: 5         # 5 محاور (axes thématiques)
total_lessons: 18      # 18 دروس
estimated_hours: 54    # ~3h par leçon (incluant activités et révisions)

difficulty_progression: "linear"
# DEV_NOTE: La progression est strictement linéaire. Les leçons DOIVENT être
# complétées dans l'ordre. Implémenter le verrouillage séquentiel dans le
# composant <CourseNavigator />.

prerequisites: []
# DEV_NOTE: Aucun prérequis formel. Le module est conçu pour des apprenants
# non-lecteurs. Le parcours commence ab initio.

gamification:
  xp_per_lesson: 100
  badge_per_unit: true
  streak_bonus: true
  leaderboard_enabled: false   # Désactivé pour les moins de 7 ans (bienveillance pédagogique)

accessibility:
  screen_reader_compatible: true
  audio_narration_required: true   # OBLIGATOIRE : tous les textes doivent avoir un audio
  high_contrast_mode: true
  font_size_adjustable: true
  wcag_level: "AA"

last_reviewed: "2026-02-28"
review_cycle: "annual"
content_status: "production_ready"

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  SECTION : EN-TÊTE DU LIVRE (Affiché sur la page d'accueil du module)
  DEV_NOTE: Rendu par le composant <ModuleHero /> avec animation d'entrée.
  ASSET: hero_image → /assets/images/modules/DZ-1AP-AR-001/hero.svg
         (Illustration : enfants algériens avec livres, palette de couleurs
          vives, style flat design. Inclure drapeaux DZ et étoiles.)
  ═══════════════════════════════════════════════════════════════════════════ -->

# بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

<!-- DEV_NOTE: La Basmala est affichée en grand, stylisée en calligraphie
  (voir composant <Basmala />). Elle s'affiche systématiquement sur la page
  d'accueil du module et sur chaque leçon. Ne pas omettre.
  ACCESSIBILITY: Ajouter aria-label="بسم الله الرحمن الرحيم" -->

---

## مرحباً يا أبطال المستقبل! 👋

هذا الكتاب هو صديقك في رحلتك المدرسية الرائعة. ستجد فيه:

- **دروساً ممتعة** في اللغة العربية الجميلة.
- **قصصاً مضيئة** من القرآن الكريم و أحاديث النبي ﷺ.
- **قيماً نبيلة** في التربية الإسلامية و المدنية.
- **معلومات مفيدة** عن وطننا العزيز الجزائر 🇩🇿.

هيا بنا نبدأ هذه المغامرة الرائعة! 🚀

<!-- DEV_NOTE: Le texte d'accueil doit être accompagné d'une narration audio.
  ASSET: audio → /assets/audio/DZ-1AP-AR-001/intro_welcome.mp3
  Durée recommandée : 20-30 secondes. Voix : enfant de 6-7 ans (local algérien).
  AI_HINT: Ce texte peut servir de "hook" motivationnel. Le moteur adaptatif
  peut le personnaliser avec le prénom de l'élève : "مرحباً يا {student.firstName}". -->

---

## 📋 جدول المحتويات

<!-- DEV_NOTE: Ce tableau est rendu comme une <TableOfContents /> interactive.
  Chaque ligne est cliquable et navigue vers la leçon correspondante.
  Les leçons verrouillées affichent une icône 🔒.
  La progression est visualisée par une barre de completion par unité.
  DATA_MODEL: Lier à la table `student_progress` via `content_id` + `student_id`. -->

| المحور | الموضوع | الدروس |
|--------|---------|--------|
| 🏠 **المحور الأول** | عائلتي | الدروس 1 → 6 |
| 🏘️ **المحور الثاني** | الحي و القرية | الدروس 7 → 9 |
| ⚽ **المحور الثالث** | الرياضة و التسلية | الدروس 10 → 12 |
| 🌿 **المحور الرابع** | البيئة و الطبيعة | الدروس 13 → 15 |
| 🍎 **المحور الخامس** | الصحة و التغذية | الدروس 16 → 18 |

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  UNITÉ 1 : عائلتي (Ma Famille)
  DEV_NOTE: Composant d'en-tête d'unité : <UnitHeader unit_id="U1" />
  Afficher une illustration de famille algérienne typique.
  ASSET: unit_banner → /assets/images/units/U1_family_banner.svg
  Badge de complétion d'unité : 🏆 "فارس العائلة" (Chevalier de la Famille)
  ═══════════════════════════════════════════════════════════════════════════ -->

# 📖 المحور الأول: عائلتي

---

## الدرس 1: أهلاً و سهلاً

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L01"
  Durée estimée : 45 minutes (en classe) / 30 minutes (en autonomie sur app).
  Composant de rendu : <LessonPage lesson_id="DZ-1AP-AR-L01" />
  Prérequis : aucun (premier cours). is_locked = false par défaut.
  XP attribués à la complétion : 100 points. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual)
     DEV_NOTE: This block is rendered as a 'sticky' or collapsible card for parents.
     It provides a quick high-level view of the pedagogical goal and home follow-up. -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** تعريف الطفل بشخصيات الكتاب (أحمد وخديجة) وتقديم أول حرفين (أ، ب).
> **Objectif :** Faire découvrir les mascottes (Ahmed et Khadija) et introduire les lettres Alif (أ) et Ba (ب).
> 
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - اطلب من طفلك أن يقدم نفسه باستخدام "أنا..." (مثال: أنا ياسمين).
> - ابحثوا في المطبخ عن أشياء تبدأ بحرف الباء (بـ... بطاطا، بـ... بصل).
> - Demandez à votre enfant de se présenter en disant "Ana..." (Moi...).
> - Cherchez des objets commençant par 'B' (Banane, Bol, etc.).
>
> **⚠️ تنبيه | Attention :**
> - تأكد أن طفلك ينطق حرف الألف (أ) بوضوح دون إطالة زائدة.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable)
     DEV_NOTE: High-end visual summary card. Large fonts, clear icons.
     Renders as <ChildSuccessCard /> upon lesson completion. -->

<div align="center" style="background-color: #f0f9ff; padding: 20px; border-radius: 15px; border: 2px solid #007bff;">
  <h2 style="color: #007bff;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L01/summary_card.svg" alt="أ، ب" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #d32f2f;">أ &nbsp;&nbsp; ب</p>
  <p style="font-size: 20px;"><b>كلمة اليوم:</b> بـَــاب 🚪</p>
</div>

---

### 🎯 أهداف الدرس

<!-- DEV_NOTE: Rendu par <LearningObjectives /> avec icônes. Chaque objectif
  est trackable individuellement via xAPI (verb: "mastered").
  BLOOM: Niveaux 1 (Mémorisation) et 2 (Compréhension). -->

بنهاية هذا الدرس، سيكون التلميذ قادراً على:

1. ✅ التعرف على شخصيتَي القصة الرئيسيتَين: **أحمد** و **خديجة**.
2. ✅ نطق حرفَي **الألف (أ)** و **الباء (ب)** نطقاً سليماً بحركاتها الثلاث.
3. ✅ كتابة حرفَي **الألف (أ)** و **الباء (ب)** في مواضعها المختلفة.
4. ✅ استخدام ضمير المتكلم **"أنا"** للتعريف بالنفس.
5. ✅ قراءة كلمات بسيطة تحتوي على هذين الحرفَين.

---

### 1. تعالوا نتعرف على أصدقائنا الجدد! 🧑‍🤝‍🧑

<!-- INTERACTIVE_HOOK: intro_mascot_greeting
  FUNCTION: Moteur de dialogue interactif.
  ACTION: Ahmed et Khadija s'animent et saluent l'élève en utilisant son prénom.
  STATE: Initialisation du profil élève. -->

<!-- DEV_NOTE: Section "Découverte des personnages". Rendu par <CharacterIntro />.
  Les personnages Ahmed et Khadija sont les MASCOTTES récurrentes du module entier.
  Ils apparaissent dans TOUTES les 18 leçons. Maintenir leur cohérence visuelle.
  ASSET: character_ahmed → /assets/characters/ahmed_happy.svg
  ASSET: character_khadija → /assets/characters/khadija_drawing.svg
         (Style : illustrations vectorielles, look amical et inclusif)
  AI_HINT: Le moteur narratif peut adapter les dialogues en fonction des
  réponses de l'élève. Ex: si l'élève s'appelle "Youcef", Ahmed peut dire
  "مرحباً يا يوسف!" -->

---

**👦 أحمد:**

> مرحباً! أنا اسمي **أحمـد**. عمري **6** سنوات.
> أحب اللعب بكرة القدم ⚽، وأحب أسرتي كثيراً. 💙

<!-- ASSET: image → /assets/images/L01/ahmed_intro.png
  Description : Ahmed souriant, chemise bleue, tenant un ballon de foot.
  Dimensions : 300×300px minimum. Format : WebP avec fallback PNG.
  ACCESSIBILITY: alt="أحمد يبتسم و يحمل كرة القدم" -->

---

**👧 خديجة:**

> و أنا **خديجـة**، أخت أحمد الصغيرة. عمري **4** سنوات.
> أحب الرسم 🎨 و أحب الأزهار الجميلة 🌸.

<!-- ASSET: image → /assets/images/L01/khadija_intro.png
  Description : Khadija dessinant une fleur, couleurs vives.
  ACCESSIBILITY: alt="خديجة ترسم زهرة ملونة" -->

---

**لنكرر معاً:**

| الاسم | الصورة | الوصف |
|-------|--------|-------|
| أحمـد 🧒 | <!-- ASSET: ahmed_small.svg --> | ولد يحب الرياضة |
| خديجة 👧 | <!-- ASSET: khadija_small.svg --> | بنت تحب الرسم |

<!-- DEV_NOTE: Interaction recommandée : tap sur chaque carte → animation + narration audio.
  ASSET: audio_ahmed → /assets/audio/L01/ahmed_intro.mp3
         audio_khadija → /assets/audio/L01/khadija_intro.mp3 -->

---

### 2. نتعلم حرفين جديدين ✨

<!-- DEV_NOTE: Section clé du cours. Rendu par <LetterLearning />.
  Chaque lettre est présentée selon le modèle pédagogique :
  Découverte → Prononciation → Positions → Écriture → Mots-exemples.
  Ce modèle est CONSTANT pour tous les cours de l'alphabet. -->

#### أوّلاً: حرف الألف (أ)

<!-- DEV_NOTE: letter_id = "ALEF"
  ASSET: letter_visual → /assets/letters/alef_animated.lottie
         (Animation Lottie : le tracé du حرف s'anime pour montrer le geste d'écriture)
  ACCESSIBILITY: Prévoir une version statique SVG pour les appareils ne supportant
  pas Lottie. ARIA role="img" aria-label="حرف الألف" -->

> ☝️ هذا هو حرف **الأَلِف** — أوّل حروف الهجاء العربية!

<!-- INTERACTIVE_HOOK: letter_trace_alef
  FUNCTION: Atelier d'écriture tactile.
  ACTION: L'élève doit suivre le tracé de la lettre Alif avec son doigt sur l'écran.
  SENSORY_FEEDBACK: Vibration légère + son de glissement de plume.
  AI_HINT: Si le tracé est imprécis, Khadija encourage l'élève : "Allez, encore une fois, tu y es presque !" -->

**🔊 كيف ننطقه؟**

<!-- DEV_NOTE: Chaque son doit avoir un bouton audio individuel.
  ASSET: audio_alef_a → /assets/audio/letters/alef_fatha.mp3   (أَ)
         audio_alef_u → /assets/audio/letters/alef_damma.mp3   (أُ)
         audio_alef_i → /assets/audio/letters/alef_kasra.mp3   (إِ)
  Recommandation : afficher le spectre sonore animé lors de la lecture audio
  pour l'aide à la prononciation (composant <AudioWaveform />). -->

| الحركة | الرمز | مثال | الصوت |
|--------|-------|------|-------|
| فتحة   | أَ    | أَسَد 🦁 | 🔊 |
| ضمة    | أُ    | أُذُن 👂 | 🔊 |
| كسرة   | إِ    | إِبْرَة 📍 | 🔊 |

<!-- INTERACTIVE_HOOK: letter_selection_game
  FUNCTION: Jeu de reconnaissance auditive.
  ACTION: Le moteur audio joue un son (ex: أَ), l'élève doit cliquer sur la bonne lettre parmi 3 ballons flottants.
  GAMIFICATION: +10 XP par bonne réponse. Animation de confettis au 3ème succès. -->

<!-- AI_HINT: Exercice de reconnaissance phonétique : le moteur audio lit un son,
  l'élève choisit la bonne voyelle parmi 3 options. Difficulté adaptative basée
  sur le temps de réponse et la précision. -->

**📍 أين يقع حرف الألف في الكلمة؟**

<!-- DEV_NOTE: Rendu par <LetterPosition /> avec mise en évidence visuelle
  (highlight coloré) du حرف dans chaque position. -->

| الموضع | مثال | ملاحظة |
|--------|------|--------|
| أول الكلمة | **أ**سد | الألف واضحة في البداية |
| وسط الكلمة | ب**أ**ب (سأل) | الألف داخل الكلمة |
| آخر الكلمة | مَدْرَسَ**ة** | في الآخر قد تتخذ أشكالاً مختلفة (ة، ا) |

<!-- DEV_NOTE: NOTE PÉDAGOGIQUE IMPORTANTE — Le حرف الألف في آخر الكلمة est
  un sujet complexe (ألف ممدودة vs تاء مربوطة). À ce stade (1AP), simplifier
  à l'extrême. Ne pas entrer dans les détails orthographiques avancés. -->

**✍️ لنتدرب على الكتابة**

<!-- DEV_NOTE: Cette section est rendue par le composant <HandwritingPractice />.
  Technologies recommandées :
    - Sur tablette : Canvas API avec détection de tracé (librairie signature_pad ou
      équivalent arabe).
    - Sur desktop : guide animé avec suivi de la souris.
    - Sur mobile : Canvas tactile.
  Le tracé est évalué par l'algorithme de reconnaissance d'écriture du moteur
  FreeGeny (DTW - Dynamic Time Warping comparé au tracé de référence).
  ASSET: stroke_guide_alef → /assets/handwriting/alef_strokes.json
         (Format: séquence de points normalisés pour le guide d'écriture)

  Lignes d'écriture : 4 lignes de pratique.
  La première ligne montre l'exemple à reproduire.
  Les 3 autres lignes sont interactives pour l'élève.

  Retour visuel : ✅ vert si tracé correct, 🔄 animation d'encouragement si incorrect. -->

```
┌─────────────────────────────────────────────────┐
│  أ   أ   أ  │ ___  ___  ___  ___  ___           │
│  (مثال)     │ (تتبع هنا)                         │
│─────────────────────────────────────────────────│
│             │ ___  ___  ___  ___  ___           │
│─────────────────────────────────────────────────│
│             │ ___  ___  ___  ___  ___           │
└─────────────────────────────────────────────────┘
```

---

#### ثانياً: حرف الباء (ب)

<!-- DEV_NOTE: letter_id = "BA"
  ASSET: letter_visual → /assets/letters/ba_animated.lottie
  Couleur distinctive : bleu (cohérence avec le codage couleur du module).
  ACCESSIBILITY: aria-label="حرف الباء" -->

> ☝️ هذا هو حرف **البَاء** — ثاني حروف الهجاء!

<!-- ASSET: large_letter_display → /assets/letters/ba_large.svg -->

**🔊 كيف ننطقه؟**

| الحركة | الرمز | مثال | الصوت |
|--------|-------|------|-------|
| فتحة   | بَـ   | بَطَّة 🦆 | 🔊 |
| ضمة    | بُـ   | بُرتقال 🍊 | 🔊 |
| كسرة   | بِـ   | بِنت 👧 | 🔊 |

<!-- ASSET: audio_ba_a → /assets/audio/letters/ba_fatha.mp3
         audio_ba_u → /assets/audio/letters/ba_damma.mp3
         audio_ba_i → /assets/audio/letters/ba_kasra.mp3 -->

**📍 أين يقع حرف الباء في الكلمة؟**

| الموضع | مثال | ملاحظة |
|--------|------|--------|
| أول الكلمة | **بـ**اب 🚪 | شكل الباء أوّل الكلمة : بـ |
| وسط الكلمة | كـ**بـ**ش 🐑 | شكل الباء في الوسط : ـبـ |
| آخر الكلمة | كِتا**ب** 📖 | شكل الباء في الآخر : ـب |

<!-- DEV_NOTE: NOTE PÉDAGOGIQUE — Les formes connexes du حرف الباء (بـ / ـبـ / ـب)
  sont un concept essentiel de la calligraphie arabe. Utiliser une animation
  interactive montrant comment la forme change selon la position.
  Composant : <ConnectedForms letter="ب" /> -->

**✍️ لنتدرب على الكتابة**

<!-- ASSET: stroke_guide_ba → /assets/handwriting/ba_strokes.json
  Note : حرف الباء a une forme creuse avec un point EN DESSOUS.
  L'algorithme doit valider : (1) la forme horizontale, (2) la position du point. -->

```
┌─────────────────────────────────────────────────┐
│  ب   ب   ب  │ ___  ___  ___  ___  ___           │
│  (مثال)     │ (تتبع هنا)                         │
│─────────────────────────────────────────────────│
│             │ ___  ___  ___  ___  ___           │
│─────────────────────────────────────────────────│
│             │ ___  ___  ___  ___  ___           │
└─────────────────────────────────────────────────┘
```

---

### 3. هيا نقرأ كلمات جديدة! 📖

<!-- DEV_NOTE: Section "Lecture guidée". Rendu par <WordReading />.
  Chaque mot cliquable → prononciation audio + décomposition syllabique animée.
  AI_HINT: Tracker les erreurs de lecture pour adapter les exercices futurs.
  BLOOM: Niveau 1 (Mémorisation) → Niveau 2 (Compréhension). -->

| الكلمة | الصورة | تحليل الأحرف | الصوت |
|--------|--------|--------------|-------|
| أَسَد | 🦁 <!-- ASSET: img_asad --> | أَ + سَ + دْ | 🔊 |
| بَطَّة | 🦆 <!-- ASSET: img_batta --> | بَ + طَّ + ة | 🔊 |
| بَاب | 🚪 <!-- ASSET: img_bab --> | بَ + ا + بْ | 🔊 |

<!-- DEV_NOTE: L'analyse des lettres (تحليل الأحرف) est un exercice de décomposition
  phonémique essentiel en 1AP. Le composant <PhonemeBreakdown /> anime la
  séparation des lettres avec un effet visuel de zoom. -->

---

### 4. التمارين التفاعلية 🎮

<!-- DEV_NOTE: Section exercices. Chaque exercice est rendu par son composant
  spécifique. Le système de scoring attribue des XP selon la performance :
    Première tentative correct : 10 XP
    Deuxième tentative : 7 XP
    Troisième tentative : 5 XP
    Après 3 tentatives : Afficher la solution + 0 XP
  Un feedback audio et visuel (confetti, étoiles) récompense chaque bonne réponse.
  DATA_MODEL: Résultats stockés dans `exercise_attempts` (exercise_id, student_id,
  attempt_number, score, timestamp, response_data JSONB). -->

---

**التمرين 1 — ضع دائرة أو مستطيلاً** 🔵🟥

<!-- EXERCISE_TYPE: drag_and_label (ou highlight_letter)
  DEV_NOTE: L'élève tape/clique sur le حرف أ pour le cercler en rouge,
  et sur حرف ب لتحديده بمستطيل أزرق. Réponse automatiquement évaluée.
  BLOOM: Niveau 1 (Identification). -->

ضع دائرة 🔵 حول كل حرف **(أ)** و مستطيلاً 🟥 حول كل حرف **(ب)** في الكلمات التالية:

> **أَسَد &nbsp;&nbsp; بَاب &nbsp;&nbsp; مَدْرَسَة &nbsp;&nbsp; بَطَّة &nbsp;&nbsp; سَأَلَ &nbsp;&nbsp; كِتَاب**

*(الإجابة الصحيحة: أ في ← أسد، مدرسة (الألف الأولى)، سأل؛ ب في ← باب (مرتان)، بطة، كتاب)*

---

**التمرين 2 — الحرف الناقص** ✏️

<!-- EXERCISE_TYPE: fill_in_the_blank
  DEV_NOTE: Rendu par <FillBlank />. Clavier arabe virtuel affiché (uniquement
  les lettres pertinentes pour l'âge). Validation en temps réel avec feedback.
  BLOOM: Niveau 2 (Application). -->

أكتب الحرف الناقص تحت كل صورة:

| الصورة | الكلمة الناقصة | الإجابة |
|--------|----------------|---------|
| 🦁 أسد | `...`سد | **أ** |
| 🚪 باب | `...`اب | **ب** |
| 🦆 بطّة | `...`طة | **ب** |

---

**التمرين 3 — صِلْ بالخيط** 🕸️

<!-- EXERCISE_TYPE: matching (drag_and_connect)
  DEV_NOTE: Rendu par <MatchingExercise />. Sur écran tactile, l'élève glisse
  un fil entre la lettre et l'image. Sur desktop : clic sur lettre puis clic
  sur image. Animation de fil coloré.
  BLOOM: Niveau 2 (Association). -->

صِلْ بين الحرف و الصورة المناسبة:

```
أَ  •─────────────────• 🦆 (بطة)
              
بَ  •─────────────────• 🦁 (أسد)
```
*(الإجابة: أَ → أسد، بَ → بطة)*

---

**التمرين 4 — تمييز الصوت الأوّل** 🔊

<!-- EXERCISE_TYPE: audio_discrimination
  DEV_NOTE: Joue un son vocalique (A ou B). L'enfant doit cliquer sur la lettre correspondante.
  AUDIO_ASSETS: /assets/audio/L01/sound_a.mp3, /assets/audio/L01/sound_b.mp3 -->

استمع جيداً 🔊 ثم اختر الحرف الذي سمعته:

1. 🔊 (صوت أَ...) → **أ**
2. 🔊 (صوت بـ...) → **ب**

---

**التمرين 5 — ترتيب الحروف** 🧱

<!-- EXERCISE_TYPE: sequencing (drag_and_drop)
  DEV_NOTE: L'enfant doit remettre les lettres dans l'ordre pour former le mot "بَاب".
  LETTERS: ب / ا / ب -->

رتب الحروف لتكوين كلمة **(بَاب)**:

> **ا &nbsp;&nbsp; ب &nbsp;&nbsp; ب** &nbsp; ⮕ &nbsp; **[ ب ] &nbsp; [ ا ] &nbsp; [ ب ]**

---

---

### 5. قاموس الدرس المصوَّر 📚

<!-- DEV_NOTE: "Picture Dictionary" — Rendu par <PictureDictionary />.
  Chaque mot est une carte flip (recto: image, verso: mot avec audio).
  Ces mots sont ajoutés au "portefeuille de mots" (word bank) de l'élève.
  DATA_MODEL: Table `student_vocabulary` (word_id, student_id, mastery_level,
  last_seen, next_review — système de répétition espacée / SRS).
  AI_HINT: Réactiver ces mots dans les leçons suivantes pour consolidation SRS. -->

| الكلمة | الصورة | المعنى بالفرنسية | الصوت |
|--------|--------|-----------------|-------|
| مَدْرَسَة 🏫 | <!-- ASSET: img_madrasa --> | École | 🔊 |
| كِتَاب 📖 | <!-- ASSET: img_kitab --> | Livre | 🔊 |
| أَسَد 🦁 | <!-- ASSET: img_asad --> | Lion | 🔊 |
| بَاب 🚪 | <!-- ASSET: img_bab --> | Porte | 🔊 |
| بَطَّة 🦆 | <!-- ASSET: img_batta --> | Canard | 🔊 |

---

### 6. نشيد الحروف 🎵

<!-- DEV_NOTE: Section "Chanson/Nashid". Rendu par <NashidPlayer />.
  Le nasheéd est un outil pédagogique puissant pour la mémorisation en 1AP.
  ASSET: audio_nashid_huroof → /assets/audio/L01/nashid_huroof.mp3
         video_nashid_huroof → /assets/video/L01/nashid_huroof_karaoke.mp4
         (Vidéo karaoké avec texte mis en surbrillance au fur et à mesure)
  Durée : ~2 minutes. Style : jingle éducatif entraînant, voix d'enfants.
  I18N: Ce nasheéd est spécifique au marché algérien. Ne pas utiliser pour
  d'autres pays sans adaptation. -->

```
أَلِفٌ، أَرْنَبٌ يَجْرِي وَيَلْعَبْ 🐇
بَاءٌ، بَطَّةٌ تَسْبَحُ وَتَنْطَطْ 🦆
تَاءٌ، تَمْرٌ حُلْوٌ كَالدُّرِّ 🌴
ثَاءٌ، ثَعْلَبٌ يَحْفِرُ جُحْرَهْ 🦊
```

*(يمكن إضافة المزيد من الأبيات للحروف الأخرى)*

<!-- DEV_NOTE: Le nasheéd peut être étendu à tous les 28 حروف. Prévoir une
  version complète dans les assets. Implémenter un "Chanson Mode" distinct
  où l'élève peut écouter/chanter en dehors du contexte de leçon. -->

---

### 7. مراجعة الدرس و التقييم الذاتي ✨

<!-- DEV_NOTE: Section de révision. Rendu par <LessonSummary /> + <SelfAssessment />.
  L'élève évalue sa compréhension avec 3 émoticônes (😊 / 😐 / 😕).
  Cette donnée est envoyée au LRS xAPI : verb "evaluated" + result.
  AI_HINT: Si 😕, le moteur adaptatif propose une activité de remédiation
  avant de continuer. -->

**ماذا تعلمنا اليوم؟**

- ✅ تعرفنا على صديقينا: **أحمد** و **خديجة**.
- ✅ تعلمنا حرفَين جديدَين: **الألف (أ)** و **الباء (ب)**.
- ✅ قرأنا كلمات جديدة: **أسد، باب، بطّة**.
- ✅ تعلمنا كلمتَين مهمتَين: **مدرسة** و **كتاب**.

**كيف تقيّم نفسك؟** *(How do you feel?)*

> 😊 فهمت كل شيء! &nbsp;&nbsp; 😐 فهمت بعض الشيء &nbsp;&nbsp; 😕 أحتاج مساعدة

<!-- DEV_NOTE: Afficher un message d'encouragement personnalisé selon le choix :
  😊 : "أحسنتَ! أنت نجم اليوم! ⭐" → Continuer vers L02.
  😐 : "لا بأس! يمكنك مراجعة الدرس." → Proposer une révision rapide.
  😕 : "دعنا نكمل معاً!" → Activer le mode tuteur IA adaptatif. -->

---

> 🎉 **أحسنتَ يا بطل!** انتظرك في الدرس القادم. 👏

<!-- ASSET: completion_animation → /assets/animations/lesson_complete.lottie
  (Confetti + son de victoire + badge "أكملتُ الدرس 1") -->

---

## الدرس 2: مَنْ في مَنْزِلِنَا؟ (أفراد العائلة)

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L02"
  Prérequis : DZ-1AP-AR-L01 (doit être complété à ≥ 70% pour déverrouiller).
  Thèmes croisés : Éducation Islamique (دعاء الدخول) + Éducation Civique (احترام الوالدين).
  XP disponibles : 150 (bonus car cours multi-matières). -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** تعرف الطفل على أفراد العائلة، حرفي (ت، ث)، واستخدام "أنتَ/أنتِ".
> **Objectif :** Identifier les membres de la famille, les lettres Ta (ت) et Tha (ث), et utiliser les pronoms "Anta/Anti".
> 
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - عند دخول المنزل، شجع طفلك على قول دعاء الدخول بصوت مسموع.
> - اطلب منه تسمية أفراد العائلة (جد، جدة، أب، أم) باللغة العربية.
> - Encouragez votre enfant à réciter le Dua en entrant à la maison.
> - Demandez-lui de nommer les membres de la famille en Arabe.
>
> **⚠️ تنبيه | Attention :**
> - التمييز بين (ت) و (ث) قد يكون صعباً؛ اطلب منه إخراج طرف اللسان قليلاً عند نطق (ث).

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #fff9db; padding: 20px; border-radius: 15px; border: 2px solid #f59f00;">
  <h2 style="color: #f59f00;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L02/family_child_card.svg" alt="عائلتي" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #2f9e44;">ت &nbsp;&nbsp; ث</p>
  <p style="font-size: 20px;"><b>قيمة اليوم:</b> احترام الوالدين ❤️</p>
</div>

---

### 🎯 أهداف الدرس

<!-- BLOOM: Niveaux 1, 2 et 3 (Application comportementale). -->

بنهاية هذا الدرس، سيكون التلميذ قادراً على:

1. ✅ تسمية أفراد العائلة الأساسيين: أب، أم، جد، جدة، أخ، أخت.
2. ✅ نطق حرفَي **التاء (ت)** و **الثاء (ث)** و التمييز بينهما.
3. ✅ استخدام ضميرَي المخاطب **أنتَ** (للمذكر) و **أنتِ** (للمؤنث).
4. ✅ حفظ **دعاء الدخول إلى المنزل** و تطبيقه.
5. ✅ إظهار الاحترام لأفراد العائلة (ممارسة سلوكية).

---

### 1. تعالوا نتعرف على عائلة أحمد و خديجة 👨‍👩‍👧‍👦

<!-- DEV_NOTE: Composant <FamilyTree /> — arbre généalogique interactif animé.
  Cliquer sur un membre → son image + son nom + audio de prononciation.
  ASSET: family_illustration → /assets/images/L02/family_portrait.png
         (Portrait de famille algérienne : père, mère, grands-parents, Ahmed, Khadija)
  Note de représentation : choisir des tenues vestimentaires typiquement algériennes
  (haïk, burnous, robe traditionnelle) pour l'authenticité culturelle. -->

| الشخص | الوصف | الصورة | الصوت |
|-------|-------|--------|-------|
| أبـي 👨 | طيب، قوي، يعمل لكي يوفر لنا كل ما نحتاج | <!-- ASSET: dad.svg --> | 🔊 |
| أمـي 👩 | حنونة، رائعة، تطبخ أشهى الطعام | <!-- ASSET: mom.svg --> | 🔊 |
| جـدي 👴 | كبير العائلة، يحكي لنا القصص القديمة | <!-- ASSET: grandpa.svg --> | 🔊 |
| جـدتي 👵 | لطيفة جداً، تعد لنا الحلويات في العيد 🍯 | <!-- ASSET: grandma.svg --> | 🔊 |
| أخي 👦 | يلعب معي و يساعدني | <!-- ASSET: brother.svg --> | 🔊 |
| أختي 👧 | رفيقتي الصغيرة | <!-- ASSET: sister.svg --> | 🔊 |

<!-- DEV_NOTE: Interactivité suggestion : "Quiz Familial" — le jeu affiche une
  description et l'élève doit identifier le membre de la famille.
  EXERCISE_TYPE: multiple_choice. Difficulté : 4 options parmi les 6 membres. -->

---

### 2. نتعلم حرفين جديدين (ت - ث)

<!-- DEV_NOTE: Note pédagogique CRITIQUE — Les حرفان ت et ث sont parmi les plus
  CONFONDUS par les apprenants algériens (dialecte darija n'utilise pas ث).
  Prévoir un exercice de discrimination auditive renforcée.
  AI_HINT: Si l'élève confond ت/ث plus de 2 fois, déclencher l'exercice
  "السبورة الصوتية" (tableau sonore comparatif) automatiquement. -->

#### أوّلاً: حرف التاء (ت)

<!-- DEV_NOTE: letter_id = "TA"
  ASSET: letter_visual → /assets/letters/ta_animated.lottie
  Couleur : vert (cohérence du système de couleurs du module).
  Points distinctifs : 2 points AU-DESSUS du حرف. L'algorithme d'écriture
  doit valider la position et le nombre de points. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| تَـ (فتحة) | تَفاحة 🍎 | 🔊 |
| تُـ (ضمة) | تُوت 🍓 | 🔊 |
| تِـ (كسرة) | تِلميذ 🧑‍🎓 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **تـ**فاحة | كـ**تـ**اب | تلميذ**ة** |

<!-- DEV_NOTE: NOTE PÉDAGOGIQUE — La تاء مربوطة (ة) en fin de mot est une forme
  spéciale du ت. À ce niveau, simplement noter qu'elle "ressemble" au ت mais
  avec une différence visuelle. L'étude détaillée est prévue en 2AP. -->

**✍️ لنتدرب على الكتابة**
<!-- ASSET: stroke_guide_ta → /assets/handwriting/ta_strokes.json -->

---

#### ثانياً: حرف الثاء (ث)

<!-- DEV_NOTE: letter_id = "THA"
  ASSET: letter_visual → /assets/letters/tha_animated.lottie
  Couleur : orange (distinctif du ت vert).
  Points distinctifs : 3 points AU-DESSUS. L'algorithme DOIT valider 3 points.
  DIFFÉRENCIATION ت/ث : Créer une animation comparative côte-à-côte.
  Composant : <LetterComparison letterA="ت" letterB="ث" /> -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| ثَـ (فتحة) | ثَعلب 🦊 | 🔊 |
| ثُـ (ضمة) | ثُوم 🧄 | 🔊 |
| ثِـ (كسرة) | ثِمار 🍒 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **ثـ**علب | مَبعـ**ثـ**ه | حَديـ**ث** |

**✍️ لنتدرب على الكتابة**
<!-- ASSET: stroke_guide_tha → /assets/handwriting/tha_strokes.json -->

---

### 3. هيا نقرأ كلمات جديدة! 📖

| الكلمة | الصورة | الصوت |
|--------|--------|-------|
| تَفاحة | 🍎 | 🔊 |
| تُوت | 🍓 | 🔊 |
| ثَعلب | 🦊 | 🔊 |
| ثُوم | 🧄 | 🔊 |

---

### 4. نتعلم: أنتَ و أنتِ 👦👧

<!-- DEV_NOTE: Introduction aux PRONOMS DE 2ème PERSONNE avec distinction de genre.
  Concept grammatical fondamental en arabe. Rendu par <GrammarLesson />.
  BLOOM: Niveau 3 (Application — utiliser correctement dans des phrases). -->

> **عندما نتحدث مع ولد، نقول:** 👦 **أنتَ** (بفتح التاء)
> **عندما نتحدث مع بنت، نقول:** 👧 **أنتِ** (بكسر التاء)

| المثال | الضمير | ملاحظة |
|--------|--------|--------|
| **أنتَ** تلميذٌ مجتهد | للمذكر | التاء مفتوحة |
| **أنتِ** تلميذةٌ مجتهدة | للمؤنث | التاء مكسورة |

<!-- DEV_NOTE: Exercice ludique suggéré : Ahmed et Khadija apparaissent en animation.
  Ahmed parle à l'élève (garçon → أنتَ) ou à Khadija (fille → أنتِ).
  L'élève doit tapper la bonne forme. Rendu par <PronounGame /> -->

**التمرين — أكمل بـ (أنتَ) أو (أنتِ):**

<!-- EXERCISE_TYPE: fill_in_the_blank with audio context -->

1. قال أحمد لخالد: "... تحبّ كرة القدم؟" → **أنتَ**
2. قالت خديجة لصديقتها: "... ترسمين لوحةً جميلة؟" → **أنتِ**
3. قال المعلم للتلميذ: "... مجتهدٌ يا عمر!" → **أنتَ**
4. قالت المعلمة للتلميذة: "... متفوقةٌ يا آية!" → **أنتِ**

---

### 5. ☪️ التربية الإسلامية — دعاء الدخول إلى المنزل

<!-- DEV_NOTE: Section "Éducation Islamique". Rendu par <IslamicEducation />.
  Ce contenu est identifié comme `content_type: islamic_content` dans les métadonnées.
  L'affichage doit être particulièrement soigné : fond légèrement coloré (vert pâle
  ou doré), police calligraphique, icône 🕌.
  ACCESSIBILITY: Text audio OBLIGATOIRE avec voix lente et claire pour la mémorisation.
  DEV_NOTE: Vérifier la conformité de chaque hadith/dua avec des sources authentiques
  (Bukhari, Muslim, Abu Dawud etc.) avant publication.
  DATA_MODEL: Table `islamic_content` (dua_id, arabic_text, source, authenticity_level,
  explanation_ar, explanation_fr). -->

عندما نعود إلى منزلنا الحبيب، نتذكر نعمة الله علينا. قال رسولنا الكريم ﷺ:

---

> ### 🤲 دعاء الدخول إلى المنزل
> ## بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا
>
> **المصدر:** رواه أبو داود
<!-- DEV_NOTE: ASSET: audio_dua_entrance → /assets/audio/islamic/dua_entering_home.mp3
  Voix : récitateur avec tajweed clair, rythme adapté aux enfants.
  Option : afficher la translittération latine pour l'aide à la lecture.
  Translittération : "Bismillāhi walajna, wa bismillāhi kharajna, wa 'alā Allāhi
  Rabbinā tawakkalnā" -->

**الشرح بكلمات بسيطة:**
- "بسم الله" ← نذكر اسم الله عند الدخول و عند الخروج.
- "وعلى الله ربنا توكلنا" ← نتوكل على الله في كل أمورنا.

**لنتدرب على قول الدعاء:**
<!-- DEV_NOTE: Exercice d'implémentation comportementale. Rendu par <PracticeScenario />.
  Animation interactive : porte animée → l'élève entre dans la maison → dit le دعاء. -->

> 1. 🚪 تخيّل أنك عائد من المدرسة و تقف أمام باب منزلك.
> 2. 🤲 ضع يدك على قلبك.
> 3. 🗣️ قل الدعاء بهدوء و خشوع.
> 4. 😊 ادخل إلى بيتك و أنت مطمئن.

---

### 6. 🇩🇿 التربية المدنية — أنا أحب أسرتي

<!-- DEV_NOTE: Section "Éducation Civique". Rendu par <CivicEducation />.
  BLOOM: Niveau 5 (Synthèse comportementale — Savoir-être). -->

أسرتي هي أغلى ما أملك. من واجبي أن:

| الواجب | كيف أطبّقه؟ |
|--------|------------|
| 🙏 طاعة الوالدين | أسمع كلامهم و أنفّذه بسرعة |
| 💖 شكرهم | أقول "شكراً يا أمي" و "جزاك الله خيراً يا أبي" |
| 🧹 المساعدة | أرتّب غرفتي و أساعد في وضع الأطباق |
| 😌 الأدب | أتحدث بصوت هادئ و لا أصرخ |
| 📞 التواصل | أخبر والديّ بيومي المدرسي |

<!-- DEV_NOTE: Exercice comportemental suggéré : "تحدّي اليوم" (Défi du jour).
  L'élève choisit UN comportement à appliquer chez lui ce soir.
  Il revient le lendemain pour "cocher" qu'il l'a fait → +20 XP bonus.
  Nécessite notification push parental. Activer seulement si l'app parent est installée.
  DATA_MODEL: Table `civic_challenges` (challenge_id, student_id, due_date, completed_at). -->

**💡 هل تعلم؟**
> رِضَا الوالدَيْن من رِضَا الله 🌟
> عندما تكون باراً بوالديك، تكون في حفظ الله و رعايته. 🤲

---

### 7. التمارين التفاعلية 🎮

**التمرين 1 — مَنْ هذا؟** 🧐

<!-- EXERCISE_TYPE: multiple_choice
  DEV_NOTE: L'enfant doit identifier le membre de la famille sur l'image.
  ASSET: /assets/images/L02/grandma_photo.png -->

انظر إلى الصورة 👵.. مَنْ هذه؟

1. ❌ أبـي
2. ✅ **جـدتي**
3. ❌ أخـي

---

**التمرين 2 — لغز النجوم** ✨

<!-- EXERCISE_TYPE: fill_in_the_blank
  DEV_NOTE: Choisir entre Ta ou Tha.
  ASSET: /assets/images/L02/apple.png -->

أكمل الكلمة بالحرف المناسب:
`...`ـفاحة 🍎

1. ✅ **تـ**
2. ❌ **ثـ**

---

**التمرين 3 — أنتَ أم أنتِ؟** 👦👧

<!-- EXERCISE_TYPE: mapping
  DEV_NOTE: Associer le pronom au bon personnage.
  AHMED (Boy) -> Anta / KHADIJA (Girl) -> Anti -->

صِلْ الضمير بالصديق المناسب:

- **أنتَ** ⮕ [ **أحمد** 👦 ]
- **أنتِ** ⮕ [ **خديجة** 👧 ]

---

**التمرين 4 — حارس البيت** 🚪

<!-- EXERCISE_TYPE: true_false
  DEV_NOTE: Vérifier si l'enfant connaît le comportement du Dua. -->

عندما أدخل إلى منزلي، أقول "بسم الله"..

- ✅ **صحيح**
- ❌ **خطأ**

---

**التمرين 5 — تتبع النقاط** ✏️

<!-- EXERCISE_TYPE: tracing
  DEV_NOTE: L'enfant trace le حرف ث. Attention aux 3 points ! 
  ASSET: /assets/letters/tha_trace.json -->

ارسم حرف **(ث)** في الهواء بإصبعك ثم على الشاشة:

> **ث &nbsp; ث &nbsp; ث**

---

**التمرين 1 — التمييز الصوتي بين (ت) و (ث)**

<!-- EXERCISE_TYPE: audio_discrimination
  DEV_NOTE: Le système audio joue un mot. L'élève choisit ت ou ث.
  Mots utilisés : تفاحة / ثعلب / توت / ثوم / تلميذ / ثلاث
  Difficulté adaptative : commencer par des mots très distincts, augmenter progressivement.
  BLOOM: Niveau 1 (Identification phonémique). -->

استمع 🔊 و اختر الحرف الصحيح: **(ت)** أم **(ث)** ؟

| الكلمة المسموعة | الجواب |
|----------------|--------|
| 🔊 (تفاحة) | ت |
| 🔊 (ثعلب) | ث |
| 🔊 (توت) | ت |
| 🔊 (ثوم) | ث |

---

**التمرين 2 — أكمل الحرف الناقص**

<!-- EXERCISE_TYPE: fill_in_the_blank -->

| الكلمة الناقصة | الجواب |
|----------------|--------|
| كِـ`...`ـاب | **ت** |
| `...`َعلب | **ث** |
| `...`ُوت | **ت** |
| `...`ُوم | **ث** |

---

**التمرين 3 — صِلْ الحرف بصورته**

<!-- EXERCISE_TYPE: matching -->

```
تَـ  •────────────────• 🍓 (توت)

ثُـ  •────────────────• 🍎 (تفاحة)

تُـ  •────────────────• 🧄 (ثوم)

ثَـ  •────────────────• 🦊 (ثعلب)
```
*(الإجابة: تَ → تفاحة، ثُ → ثوم، تُ → توت، ثَ → ثعلب)*

---

### 8. مراجعة الدرس ✨

- ✅ تعرفنا على أفراد عائلة أحمد: أب، أم، جد، جدة، أخ، أخت.
- ✅ تعلمنا حرفَي **التاء (ت)** و **الثاء (ث)** و الفرق بينهما.
- ✅ تعلمنا الفرق بين **أنتَ** (للولد) و **أنتِ** (للبنت).
- ✅ حفظنا **دعاء الدخول إلى المنزل**.
- ✅ عرفنا كيف نعامل أسرتنا بالحب و الاحترام.

---

> 🌟 **أنت رائع! نلتقي في الدرس القادم إن شاء الله.** 🤲

---

## الدرس 3: أحبّ عائلتي

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L03"
  Thème : Expression des sentiments + Hadith sur la miséricorde.
  Compétences langagières : Exprimer l'amour, structurer une phrase avec "أحب".
  Nouveaux حروف : الجيم (ج) و الحاء (ح).
  Note culturelle : Le concept de "رحمة" (miséricorde) est central dans la
  culture algérienne et islamique. Traiter avec délicatesse et profondeur. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** تعليم الطفل التعبير عن مشاعره (أحب عائلتي)، تعريف بحرفي (ج، ح)، وقيمة "الرحمة".
> **Objectif :** Apprendre à exprimer ses sentiments ("J'aime ma famille"), introduire les lettres Jim (ج) et Ha (ح), et la valeur de la "Rahma" (miséricorde).
> 
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - اطلب من طفلك أن يقول جملة تبدأ بـ "أحب..." لكل فرد في العائلة.
> - جربوا نطق حرف الحاء (ح) معاً؛ هو صوت يخرج من وسط الحلق (مثل النفس الدافئ).
> - Demandez à votre enfant de dire une phrase commençant par "Ouhibbou..." (J'aime...) pour chaque membre de la famille.
> - Pratiquez le son 'Ha' (ح), un son doux venant du milieu de la gorge.
>
> **⚠️ تنبيه | Attention :**
> - نقطة حرف الجيم (ج) موجودة في الأسفل (في البطن)، بينما حرف الحاء (ح) ليس له نقاط أبداً.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #f3f0ff; padding: 20px; border-radius: 15px; border: 2px solid #7950f2;">
  <h2 style="color: #7950f2;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L03/love_child_card.svg" alt="أحب عائلتي" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #5f3dc4;">ج &nbsp;&nbsp; ح</p>
  <p style="font-size: 20px;"><b>أنا رحيم:</b> أرحم الصغير وأحترم الكبير 😊</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ التعبير عن حبّ أفراد العائلة باستخدام "**أحبّ...**".
2. ✅ إدراك أهمية **العطف و الرحمة** في الأسرة.
3. ✅ حفظ حديث نبوي شريف عن الرحمة.
4. ✅ نطق حرفَي **الجيم (ج)** و **الحاء (ح)** و التمييز بينهما.
5. ✅ قراءة كلمات تتضمن هذين الحرفين.

---

### 1. كيف نُعبّر عن حبّنا لعائلتنا؟ 💕

<!-- DEV_NOTE: Section "Expression affective". Importante sur le plan socio-émotionnel (SEL).
  Rendu par <AffectiveLesson /> avec illustrations de scènes familiales chaleureuses.
  ASSET: scenes_family_love → /assets/images/L03/family_love_scenes.png
         (4 vignettes : enfant qui aide sa mère, enfant qui lit avec son père,
          enfant qui embrasse sa grand-mère, enfant qui joue avec ses frères/sœurs) -->

نُظهر حبّنا لعائلتنا بأفعالنا و كلماتنا:

| 💬 بالكلمات | 🤝 بالأفعال |
|------------|------------|
| "أحبّك يا أبي" 💙 | مساعدة في المنزل 🧹 |
| "أحبّك يا أمي" ❤️ | الطاعة و الاستماع 👂 |
| "جزاك الله خيراً يا جدي" 🤲 | رسم صورة هديّة 🎨 |
| "أنتِ رائعة يا أختي" ✨ | اللعب بلطف 🎮 |

**لنردد معاً:**

> أحبّ **أبي** 👨 &nbsp;&nbsp; أحبّ **أمي** 👩 &nbsp;&nbsp; أحبّ **جدي** 👴 &nbsp;&nbsp; أحبّ **جدتي** 👵

<!-- ASSET: audio_i_love_family → /assets/audio/L03/i_love_family_chant.mp3
  DEV_NOTE: Chanter avec mélodie simple et répétitive. Excellent pour la mémorisation. -->

---

### 2. نتعلم حرفَين جديدَين (ج - ح)

<!-- DEV_NOTE: NOTE PÉDAGOGIQUE CRITIQUE — الجيم و الحاء يشتركان في نفس الشكل
  الأساسي ! (جـ / حـ) La distinction visuelle est délicate pour les jeunes enfants.
  Composant spécial : <SimilarLettersLesson letterA="ج" letterB="ح" letterC="خ" />
  (Les trois sont liées : ج ح خ — présenter ensemble visuellement même si خ est
  enseignée plus tard, pour préparer l'élève). -->

#### أوّلاً: حرف الجيم (ج)

<!-- letter_id = "JIM"
  ASSET: letter_visual → /assets/letters/jim_animated.lottie
  Couleur : violet (pour le distinguer de ح orange et خ marron)
  Point distinctif : UN point EN DESSOUS de la forme creuse. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| جَـ (فتحة) | جَمَل 🐫 | 🔊 |
| جُـ (ضمة) | جُبْن 🧀 | 🔊 |
| جِـ (كسرة) | جِسْر 🌉 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **جـ**مل | مَسـ**جـ**ِد | بُرـ**ج** |

**✍️ الكتابة** <!-- ASSET: stroke_guide_jim → /assets/handwriting/jim_strokes.json -->

---

#### ثانياً: حرف الحاء (ح)

<!-- letter_id = "HA"
  ASSET: letter_visual → /assets/letters/ha_animated.lottie
  Couleur : orange.
  Point distinctif : AUCUN point. Forme identique à ج mais sans le point.
  Prononciation : son aspiré du fond de la gorge, inexistant en français.
  ASSET: pronunciation_comparison → /assets/audio/letters/jeem_vs_haa_comparison.mp3
  AI_HINT: Si l'élève confond ج/ح dans les exercices, activer la leçon corrective
  "الفرق بين الجيم و الحاء" avec exercices ciblés. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| حَـ (فتحة) | حَقل 🌾 | 🔊 |
| حُـ (ضمة) | حُوت 🐋 | 🔊 |
| حِـ (كسرة) | حِصَان 🐴 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **حـ**قل | مِـ**حـ**فَظة | صَبَا**ح** |

**✍️ الكتابة** <!-- ASSET: stroke_guide_ha → /assets/handwriting/ha_strokes.json -->

---

### 3. ☪️ التربية الإسلامية — حديث الرحمة

<!-- DEV_NOTE: Hadith majeur sur la Miséricorde. Source: Tirmidhi & Abu Dawud.
  Authenticité : صحيح.
  ASSET: audio_hadith_rahma → /assets/audio/islamic/hadith_rahma.mp3 -->

قال رسول الله ﷺ:

---

> ### 🤲 حديث الرحمة
> ## "لَيْسَ مِنَّا مَنْ لَمْ يَرْحَمْ صَغِيرَنَا وَيُوَقِّرْ كَبِيرَنَا"
>
> **المصدر:** رواه الترمذي و أبو داود

---

**الشرح بلغة بسيطة:**
> الذي لا يرحم الأطفال الصغار، و لا يحترم الكبار في السن، فهو ليس على منهج الإسلام الصحيح.

**كيف نطبّق الرحمة في حياتنا اليومية؟**

| نتصرف مع الصغار 👶 | نتصرف مع الكبار 👴 |
|--------------------|--------------------|
| نساعدهم بلطف | نستمع إليهم باحترام |
| نلعب معهم بهدوء | نتركهم يجلسون في الحافلة |
| لا نأخذ لعبهم | نتحدث معهم بأدب |
| نبتسم لهم 😊 | نسلّم عليهم أولاً |

<!-- DEV_NOTE: Exercice d'auto-réflexion : "أفكر في موقف كنت فيه رحيماً مع أخي/أختي."
  Rendu par <ReflectionActivity /> — champ de texte libre (ou message vocal si l'élève
  ne sait pas encore écrire). AI_HINT: L'IA peut générer un feedback positif sur la
  réponse de l'élève. -->

---

### 4. التمارين التفاعلية 🎮

**التمرين 1 — لغز النحل 🐝**

<!-- EXERCISE_TYPE: matching
  DEV_NOTE: L'enfant doit relier le mot à l'image correspondante.
  ASSET: /assets/images/L03/camel.png, /assets/images/L03/whale.png -->

صِلْ الكلمة بالصورة الصحيحة:

- **جَمَل** ⮕ [ 🐫 ]
- **حُوت** ⮕ [ 🐋 ]

---

**التمرين 2 — أين النقطة؟ 📍**

<!-- EXERCISE_TYPE: multiple_choice
  DEV_NOTE: Différenciation visuelle J/H. -->

ما هو الحرف الذي لديه نقطة في الأسفل؟

1. ✅ **جـ**
2. ❌ **حـ**

---

**التمرين 3 — أنا أقول.. 💬**

<!-- EXERCISE_TYPE: fill_in_the_blank
  DEV_NOTE: Utilisation du mot "Ouhibbou". -->

أكمل الجملة:
`...`ـبُّ جـدتي 👵

1. ✅ **أُحِـ**
2. ❌ **بَـ**

---

**التمرين 4 — كن رحيماً ❤️**

<!-- EXERCISE_TYPE: true_false
  DEV_NOTE: Application de la valeur du Hadith. -->

عندما أرى أختي الصغيرة تبكي، أضحك عليها..

- ❌ **خطأ**
- ✅ **صحيح أن أقبلها وأساعدها**

---

**التمرين 5 — صوت الحلق 🔊**

<!-- EXERCISE_TYPE: audio_discrimination
  DEV_NOTE: Joue un son vocalique (J ou H).
  AUDIO_ASSETS: /assets/audio/L03/voice_j.mp3, /assets/audio/L03/voice_h.mp3 -->

استمع جيداً 🔊 مَنْ هذا الصوت؟

1. 🔊 (صوت حـ...) ⮕ **حـ**
2. 🔊 (صوت جـ...) ⮕ **جـ**

---

### 4. التمارين التفاعلية 🎮

**التمرين 1 — اقرأ الكلمات الجديدة**

<!-- EXERCISE_TYPE: reading_aloud (reconnaissance vocale si disponible)
  ASSET: audio_words → /assets/audio/L03/words_jim_ha.mp3 -->

| الكلمة | الصورة | الصوت |
|--------|--------|-------|
| جَمَل | 🐫 | 🔊 |
| حِصَان | 🐴 | 🔊 |
| مَسجِد | 🕌 | 🔊 |

---

**التمرين 2 — أكمل الحرف الناقص**

<!-- EXERCISE_TYPE: fill_in_the_blank -->

| الكلمة الناقصة | الجواب |
|----------------|--------|
| `...`َمَل (جمل) | **ج** |
| `...`ِصَان (حصان) | **ح** |
| مَسْ`...`ِد (مسجد) | **ج** |
| صَبَا`...` (صباح) | **ح** |

---

### 5. مراجعة الدرس ✨

- ✅ تعلمنا طرق التعبير عن المحبة لأفراد العائلة.
- ✅ تعلمنا حرفَي **الجيم (ج)** و **الحاء (ح)**.
- ✅ حفظنا **حديث الرحمة الشريف**.
- ✅ عرفنا كيف نرحم الصغار و نوقّر الكبار.

---

> 🎉 **أحسنتَ! إلى الدرس القادم.** ⭐

---

## الدرس 4: في المدرسة

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L04"
  Thème : L'école comme deuxième maison + آداب الاستئذان.
  Nouveau حرف : الميم (م).
  Texte coranique : آية الاستئذان (سورة النور).
  Note culturelle : Le respect de la permission avant d'entrer est une valeur
  cardinale en Islam et dans la culture algérienne. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** تعريف الطفل بمصطلحات المدرسة، حرف الميم (م)، وقيمة "الاستئذان".
> **Objectif :** Vocabulaire de l'école, introduction de la lettre Meem (م), et la valeur de "l'Isti'dhan" (demander la permission).
> 
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - اطلب من طفلك أن يعدد لك 3 أشياء يراها في مدرسته (علم، سبورة، ساحة).
> - تدربوا على الاستئذان في البيت: "هل يمكنني الدخول؟" قبل دخول أي غرفة.
> - Demandez à votre enfant de nommer 3 choses qu'il voit à l'école.
> - Pratiquez la demande de permission à la maison avant d'entrer dans une pièce.
>
> **⚠️ تنبيه | Attention :**
> - حرف الميم (م) في آخر الكلمة يختلف شكله؛ ساعد طفلك على تمييزه.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #e3fafd; padding: 20px; border-radius: 15px; border: 2px solid #0b7285;">
  <h2 style="color: #0b7285;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L04/school_child_card.svg" alt="مدرستي" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #08667e;">م</p>
  <p style="font-size: 20px;"><b>أنا مؤدب:</b> أطرق الباب و أستأذن 🚪</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ التعرف على مرافق المدرسة و وصفها.
2. ✅ نطق حرف **الميم (م)** و كتابته في مواضعه الثلاثة.
3. ✅ فهم و حفظ **آية الاستئذان** من سورة النور.
4. ✅ تطبيق آداب الاستئذان في المدرسة و المنزل (سلوك عملي).
5. ✅ بناء جمل وصفية بسيطة عن المدرسة.

---

### 1. المدرسة بيتنا الثاني 🏫

<!-- ASSET: school_map → /assets/images/L04/school_interactive_map.svg
  DEV_NOTE: خريطة تفاعلية للمدرسة. النقر على كل مرفق يظهر اسمه مع صورة وصوت.
  Composant : <InteractiveSchoolMap />. Points cliquables : قسم، ساحة، مكتبة، مدير. -->

**في مدرستنا الجميلة نجد:**

| المرفق | الوصف | الصورة |
|--------|-------|--------|
| القِسْم 📚 | حيث نجلس و ندرس و نتعلم | <!-- ASSET: classroom.svg --> |
| السَّاحة 🤸 | حيث نلعب و نمرح أثناء الاستراحة | <!-- ASSET: playground.svg --> |
| المَكتبة 📖 | حيث نقرأ الكتب المفيدة | <!-- ASSET: library.svg --> |
| مكتب المدير 👔 | حيث يدير مدرستنا بحكمة | <!-- ASSET: principal_office.svg --> |
| المطعم المدرسي 🍱 | حيث نتناول وجبتنا في الظهر | <!-- ASSET: canteen.svg --> |

<!-- DEV_NOTE: المطعم المدرسي مضاف كتحسين (لم يكن في النسخة الأصلية).
  Pertinent pour les apprenants algériens qui ont la restauration scolaire.
  لنردد معاً: -->

> **هذه مدرستي الجميلة.** 🏫 &nbsp; **أحبّ مدرستي كثيراً.** 💛

---

### 2. نتعلم حرف الميم (م)

<!-- DEV_NOTE: letter_id = "MEEM"
  ASSET: letter_visual → /assets/letters/meem_animated.lottie
  Couleur : rose/bordeaux.
  Le ميم est extrêmement fréquent en arabe. Renforcer sa reconnaissance est crucial.
  Fait amusant pour les enfants : حرف الميم يشبه الدائرة الصغيرة 🔵 -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| مَـ (فتحة) | مَدرسة 🏫 | 🔊 |
| مُـ (ضمة) | مُعلِّم 👨‍🏫 | 🔊 |
| مِـ (كسرة) | مِحفَظة 🎒 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **مـ**درسة | قَ**مـ**ر 🌙 | نَجـ**م** ⭐ |

**✍️ الكتابة** <!-- ASSET: stroke_guide_meem → /assets/handwriting/meem_strokes.json -->

---

### 3. ☪️ التربية الإسلامية — آية الاستئذان

<!-- DEV_NOTE: آية قرآنية من سورة النور، الآية 27.
  ASSET: audio_aya_istidhan → /assets/audio/islamic/aya_nur_27.mp3
  (Récitation: Cheikh dont la voix est agréable pour les enfants)
  Affichage : composant <QuranVerse surah="24" ayah="27" /> avec fond spécial. -->

قال الله تعالى في القرآن الكريم (سورة النور، الآية 27):

---

> ### 📖 آية الاستئذان
> ## "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَدْخُلُوا بُيُوتًا غَيْرَ بُيُوتِكُمْ حَتَّى تَسْتَأْنِسُوا وَتُسَلِّمُوا عَلَى أَهْلِهَا"
>
> **سورة النور — الآية 27**

---

**الشرح بكلمات بسيطة:**
> يا من آمنتم بالله، لا تدخلوا بيوت الآخرين قبل أن تستأذنوا و تلقوا السلام على أصحابها.

**ماذا نتعلم من هذه الآية الكريمة؟**
- 🚪 لا ندخل أي مكان دون استئذان.
- 🤲 نطرق الباب بلطف قبل الدخول.
- ⏳ ننتظر الإذن بصبر و أدب.
- 🌸 نبدأ بالسلام.

---

### 4. 🇩🇿 التربية المدنية — آداب الاستئذان

<!-- DEV_NOTE: Roleplay interactif : <RolePlayScenario />
  L'élève joue le rôle d'Ahmed qui frappe à la porte.
  Animation : Ahmed frappe → voix de la maman → Ahmed demande la permission → entre.
  BLOOM: Niveau 3 (Application comportementale). -->

في المدرسة و في المنزل، يجب أن نستأذن قبل:

| الموقف | ماذا نفعل؟ |
|--------|-----------|
| 🚪 دخول غرفة الوالدين | نطرق الباب و نستأذن |
| 📚 الدخول إلى القسم | نستأذن من المعلم/المعلمة |
| 🖊️ أخذ قلم صديقنا | نطلب الإذن أولاً |
| 🗣️ الكلام أمام الجميع | نرفع يدنا و ننتظر |

**لنتدرب معاً — محادثة الاستئذان:**

<!-- ASSET: dialogue_animation → /assets/video/L04/permission_dialogue.mp4 -->

> 🔊 **طق طق طق** *(طرق الباب)*
> 💬 **أحمد:** "السلام عليكم، هل آذن بالدخول؟"
> 💬 **الأم:** "وعليكم السلام، تفضل يا أحمد."
> 😊 **أحمد:** "شكراً يا أمي."

---

### 5. التمارين التفاعلية 🎮

**التمرين 1 — لغز المدرسة 🏫**

<!-- EXERCISE_TYPE: matching
  DEV_NOTE: Associer le lieu à son nom.
  ASSET: /assets/images/L04/classroom.png, /assets/images/L04/flag.png -->

صِلْ الكلمة بالصورة المناسبة:

- **قِسْم** ⮕ [ 🏫 ]
- **عَلَم** ⮕ [ 🇩🇿 ]

---

**التمرين 2 — صيد الميم 🎣**

<!-- EXERCISE_TYPE: highlight_letter
  DEV_NOTE: Trouver la lettre Meem dans les mots. -->

اختر حرف **الميم (م)** في هذه الكلمة:
**مُـعَـلِّـمَـة** 👩‍🏫

- ✅ **مـ** (الأولى)
- ✅ **ـمـ** (الثانية)

---

**التمرين 3 — طق طق طق! ✊**

<!-- EXERCISE_TYPE: true_false
  DEV_NOTE: Valeur de l'Isti'dhan. -->

هل أدخل إلى القسم دون أن أقول "السلام عليكم"؟

- ❌ **نعم**
- ✅ **لا، يجب أن أستأذن و أسلم**

---

**التمرين 4 — الحرف المفقود 🔍**

<!-- EXERCISE_TYPE: fill_in_the_blank
  ASSET: /assets/images/L04/pencil.png -->

أكمل الكلمة:
قـلـ`...` ✏️

1. ✅ **ـم**
2. ❌ **ـب**

---

**التمرين 5 — صوت الميم 🔊**

<!-- EXERCISE_TYPE: audio_discrimination
  AUDIO_ASSETS: /assets/audio/L04/sound_m_ma.mp3, /assets/audio/L04/sound_m_mo.mp3 -->

استمع 🔊 ثم اختر الصوت الذي سمعته:

1. 🔊 (مَـ...) ⮕ **مَـ**
2. 🔊 (مُـ...) ⮕ **مُـ**

---

---

### 6. مراجعة الدرس ✨

- ✅ تعرفنا على مرافق مدرستنا الجميلة.
- ✅ تعلمنا حرف **الميم (م)** و كتبناه.
- ✅ حفظنا **آية الاستئذان** من سورة النور.
- ✅ تطبّقنا آداب الاستئذان عملياً.

---

> 🎉 **أحسنتَ! أنتَ بطل الأدب!** 👏⭐

---

## الدرس 5: في ساحة المدرسة

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L05"
  Thème : Les activités récréatives + آية التعاون.
  Nouveau حرف : الراء (ر).
  Compétences langagières : Décrire des actions (verbes simples).
  Note : La coopération est une valeur universelle importante à ancrer dès 1AP. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** تعريف الطفل ببيئة ساحة المدرسة، أفعال الحركة، حرف الراء (ر)، وقيمة "التعاون".
> **Objectif :** Découverte de la cour de récréation, les verbes d'action, la lettre Ra (ر), et la valeur de la "Coopération".
> 
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - العب مع طفلك لعبة "تقليد الحركات" (اجرِ، اقفز، قف).
> - ساعده في التعرف على حرف الراء في أسماء الفاكهة (ر... رمان، فـ...ـراولة).
> - Jouez au jeu des mouvements (Courir, Sauter, S'arrêter).
> - Trouvez la lettre 'Ra' dans des noms de fruits (Grena de 'Rouman', Fraise).
>
> **⚠️ تنبيه | Attention :**
> - حرف الراء (ر) لا يلتصق بما بعده؛ نبه طفلك لهذا عند الكتابة لتجنب الأخطاء.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #e6fcf5; padding: 20px; border-radius: 15px; border: 2px solid #087f5b;">
  <h2 style="color: #087f5b;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L05/play_child_card.svg" alt="في الساحة" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #099268;">ر</p>
  <p style="font-size: 20px;"><b>أنا أتعاون:</b> ألعب مع أصدقائي بحب 🤝</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ وصف الأنشطة في ساحة المدرسة بجمل بسيطة.
2. ✅ نطق حرف **الراء (ر)** و كتابته.
3. ✅ فهم معنى آية التعاون و تطبيقها.
4. ✅ استخدام أفعال الحركة: يجري، يلعب، يقفز.
5. ✅ إدراك أهمية التعاون في الألعاب الجماعية.

---

### 1. مرحاً في الساحة! 🤸‍♂️

<!-- ASSET: playground_scene → /assets/images/L05/playground_animated.gif
  DEV_NOTE: Illustration animée de la cour de récré avec Ahmed, Khadija et leurs
  camarades jouant ensemble. -->

بعد ساعات الدراسة، نخرج إلى الساحة لنلعب و نمرح. في الساحة نستطيع:

| النشاط | الفعل | الصورة |
|--------|-------|--------|
| الجري 🏃 | يَجْرِي أحمد بسرعة | <!-- ASSET: running.svg --> |
| القفز 🤸 | يَقْفِز مع أصدقائه | <!-- ASSET: jumping.svg --> |
| لعب الكرة ⚽ | يَلْعَب كرة القدم | <!-- ASSET: football.svg --> |
| التحدث مع الأصدقاء 🗣️ | يَتَحَدَّث و يضحك | <!-- ASSET: friends_chat.svg --> |
| التعاون 🤝 | يُسَاعِد من وقع | <!-- ASSET: helping.svg --> |

---

### 2. نتعلم حرف الراء (ر)

<!-- DEV_NOTE: letter_id = "RA"
  ASSET: letter_visual → /assets/letters/ra_animated.lottie
  Couleur : turquoise.
  Note de prononciation : le ر arabe est "roulé" (apical vibrant), différent
  du R français. Exercice de prononciation spécifique recommandé.
  حرف الراء لا يتصل بما يليه (حرف غير متصل من الجانب الأيسر).
  Ce point est important pour l'écriture. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| رَـ (فتحة) | رَكض 🏃 | 🔊 |
| رُـ (ضمة) | رُسوم 🎨 | 🔊 |
| رِـ (كسرة) | رِجل 🦵 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **رـ**كض | كـ**رـ**ة ⚽ | قَمَـ**ر** 🌙 |

**✍️ الكتابة** <!-- ASSET: stroke_guide_ra → /assets/handwriting/ra_strokes.json -->
<!-- DEV_NOTE: Le tracé de ر est SIMPLE — une courbe vers le bas. Insister sur
  le fait qu'il ne se connecte pas à gauche. -->

**كلمات جديدة مع حرف الراء:**

| الكلمة | الصورة | الصوت |
|--------|--------|-------|
| كُرَة | ⚽ | 🔊 |
| رَكض | 🏃 | 🔊 |
| قَمَر | 🌙 | 🔊 |

---

### 3. ☪️ التربية الإسلامية — آية التعاون

<!-- DEV_NOTE: آية من سورة المائدة، الآية 2.
  ASSET: audio_aya_taawun → /assets/audio/islamic/aya_maida_2.mp3 -->

قال الله تعالى (سورة المائدة، الآية 2):

---

> ### 📖 آية التعاون
> ## "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ"
>
> **سورة المائدة — الآية 2**

---

**الشرح:**
> تعاونوا مع بعضكم في فعل الخير و طاعة الله، و لا تتعاونوا في الأشياء السيئة.

**كيف نتعاون في الساحة؟**

| ✅ نفعل | ❌ لا نفعل |
|--------|---------|
| نتبادل الأدوار في اللعب | لا نستأثر بالكرة وحدنا |
| نساعد من وقع على الأرض | لا نضحك على من يسقط |
| نشجّع بعضنا: "هيا!" | لا نثبّط همّة أصدقائنا |
| نلعب وفق القواعد | لا نغشّ في اللعبة |

---

### 4. التمارين التفاعلية 🎮

**التمرين 1 — سباق الحروف 🏃‍♂️**

<!-- EXERCISE_TYPE: highlight_letter
  DEV_NOTE: Identifier Ra dans une liste de mots. -->

ضع دائرة حول حرف **الراء (ر)** في هذه الكلمات:

> **كُرَة &nbsp;&nbsp; سَاحة &nbsp;&nbsp; رَكض &nbsp;&nbsp; مَدْرَسَة &nbsp;&nbsp; قَمَر**

---

**التمرين 2 — ماذا يفعل أحمد؟ ⚽**

<!-- EXERCISE_TYPE: multiple_choice
  DEV_NOTE: Verbes d'action.
  ASSET: /assets/images/L05/ahmed_ball.png -->

أحمد يمسك الكرة.. هو:

1. ❌ يـنام
2. ✅ **يـلعب**
3. ❌ يـأكل

---

**التمرين 3 — فريق الخير 🤝**

<!-- EXERCISE_TYPE: true_false
  DEV_NOTE: Valeur de la Coopération. -->

عندما نلعب، نتعاون مع أصدقائنا..

- ✅ **صحيح**
- ❌ **خطأ**

---

**التمرين 4 — الحرف الضائع 🎾**

<!-- EXERCISE_TYPE: fill_in_the_blank
  ASSET: /assets/images/L05/ball.png -->

أكمل كلمة "كُـ...ـة":

1. ✅ **ر**
2. ❌ **د**

---

**التمرين 5 — صوت الراء 🔊**

<!-- EXERCISE_TYPE: audio_discrimination
  AUDIO_ASSETS: /assets/audio/L05/sound_r_ra.mp3, /assets/audio/L05/sound_r_ri.mp3 -->

استمع جيداً 🔊 ثم اختر الحركة الصحيحة:

1. 🔊 (رَـ...) ⮕ **رَـ**
2. 🔊 (رِـ...) ⮕ **رِـ**

---

---

### 5. مراجعة الدرس ✨

- ✅ وصفنا الأنشطة الممتعة في ساحة المدرسة.
- ✅ تعلمنا حرف **الراء (ر)**.
- ✅ حفظنا **آية التعاون** من سورة المائدة.
- ✅ أدركنا أهمية التعاون مع الأصدقاء.

---

> 🎉 **أحسنتَ! أنتَ رياضي و متعاون!** 🤸⭐

---

## الدرس 6: أدواتي المدرسية

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L06"
  Thème : Les fournitures scolaires + المحافظة على الممتلكات.
  Nouveau حرف : الدال (د).
  Activité spéciale : Remplir sa carte d'identité scolaire.
  Note : C'est le DERNIER cours de l'Unité 1. Prévoir un bilan d'unité complet
  et un badge de complétion. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** تسمية الأدوات المدرسية، حرف الدال (د)، والحرص على نظافة الأدوات.
> **Objectif :** Nommer les fournitures scolaires, introduire la lettre Dal (د), et sensibiliser à l'entretien de son matériel.
> 
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - ساعد طفلك على مراجعة محتويات مقلمته وتسميتها بالعربية (مبراة، ممحاة، قلم).
> - ابحثوا في المنزل عن أشياء فيها حرف الدال (د... دجاج، د... دلو).
> - Review the contents of the pencil case and name them in Arabic (Minshara, Mimhat, Qalam).
> - Look for household objects with 'D' (Poulet, Seau).
>
> **⚠️ تنبيه | Attention :**
> - حرف الدال (د) لا يلتصق بما بعده، مثل حرف الراء. تدربوا على كتابته بوضوح.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #fff4e6; padding: 20px; border-radius: 15px; border: 2px solid #fd7e14;">
  <h2 style="color: #fd7e14;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L06/tools_child_card.svg" alt="أدواتي" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #e8590c;">د</p>
  <p style="font-size: 20px;"><b>أنا نظيف:</b> أحافظ على أدواتي المدرسية ✨</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ تسمية الأدوات المدرسية الأساسية و وصفها.
2. ✅ نطق حرف **الدال (د)** و كتابته.
3. ✅ ملء بطاقة التعريف الشخصية.
4. ✅ اتخاذ قيمة **المحافظة على الممتلكات** كسلوك دائم.
5. ✅ بناء جملة وصفية: "هذا/هذه ... + وصف".

---

### 1. ما في حقيبتي؟ 🎒

<!-- ASSET: school_bag_illustration → /assets/images/L06/school_bag_interactive.svg
  DEV_NOTE: حقيبة تفاعلية — النقر عليها يخرج الأدوات واحدةً تلو الأخرى مع الاسم. -->

كل يوم أحمل حقيبتي إلى المدرسة. فيها أدواتي الجميلة:

| الأداة | الصورة | الاستعمال | الصوت |
|--------|--------|----------|-------|
| كِتَاب 📖 | <!-- ASSET: book.svg --> | أقرأ منه الدروس | 🔊 |
| كُرَّاس 📓 | <!-- ASSET: notebook.svg --> | أكتب فيه تمارينَ | 🔊 |
| قَلَم ✏️ | <!-- ASSET: pencil.svg --> | أكتب و أرسم به | 🔊 |
| مِمْحَاة 🧹 | <!-- ASSET: eraser.svg --> | أمحو بها عند الخطأ | 🔊 |
| مِسطَرة 📏 | <!-- ASSET: ruler.svg --> | أرسم بها الخطوط المستقيمة | 🔊 |
| مِقَصّ ✂️ | <!-- ASSET: scissors.svg --> | أقصّ الورق بعناية | 🔊 |

<!-- DEV_NOTE: المقصّ و المسطرة مضافَتان للتوسيع (تحسين نسبة إلى النسخة الأصلية). -->

---

### 2. نتعلم حرف الدال (د)

<!-- DEV_NOTE: letter_id = "DAL"
  ASSET: letter_visual → /assets/letters/dal_animated.lottie
  Couleur : doré/jaune.
  Note : مثل ر، حرف الدال لا يتصل بما يليه. Important pour l'écriture! -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| دَـ (فتحة) | دَفتر 📓 | 🔊 |
| دُـ (ضمة) | دُمية 🪆 | 🔊 |
| دِـ (كسرة) | دِيك 🐓 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **دـ**فتر | مَ**دـ**رسة | يَ**د** ✋ |

**✍️ الكتابة** <!-- ASSET: stroke_guide_dal → /assets/handwriting/dal_strokes.json -->

---

### 3. 🇩🇿 التربية المدنية — بطاقتي المدرسية

<!-- DEV_NOTE: Activité personnelle très engageante — l'élève remplit sa propre carte.
  Rendu par <IdentityCardActivity />.
  DATA_MODEL: Les informations renseignées sont pré-remplies depuis `student_profile`
  (prénom, nom, date de naissance) pour éviter les erreurs de saisie.
  L'élève peut les confirmer ou les compléter.
  ASSET: id_card_template → /assets/templates/student_id_card.svg
  (Template SVG personnalisable, exportable en PDF, imprimable.) -->

**لكل تلميذ بطاقة تعريف مدرسية فيها معلوماته الشخصية:**

```
╔══════════════════════════════════════════════╗
║         🏫 بطاقة التلميذ المدرسية           ║
╠══════════════════════════════════════════════╣
║  الاسم (الأول)  : ........................   ║
║  اللقب (العائلي): ........................   ║
║  تاريخ الميلاد : ....../ ....../..........   ║
║  الولاية        : ........................   ║
║  المدرسة        : ........................   ║
║  المستوى        : السنة الأولى ابتدائي       ║
║                                              ║
║  صورتي:  [ 📷 ]              🇩🇿            ║
╚══════════════════════════════════════════════╝
```

<!-- DEV_NOTE: Option "Imprimer" permettant aux parents d'imprimer la carte plastifiée.
  Ajouter la photo de l'élève si uploadée dans le profil parent. -->

---

### 4. المحافظة على الأدوات المدرسية

<!-- BLOOM: Niveau 5 (Synthèse — engagement comportemental). -->

أدواتي المدرسية ثمينة. يجب أن أحافظ عليها:

| ✅ نفعل | ❌ لا نفعل |
|--------|---------|
| نرتّب الحقيبة بعد المدرسة | لا نكسر الأقلام |
| نكتب اسمنا على أغراضنا | لا نمزّق الكراسات |
| نعيد كل شيء إلى مكانه | لا نعبث بأغراض الآخرين |
| نعتني بكتبنا | لا نرسم على الكتب المدرسية |

---

### 5. التمارين التفاعلية 🎮

**التمرين 1 — لغز الحقيبة 🎒**

<!-- EXERCISE_TYPE: matching
  DEV_NOTE: Associer l'outil à son nom.
  ASSET: /assets/images/L06/ruler.png, /assets/images/L06/scissors.png -->

صِلْ كل أداة باسمها الصحيح:

- **مِسطَرة** ⮕ [ 📏 ]
- **مِقَصّ** ⮕ [ ✂️ ]

---

**التمرين 2 — بطل النظافة ✨**

<!-- EXERCISE_TYPE: true_false
  DEV_NOTE: Valeur de la conservation du matériel. -->

أرسمُ على طاولة القسم وعلى كراسي المدرسة..

- ❌ **صواب**
- ✅ **خطأ، أحافظ على نظافة مدرستي**

---

**التمرين 3 — لعبة الدال 🥁**

<!-- EXERCISE_TYPE: highlight_letter
  DEV_NOTE: Trouver Dal dans les mots. -->

اختر الكلمات التي فيها حرف **الدال (د)**:

- ✅ **دَفتر**
- ❌ **رَكض**
- ✅ **مَدرسة**
- ✅ **ِيَد**

---

**التمرين 4 — مَنْ أنا؟ 🪪**

<!-- EXERCISE_TYPE: multiple_choice
  DEV_NOTE: Vocabulaire de la carte d'identité. -->

أين أجد "تاريخ ميلادي" و "اسمي الكامل"؟

1. ❌ في كتاب القراءة
2. ✅ **في بطاقتي المدرسية**
3. ❌ في المقلمة

---

**التمرين 5 — صوت الدال 🔊**

<!-- EXERCISE_TYPE: audio_discrimination
  AUDIO_ASSETS: /assets/audio/L06/sound_d_da.mp3, /assets/audio/L06/sound_d_di.mp3 -->

استمع جيداً 🔊 ثم اختر الصوت الذي سمعته:

1. 🔊 (دِ...) ⮕ **دِ**
2. 🔊 (دَ...) ⮕ **دَ**

---

---

### 6. مراجعة الدرس و بداية المحور الثاني ✨

- ✅ تعرفنا على الأدوات المدرسية و استعمالاتها.
- ✅ تعلمنا حرف **الدال (د)**.
- ✅ ملأنا بطاقتنا المدرسية الشخصية.
- ✅ تعلمنا المحافظة على ممتلكاتنا.

<!-- DEV_NOTE: FIN DE L'UNITÉ 1 ! Afficher le bilan d'unité complet.
  Composant : <UnitCompletionCelebration unit="1" />
  Récapitulatif :
    - Leçons complétées : 6/6
    - Lettres apprises : أ ب ت ث ج ح م ر د (9 حروف)
    - Islamique : دعاء الدخول، آية الاستئذان، آية التعاون، حديث الرحمة
    - Valeurs civiques : احترام الأسرة، الاستئذان، التعاون، المحافظة على الممتلكات
  Badge déblocage : 🏆 "بطل الأسرة — البادج الأول"
  XP Total Unité 1 : 600 XP -->

---

> 🎉 **أحسنتَ! أتممتَ المحور الأول بنجاح! أنتَ الأفضل!** 🏆🌟

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  UNITÉ 2 : الحي و القرية (Le Quartier et le Village)
  ASSET: unit_banner → /assets/images/units/U2_village_banner.svg
  Badge : 🏘️ "ابن الحي" (Fils du Quartier)
  ═══════════════════════════════════════════════════════════════════════════ -->

# 📖 المحور الثاني: الحي و القرية

---

## الدرس 7: في القرية

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L07"
  Thème : La vie rurale + حديث الصدق + مقارنة قرية/مدينة.
  Nouveau حرف : العين (ع).
  Note culturelle : L'Algérie est un pays à forte tradition rurale. Beaucoup
  d'élèves viennent de villages ou y ont de la famille. Ce cours est très
  ancré dans leur vécu. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** وصف القرية، حرف العين (ع)، حديث الصدق، ومقارنة القرية بالمدينة.
> **Objectif :** Décrire la vie à la campagne, la lettre Ain (ع), le Hadith sur la vérité, et comparer ville/campagne.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - إن كان لديكم قريب يسكن في الريف، تحدثوا عنه مع طفلك.
> - اطلب منه ذكر حيوان يعيش في الريف (بقرة، خروف) ونطق اسمه بالعربية.
> - Si vous avez de la famille à la campagne, parlez-en avec votre enfant.
> - Demandez-lui de nommer un animal de la ferme en Arabe.
>
> **⚠️ تنبيه | Attention :**
> - صوت العين (ع) عميق من الحلق. لا تخلط بينه وبين الهمزة. تدرب معه باستمرار.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #ebfbee; padding: 20px; border-radius: 15px; border: 2px solid #2f9e44;">
  <h2 style="color: #2f9e44;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L07/village_child_card.svg" alt="القرية" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #2b8a3e;">ع</p>
  <p style="font-size: 20px;"><b>أنا صادق:</b> الصدق يصلح إلى الجنة 🌿</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ وصف خصائص القرية و مميزاتها.
2. ✅ نطق حرف **العين (ع)** و كتابته.
3. ✅ حفظ **حديث الصدق** و تطبيقه.
4. ✅ المقارنة بين **القرية** و **المدينة**.
5. ✅ استخدام المفردات الزراعية الأساسية.

---

### 1. القرية الجميلة 🌾

<!-- ASSET: village_scene → /assets/images/L07/algerian_village.png
  DEV_NOTE: Illustration d'un village algérien typique : maisons en pisé,
  champs verts, animaux, montagne en arrière-plan. -->

القرية مكان هادئ رائع. فيها نجد:

| عنصر القرية | الصورة | الصوت |
|-------------|--------|-------|
| حُقُول خضراء واسعة 🌿 | <!-- ASSET: fields.svg --> | 🔊 |
| حَيَوانات: بقرة 🐄، خروف 🐑، دجاج 🐔 | <!-- ASSET: animals.svg --> | 🔊 |
| هَوَاء نقي و نظيف 💨 | <!-- ASSET: fresh_air.svg --> | 🔊 |
| مَزَارع يعمل فيها الفلاحون 🚜 | <!-- ASSET: farm.svg --> | 🔊 |
| بُيُوت صغيرة و حدائق 🌸 | <!-- ASSET: village_houses.svg --> | 🔊 |

---

### 2. نتعلم حرف العين (ع)

<!-- DEV_NOTE: letter_id = "AIN"
  ASSET: letter_visual → /assets/letters/ain_animated.lottie
  Couleur : vert forêt.
  NOTE PHONÉTIQUE CRITIQUE — Le حرف ع est un son pharyngal sonore, totalement
  inexistant dans les langues européennes. C'est l'un des sons LES PLUS DIFFICILES
  pour les apprenants non-arabophones. Pour les enfants algériens (Darija speakers),
  ce son est familier. Mais insister sur la qualité articulatoire.
  ASSET: pronunciation_video_ain → /assets/video/letters/ain_pronunciation.mp4
         (Vidéo montrant la position de la gorge pour prononcer ع correctement) -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| عَـ (فتحة) | عَيْن 👁️ | 🔊 |
| عُـ (ضمة) | عُصفور 🐦 | 🔊 |
| عِـ (كسرة) | عِنَب 🍇 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **عـ**ين | مَزرَ**عـ**ة | سَمِيـ**ع** |

---

### 3. ☪️ التربية الإسلامية — حديث الصدق

<!-- DEV_NOTE: Hadith. Source: Bukhari & Muslim (متفق عليه).
  ASSET: audio_hadith_sidq → /assets/audio/islamic/hadith_sidq.mp3 -->

قال رسول الله ﷺ:

---

> ### 🤲 حديث الصدق
> ## "إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ"
>
> **المصدر:** متفق عليه (البخاري و مسلم)

---

**الشرح:**
> الصدق يقودنا إلى الأعمال الطيبة، و الأعمال الطيبة تقودنا إلى الجنة. 🌿

**لماذا الصدق مهم؟**

| فائدة الصدق | مثال من حياتنا |
|------------|----------------|
| 💚 يريح الضمير | عندما أعترف بخطئي، أشعر بالارتياح |
| 💛 يكسب محبة الناس | الصادق يحبه الجميع |
| 💜 يكسب رضا الله | الله يحب الصادقين |
| 🔵 يبني الثقة | أصدقائي يثقون بي |

---

### 4. 🇩🇿 التربية المدنية — القرية و المدينة

<!-- DEV_NOTE: Tableau comparatif interactif. Composant : <ComparisonTable />.
  L'élève peut faire glisser des images/mots vers la bonne colonne. -->

| في القرية 🌾 | في المدينة 🏙️ |
|------------|-------------|
| حقول خضراء | مباني عالية و شوارع واسعة |
| حيوانات كثيرة | محلات و مراكز تجارية |
| هدوء و نقاء | حركة و ازدحام |
| فلاحون يعملون في الأرض | موظفون و تجار |
| مياه نبع طبيعية | شبكة مياه حضرية |

<!-- EXERCISE_TYPE: open_question (pensée critique)
  BLOOM: Niveau 4 (Analyse — Évaluation personnelle). -->

### 5. التمارين التفاعلية 🎮

**التمرين 1 — أين نجد هذا؟ 🌾**

<!-- EXERCISE_TYPE: matching
  DEV_NOTE: Village vs City elements.
  ASSET: /assets/images/L07/farm.png, /assets/images/L07/building.png -->

صِلْ كل عنصر بمكانه:

- **حُقول خضراء** ⮕ [ **القرية** 🌾 ]
- **مباني شاهقة** ⮕ [ **المدينة** 🏙️ ]

---

**التمرين 2 — بيتي العين 👁️**

<!-- EXERCISE_TYPE: highlight_letter
  DEV_NOTE: Find the letter Ain in the word. -->

ضع دائرة حول حرف **العين (ع)** في هذه الكلمات:

> **عَيْن &nbsp;&nbsp; عِنَب &nbsp;&nbsp; مَزْرَعة &nbsp;&nbsp; عُصْفُور**

---

**التمرين 3 — أنا صادق 💪**

<!-- EXERCISE_TYPE: true_false
  DEV_NOTE: Application du Hadith de la vérité. -->

كسرت لعبة صديقي. هل أقول له الحقيقة؟

- ✅ **نعم، الصدق واجب**
- ❌ **لا، أخفي الأمر**

---

**التمرين 4 — حيوان القرية 🐄**

<!-- EXERCISE_TYPE: multiple_choice
  ASSET: /assets/images/L07/cow.png -->

هذا الحيوان يعيش في القرية 🐄 هو:

1. ❌ حوت
2. ✅ **بقرة**
3. ❌ أسد

---

**التمرين 5 — من أين صوت العين؟ 🔊**

<!-- EXERCISE_TYPE: audio_discrimination
  AUDIO_ASSETS: /assets/audio/L07/sound_ain.mp3 -->

استمع جيداً 🔊 ثم اختر الحرف الصحيح:

1. 🔊 (عَ...) ⮕ **عَـ**
2. 🔊 (عِ...) ⮕ **عِـ**

---

**💭 سؤال للتأمل:** أين تفضل أن تعيش؟ في القرية أم في المدينة؟ لماذا؟

*(لا توجد إجابة صحيحة أو خاطئة — المهم التفكير و التعبير!)*

---

---

### 5. مراجعة الدرس ✨

- ✅ وصفنا خصائص **القرية الجميلة**.
- ✅ تعلمنا حرف **العين (ع)**.
- ✅ حفظنا **حديث الصدق** من أصح الكتب بعد القرآن.
- ✅ قارنا بين الحياة في القرية و المدينة.

---

> 🎉 **أحسنتَ يا قروي الجميل!** 🌾⭐

---

## الدرس 8: مدينتنا

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L08"
  Thème : La vie urbaine + حق الجار.
  Nouveau حرف : الحاء (ح) — révision approfondie.
  Note : حرف الحاء a déjà été introduit en L03. Ce cours l'approfondit dans
  un contexte nouveau (حياة المدينة). Mentionner la révision dans l'interface.
  "تذكّر! تعلمنا هذا الحرف في الدرس 3 أيضاً!" -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** وصف المدينة، مراجعة حرف (ح)، وقيمة "حق الجار".
> **Objectif :** Décrire la ville, réviser la lettre Ha (ح), et comprendre les droits du voisin.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - غداً، شجع طفلك على إلقاء التحية على جيرانكم بنفسه.
> - اطلب منه تسمية 3 مرافق في مدينتكم (مسجد، مدرسة، سوق).
> - Encouragez votre enfant à saluer les voisins le lendemain.
>
> **⚠️ تنبيه | Attention :**
> - حرف (ح) ليس له نقاط أبداً. ساعد طفلك على التمييز بين (ج) و (ح) و (خ).

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #edf2ff; padding: 20px; border-radius: 15px; border: 2px solid #4263eb;">
  <h2 style="color: #4263eb;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L08/city_child_card.svg" alt="مدينتنا" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #3b5bdb;">ح</p>
  <p style="font-size: 20px;"><b>أنا حسن الجوار:</b> أسلّم و أساعد جاري 🤝</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ وصف خصائص المدينة و مرافقها.
2. ✅ تعميق التعرف على حرف **الحاء (ح)**.
3. ✅ فهم **حق الجار** و تطبيقه.
4. ✅ استخدام مفردات حضرية جديدة.
5. ✅ تمييز الحاء عن الجيم و الخاء بصرياً.

---

### 1. مدينتنا العامرة 🏙️

<!-- ASSET: city_scene → /assets/images/L08/algerian_city.png
  DEV_NOTE: Illustration d'une ville algérienne moderne : immeubles, rues,
  mosquée, marché, hôpital. Représentations culturellement précises. -->

المدينة مليئة بالحركة و النشاط. فيها:

| مرفق المدينة | الصورة | الصوت |
|-------------|--------|-------|
| عِمارات عالية 🏢 | <!-- ASSET: buildings.svg --> | 🔊 |
| شوارع واسعة مزدحمة بالسيارات 🚗 | <!-- ASSET: street.svg --> | 🔊 |
| محلات تجارية و أسواق 🛍️ | <!-- ASSET: market.svg --> | 🔊 |
| مستشفيات و مدارس و جامعات 🏥📚 | <!-- ASSET: hospital_school.svg --> | 🔊 |
| مساجد و حدائق عامة 🕌🌳 | <!-- ASSET: mosque_park.svg --> | 🔊 |

---

### 2. ☪️ التربية الإسلامية و المدنية — حق الجار

<!-- DEV_NOTE: Sujet transversal Islam + Civic. حق الجار est un thème majeur.
  SOURCE HADITH: البخاري و مسلم.
  ASSET: audio_hadith_jar → /assets/audio/islamic/hadith_jibreel_jar.mp3 -->

للجيران حقوق علينا. قال رسول الله ﷺ:

---

> ### 🤲 حديث حق الجار
> ## "مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ"
>
> **المصدر:** متفق عليه

---

**الشرح:** جبريل عليه السلام كان يذكّر النبي ﷺ دائماً بحق الجار، حتى ظن النبي ﷺ أن الجار سيرث من جاره!

**حقوق الجار علينا:**

| الحق | كيف نطبّقه؟ |
|------|------------|
| 🌸 السلام | نبدأ جارنا بالسلام عند اللقاء |
| 🤝 المساعدة | نعينه إذا احتاج |
| 🤫 الهدوء | لا نؤذيه بالصوت العالي |
| 🗑️ النظافة | لا نرمي القمامة أمام بيته |
| 🎊 الزيارة | نزوره في المناسبات السعيدة |
| 🤒 العيادة | نزوره إذا مرض |

---

### 3. التمارين التفاعلية 🎮

**التمرين 1 — مرفق المدينة 🏙️**

<!-- EXERCISE_TYPE: matching -->

صِلْ كل مرفق بصورته المناسبة:

- **مُستَشفى** ⮕ [ 🏥 ]
- **مَسجِد** ⮕ [ 🕌 ]

---

**التمرين 2 — هل تتذكر حرف الحاء؟ 🔄**

<!-- EXERCISE_TYPE: highlight_letter -->

ضع دائرة حول كل حرف **(ح)** في هذه الكلمات:

> **حَدِيقة &nbsp;&nbsp; حُقول &nbsp;&nbsp; صَبَاح &nbsp;&nbsp; حِصَان**

---

**التمرين 3 — جاري أمانة 🎝️**

<!-- EXERCISE_TYPE: true_false -->

أضع الموسيقى بصوت عالٍ جداً داعماً جاري..

- ❌ **صواب، هذا حقيـ**
- ✅ **خطأ، يجب أن أحافظ على هدوء جاري**

---

**التمرين 4 — حق أم لا؟ ⚖️**

<!-- EXERCISE_TYPE: multiple_choice -->

من حقوق الجار علينا:

1. ❌ أخذ طعامه دون إذن
2. ✅ **مساعدته عند الحاجة**
3. ❌ إزعاجه بالضوضاء

---

**التمرين 5 — صوت الحاء 🔊**

<!-- EXERCISE_TYPE: audio_discrimination -->

استمع 🔊 ثم اختر الكلمة التي تبدأ بحرف الحاء:

1. 🔊 ⮕ **حَدِيقة** ✅
2. 🔊 ⮕ **جَمَل** ❌

---

### مراجعة الدرس ✨

- ✅ وصفنا مدينتنا العامرة و مرافقها.
- ✅ عمّقنا معرفتنا بحرف **الحاء (ح)**.
- ✅ فهمنا **حقوق الجار** و أهميتها في الإسلام.

---

## الدرس 9: في الحفل

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L09"
  Thème : Les fêtes et célébrations + الأمانة.
  Nouveau حرف : الجيم (ج) — révision.
  Note : Dernier cours de l'Unité 2. Prévoir bilan d'unité. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** وصف الاحتفالات، مراجعة حرف الجيم (ج)، وقيمة "الأمانة".
> **Objectif :** Décrire une fête, réviser la lettre Jim (ج), et comprendre la valeur de l'honneteté.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - تحدثوا عن آخر حفل حضرتموه ضمن العائلة.
> - اطلب منه تسمية 3 كلمات فيها حرف الجيم (ج).
> - Parlez de la dernière fête en famille. Quels mots en Arabe connaissez-vous?
>
> **⚠️ تنبيه | Attention :**
> - الأمانة قيمة كبيرة. احرص على تطبيقها مع طفلك في الحياة اليومية.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #fff0f6; padding: 20px; border-radius: 15px; border: 2px solid #e64980;">
  <h2 style="color: #e64980;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L09/party_child_card.svg" alt="الحفل" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #c2255c;">ج</p>
  <p style="font-size: 20px;"><b>أنا أمين:</b> أعيد كل شيء لأهله 🧡</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ وصف حفل سعيد و التعبير عن الفرح.
2. ✅ تعميق التعرف على حرف **الجيم (ج)**.
3. ✅ فهم قيمة **الأمانة** و تطبيقها.
4. ✅ استخدام كلمات التعبير عن المشاعر: فرح، سعادة، مرح.

---

### 1. يوم الحفل 🎉

<!-- ASSET: party_scene → /assets/images/L09/celebration.png
  DEV_NOTE: Illustration d'une fête d'anniversaire ou d'une fête scolaire
  algérienne, avec ballons, gâteau, enfants heureux en tenues colorées. -->

في المدرسة أو في البيت، نقيم حفلات سعيدة. في الحفل:

| نشاط الحفل | الصورة | الشعور |
|-----------|--------|--------|
| نلبس أجمل الثياب 👗👘 | <!-- ASSET: dress_up.svg --> | 😊 فرح |
| نأكل الحلويات و الكعك 🎂 | <!-- ASSET: cake.svg --> | 😋 سعادة |
| نلعب و نمرح و نضحك 😂 | <!-- ASSET: play.svg --> | 😄 مرح |
| نقدم هدايا للأصدقاء 🎁 | <!-- ASSET: gift.svg --> | 💖 محبة |
| نغني أناشيد جميلة 🎵 | <!-- ASSET: singing.svg --> | 🌟 بهجة |

---

### 2. ☪️ التربية الإسلامية — الأمانة

<!-- DEV_NOTE: آية قرآنية من سورة النساء، الآية 58.
  ASSET: audio_aya_amana → /assets/audio/islamic/aya_nisa_58.mp3 -->

قال الله تعالى (سورة النساء، الآية 58):

---

> ### 📖 آية الأمانة
> ## "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَى أَهْلِهَا"
>
> **سورة النساء — الآية 58**

---

**كيف نكون أمناء؟**

| موقف | التصرف الأمين |
|------|--------------|
| 🖊️ استعرت قلماً من صديقي | أعيده بعد الاستعمال مباشرة |
| 💰 وجدت نقوداً على الأرض | أسلّمها للمعلمة أو أعطيها صاحبها |
| 🤫 أخبرني صديقي بسره | لا أحكي سره لأحد |
| 🎒 حقيبة صديقي بجانبي | لا أأخذ منها شيئاً دون إذنه |

---

### 3. التمارين التفاعلية 🎮

**التمرين 1 — حفلة الفرح 🎉**

<!-- EXERCISE_TYPE: matching -->

صِلْ كل ٕنشاط بالشعور المناسب:

- **نأكل الكعك** ⮕ [ 😋 سعادة ]
- **نقدّم هدايا** ⮕ [ 💖 محبة ]

---

**التمرين 2 — حرف الجيم في الحفل 🧨**

<!-- EXERCISE_TYPE: highlight_letter -->

ضع دائرة حول حرف **(ج)** في هذه الكلمات:

> **جَمَل &nbsp;&nbsp; حَفْل &nbsp;&nbsp; جَمِيل &nbsp;&nbsp; مَسْجِد**

---

**التمرين 3 — أنا أمين 🤞**

<!-- EXERCISE_TYPE: multiple_choice -->

وجدتُ نقودًا على الأرض. ماذا أفعل؟

1. ❌ أضعها في جيبي
2. ✅ **أسلّمها للمعلمة**
3. ❌ أتركها على الأرض

---

**التمرين 4 — كيف نكون أمناء؟ 🚫**

<!-- EXERCISE_TYPE: true_false -->

استعرتُ قلمًا من صديقي. يمكنني أن أحتفظ به لأنهُ أجمل..

- ❌ **صواب**
- ✅ **خطأ، أعيد كل شيء لأهله**

---

**التمرين 5 — صوت الجيم 🔊**

<!-- EXERCISE_TYPE: audio_discrimination -->

استمع 🔊 ثم اختر الكلمة التي تبدأ بحرف الجيم:

1. 🔊 ⮕ **جَمَل** ✅
2. 🔊 ⮕ **حِصَان** ❌

---

### 4. مراجعة الدرس ✨ + بداية المحور الثالث

- ✅ وصفنا حفلاتنا السعيدة.
- ✅ عمّقنا معرفتنا بحرف **الجيم (ج)**.
- ✅ فهمنا قيمة **الأمانة** العظيمة.

<!-- DEV_NOTE: FIN DE L'UNITÉ 2.
  Badge déblocage : 🏘️ "ابن الحي — البادج الثاني"
  Nouvelles lettres de l'unité 2 : ع، ح، ج (révision approfondie)
  Cumul XP : 450 XP (Unité 2). Total cumulé : 1050 XP. -->

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  UNITÉ 3 : الرياضة و التسلية (Sport et Loisirs)
  ASSET: unit_banner → /assets/images/units/U3_sports_banner.svg
  Badge : ⚽ "البطل الرياضي" (Le Champion Sportif)
  ═══════════════════════════════════════════════════════════════════════════ -->

# 📖 المحور الثالث: الرياضة و التسلية

---

## الدرس 10: في معرض الكتاب

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L10"
  Thème : L'amour de la lecture + الصاد.
  Note pédagogique : Inclure ce cours dans le "محور الرياضة و التسلية" signifie que
  la LECTURE est considérée comme un loisir noble. Message fort à valoriser! -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** اكتشاف متعة القراءة، حرف الصاد (ص)، وتعزيز حب الكتاب.
> **Objectif :** Découvrir le plaisir de la lecture, introduire la lettre Sad (ص), et promouvoir l'amour des livres.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - اقرأ مع طفلك قصة قصيرة قبل النوم.
> - ابحثوا في المنزل عن كلمات فيها حرف الصاد (ص).
> - Lisez ensemble une courte histoire avant le coucher.
> - Cherchez des mots avec la lettre Sad en rentrant de l'école.
>
> **⚠️ تنبيه | Attention :**
> - صوت الصاد (ص) " متفخّم» مثل السين لكن بصوت أعمق. ساعد طفلك على التمييز بين (ص) و (س).

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #fdf3e7; padding: 20px; border-radius: 15px; border: 2px solid #e67700;">
  <h2 style="color: #e67700;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L10/book_child_card.svg" alt="أحب القراءة" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #d9480f;">ص</p>
  <p style="font-size: 20px;"><b>أنا قارئ:</b> الكتاب صديقي الأمين 📚</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ اكتشاف متعة القراءة و اقتناء الكتب.
2. ✅ نطق حرف **الصاد (ص)** و كتابته.
3. ✅ وصف معرض الكتاب و محتوياته.
4. ✅ استخدام تعبيرات التفضيل: "أحب / أفضل".

---

### 1. معرض الكتاب 📚

<!-- ASSET: book_fair → /assets/images/L10/book_fair.png
  DEV_NOTE: Illustration d'un salon du livre avec beaucoup de couleurs,
  enfants feuilletant des livres, stands colorés — environnement joyeux. -->

معرض الكتاب مكان رائع زرناه مع معلمتنا. وجدنا فيه:

| نوع الكتاب | مثال | لماذا نحبه؟ |
|-----------|------|------------|
| قِصَص مسلية 📖 | قصة الأرنب و السلحفاة | تُفَرِّح القلب |
| كتب علمية 🔬 | كتاب عن الحيوانات | تزيد المعرفة |
| كتب تلوين 🎨 | كتاب رسم الحيوانات | تطوّر الإبداع |
| كتب دينية ☪️ | قصص الأنبياء | تعلّمنا الأخلاق |
| كتب وطنية 🇩🇿 | تاريخ الجزائر | تعزز الانتماء |

<!-- ASSET: audio_nashid_book → /assets/audio/L10/nashid_book.mp3
  DEV_NOTE: نشيد قصير عن الكتاب: "الكتاب صديقي، يعلّمني و يسعدني..." -->

---

### 2. نتعلم حرف الصاد (ص)

<!-- DEV_NOTE: letter_id = "SAD"
  ASSET: letter_visual → /assets/letters/sad_animated.lottie
  Couleur : brun doré.
  NOTE PHONÉTIQUE — Le ص est une consonne emphatique (مفخّمة). Son articulation
  influence les voyelles voisines. Important de distinguer ص / س en 1AP.
  EXERCISE: Paires minimales ص/س : سام/صام، سار/صار. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| صَـ (فتحة) | صَحيفة 📰 | 🔊 |
| صُـ (ضمة) | صُندوق 📦 | 🔊 |
| صِـ (كسرة) | صِحّة 💚 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **صـ**حيفة | قِـ**صـ**ص | مَعرِ**ض** |

---

### 3. التمارين التفاعلية 🎮

**التمرين 1 — صديقي الكتاب 📚**

<!-- EXERCISE_TYPE: matching -->

صِلْ نوع الكتاب بالفائدة المناسبة:

- **كتب علمية** ⮕ [ تزيد المعرفة 🔬 ]
- **قصص مسلية** ⮕ [ تُفَرّح القلب 📖 ]

---

**التمرين 2 — صيد الصاد 🐟**

<!-- EXERCISE_TYPE: highlight_letter -->

ضع دائرة حول حرف **(ص)** في هذه الكلمات:

> **صَحِيفة &nbsp;&nbsp; صُندوق &nbsp;&nbsp; مَعْرِض &nbsp;&nbsp; قِصَص**

---

**التمرين 3 — ماذا تحب أن تقرأ؟ 💬**

<!-- EXERCISE_TYPE: multiple_choice -->

أي كتاب يجعلك تعرف أخلاق الأنبياء؟

1. ❌ كتاب تلوين
2. ❌ كتاب رياضيات
3. ✅ **كتاب قصص الأنبياء**

---

**التمرين 4 — المعرض الجميل ✨**

<!-- EXERCISE_TYPE: true_false -->

معرض الكتاب مكان رائع للزيارة و البحث..

- ✅ **صحيح**
- ❌ **خطأ**

---

**التمرين 5 — صوت الصاد 🔊**

<!-- EXERCISE_TYPE: audio_discrimination -->

استمع 🔊 ثم اختر الصوت الصحيح:

1. 🔊 ⮕ **صَحِيفة** ✅
2. 🔊 ⮕ **سَيارة** ❌

---

### 4. التمارين و المراجعة ✨

- ✅ اكتشفنا متعة معرض الكتاب.
- ✅ تعلمنا حرف **الصاد (ص)**.
- ✅ أدركنا أن القراءة هي أفضل هواية.

---

## الدرس 11: مباراة في كرة القدم

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L11"
  Thème : Le football + الروح الرياضية.
  Nouveau حرف : القاف (ق).
  Grammaire : ظروف المكان — أمام، خلف.
  Note culturelle : Le football est LA passion nationale en Algérie.
  Ce cours crée un très fort engagement (surtout chez les garçons). -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** وصف المباراة، حرف القاف (ق)، كلمات المكان (أمام/خلف)، والروح الرياضية.
> **Objectif :** Décrire un match de foot, la lettre Qaf (ق), les prépositions spatiales, et l'esprit sportif.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - شاهدوا معًا لقطات دوري أو مباراة و تحدثوا بالعربية عما ترون.
> - استخدموا كلمتي أمام/خلف في لعبة سريعة (ن-ضع شيئًا أمام طفلك و يشرح).
> - Regardez des extraits de foot ensemble et commentez en Arabe.
> - Jeu: placer des objets "Devant" ou "Derrière" pour pratiquer les prépositions.
>
> **⚠️ تنبيه | Attention :**
> - حرف القاف (ق) له نقطتان في الأعلى. تميّز بينه وبين الفاء الذي له نقطة واحدة في الأسفل.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #fff3cd; padding: 20px; border-radius: 15px; border: 2px solid #ffa200;">
  <h2 style="color: #ffa200;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L11/football_child_card.svg" alt="كرة القدم" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #d9480f;">ق</p>
  <p style="font-size: 20px;"><b>أنا رياضي:</b> ألعب بشرف و أحترم الخصم ⚽</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ وصف مباراة كرة القدم بمفردات متنوعة.
2. ✅ نطق حرف **القاف (ق)** و كتابته.
3. ✅ استخدام كلمات المكان: **أمام** و **خلف**.
4. ✅ تبنّي مبادئ **الروح الرياضية النظيفة**.
5. ✅ بناء جمل وصفية بسيطة عن اللاعبين.

---

### 1. يوم المباراة ⚽🏟️

<!-- ASSET: football_match → /assets/images/L11/football_match.png
  DEV_NOTE: Stade algérien, foule enthousiaste, joueurs en maillots vert/blanc
  (couleurs de l'équipe nationale). Ahmed et ses amis jouent dans le stade. -->

في الملعب اليوم، مباراةٌ رائعة! الفريقان يتنافسان بأدب و روح رياضية. اللاعبون:

| الفعل | المثال |
|-------|--------|
| 🏃 يركضون | أحمد يركض بسرعة نحو المرمى |
| 🤝 يمرّرون الكرة | يمرّر الكرة لزميله بذكاء |
| 🥅 يحاولون التسجيل | يسدّد كرة قوية نحو المرمى |
| 👏 يشجعون | الجمهور يشجّع و يصفّق |

---

### 2. نتعلم حرف القاف (ق)

<!-- DEV_NOTE: letter_id = "QAF"
  ASSET: letter_visual → /assets/letters/qaf_animated.lottie
  Couleur : bordeaux/dark red.
  NOTE PHONÉTIQUE — Le ق est une occlusive uvulaire, prononcée du fond de
  la gorge. Distinctif du ك. Exercice de discrimination ق/ك important.
  DEUX POINTS au-dessus. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| قَـ (فتحة) | قَدَم 🦶 | 🔊 |
| قُـ (ضمة) | قُطن ☁️ | 🔊 |
| قِـ (كسرة) | قِطة 🐱 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **قـ**دم | مُبَاـ**قـ**اة | حقيـ**ق**ة |

---

### 3. كلمات المكان: أمام و خلف

<!-- DEV_NOTE: Introduction aux prépositions de lieu. Rendu par <SpatialLearning />.
  Utiliser des illustrations 3D ou des animations pour montrer la relation spatiale.
  BLOOM: Niveau 2 (Compréhension spatiale). -->

| الكلمة | المعنى | مثال |
|--------|--------|------|
| أَمَامَ | الجهة المقابلة | السبورة **أمامَ** التلاميذ |
| خَلْفَ | الجهة الأخرى | الحديقة **خلفَ** البيت |

**التمرين — ضع (أمام) أو (خلف):**

> 1. المدرس يقف `...` التلاميذ. ← **أمام**
> 2. الكرسي `...` الطاولة. ← **خلف**
> 3. الحارس يقف `...` المرمى. ← **أمام**
> 4. الحديقة `...` البيت. ← **خلف**

---

### 4. الروح الرياضية 🤝

<!-- BLOOM: Niveau 5 (Synthèse comportementale — valeurs sportives). -->

| المنتصر يتصرف هكذا ✅ | الخاسر يتصرف هكذا ✅ |
|----------------------|---------------------|
| يفرح بتواضع و لا يفتخر | يقبل النتيجة برحابة صدر |
| يصافح الفريق الخاسم | يحاول الفوز في المرة القادمة |
| يشكر الله على الفوز | لا يتشاجر أو يبكي |
| يمدح الفريق الآخر | يستفيد من أخطائه |

---

### 5. مراجعة الدرس ✨

- ✅ وصفنا مباراة كرة القدم.
- ✅ تعلمنا حرف **القاف (ق)**.
- ✅ تعلمنا كلمات المكان: **أمام** و **خلف**.
- ✅ تبنّينا مبادئ الروح الرياضية.

---

## الدرس 12: أنواع الرياضة

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L12"
  Thème : Les différents sports + فوائد الرياضة + دعاء النوم.
  Nouveaux حروف : الطاء (ط) و الظاء (ظ).
  Note : Dernier cours de l'Unité 3. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** التعرف على أنواع الرياضة، حرفي (ط/ظ)، دعاء النوم، وفوائد الرياضة.
> **Objectif :** Connaître différents sports, les lettres Ta (ط) et Dha (ظ), le Dua du sommeil, et les bienfaits du sport.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - تأكد مع طفلك من قول دعاء النوم قبل النوم.
> - اتفق على رياضة تمارسونها معاً بشكل منتظم في الأسبوع (20 دقيقة كافية).
> - Assurez-vous qu'il récite le Dua avant de dormir.
> - Choisissez un sport à pratiquer ensemble chaque semaine.
>
> **⚠️ تنبيه | Attention :**
> - حرف الظاء (ظ) هو نفس شكل الطاء لكن مع نقطة فوقها. ساعد طفلك على التمييز.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #f8f9fa; padding: 20px; border-radius: 15px; border: 2px solid #495057;">
  <h2 style="color: #495057;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L12/sports_child_card.svg" alt="أنواع الرياضة" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #343a40;">ط &nbsp;&nbsp; ظ</p>
  <p style="font-size: 20px;"><b>أنا صحيح:</b> الرياضة تقوّي جسمي و عقلي 💪</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ التعرف على رياضات متنوعة و تسميتها.
2. ✅ نطق حرفَي **الطاء (ط)** و **الظاء (ظ)** و التمييز بينهما.
3. ✅ حفظ **دعاء النوم**.
4. ✅ ذكر فوائد الرياضة على الجسم و العقل.

---

### 1. الرياضة للجميع! 🏊‍♂️🚴‍♀️

<!-- ASSET: sports_collage → /assets/images/L12/sports_types.png
  DEV_NOTE: Collage de sports pratiqués en Algérie. -->

الرياضة أنواع رائعة و كلها مفيدة:

| الرياضة | الصورة | تحتاج |
|---------|--------|-------|
| السِّبَاحة 🏊 | <!-- ASSET: swimming.svg --> | حوض مائي |
| رُكوب الدَّرَّاجة 🚴 | <!-- ASSET: cycling.svg --> | دراجة هوائية |
| الجَري 🏃 | <!-- ASSET: running.svg --> | مضمار أو حديقة |
| كُرة السَّلة 🏀 | <!-- ASSET: basketball.svg --> | ملعب وحلقة |
| كُرة القدم ⚽ | <!-- ASSET: football_icon.svg --> | ملعب و كرة |
| التَّنِس 🎾 | <!-- ASSET: tennis.svg --> | مضرب و كرة |
| فنون الدِّفاع عن النَّفس 🥋 | <!-- ASSET: martial_arts.svg --> | قاعة تدريب |

---

### 2. نتعلم حرفَي الطاء (ط) و الظاء (ظ)

<!-- DEV_NOTE: NOTE CRITIQUE — ط و ظ كلاهما حروف مُفَخَّمة (emphatiques).
  ظ est l'une des lettres les moins fréquentes en arabe mais elle est importante.
  Différenciation visuelle : ط = forme ouverte en haut / ظ = même forme + UN POINT au-dessus.
  Composant : <SimilarLettersLesson letterA="ط" letterB="ظ" /> -->

#### حرف الطاء (ط) — letter_id = "TA_EMPHATIC"

| الحركة | مثال | الصوت |
|--------|------|-------|
| طَـ | طَائرة ✈️ | 🔊 |
| طُـ | طُيور 🐦 | 🔊 |
| طِـ | طِفل 👶 | 🔊 |

#### حرف الظاء (ظ) — letter_id = "ZHA"

| الحركة | مثال | الصوت |
|--------|------|-------|
| ظَـ | ظَهر 🦴 | 🔊 |
| ظُـ | ظُفر 💅 | 🔊 |
| ظِـ | ظِل 🌳 | 🔊 |

---

### 3. ☪️ دعاء النوم

<!-- DEV_NOTE: ASSET: audio_dua_sleep → /assets/audio/islamic/dua_sleep.mp3
  دعاء النوم : مستحب أن يقوله المسلم قبل النوم. -->

قبل أن ننام كل ليلة، نقول:

---

> ### 🤲 دعاء النوم
> ## "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ"
>
> **المصدر:** متفق عليه

---

**الشرح:** باسمك يا الله أنام، و باسمك أستيقظ.

---

### 4. فوائد الرياضة 💪

| على الجسم 🏃 | على العقل 🧠 | على الروح 💚 |
|------------|------------|------------|
| تقوي العضلات | تزيد التركيز | تبعث السعادة |
| تنشّط الدورة الدموية | تحسّن الذاكرة | تقلّل التوتر |
| تحمي من الأمراض | تعلّمنا الانضباط | تعزّز الثقة بالنفس |
| تجعلنا نام بشكل أفضل | تعلّمنا التعاون | تبني صداقات |

---

### 5. مراجعة الدرس ✨

- ✅ تعرفنا على **أنواع الرياضة** المختلفة.
- ✅ تعلمنا حرفَي **الطاء (ط)** و **الظاء (ظ)**.
- ✅ حفظنا **دعاء النوم**.
- ✅ عرفنا **فوائد الرياضة** الجسدية و العقلية.

<!-- DEV_NOTE: FIN DE L'UNITÉ 3.
  Badge : ⚽ "البطل الرياضي"
  Lettres de l'unité 3 : ص، ق، ط، ظ
  Cumul XP Unité 3 : 450 XP. Total cumulé : 1500 XP. -->

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  UNITÉ 4 : البيئة و الطبيعة (L'Environnement et la Nature)
  ASSET: unit_banner → /assets/images/units/U4_nature_banner.svg
  Badge : 🌿 "حارس الطبيعة" (Gardien de la Nature)
  ═══════════════════════════════════════════════════════════════════════════ -->

# 📖 المحور الرابع: البيئة و الطبيعة

---

## الدرس 13: بلدنا الجميلة

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L13"
  Thème : Identité nationale, symboles patriotiques, géographie.
  Nouveaux حروف : الغين (غ) و الخاء (خ).
  Note CULTURELLE IMPORTANTE : Ce cours est chargé émotionnellement (وطنية).
  Traiter avec fierté et respect. Le Nasheéd national est sacré en Algérie.
  Coordination avec le système : activer le drapeau DZ en animation spéciale. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** الفخر بالانتماء للجزائر، حرفا (غ/خ)، وتعريف طفلك برموز وطنه.
> **Objectif :** Fierté nationale, les lettres Ghain (غ) et Kha (خ), et les symboles de l'Algérie.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - أظهر طفلك صورة العلم الجزائري و اشرح له الألوان (الأخضر، الأبيض، الأحمر).
> - حدث طفلك عن شيء يحبه في بلدنا الجزائر.
> - Montrez le drapeau algérien et expliquez la signification des couleurs.
>
> **⚠️ تنبيه | Attention :**
> - حرف الخاء (خ) مجهور، بينما الغين (غ) يشبه صوت الر الفرنسي.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #f1f8ff; padding: 20px; border-radius: 15px; border: 2px solid green;">
  <h2 style="color: green;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L13/algeria_child_card.svg" alt="بلدنا" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: green;">غ &nbsp;&nbsp; خ</p>
  <p style="font-size: 20px;"><b>أنا جزائري:</b> أفخر ببلدي الجزائر 🇩🇿</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ التعرف على رموز الوطن الجزائري: العلم و النشيد الوطني.
2. ✅ نطق حرفَي **الغين (غ)** و **الخاء (خ)**.
3. ✅ إنشاد مقطع من النشيد الوطني "قَسَمًا".
4. ✅ وصف جغرافية الجزائر: بحر، جبال، صحراء.
5. ✅ الاعتزاز بالانتماء للجزائر.

---

### 1. الجزائر يا بلادي 🇩🇿

<!-- ASSET: algeria_map → /assets/images/L13/algeria_map_illustrated.svg
  DEV_NOTE: خريطة الجزائر مصوّرة بشكل ودود للأطفال. كل منطقة قابلة للنقر.
  Cliquer sur le Nord → plage / cliquer sur le centre → montagnes Aurès
  Cliquer sur le Sud → Sahara et dunes.
  Composant : <AlgeriaInteractiveMap /> -->

الجزائر بلدي الحبيب. هي **أكبر دولة في أفريقيا** 🌍. فيها:

| المنطقة الجغرافية | الوصف | الصورة |
|-----------------|-------|--------|
| البَحر الأبيض المتوسط 🌊 | شمال الجزائر، زرقاء صافية | <!-- ASSET: sea.svg --> |
| الجِبال ⛰️ | جبال الأطلس، شامخة و خضراء | <!-- ASSET: mountains.svg --> |
| الصَّحراء الكبرى 🏜️ | جنوب الجزائر، أكبر صحراء في العالم | <!-- ASSET: sahara.svg --> |
| عاصمة الجزائر 🏙️ | مدينة الجزائر، القلب النابض | <!-- ASSET: algiers.svg --> |

---

### 2. رموز الوطن 🇩🇿

<!-- DEV_NOTE: Section très importante culturellement. Composant : <NationalSymbols />.
  Affichage du drapeau animé (Lottie) avec les couleurs qui s'allument. -->

**العَلَم الجزائري:**

<!-- ASSET: algerian_flag_animated → /assets/animations/flag_dz.lottie -->

| اللون | معناه |
|-------|-------|
| 🟢 الأخضر | الإسلام و الأمل |
| ⬜ الأبيض | الصفاء و النقاء |
| 🔴 الأحمر | دماء الشهداء الأبطال |
| ☪️ الهلال و النجمة | الإسلام |

**النشيد الوطني "قَسَمًا":**

<!-- ASSET: audio_national_anthem → /assets/audio/national/qasaman_children.mp3
  DEV_NOTE: Version instrumentale + voix d'enfants. Respectueuse et émouvante.
  Paroles du poète : مفدي زكريا — DROITS D'AUTEUR : domaine public en Algérie.
  Afficher le texte en karaoké (mise en surbrillance au fur et à mesure). -->

```
قَسَمًا بِالنَّازِلَاتِ الْمَاحِقَاتِ 🌟
وَالدِّمَاءِ الزَّاكِيَاتِ الطَّاهِرَاتِ 🌹
```

*كلمات: مفدي زكريا — لحن: المصطفى الشاوي*

---

### 3. نتعلم حرفَي الغين (غ) و الخاء (خ)

<!-- DEV_NOTE: غ و خ — à ne pas confondre avec ع et ح (même famille morphologique).
  Créer une animation comparative : ع/غ et ح/خ côte-à-côte.
  Composant : <LetterFamilyComparison family1={["ع","غ"]} family2={["ح","خ"]} /> -->

#### حرف الغين (غ) — letter_id = "GHAIN"

<!-- Couleur : violet-gris. Prononciation : fricative uvulaire sonore (son "r" grasseyé français). -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| غَـ | غَراب 🐦‍⬛ | 🔊 |
| غُـ | غُرفة 🚪 | 🔊 |
| غِـ | غِذاء 🍽️ | 🔊 |

#### حرف الخاء (خ) — letter_id = "KHA"

<!-- Couleur : marron doré. Prononciation : fricative vélaire sourde (son "j" espagnol). -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| خَـ | خَروف 🐑 | 🔊 |
| خُـ | خُبز 🥖 | 🔊 |
| خِـ | خِيار 🥒 | 🔊 |

---

### 4. مراجعة الدرس ✨

- ✅ تعرفنا على **جمال الجزائر** الطبيعي و الجغرافي.
- ✅ تعلمنا حرفَي **الغين (غ)** و **الخاء (خ)**.
- ✅ تعرفنا على **رموز وطننا** و معاني ألوان العلم.
- ✅ أنشدنا مقطعاً من **النشيد الوطني** "قَسَمًا".

---

## الدرس 14: جولة ممتعة

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L14"
  Thème : La nature, la forêt, l'environnement.
  Nouveaux حروف : النون (ن) و الزاي (ز). -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** وصف الطبيعة، حرفا (ن/ز)، وقيمة المحافظة على البيئة.
> **Objectif :** Décrire la nature, apprendre les lettres Nun (ن) et Zay (ز), et valoriser l'environnement.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - اخرجوا في نزهة قصيرة إلى حديقة أو متنزه قريب.
> - تحدثوا عن أشياء الطبيعة بالعربية (شجرة، زهرة، عصفور).
> - Faites une sortie dans un parc ou jardin à proximité.
>
> **⚠️ تنبيه | Attention :**
> - حرف الزاي (ز) شبيه بشكل الراء لكن مع نقطة فوقها. ساعد طفلك على التمييز.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #e6fcf5; padding: 20px; border-radius: 15px; border: 2px solid #0b7261;">
  <h2 style="color: #0b7261;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L14/nature_child_card.svg" alt="الطبيعة" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #099268;">ن &nbsp;&nbsp; ز</p>
  <p style="font-size: 20px;"><b>أنا صديق البيئة:</b> أحرص على الطبيعة 🌿</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ وصف نزهة في الطبيعة بمفردات غنية.
2. ✅ نطق حرفَي **النون (ن)** و **الزاي (ز)**.
3. ✅ اتخاذ مواقف إيجابية نحو البيئة و الطبيعة.
4. ✅ تطبيق مبادئ المحافظة على البيئة عملياً.

---

### 1. في الغابة 🌳

<!-- ASSET: forest_scene → /assets/images/L14/algerian_forest.png -->

خرجنا في نزهة ممتعة إلى الغابة مع العائلة. رأينا:

| ما رأيناه | الصورة | الصوت في الطبيعة |
|---------|--------|-----------------|
| أشجار عالية 🌲 | <!-- ASSET: tall_trees.svg --> | صوت الريح في الأوراق |
| أزهار ملونة 🌸 | <!-- ASSET: flowers.svg --> | صمت جميل |
| عصافير تغرّد 🐦 | <!-- ASSET: birds.svg --> | تغريد جميل |
| أرانب تركض 🐇 | <!-- ASSET: rabbits.svg --> | أصوات خفيفة |
| نهر صغير 💧 | <!-- ASSET: stream.svg --> | خرير الماء |

---

### 2. حرفَا النون (ن) و الزاي (ز)

#### حرف النون (ن) — letter_id = "NUN"
<!-- Couleur : bleu nuit. UN POINT AU-DESSUS de la forme creuse. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| نَـ | نَخلة 🌴 | 🔊 |
| نُـ | نُجوم ✨ | 🔊 |
| نِـ | نِسر 🦅 | 🔊 |

#### حرف الزاي (ز) — letter_id = "ZAY"
<!-- Couleur : orange vif. Identique à ر mais avec UN POINT AU-DESSUS. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| زَـ | زَهرة 🌺 | 🔊 |
| زُـ | زُجاج 🪟 | 🔊 |
| زِـ | زِراعة 🌾 | 🔊 |

<!-- DEV_NOTE: Discrimination visuelle ر / ز : même forme, seul le point distingue.
  Exercice spécial : <SpotTheDifference letterA="ر" letterB="ز" />
  "انظر جيداً! ما الفرق بين ر و ز؟ الجواب: نقطة فوق الزاي!" -->

---

### 3. المحافظة على البيئة 🌍

<!-- BLOOM: Niveau 5 (Synthèse — engagement environnemental).
  DEV_NOTE: Connecter avec les Objectifs de Développement Durable (ODD) de l'ONU,
  notamment l'ODD 15 (Vie terrestre). Mentionner subtilement pour les enseignants. -->

البيئة الجميلة هي نعمة من الله. من واجبنا أن نحافظ عليها:

| ✅ نفعل | ❌ لا نفعل |
|--------|---------|
| نضع القمامة في السلة 🗑️ | لا نرمي الأوساخ في الطبيعة |
| نزرع الأشجار 🌱 | لا نكسر الأغصان |
| نرشّد استهلاك الماء 💧 | لا نهدر الماء |
| نطفئ النار بعد الاستعمال 🔥 | لا نترك النار مشتعلة |

**💭 سؤال للتفكير:** ماذا تفعل إذا رأيت زميلك يرمي علبةً فارغة في الغابة؟

*(الإجابة المثالية: أنصحه بلطف بوضعها في السلة، و أضرب له المثل الحسن)*

---
### 4. التمارين التفاعلية 🎮

**التمرين 1 — في الغابة 🌳**

<!-- EXERCISE_TYPE: matching -->
صِلْ كل شيء بصوته في الطبيعة:
- **عصَافير** ⮕ [ تغريد جميل 🎶 ]
- **نَهر صغير** ⮕ [ خرير الماء 💧 ]

---

**التمرين 2 — النون و الزاي**

<!-- EXERCISE_TYPE: highlight_letter -->
ضع دائرة حول حرف **(ن)** في:
> **نَخلة &nbsp;&nbsp; نُجوم &nbsp;&nbsp; زَهرة &nbsp;&nbsp; نِسْر**

---

**التمرين 3 — حامي البيئة 🌍**

<!-- EXERCISE_TYPE: true_false -->
أرمي العلبة الفارغة في الغابة..
- ❌ **صواب**
- ✅ **خطأ، أضعها في السلة**

---

**التمرين 4 — ز أو ر؟ 👁️**

<!-- EXERCISE_TYPE: multiple_choice -->
أي الحرفين له نقطة فوقه؟
1. ❌ ر
2. ✅ **ز**
3. ❌ لا شيء

---

**التمرين 5 — صوت الطبيعة 🔊**

<!-- EXERCISE_TYPE: audio_discrimination -->
استمع 🔊 ثم اختر الصوت الصحيح:
1. 🔊 ⮕ **نَخلة** ✅
2. 🔊 ⮕ **زَهرة** ❌

---

## الدرس 15: في حديقة المنزل

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L15"
  Thème : Le jardin domestique + الرفق بالحيوان.
  Nouveau حرف : الفاء (ف).
  Note : Dernier cours de l'Unité 4. -->

### 🎯 أهداف الدرس

1. ✅ التعرف على نباتات و حيوانات حديقة المنزل.
2. ✅ نطق حرف **الفاء (ف)** و كتابته.
3. ✅ فهم مفهوم **الرفق بالحيوان** من المنظور الإسلامي.
4. ✅ استخدام مفردات الطبيعة المنزلية.

---

### 1. حديقتي الخضراء 🌿

<!-- ASSET: home_garden → /assets/images/L15/home_garden.png -->

في حديقة منزلنا الجميلة نجد:

| ما في الحديقة | الصورة | الوصف |
|-------------|--------|-------|
| أشجار مثمرة 🍋 | <!-- ASSET: fruit_trees.svg --> | ليمون و برتقال و تين |
| أزهار جميلة 🌹 | <!-- ASSET: garden_flowers.svg --> | ورد و ياسمين |
| فراشات 🦋 | <!-- ASSET: butterflies.svg --> | ترفرف بين الأزهار |
| نحل 🐝 | <!-- ASSET: bees.svg --> | يجمع الرحيق |
| قطة أليفة 🐱 | <!-- ASSET: cat.svg --> | تلعب في الظل |

---

### 2. حرف الفاء (ف) — letter_id = "FA"

<!-- Couleur : violet clair. UN POINT AU-DESSUS. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| فَـ | فَراشة 🦋 | 🔊 |
| فُـ | فُول 🫘 | 🔊 |
| فِـ | فِيل 🐘 | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **فـ**راشة | عُصـ**فـ**ور | قِـ**ف** |

---

### 3. ☪️ الرفق بالحيوان

قال رسول الله ﷺ:

---

> ### 🤲 حديث الرحمة بالحيوانات
> ## "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَٰنُ"
>
> **المصدر:** رواه أبو داود و الترمذي

---

**كيف نرفق بالحيوانات؟**

| ✅ نفعل | ❌ لا نفعل |
|--------|---------|
| نطعمهم و نسقيهم 🥣 | لا نضربهم أو نؤذيهم |
| نصنع لهم مأوى دافئاً 🏠 | لا نحبسهم في أماكن ضيقة |
| نداويهم عند المرض 🏥 | لا نخيفهم |
| نتعامل معهم برفق 🤲 | لا نلعب معهم بعنف |

---

### 4. التمارين التفاعلية 🎮

**التمرين 1 — حديقتي الجميلة 🌿**

<!-- EXERCISE_TYPE: matching -->
صِلْ كل كائن بدوره:
- **نَحل 🐝** ⮕ [ يجمع الرحيق ]
- **فَراشة 🦋** ⮕ [ تنقل اللقاح ]

---

**التمرين 2 — صيد الفاء 🧨**

<!-- EXERCISE_TYPE: highlight_letter -->
ضع دائرة حول حرف **(ف)** في:
> **فَراشة &nbsp;&nbsp; عُصْفور &nbsp;&nbsp; فِيل &nbsp;&nbsp; قِف**

---

**التمرين 3 — رفيق الحيوان 🐱**

<!-- EXERCISE_TYPE: true_false -->
أخيف القطة لأسليها..
- ❌ **صواب**
- ✅ **خطأ، أتعامل مع الحيوان برفق**

---

**التمرين 4 — كيف نرفق بالحيوانات؟ 🏆**

<!-- EXERCISE_TYPE: multiple_choice -->
من طرق الرفق بالحيوانات:
1. ❌ خداعهم و إيذائهم
2. ✅ **إطعامهم و الكرم بهم**
3. ❌ حبسهم في أمكنة ضيقة

---

**التمرين 5 — صوت الفاء 🔊**

<!-- EXERCISE_TYPE: audio_discrimination -->
استمع 🔊 ثم اختر الكلمة التي تبدأ بحرف الفاء:
1. 🔊 ⮕ **فَراشة** ✅
2. 🔊 ⮕ **قَطة** ❌

---

### 5. مراجعة المحور الرابع ✨

- ✅ تعرفنا على حديقة المنزل.
- ✅ تعلمنا حرف **الفاء (ف)**.
- ✅ فهمنا **الرفق بالحيوان** في الإسلام.

<!-- DEV_NOTE: FIN DE L'UNITÉ 4.
  Badge : 🌿 "حارس الطبيعة"
  Lettres de l'unité 4 : غ، خ، ن، ز، ف
  Cumul XP Unité 4 : 450 XP. Total cumulé : 1950 XP. -->

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  UNITÉ 5 : الصحة و التغذية (Santé et Nutrition)
  ASSET: unit_banner → /assets/images/units/U5_health_banner.svg
  Badge : 💚 "بطل الصحة" (Champion de la Santé)
  ═══════════════════════════════════════════════════════════════════════════ -->

# 📖 المحور الخامس: الصحة و التغذية

---

## الدرس 16: الفحص الطبي

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L16"
  Thème : Le médecin + نظافة شخصية.
  Nouveau حرف : الواو (و). -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** دور الطبيب، حرف الواو (و)، وعادات النظافة اليومية.
> **Objectif :** Le rôle du médecin, la lettre Waw (و), et les habitudes d'hygiène personnelle.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - تأكد مع طفلك من غسل أسنانه قبل النوم.
> - شجعه على غسل يديه قبل الأكل و بعده.
> - Vérifiez qu'il se brosse les dents avant de dormir.
> - Encouragez le lavage des mains avant et après chaque repas.
>
> **⚠️ تنبيه | Attention :**
> - حرف الواو (و) لا يتصل بما يليه و يكتب دائماً منفصلاً عن الحرف التالي.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #ebfbee; padding: 20px; border-radius: 15px; border: 2px solid #2f9e44;">
  <h2 style="color: #2f9e44;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L16/doctor_child_card.svg" alt="عند الطبيب" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #2b8a3e;">و</p>
  <p style="font-size: 20px;"><b>أنا نظيف:</b> أغسل يديّ و أسناني دائماً 🧹</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ التعرف على دور الطبيب و المستشفى.
2. ✅ نطق حرف **الواو (و)** و كتابته.
3. ✅ تطبيق عادات **النظافة الشخصية** يومياً.
4. ✅ إدراك أهمية الفحص الطبي الدوري.

---

### 1. عند الطبيب 🩺

<!-- ASSET: doctor_scene → /assets/images/L16/doctor_visit.png
  DEV_NOTE: طبيب جزائري يفحص طفلاً. بيئة مستشفى حديثة و مريحة.
  Important : donner une image POSITIVE du médecin pour réduire l'anxiété médicale. -->

عندما نمرض، نذهب إلى الطبيب. الطبيب:

| ما يفعله الطبيب | الأداة | الصورة |
|----------------|--------|--------|
| يسمع دقات قلبنا | السَّمَّاعة 🔵 | <!-- ASSET: stethoscope.svg --> |
| يقيس حرارتنا | المِحرار 🌡️ | <!-- ASSET: thermometer.svg --> |
| يفحص أسناننا | آلة خاصة | <!-- ASSET: dental.svg --> |
| يصف لنا الدواء | وصفة طبية | <!-- ASSET: prescription.svg --> |
| ينصحنا بالراحة | | |

---

### 2. حرف الواو (و) — letter_id = "WAW"

<!-- Couleur : vert clair. حرف الواو غير متصل بما يليه.
  Note : الواو يعمل أحياناً كحرف مدّ (voyelle longue) - à mentionner simplement. -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| وَـ | وَلَد 👦 | 🔊 |
| وُـ | وُضوء 💧 | 🔊 |
| وِـ | وِسادة 🛏️ | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **وـ**لد | عُنُ**وـ**د | يَدعُـ**و** |

---

### 3. عادات النظافة الشخصية 🧼

<!-- BLOOM: Niveau 3 (Application habitudes de vie). -->

| العادة | متى؟ | الأداة |
|--------|------|--------|
| 🤲 غسل اليدين | قبل الأكل و بعده / بعد الحمام | صابون + ماء |
| 🦷 غسل الأسنان | صباحاً و مساءً | فرشاة + معجون |
| 🚿 الاستحمام | مرتين في الأسبوع على الأقل | ماء + صابون |
| ✂️ قص الأظافر | كل أسبوع تقريباً | مقص أظافر |
| 👚 تغيير الملابس | يومياً | ملابس نظيفة |

---

### 4. مراجعة الدرس ✨

- ✅ تعرفنا على **دور الطبيب** و أهميته.
- ✅ تعلمنا حرف **الواو (و)**.
- ✅ التزمنا بـ**عادات النظافة الشخصية**.

---

## الدرس 17: الغذاء الصحي

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L17"
  Thème : La nutrition saine + التمييز الغذائي.
  Nouveau حرف : الياء (ي).
  Note nutritionnelle : Aligné sur les recommandations de l'OMS pour les enfants de 6 ans.
  Consulter un nutritionniste avant la finalisation du contenu. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents
> **الهدف من الدرس:** الغذاء الصحي، حرف الياء (ي)، والتمييز بين الطعام المفيد و الضار.
> **Objectif :** La nutrition saine, la lettre Ya (ي), et distinguer les bons et mauvais aliments.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - شجع طفلك على اختيار فاكهة من الثلاجة بدلاً من الحلويات.
> - تحدثوا عن لون كل خضرة و فاكهة على طاولة الأكل.
> - Encouragez votre enfant à choisir un fruit au lieu d'un bonbon.
>
> **⚠️ تنبيه | Attention :**
> - حرف الياء (ي) هو آخر الحروف الأساسية في هذا المنهج! شجع طفلك و احتفل معه بهذا الإنجاز.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #fff9db; padding: 20px; border-radius: 15px; border: 2px solid #fab005;">
  <h2 style="color: #fab005;">🌟 ملخص البطل الصغير 🌟</h2>
  <img src="/assets/images/L17/food_child_card.svg" alt="الغذاء الصحي" width="150" />
  <p style="font-size: 24px;"><b>أنا أتعلم:</b></p>
  <p style="font-size: 32px; color: #e67700;">ي</p>
  <p style="font-size: 20px;"><b>أنا صحي:</b> آكل الخضر و الفاكهة 🍎🥦</p>
</div>

---

### 🎯 أهداف الدرس

1. ✅ التعرف على الأطعمة الصحية و غير الصحية.
2. ✅ نطق حرف **الياء (ي)** و كتابته.
3. ✅ التمييز بين الغذاء المفيد و الضار.
4. ✅ بناء عادات غذائية سليمة منذ الصغر.

---

### 1. ماذا نأكل؟ 🍎🥦

<!-- ASSET: healthy_food → /assets/images/L17/healthy_food_plate.png
  DEV_NOTE: "طبق الأكل الصحي" — le modèle de l'assiette équilibrée OMS,
  adapté pour les enfants algériens avec des aliments locaux. -->

**الأطعمة الصحية التي يحبها جسمي:**

| المجموعة الغذائية | أمثلة | الفائدة |
|-----------------|-------|---------|
| فَوَاكه 🍎 | تفاح، موز، برتقال، تين | فيتامينات + طاقة |
| خُضَار 🥕 | جزر، خس، فلفل، خيار | معادن + ألياف |
| حَليب و مشتقاته 🥛 | حليب، جبن، زبادي | كالسيوم للعظام |
| لَحم و سمك 🥩🐟 | دجاج، سمك، بيض | بروتين للنمو |
| حُبوب 🌾 | خبز، عجين، شعير | طاقة دائمة |

**الأطعمة التي يجب تقليلها:**

| الطعام | لماذا نقلله؟ |
|--------|------------|
| 🍬 الحلويات الكثيرة | تتلف الأسنان و ترفع السكر |
| 🥤 المشروبات الغازية | تضر الأسنان و المعدة |
| 🍟 البطاطا المقلية كثيراً | دهون تضر القلب |
| 🍫 الشوكولاتة كثيراً | سكر مفرط |

---

### 2. حرف الياء (ي) — letter_id = "YA"

<!-- Couleur : jaune or. يعمل الياء أحياناً كحرف مد.
  Note : آخر الحروف الأساسية في هذا المنهج! (مع الهمزة في الدرس 18). -->

| الحركة | مثال | الصوت |
|--------|------|-------|
| يَـ | يَد ✋ | 🔊 |
| يُـ | يُوسف (اسم النبي) | 🔊 |
| يِـ | يِسار (اليسار) | 🔊 |

**📍 الحرف في مواضعه:**

| أول الكلمة | وسط الكلمة | آخر الكلمة |
|-----------|-----------|-----------|
| **يـ**د | بَ**يـ**ت 🏠 | نَبِـ**ي** |

---

### 3. التمارين التفاعلية 🎮

**التمرين 1 — ماذا آكل؟ 🍎**

<!-- EXERCISE_TYPE: matching -->
صِلْ كل طعام بفائدته:
- **تُفَّاح 🍎** ⮕ [ فيتامينات + طاقة ]
- **حَليب 🥛** ⮕ [ كالسيوم للعظام ]

---

**التمرين 2 — صيد الياء 👀**

<!-- EXERCISE_TYPE: highlight_letter -->
ضع دائرة حول حرف **(ي)** في:
> **يَد &nbsp;&nbsp; بَيْت &nbsp;&nbsp; فُول &nbsp;&nbsp; نَبِي**

---

**التمرين 3 — خيار صحي 🥦**

<!-- EXERCISE_TYPE: true_false -->
البطاطا المقلية يومياً دائماً فكرة جيدة..
- ❌ **صغيح**
- ✅ **خطأ، يجب تقليلها**

---

**التمرين 4 — الغذاء المفيد 🏅**

<!-- EXERCISE_TYPE: multiple_choice -->
من وجبات الغذاء المفيد:
1. ❌ مشروبات غازية
2. ✅ **خضار و فواكه**
3. ❌ حلويات كثيرة

---

**التمرين 5 — صوت الياء 🔊**

<!-- EXERCISE_TYPE: audio_discrimination -->
استمع 🔊 ثم اختر الكلمة التي تبدأ بالياء:
1. 🔊 ⮕ **يَد** ✅
2. 🔊 ⮕ **تُفَّاح** ❌

---

### 4. مراجعة الدرس ✨

- ✅ تعرفنا على **الغذاء الصحي** و فوائده.
- ✅ تعلمنا حرف **الياء (ي)**.
- ✅ تعلمنا **التمييز** بين الطعام المفيد و الضار.

---

## الدرس 18: أحافظ على أسناني

<!-- DEV_NOTE: lesson_id = "DZ-1AP-AR-L18"
  Thème : L'hygiène dentaire + الهمزة + دعاء الأكل.
  Nouveau حرف : الهمزة (ء).
  NOTE IMPORTANTE: Le حرف الهمزة est un CONCEPT AVANCÉ pour la 1AP.
  À ce stade, enseigner uniquement les formes les plus visibles.
  L'étude complète (همزة الوصل، همزة القطع، تنوين...) est reportée aux classes suivantes.
  C'est le DERNIER COURS du module. Clôturer avec émotion et célébration. -->

---

<!-- 🧑‍🏫 SECTION: PARENT SUMMARY CARD (Bilingual) -->

> [!TIP]
> ### 🧑‍🏫 ركن الأولياء | Espace Parents — الدرس الأخير! | Dernier cours !
> **الهدف من الدرس:** صحة الأسنان، الهمزة (ء)، و دعاء الأكل للختام بنجاح!
> **Objectif :** Hygiène dentaire, la lettre Hamza (ء), dua avant/après manger, et clôturer l'année sur une note de succès.
>
> **💡 ماذا تفعل الليلة؟ | Que faire ce soir ?**
> - علّم طفلك دعاء الأكل (بسم الله) و بعده (الحمد لله).
> - احتفلوا معه بإتمام السنة! هذا إنجاز كبير.
> - Apprenez son Dua avant et après le repas.
> - Fêtez la fin de l'année avec lui! Il mérite d'être fêtoyé!
>
> **⚠️ تنبيه | Attention :**
> - حرف الهمزة متقدم. لا تقلق إلا دقيقة. سيتعمق في هذا في السنة الثانية.

---

<!-- 🧒 SECTION: CHILD COMPACT CARD (Visual/Printable) -->

<div align="center" style="background-color: #f8f9fa; padding: 20px; border-radius: 15px; border: 3px double #212529;">
  <h2 style="color: #2b8a3e;">🌟 ملخص البطل الصغير — الدرس 18! 🌟</h2>
  <img src="/assets/images/L18/tooth_child_card.svg" alt="أسناني" width="150" />
  <p style="font-size: 24px;"><b>أتعلم آخر حرف:</b></p>
  <p style="font-size: 40px; color: #2b8a3e;">ء</p>
  <p style="font-size: 22px; background: gold; border-radius: 10px; padding: 10px;"><b>🎉 وصلت للنهاية! أنا بطل 1AP!</b></p>
</div>

---

### 🎯 أهداف الدرس (الدرس الأخير!)

1. ✅ تعلّم خطوات العناية الصحيحة بالأسنان.
2. ✅ التعرف على **الهمزة (ء)** و أشكالها الأساسية.
3. ✅ حفظ **دعاء الأكل** (قبله و بعده).
4. ✅ إدراك أهمية الوقاية الصحية.
5. ✅ **استكمال المسيرة التعلمية بنجاح!** 🎓

---

### 1. أسناني اللؤلؤية 🦷

<!-- ASSET: dental_health → /assets/images/L18/dental_health.png
  DEV_NOTE: Illustration d'une bouche avec des dents blanches et lumineuses,
  style cartoon joyeux. Ahmed et Khadija tiennent chacun une brosse à dents. -->

الأسنان نعمة من الله. يجب أن نحافظ عليها:

| خطوات العناية بالأسنان | متى؟ |
|-----------------------|------|
| 🪥 فرشاة الأسنان بالمعجون | صباحاً و مساءً (دقيقتان) |
| 🧵 الخيط الطبي | مرة في اليوم |
| 🥗 تقليل الحلويات | دائماً |
| 💧 كثرة شرب الماء | طوال اليوم |
| 🏥 زيارة طبيب الأسنان | كل 6 أشهر |

---

### 2. الهمزة (ء) — letter_id = "HAMZA"

<!-- DEV_NOTE: La Hamza est unique — ce n'est pas une "lettre" au sens habituel
  mais un phonème (coup de glotte) qui peut s'écrire de plusieurs façons.
  Pour la 1AP : montrer uniquement les 3 formes de base avec des mots connus.
  NE PAS enseigner les règles complexes d'orthographe de la hamza à ce stade. -->

> ☝️ الهمزة هي صوت يخرج من أقصى الحلق. يمكن أن تكتب بأشكال مختلفة:

| موضع الهمزة | الشكل | مثال |
|------------|-------|------|
| أول الكلمة | أ / إ | **أ**سد 🦁 / **إ**برة |
| وسط الكلمة | أ / ئ / ؤ | سَ**أ**ل ❓ |
| آخر الكلمة | ء | مَلَ**أ** / سَمَا**ء** ☁️ |

<!-- ASSET: hamza_forms_visual → /assets/images/letters/hamza_positions.svg
  DEV_NOTE: Tableau visuel des formes de la hamza. Présenter de façon claire et
  non anxiogène : "La hamza a plusieurs tenues! On apprendra mieux en 2ème année." -->

---

### 3. ☪️ دعاء الأكل

<!-- DEV_NOTE: Deux duas simples et fondamentaux. À mémoriser ABSOLUMENT.
  ASSET: audio_dua_food → /assets/audio/islamic/dua_before_after_eating.mp3 -->

---

> ### 🤲 قبل الأكل
> ## بِسْمِ اللَّهِ
>
> **المصدر:** متفق عليه

> ### 🤲 بعد الأكل
> ## الْحَمْدُ لِلَّهِ
>
> **المصدر:** متفق عليه

> ### 🤲 إذا نسيتَ البسملة في أول الطعام
> ## بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ
>
> **المصدر:** رواه أبو داود

---

**التمرين:**

> قبل الأكل نقول: **بسم الله** 🤲
> بعد الأكل نقول: **الحمد لله** 🌟

---

### 4. التمارين التفاعلية 🎮

**التمرين 1 — صيد الهمزة 👀**

<!-- EXERCISE_TYPE: highlight_letter -->
ضع دائرة حول حرف **(أ / ء)** في:
> **أَسَد &nbsp;&nbsp; سَأَلَ &nbsp;&nbsp; مَلَأَ &nbsp;&nbsp; سَمَاء**

---

**التمرين 2 — أين الهمزة؟ 👁️**

<!-- EXERCISE_TYPE: matching -->
صِلْ كل كلمة بموقع الهمزة:
- **أَسَد** ⮕ [ أول الكلمة ]
- **سَمَاء** ⮕ [ آخر الكلمة ]

---

**التمرين 3 — بطل النظافة 🦷**

<!-- EXERCISE_TYPE: true_false -->
أغسل أسناني مرة واحدة في الشهر..
- ❌ **صواب**
- ✅ **خطأ، أغسلها كل يوم مرتين**

---

**التمرين 4 — ماذا نقول؟ 🤲**

<!-- EXERCISE_TYPE: multiple_choice -->
ماذا نقول قبل الأكل مباشرة؟
1. ✅ **بِسْمِ الله**
2. ❌ الحمد لله
3. ❌ تصبح على خير

---

**التمرين 5 — صوت الهمزة 🔊**

<!-- EXERCISE_TYPE: audio_discrimination -->
استمع 🔊 ثم اختر الكلمة التي تبدأ بالهمزة:
1. 🔊 ⮕ **أَسَد** ✅
2. 🔊 ⮕ **بَطَّة** ❌

---

---

### 5. مراجعة الدرس الأخير ✨

- ✅ تعلمنا كيف **نعتني بأسناننا** بالطريقة الصحيحة.
- ✅ تعرفنا على **الهمزة (ء)** و أشكالها الأساسية.
- ✅ حفظنا **دعاء الأكل** قبله و بعده.
- ✅ أدركنا **أهمية الوقاية الصحية** منذ الصغر.

---

> 🎉 **أحسنتَ! لقد أتممتَ الدرس الأخير بنجاح!** 👏🏆

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  SECTION FINALE : خاتمة الكتاب (Conclusion du Module)
  DEV_NOTE: Rendu par <ModuleCompletionPage />.
  Déclencher la grande animation de célébration :
  - Confettis et étoiles qui tombent
  - Fanfare/jingle de victoire
  - Affichage du certificat numérique
  - Récapitulatif de toutes les lettres apprises (الحروف المتعلَّمة)
  - Récapitulatif des duaas et ayaat mémorisées
  - Score total XP et rang dans le leaderboard classe (si activé)
  - Bouton "شارك إنجازي" (Partager mon succès) pour les parents
  ═══════════════════════════════════════════════════════════════════════════ -->

# 🎉 ختام الكتاب — إنجاز رائع!

<!-- ASSET: graduation_animation → /assets/animations/module_complete.lottie
  (Ahmed et Khadija en tenues de graduation avec diplômes 🎓) -->

---

## 🏆 أحسنتَ يا بطل المستقبل!

لقد **أتممتَ** دروس **اللغة العربية و التربية الإسلامية و المدنية**
للسنة الأولى ابتدائي بنجاح! 🌟

**ماذا تعلمتَ هذه السنة؟**

| المجال | ما تعلمتَه |
|-------|-----------|
| 🔤 الحروف | أكثر من **20 حرفاً** من الهجاء العربية |
| 📖 القراءة | قراءة كلمات و جمل بسيطة |
| ✍️ الكتابة | كتابة الحروف في مواضعها الثلاثة |
| 🤲 الدعاء | دعاء الدخول، دعاء النوم، دعاء الأكل |
| 📖 القرآن | آية الاستئذان، آية التعاون، آية الأمانة |
| ✨ الأحاديث | حديث الرحمة، حديث الصدق، حديث الجار |
| 🇩🇿 وطني | رموز الجزائر، علمها، نشيدها الوطني |
| 💚 قيمي | الصدق، الأمانة، التعاون، الرفق، الطاعة |

---

## 🎓 شهادة الإنجاز

<!-- DEV_NOTE: Rendu par <DigitalCertificate />.
  Template SVG élégant avec :
    - اسم التلميذ
    - اسم المدرسة و المستوى
    - تاريخ الإتمام
    - توقيع رمزي من "أحمد و خديجة"
    - QR Code pour vérification en ligne
  Possibilité d'impression en A4, et de partage sur WhatsApp (fréquent en Algérie).
  DATA_MODEL: Table `certificates` (cert_id, student_id, module_id, issued_at,
  cert_url, qr_hash). -->

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🏆 شَهَادَةُ إِتْمَامٍ — FreeGeny 🏆                       ║
║                                                              ║
║   نُشهد أن التلميذ/ة:                                        ║
║                                                              ║
║         ✨ _____________________________ ✨                  ║
║                                                              ║
║   قد أتمّ بنجاح دروس السنة الأولى ابتدائي                   ║
║   في اللغة العربية و التربية الإسلامية و المدنية              ║
║                                                              ║
║                  بتاريخ: ___ / ___ / _____                  ║
║                                                              ║
║   👦 أحمد  ✍️                    👧 خديجة  ✍️               ║
║                                                              ║
║                🇩🇿 FreeGeny — التعليم للجميع 🇩🇿              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 💌 نصائح للمستقبل

> **"طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"** ﷺ

1. 📚 **واظب على مراجعة دروسك** — خصص وقتاً يومياً للقراءة.
2. 🙏 **حافظ على صلاتك و أخلاقك** — هي أساس النجاح الحقيقي.
3. 🇩🇿 **أحب وطنك الجزائر** — كن فخوراً بتاريخه و حضارته.
4. 💛 **كن طفلاً مهذباً** — يحترم الكبير و يرحم الصغير.
5. 🌟 **تحدّ نفسك** — الصعوبات تصنع الأبطال!

---

> ### إلى اللقاء في السنة الثانية إن شاء الله! 🚀
>
> **أحمد 👦 و خديجة 👧 ينتظرانك!**

<!-- ASSET: farewell_animation → /assets/animations/ahmed_khadija_wave.lottie
  (Ahmed et Khadija qui saluent en agitant la main) -->

---

<!-- ═══════════════════════════════════════════════════════════════════════════
  ANNEXES TECHNIQUES (Pour les développeurs et l'équipe contenu FreeGeny)
  ═══════════════════════════════════════════════════════════════════════════ -->

---

# 📋 ANNEXES TECHNIQUES

<!-- DEV_NOTE: Ces annexes sont à usage interne. Elles ne sont PAS affichées
  aux élèves. Elles sont utilisées par l'équipe pédagogique et technique. -->

## Annexe A — Inventaire Complet des Lettres Enseignées

<!-- DATA_MODEL: Table `letters` dans la DB — serve à l'algorithme SRS. -->

| # | الحرف | Translitération | Cours d'introduction | Cours de révision |
|---|-------|-----------------|---------------------|-------------------|
| 1 | أ | alef | L01 | L18 |
| 2 | ب | ba | L01 | L02 |
| 3 | ت | ta | L02 | L06 |
| 4 | ث | tha | L02 | L07 |
| 5 | ج | jim | L03 | L09 |
| 6 | ح | ha | L03 | L08 |
| 7 | د | dal | L06 | L07 |
| 8 | ر | ra | L05 | L11 |
| 9 | ز | zay | L14 | L17 |
| 10 | ص | sad | L10 | L13 |
| 11 | ط | ta (emph.) | L12 | L15 |
| 12 | ظ | zha | L12 | L14 |
| 13 | ع | ain | L07 | L08 |
| 14 | غ | ghain | L13 | L15 |
| 15 | ف | fa | L15 | L17 |
| 16 | ق | qaf | L11 | L13 |
| 17 | م | meem | L04 | L10 |
| 18 | ن | nun | L14 | L16 |
| 19 | و | waw | L16 | L18 |
| 20 | ي | ya | L17 | L18 |
| 21 | خ | kha | L13 | L14 |
| 22 | ء | hamza | L18 | — |

<!-- DEV_NOTE: Lettres NON couvertes dans ce module (enseignées en 2AP) :
  ة (ta marbuta - mentionnée), ذ، س، ش، ض، ع (approfondie)، لا، همزة الوصل...
  Maintenir une liste de lettres "en attente" pour éviter les lacunes entre niveaux. -->

---

## Annexe B — Inventaire des Contenus Islamiques

<!-- DATA_MODEL: Table `islamic_content` (type, arabic_text, source, lesson_id). -->

| # | النوع | النص (incipit) | المصدر | الدرس |
|---|-------|---------------|--------|-------|
| 1 | دعاء | بسم الله ولجنا... | أبو داود | L02 |
| 2 | حديث | ليس منا من لم يرحم... | الترمذي + أبو داود | L03 |
| 3 | آية | يا أيها الذين آمنوا لا تدخلوا... | النور 27 | L04 |
| 4 | آية | وتعاونوا على البر... | المائدة 2 | L05 |
| 5 | حديث | إن الصدق يهدي... | متفق عليه | L07 |
| 6 | حديث | ما زال جبريل يوصيني... | متفق عليه | L08 |
| 7 | آية | إن الله يأمركم أن تؤدوا... | النساء 58 | L09 |
| 8 | دعاء | باسمك ربي وضعت جنبي... | متفق عليه | L12 |
| 9 | حديث | الراحمون يرحمهم الرحمان | أبو داود + الترمذي | L15 |
| 10 | دعاء | بسم الله / الحمد لله (الأكل) | متفق عليه | L18 |

---

## Annexe C — Spécifications Assets Médias

<!-- DEV_NOTE: Guide pour l'équipe graphique et audio. -->

### Images et Illustrations
- **Format préféré :** SVG (vectoriel, scalable, RTL-compatible)
- **Fallback :** WebP avec fallback PNG
- **Résolution min :** 72 DPI écran / 300 DPI impression
- **Style artistique :** Flat design, couleurs vives, personnages incluant la diversité algérienne
- **Palette de couleurs principale :**
  - Vert : `#2E8B57` (couleur nationale DZ)
  - Blanc : `#FAFAFA`
  - Doré : `#F4A100`
  - Bleu éducatif : `#1565C0`

### Audio
- **Format :** MP3 (128 kbps min) + OGG (fallback)
- **Voix narration :** Arabe classique clair, adapté aux enfants
- **Accent :** Arabe standard (MSA) — PAS de dialecte darija dans les leçons
- **Débit :** Lent et articulé (50-60% du débit normal adulte)
- **Musique de fond :** Optionnelle, volume max 20% de la voix

### Animations
- **Format :** Lottie JSON (pour les animations SVG complexes)
- **Format vidéo :** MP4 (H.264) + WebM (fallback)
- **FPS :** 24 minimum
- **Taille fichier :** < 2MB pour les Lottie, < 10MB pour les vidéos

---

## Annexe D — Accessibilité (WCAG 2.1 AA)

<!-- DEV_NOTE: Liste de contrôle accessibilité. Valider avant déploiement. -->

- [ ] Tous les textes ont un contraste ≥ 4.5:1
- [ ] Toutes les images ont un `alt` en arabe
- [ ] Tous les audio/vidéo ont des sous-titres
- [ ] Navigation au clavier entièrement fonctionnelle (tabulation)
- [ ] Taille minimale des boutons tactiles : 44×44px
- [ ] Police minimale : 16px (corps), 24px (titres)
- [ ] Mode sombre disponible
- [ ] Mode haut contraste disponible
- [ ] Compatible avec les lecteurs d'écran (NVDA, VoiceOver, TalkBack)
- [ ] Pas de contenu clignotant > 3 fois/seconde
- [ ] Direction de texte `dir="rtl"` correctement appliquée partout

---

## Annexe E — Intégration xAPI (LRS)

<!-- DEV_NOTE: Verbes xAPI utilisés dans ce module. -->

| Événement | Verbe xAPI | Déclencheur |
|-----------|-----------|-------------|
| Commencer une leçon | `http://adlnet.gov/expapi/verbs/launched` | Ouverture de la leçon |
| Compléter un exercice | `http://adlnet.gov/expapi/verbs/completed` | 100% des questions répondues |
| Réussir un exercice | `http://adlnet.gov/expapi/verbs/passed` | Score ≥ 70% |
| Échouer un exercice | `http://adlnet.gov/expapi/verbs/failed` | Score < 70% |
| Mémoriser un mot | `http://adlnet.gov/expapi/verbs/mastered` | 3 bonnes réponses consécutives |
| Terminer une unité | `http://adlnet.gov/expapi/verbs/completed` | Toutes les leçons ≥ 70% |
| Obtenir un badge | `https://w3id.org/xapi/badges/verbs/earned` | Critères du badge atteints |

---

## Annexe F — Modèle de Données (DB Schema Suggestion)

```sql
-- Table principale des modules
CREATE TABLE content_modules (
  id           VARCHAR(20) PRIMARY KEY,    -- "DZ-1AP-AR-001"
  country_code CHAR(2),
  level        VARCHAR(10),
  subject      VARCHAR(50),
  title_ar     TEXT,
  title_fr     TEXT,
  created_at   TIMESTAMP,
  updated_at   TIMESTAMP
);

-- Table des leçons
CREATE TABLE lessons (
  id           VARCHAR(25) PRIMARY KEY,    -- "DZ-1AP-AR-L01"
  module_id    VARCHAR(20) REFERENCES content_modules(id),
  unit_number  INT,
  lesson_number INT,
  title_ar     TEXT,
  content_json JSONB,                       -- Contenu structuré de la leçon
  xp_reward    INT DEFAULT 100,
  order_index  INT,                         -- Pour le séquençage
  is_locked    BOOLEAN DEFAULT TRUE
);

-- Progression des élèves
CREATE TABLE student_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID REFERENCES students(id),
  lesson_id    VARCHAR(25) REFERENCES lessons(id),
  status       VARCHAR(20),                 -- 'not_started'|'in_progress'|'completed'
  score        DECIMAL(5,2),               -- 0.00 à 100.00
  xp_earned    INT DEFAULT 0,
  attempts     INT DEFAULT 0,
  started_at   TIMESTAMP,
  completed_at TIMESTAMP
);

-- Vocabulaire de l'élève (SRS)
CREATE TABLE student_vocabulary (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID REFERENCES students(id),
  word_ar       VARCHAR(100),
  mastery_level INT DEFAULT 0,             -- 0-5 (0=nouveau, 5=maîtrisé)
  last_seen     TIMESTAMP,
  next_review   TIMESTAMP,                 -- Calculé par l'algorithme SRS
  ease_factor   DECIMAL(3,2) DEFAULT 2.5   -- SuperMemo SM-2
);
```

---

## Annexe G — Checklist Qualité Avant Publication

<!-- DEV_NOTE: À valider par l'équipe QA pédagogique ET technique. -->

### ✅ Qualité Pédagogique
- [ ] Contenu aligné avec le programme MEN Algérie
- [ ] Objectifs pédagogiques SMART pour chaque leçon
- [ ] Progression linguistique logique et linéaire
- [ ] Exercices couvrant les 3 domaines : compréhension, production, discrimination
- [ ] Contenu islamique vérifié par un conseiller religieux qualifié
- [ ] Contenu civique vérifié par un expert en éducation algérienne
- [ ] Contenu nutritionnel vérifié par un professionnel de santé

### ✅ Qualité Technique
- [ ] Tous les `lesson_id` sont uniques et cohérents
- [ ] Tous les liens `ASSET:` sont résolus (fichiers existants)
- [ ] Tous les audios sont enregistrés et intégrés
- [ ] Rendu RTL (droite à gauche) validé sur iOS + Android + Web
- [ ] Tests sur appareils bas de gamme (Android 8+, 2GB RAM)
- [ ] Mode hors-ligne fonctionnel (contenu préchargé)
- [ ] Données xAPI correctement envoyées au LRS

### ✅ Qualité Expérience Utilisateur
- [ ] Testé avec des enfants de 5-7 ans (tests utilisateurs)
- [ ] Testé avec des parents algériens non-techniciens
- [ ] Temps de chargement < 3 secondes (connexion 3G)
- [ ] Aucun bug bloquant en mode parcours linéaire
- [ ] Animations non-distrayantes

---

<!--
================================================================================
  FIN DU FICHIER — freegeny_algerie_1ap_arabe_lessons_v2.md
  ─────────────────────────────────────────────────────────────────────────────
  © 2026 FreeGeny — Tous droits réservés
  Ce fichier est la propriété exclusive de FreeGeny.
  Toute reproduction ou distribution non autorisée est interdite.
  ─────────────────────────────────────────────────────────────────────────────
  Contact équipe contenu : content@freegeny.com
  Contact équipe technique : dev@freegeny.com
  ─────────────────────────────────────────────────────────────────────────────
  Pour contribuer à l'amélioration de ce contenu :
  https://github.com/freegeny/content-dz-1ap (accès restreint)
================================================================================
-->