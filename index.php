<?php
// ============================================================
// FreeGeny — Landing Page (index.php)
// freegeny.com
// ============================================================
require_once __DIR__ . '/config/app.php';
initSession();

$lang  = detectLang();
$isRtl = in_array($lang, RTL_LANGS);
$translations = loadLang($lang);

$pageTitle       = 'FreeGeny — Éducation conforme au programme algérien MEN';
$pageDescription = 'Plateforme éducative pour enfants 5-12 ans, 100% conforme au programme du Ministère de l\'Éducation Nationale algérien. 115 leçons, 333 jeux, gratuit en Algérie.';

require_once INCLUDES_PATH . '/header.php';
?>

<!-- ==================== HERO ==================== -->
<section class="hero" id="accueil">
  <div class="hero-bg-orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>

  <div class="container">
    <div class="hero-content">

      <div class="hero-badge" data-animate>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <?= t('hero.badge') ?>
      </div>

      <h1 class="hero-title">
        <?= $lang === 'ar'
          ? 'المنهج الجزائري الرسمي،<br><span class="highlight">متاح في بيتك</span>'
          : 'Le programme algérien officiel,<br><span class="highlight">à la maison</span>'
        ?>
      </h1>

      <p class="hero-subtitle">
        <?= t('hero.subtitle') ?>
      </p>

      <div class="hero-cta">
        <a href="<?= APP_URL ?>/auth/register" class="btn btn-primary btn-lg" id="hero-cta-register">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
          <?= t('hero.cta.free') ?>
        </a>
        <a href="#matieres" class="btn btn-ghost btn-lg" id="hero-cta-explore">
          <?= t('hero.cta.explore') ?>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17l9.2-9.2M17 17V7H7"/>
          </svg>
        </a>
      </div>

      <!-- Trust signals -->
      <div style="display:flex; gap:1.5rem; margin-top:2.5rem; flex-wrap:wrap;" class="animate-fade-in animate-delay-300">
        <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:var(--clr-text-muted)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <?= $lang === 'ar' ? 'مجاني 100% في الجزائر' : 'Gratuit 100% en Algérie' ?>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:var(--clr-text-muted)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <?= $lang === 'ar' ? 'بدون إعلان خلال الدروس' : 'Aucune pub pendant les leçons' ?>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:var(--clr-text-muted)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <?= $lang === 'ar' ? 'بدون إعداد إضافي' : 'Accès immédiat, sans config' ?>
        </div>
      </div>

    </div>

    <!-- Hero visual (card flottante) -->
    <div class="hero-visual" style="position:absolute;right:5%;top:50%;transform:translateY(-50%);display:none;" id="hero-card-demo">
      <!-- Visible seulement sur grand écran via CSS media query -->
    </div>
  </div>
</section>

<!-- ==================== STATS ==================== -->
<section class="stats-bar">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item" data-animate>
        <span class="stat-number" data-count="115">0</span>
        <span class="stat-label"><?= t('stats.lessons') ?></span>
      </div>
      <div class="stat-item" data-animate>
        <span class="stat-number" data-count="333">0</span>
        <span class="stat-label"><?= t('stats.games') ?></span>
      </div>
      <div class="stat-item" data-animate>
        <span class="stat-number" data-count="61">0</span>
        <span class="stat-label"><?= t('stats.languages') ?></span>
      </div>
      <div class="stat-item" data-animate>
        <span class="stat-number" data-count="75">0</span>
        <span class="stat-label"><?= t('stats.countries') ?></span>
      </div>
    </div>
  </div>
</section>

<!-- ==================== MATIÈRES ==================== -->
<section class="section" id="matieres">
  <div class="container">
    <div class="section-header" data-animate>
      <span class="section-tag"><?= $lang === 'ar' ? 'المواد الدراسية' : 'Matières disponibles' ?></span>
      <h2 class="section-title">
        <?= $lang === 'ar' ? 'السنة الأولى ابتدائي — الجزائر' : 'Algérie — 1ère Année Primaire' ?>
      </h2>
      <p class="section-desc">
        <?= $lang === 'ar'
          ? 'محتوى معتمد وموافق عليه من قِبَل أساتذة مدارس معتمدين، متطابق 100% مع منهج وزارة التربية الوطنية.'
          : 'Contenu relu et validé par un panel de professeurs des écoles. 100% conforme au programme MEN.' ?>
      </p>
    </div>

    <div class="grid grid-2" style="max-width:800px;margin:0 auto;" data-animate>

      <!-- Arabe -->
      <div class="subject-card" onclick="window.location='<?= APP_URL ?>/algeria/1ap/arabe'" tabindex="0" role="button" aria-label="Arabe 1AP">
        <div class="subject-card-cover arabe">
          <div style="text-align:center;color:white;">
            <div style="font-family:var(--font-arabic);font-size:3rem;font-weight:700;line-height:1;">ع</div>
            <div style="font-size:0.875rem;margin-top:0.5rem;opacity:0.8;"><?= $lang === 'ar' ? 'اللغة العربية' : 'اللغة العربية' ?></div>
          </div>
        </div>
        <div class="subject-card-body">
          <h3><?= t('subjects.arabe') ?></h3>
          <p><?= t('subjects.grade') ?></p>
          <div class="subject-card-meta">
            <div class="subject-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              115 <?= $lang === 'ar' ? 'درس' : 'leçons' ?>
            </div>
            <div class="subject-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              460 <?= $lang === 'ar' ? 'تمرين' : 'exercices' ?>
            </div>
          </div>
          <a href="<?= APP_URL ?>/algeria/1ap/arabe" class="btn btn-primary w-full" id="btn-arabe-start">
            <?= t('subjects.start') ?>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- Maths -->
      <div class="subject-card" onclick="window.location='<?= APP_URL ?>/algeria/1ap/mathematiques'" tabindex="0" role="button" aria-label="Mathématiques 1AP">
        <div class="subject-card-cover maths">
          <div style="text-align:center;color:white;">
            <div style="font-size:3.5rem;font-weight:900;line-height:1;">π</div>
            <div style="font-size:0.875rem;margin-top:0.5rem;opacity:0.8;"><?= $lang === 'ar' ? 'الرياضيات' : 'Mathématiques' ?></div>
          </div>
        </div>
        <div class="subject-card-body">
          <h3><?= t('subjects.maths') ?></h3>
          <p><?= t('subjects.grade') ?></p>
          <div class="subject-card-meta">
            <div class="subject-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              115 <?= $lang === 'ar' ? 'درس' : 'leçons' ?>
            </div>
            <div class="subject-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              460 <?= $lang === 'ar' ? 'تمرين' : 'exercices' ?>
            </div>
          </div>
          <a href="<?= APP_URL ?>/algeria/1ap/mathematiques" class="btn btn-outline w-full" id="btn-maths-start" style="border-color:#388e3c;color:#66bb6a;">
            <?= t('subjects.start') ?>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ==================== FONCTIONNALITÉS ==================== -->
<section class="section-sm" style="background:var(--clr-surface);">
  <div class="container">
    <div class="section-header" data-animate>
      <span class="section-tag"><?= $lang === 'ar' ? 'لماذا فري جيني؟' : 'Pourquoi FreeGeny ?' ?></span>
      <h2 class="section-title"><?= $lang === 'ar' ? 'التعلم الحقيقي للبرنامج الحقيقي' : 'L\'apprentissage réel du vrai programme' ?></h2>
    </div>

    <div class="grid grid-3" data-animate>
      <?php
      $features = $lang === 'ar' ? [
        ['🎯', 'متوافق 100%', 'كل درس مبني على البرنامج الرسمي لوزارة التربية الوطنية الجزائرية بدقة.'],
        ['🎮', '333 لعبة تعليمية', 'تعلّم عبر الألعاب: القصص، التطابق، السحب والإفلات، الإملاء الصوتي.'],
        ['📊', 'لوحة تحكم الأولياء', 'تابع تقدم طفلك، نقاط XP، أيام المراجعة المتتالية، وإجازات الاختبار.'],
        ['🔒', 'آمن ومراقَب', 'مراقبة الوالدين، تحديد وقت الشاشة، بدون محتوى خارجي.'],
        ['📱', 'يعمل على كل الأجهزة', 'هاتف، لوح، حاسوب — بنية متجاوبة لجميع الأجهزة.'],
        ['🌐', 'عربي وفرنسي', 'واجهة كاملة بالعربية مع دعم كامل للاتجاه من اليمين للشمال.'],
      ] : [
        ['🎯', '100% conforme MEN', 'Chaque leçon suit scrupuleusement le programme officiel du Ministère de l\'Éducation Nationale Algérien.'],
        ['🎮', '333 jeux éducatifs', 'Apprends en jouant : histoires, associations, drag & drop, dictée vocale et plus encore.'],
        ['📊', 'Dashboard Parents', 'Suivez la progression, les points XP, la série de jours et les résultats aux examens.'],
        ['🔒', 'Sécurisé & Contrôlé', 'Contrôle parental, limite de temps d\'écran, zéro contenu externe non vérifié.'],
        ['📱', 'Tous appareils', 'Téléphone, tablette, ordinateur — responsive design optimisé pour l\'apprentissage.'],
        ['🌐', 'Arabe & Français', 'Interface complète en arabe avec support RTL natif et en français.'],
      ];
      foreach ($features as [$icon, $title, $desc]): ?>
      <div class="card card-glass" style="padding:1.75rem;" data-animate>
        <div style="font-size:2rem;margin-bottom:1rem;"><?= $icon ?></div>
        <h3 style="font-size:1.1rem;margin-bottom:0.5rem;"><?= e($title) ?></h3>
        <p style="font-size:0.875rem;"><?= e($desc) ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ==================== COMMENT ÇA MARCHE ==================== -->
<section class="section">
  <div class="container">
    <div class="section-header" data-animate>
      <span class="section-tag"><?= $lang === 'ar' ? 'كيف يعمل' : 'Comment ça marche' ?></span>
      <h2 class="section-title"><?= $lang === 'ar' ? 'ابدأ في 3 خطوات بسيطة' : 'Démarrez en 3 étapes simples' ?></h2>
    </div>
    <div class="grid grid-3" style="max-width:900px;margin:0 auto;" data-animate>
      <?php
      $steps = $lang === 'ar' ? [
        ['1', 'أنشئ حسابك', 'سجّل مجاناً في أقل من دقيقة. لا حاجة لبطاقة بنكية في الجزائر.'],
        ['2', 'أضف ملف طفلك', 'أملأ صفوف الطفل واختر المادة — النظام يُكيّف المحتوى تلقائياً.'],
        ['3', 'ابدأ التعلم', 'دروس تفاعلية، تمارين مباشرة، وألعاب تعليمية تحفّز الطفل.'],
      ] : [
        ['1', 'Créez votre compte', 'Inscription gratuite en moins d\'une minute. Pas de carte bancaire requise pour l\'Algérie.'],
        ['2', 'Ajoutez le profil enfant', 'Renseignez la classe et la matière — le système adapte tout automatiquement.'],
        ['3', 'Commencez à apprendre', 'Leçons interactives, exercices immédiats, et jeux qui passionnent l\'enfant.'],
      ];
      foreach ($steps as [$num, $title, $desc]): ?>
      <div style="text-align:center;padding:1.5rem;" data-animate>
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(255,107,53,0.15);border:2px solid var(--clr-accent);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;font-size:1.5rem;font-weight:900;color:var(--clr-accent);"><?= $num ?></div>
        <h3 style="font-size:1.1rem;margin-bottom:0.5rem;"><?= e($title) ?></h3>
        <p style="font-size:0.875rem;"><?= e($desc) ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- ==================== CTA FINAL ==================== -->
<section class="section-sm" style="background:linear-gradient(135deg,var(--clr-primary) 0%,#1B3A5C 50%,var(--clr-primary-dark) 100%);text-align:center;">
  <div class="container" data-animate>
    <h2 style="font-size:clamp(1.75rem,4vw,2.75rem);margin-bottom:1rem;color:white;">
      <?= $lang === 'ar' ? 'ابدأ مجاناً اليوم' : 'Commencez gratuitement aujourd\'hui' ?>
    </h2>
    <p style="color:rgba(255,255,255,0.7);margin-bottom:2rem;font-size:1.125rem;max-width:500px;margin-left:auto;margin-right:auto;">
      <?= $lang === 'ar'
        ? 'انضم إلى آلاف الأسر الجزائرية التي تثق بـ FreeGeny لمساعدة أطفالها على التفوق.'
        : 'Rejoignez des milliers de familles algériennes qui font confiance à FreeGeny pour aider leurs enfants à exceller.' ?>
    </p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
      <a href="<?= APP_URL ?>/auth/register" class="btn btn-primary btn-xl" id="cta-footer-register">
        <?= t('hero.cta.free') ?>
      </a>
      <a href="<?= APP_URL ?>/auth/login" class="btn btn-ghost btn-lg" style="border-color:rgba(255,255,255,0.3);color:rgba(255,255,255,0.8);" id="cta-footer-login">
        <?= t('nav.login') ?>
      </a>
    </div>
    <p style="margin-top:1.5rem;font-size:0.875rem;color:rgba(255,255,255,0.5);">
      <?= $lang === 'ar' ? '✓ مجاني في الجزائر · ✓ بدون إعلانات خلال الدروس · ✓ آمن للأطفال' : '✓ Gratuit en Algérie · ✓ Zéro pub pendant les leçons · ✓ Sécurisé pour les enfants' ?>
    </p>
  </div>
</section>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>
