<?php
// ============================================================
// Page Vitrine — Arabe 1AP (Algérie)
// Source : presentation_arabe_1ap_latest.json + curriculum_map
// ============================================================
require_once __DIR__ . '/../../../config/app.php';
initSession();

$lang  = detectLang();
$isRtl = in_array($lang, RTL_LANGS);
$translations = loadLang($lang);

// --- Chargement des JSONs ---
function loadSubjectJson(string $subject, string $file): ?array {
    // Chercher d'abord dans data/ (production), ensuite dans Documentation_Programs_Contry (dev)
    $dataPaths = [
        DATA_PATH . "/algeria/1ap/{$subject}/{$file}",
        ROOT_PATH . "/../../../Documentation_Programs_Contry/ar/algeria/1_ap/{$subject}/output/{$file}",
    ];
    foreach ($dataPaths as $path) {
        $realPath = realpath($path);
        if ($realPath && file_exists($realPath)) {
            $json = file_get_contents($realPath);
            return json_decode($json, true) ?? null;
        }
    }
    return null;
}

$presentation  = loadSubjectJson('arabe', 'presentation_arabe_1ap_latest.json');
$curriculumMap = loadSubjectJson('arabe', 'curriculum_map_arabe_1ap_latest.json');

// Stats depuis le JSON
$stats = $presentation['stats'] ?? [];
$programme = $presentation['programme'] ?? [];
$temoignages = $presentation['temoignages'] ?? [];
$faq = $presentation['faq'] ?? [];

// Leçons par trimestre (max 8 premières par trimestre pour l'aperçu)
$lecons = $curriculumMap['lecons'] ?? [];
$leconsByTrimestre = [];
foreach ($lecons as $lecon) {
    $t = $lecon['trimestre'] ?? 1;
    if (!isset($leconsByTrimestre[$t])) $leconsByTrimestre[$t] = [];
    if (count($leconsByTrimestre[$t]) < 8) {
        $leconsByTrimestre[$t][] = $lecon;
    }
}

// SEO depuis JSON
$seo = $presentation['seo'] ?? [];
$pageTitle       = $seo['title_fr'] ?? 'Arabe 1AP Algérie — FreeGeny';
$pageDescription = $seo['description_fr'] ?? 'Programme interactif Arabe 1ère Année Primaire Algérie.';

$typeIcons = ['lecon' => '📖', 'evaluation' => '📝', 'revision' => '🔄', 'project' => '🎨'];
$statusColors = ['lecon' => 'var(--clr-primary-light)', 'evaluation' => 'var(--clr-accent)', 'revision' => 'var(--clr-success)', 'project' => '#7c3aed'];

require_once INCLUDES_PATH . '/header.php';
?>

<!-- Hero Matière -->
<section style="background:linear-gradient(135deg,#0d1642 0%,#1a237e 50%,#283593 100%);padding:4rem 0;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 opacity=%220.04%22>ع</text></svg>') center/cover;pointer-events:none;"></div>
  <div class="container" style="position:relative;z-index:1;">
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
      <a href="<?= APP_URL ?>" style="color:rgba(255,255,255,.5);font-size:.875rem;text-decoration:none;">
        <?= $lang === 'ar' ? 'الرئيسية' : 'Accueil' ?>
      </a>
      <span style="color:rgba(255,255,255,.3);">/</span>
      <span style="color:rgba(255,255,255,.7);font-size:.875rem;"><?= $lang === 'ar' ? 'اللغة العربية 1 ابتدائي' : 'Arabe 1AP' ?></span>
    </div>

    <div style="display:grid;grid-template-columns:1fr auto;gap:3rem;align-items:center;" class="hero-subject-grid">
      <div>
        <div class="hero-badge" style="margin-bottom:1.5rem;">
          🇩🇿 <?= $lang === 'ar' ? 'برنامج وزارة التربية الوطنية — الجزائر' : 'Programme MEN Algérie · 1ère Année Primaire' ?>
        </div>
        <h1 style="font-size:clamp(1.8rem,4vw,3rem);color:white;margin-bottom:1rem;line-height:1.2;">
          <?php if ($lang === 'ar'): ?>
            <span style="font-family:var(--font-arabic);"><?= e($presentation['page_titre']['titre_ar'] ?? 'اللغة العربية') ?></span>
          <?php else: ?>
            <?= e($presentation['page_titre']['titre_fr'] ?? 'Arabe 1AP') ?>
          <?php endif; ?>
        </h1>
        <p style="color:rgba(255,255,255,.75);font-size:1.1rem;max-width:560px;margin-bottom:2rem;line-height:1.7;">
          <?= e($presentation['page_titre']['sous_titre_fr'] ?? '') ?>
        </p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <?php if (isLoggedIn()): ?>
          <a href="<?= APP_URL ?>/cours/arabe_dz_lecon_001" class="btn btn-primary btn-lg" id="btn-start-arabe">
            🚀 <?= $lang === 'ar' ? 'ابدأ الآن' : 'Commencer maintenant' ?>
          </a>
          <?php else: ?>
          <a href="<?= APP_URL ?>/auth/register" class="btn btn-primary btn-lg" id="btn-register-arabe">
            <?= $lang === 'ar' ? 'ابدأ مجاناً' : 'Commencer gratuitement' ?>
          </a>
          <?php endif; ?>
          <a href="#programme" class="btn btn-ghost btn-lg" style="border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.8);">
            <?= $lang === 'ar' ? 'استكشف البرنامج' : 'Voir le programme' ?>
          </a>
        </div>
      </div>

      <!-- Symbole décoratif -->
      <div style="display:flex;align-items:center;justify-content:center;">
        <div style="width:160px;height:160px;border-radius:2rem;background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:6rem;line-height:1;">
          ع
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Stats de la matière -->
<section style="background:var(--clr-surface);border-bottom:1px solid var(--clr-border);">
  <div class="container" style="padding:2rem var(--space-6);">
    <div style="display:flex;gap:2.5rem;flex-wrap:wrap;justify-content:center;">
      <?php foreach ($stats as $stat): ?>
      <div style="text-align:center;">
        <div style="font-size:2rem;font-weight:900;color:var(--clr-accent);" data-count="<?= preg_replace('/[^0-9]/', '', $stat['valeur']) ?>">
          <?= e($stat['valeur']) ?>
        </div>
        <div style="font-size:0.8rem;color:var(--clr-text-muted);margin-top:.25rem;">
          <?= e($stat['label_fr']) ?>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Programme par trimestre -->
<section class="section" id="programme">
  <div class="container">
    <div class="section-header">
      <span class="section-tag"><?= $lang === 'ar' ? 'البرنامج الدراسي' : 'Programme officiel' ?></span>
      <h2 class="section-title"><?= $lang === 'ar' ? '3 فصول · 115 درساً' : '3 trimestres · 115 leçons' ?></h2>
      <p class="section-desc">
        <?= $lang === 'ar'
          ? 'البرنامج الكامل لوزارة التربية الوطنية الجزائرية، مُرقمن بالكامل وتفاعلي.'
          : 'Le programme complet du MEN algérien, numérisé et rendu interactif.' ?>
      </p>
    </div>

    <!-- Onglets trimestres -->
    <div x-data="{ activeTab: 1 }" style="max-width:900px;margin:0 auto;">
      <div style="display:flex;gap:.5rem;margin-bottom:2rem;background:var(--clr-surface);border-radius:var(--radius-lg);padding:.25rem;">
        <?php for ($t = 1; $t <= 3; $t++): ?>
        <button @click="activeTab = <?= $t ?>"
          :class="activeTab === <?= $t ?> ? 'btn-primary' : 'btn-ghost'"
          class="btn btn-sm" style="flex:1;border:none;"
          id="tab-trimestre-<?= $t ?>">
          <?= $lang === 'ar' ? "الفصل $t" : "Trimestre $t" ?>
        </button>
        <?php endfor; ?>
      </div>

      <?php for ($t = 1; $t <= 3; $t++): ?>
      <div x-show="activeTab === <?= $t ?>" x-transition>
        <!-- Objectifs du trimestre -->
        <?php if (!empty($programme["trimestre_$t"])): ?>
        <div class="card-glass" style="padding:1.5rem;margin-bottom:1.5rem;border-radius:var(--radius-xl);">
          <h3 style="font-size:1rem;margin-bottom:.75rem;">
            🎯 <?= e($programme["trimestre_$t"]['titre_fr'] ?? '') ?>
          </h3>
          <ul style="display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem;" data-animate>
            <?php foreach ($programme["trimestre_$t"]['objectifs_fr'] ?? [] as $obj): ?>
            <li style="display:flex;align-items:flex-start;gap:.5rem;font-size:.875rem;color:var(--clr-text-muted);">
              <span style="color:var(--clr-success);flex-shrink:0;margin-top:2px;">✓</span>
              <?= e($obj) ?>
            </li>
            <?php endforeach; ?>
          </ul>
        </div>
        <?php endif; ?>

        <!-- Liste des leçons (aperçu) -->
        <div style="display:flex;flex-direction:column;gap:.625rem;" data-animate>
          <?php foreach ($leconsByTrimestre[$t] ?? [] as $lecon): ?>
          <?php $icon = $typeIcons[$lecon['type']] ?? '📖'; ?>
          <a href="<?= APP_URL ?>/cours/<?= e($lecon['id']) ?>"
            class="lesson-card <?= isLoggedIn() ? '' : 'lesson-locked' ?>"
            style="text-decoration:none;">
            <div class="lesson-num" style="background:rgba(26,35,126,.3);color:#818cf8;">
              <?= $lecon['numero'] ?>
            </div>
            <div class="lesson-info">
              <div class="lesson-title">
                <?= $icon ?> <?= $lang === 'ar' ? e($lecon['titre_ar']) : e($lecon['titre_fr']) ?>
              </div>
              <div class="lesson-meta">
                <?= $lecon['duree_minutes'] ?> min ·
                <?php if ($lang === 'ar'): ?>
                  <?= $lecon['type'] === 'evaluation' ? 'تقييم' : ($lecon['type'] === 'revision' ? 'مراجعة' : 'درس') ?>
                <?php else: ?>
                  <?= ucfirst($lecon['type']) ?> · Sem.<?= $lecon['semaine'] ?>
                <?php endif; ?>
              </div>
            </div>
            <div class="lesson-status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-faint)" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </a>
          <?php endforeach; ?>
        </div>

        <?php if (!empty($curriculumMap['lecons'])): ?>
        <div style="text-align:center;margin-top:1.5rem;">
          <a href="<?= APP_URL ?>/auth/<?= isLoggedIn() ? '' : 'register' ?>" class="btn btn-outline" id="btn-voir-plus-t<?= $t ?>">
            <?= $lang === 'ar'
              ? '← اعرض جميع دروس الفصل ' . $t
              : "Voir toutes les leçons du trimestre $t →" ?>
          </a>
        </div>
        <?php endif; ?>
      </div>
      <?php endfor; ?>
    </div>
  </div>
</section>

<!-- Témoignages -->
<?php if ($temoignages): ?>
<section class="section-sm" style="background:var(--clr-surface);">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">⭐ <?= $lang === 'ar' ? 'آراء الأولياء والمعلمين' : 'Avis parents & enseignants' ?></span>
      <h2 class="section-title"><?= $lang === 'ar' ? 'ماذا يقولون عنا؟' : 'Ce qu\'ils en pensent' ?></h2>
    </div>
    <div class="grid grid-3" data-animate>
      <?php foreach ($temoignages as $t): ?>
      <div class="card-glass" style="padding:1.75rem;border-radius:var(--radius-xl);">
        <div style="display:flex;gap:.25rem;margin-bottom:1rem;">
          <?php for ($i = 0; $i < ($t['note'] ?? 5); $i++): ?><span style="color:#fbbf24;">★</span><?php endfor; ?>
        </div>
        <p style="font-size:.9rem;line-height:1.6;color:var(--clr-text-muted);margin-bottom:1rem;">
          "<?= e($t['texte_fr'] ?? '') ?>"
        </p>
        <div style="font-size:.8rem;font-weight:600;color:var(--clr-text);">— <?= e($t['auteur_fr'] ?? '') ?></div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- FAQ -->
<?php if ($faq): ?>
<section class="section">
  <div class="container" style="max-width:700px;">
    <div class="section-header">
      <span class="section-tag">FAQ</span>
      <h2 class="section-title"><?= $lang === 'ar' ? 'الأسئلة الشائعة' : 'Questions fréquentes' ?></h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:1rem;" data-animate>
      <?php foreach ($faq as $i => $item): ?>
      <div x-data="{ open: false }" style="border:1px solid var(--clr-border);border-radius:var(--radius-lg);overflow:hidden;">
        <button @click="open = !open"
          style="width:100%;padding:1.25rem 1.5rem;background:var(--clr-surface);display:flex;justify-content:space-between;align-items:center;border:none;cursor:pointer;text-align:<?= $isRtl ? 'right' : 'left' ?>;"
          id="faq-<?= $i ?>">
          <span style="font-weight:600;color:var(--clr-text);font-size:.95rem;"><?= e($item['question_fr']) ?></span>
          <svg :style="open ? 'transform:rotate(180deg)' : ''" style="transition:.2s;flex-shrink:0;margin-<?= $isRtl ? 'right' : 'left' ?>:.75rem;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-muted)" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div x-show="open" x-transition style="padding:1.25rem 1.5rem;border-top:1px solid var(--clr-border);background:var(--clr-surface-2);color:var(--clr-text-muted);font-size:.9rem;line-height:1.7;">
          <?= e($item['reponse_fr']) ?>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- CTA final -->
<section style="background:linear-gradient(135deg,#1a237e,#0d1642);padding:4rem 0;text-align:center;">
  <div class="container">
    <h2 style="color:white;margin-bottom:1rem;">
      <?= $lang === 'ar' ? 'ابدأ رحلة تعلم اللغة العربية اليوم' : 'Commencez l\'aventure Arabe aujourd\'hui' ?>
    </h2>
    <p style="color:rgba(255,255,255,.7);margin-bottom:2rem;">
      <?= $lang === 'ar' ? '115 درساً موافقاً لبرنامج الوزارة · مجاني في الجزائر' : '115 leçons conformes MEN · Gratuit en Algérie' ?>
    </p>
    <a href="<?= APP_URL ?>/<?= isLoggedIn() ? 'cours/arabe_dz_lecon_001' : 'auth/register' ?>" class="btn btn-primary btn-xl" id="cta-arabe-final">
      <?= $lang === 'ar' ? '🚀 ابدأ الآن' : '🚀 Commencer maintenant' ?>
    </a>
  </div>
</section>

<style>
@media (max-width: 768px) {
  .hero-subject-grid { grid-template-columns: 1fr !important; }
  .hero-subject-grid > div:last-child { display: none; }
}
</style>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>
