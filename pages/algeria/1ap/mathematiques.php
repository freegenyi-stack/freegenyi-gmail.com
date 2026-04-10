<?php
// ============================================================
// Page Vitrine — Mathématiques 1AP (Algérie)
// ============================================================
require_once __DIR__ . '/../../../config/app.php';
initSession();

$lang  = detectLang();
$isRtl = in_array($lang, RTL_LANGS);
$translations = loadLang($lang);

function loadSubjectJson(string $subject, string $file): ?array {
    $dataPaths = [
        DATA_PATH . "/algeria/1ap/{$subject}/{$file}",
        ROOT_PATH . "/../../../Documentation_Programs_Contry/ar/algeria/1_ap/{$subject}/output/{$file}",
    ];
    foreach ($dataPaths as $path) {
        $realPath = realpath($path);
        if ($realPath && file_exists($realPath)) {
            return json_decode(file_get_contents($realPath), true) ?? null;
        }
    }
    return null;
}

$presentation  = loadSubjectJson('mathematiques', 'presentation_maths_1ap_latest.json');
$curriculumMap = loadSubjectJson('mathematiques', 'curriculum_map_maths_1ap_latest.json');

$stats       = $presentation['stats']       ?? [];
$programme   = $presentation['programme']   ?? [];
$temoignages = $presentation['temoignages'] ?? [];
$faq         = $presentation['faq']         ?? [];

$lecons = $curriculumMap['lecons'] ?? [];
$leconsByTrimestre = [];
foreach ($lecons as $lecon) {
    $t = $lecon['trimestre'] ?? 1;
    if (!isset($leconsByTrimestre[$t])) $leconsByTrimestre[$t] = [];
    if (count($leconsByTrimestre[$t]) < 8) {
        $leconsByTrimestre[$t][] = $lecon;
    }
}

$seo = $presentation['seo'] ?? [];
$pageTitle       = $seo['title_fr'] ?? 'Mathématiques 1AP Algérie — FreeGeny';
$pageDescription = $seo['description_fr'] ?? 'Programme Mathématiques 1ère Année Primaire Algérie.';
$typeIcons = ['lecon' => '🔢', 'evaluation' => '📝', 'revision' => '🔄', 'project' => '🎨'];

require_once INCLUDES_PATH . '/header.php';
?>

<!-- Hero Matière Maths -->
<section style="background:linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#388e3c 100%);padding:4rem 0;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:flex-end;padding-right:5%;pointer-events:none;opacity:.06;font-size:20rem;font-weight:900;line-height:1;">π</div>
  <div class="container" style="position:relative;z-index:1;">
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
      <a href="<?= APP_URL ?>" style="color:rgba(255,255,255,.5);font-size:.875rem;text-decoration:none;">
        <?= $lang === 'ar' ? 'الرئيسية' : 'Accueil' ?>
      </a>
      <span style="color:rgba(255,255,255,.3);">/</span>
      <span style="color:rgba(255,255,255,.7);font-size:.875rem;"><?= $lang === 'ar' ? 'الرياضيات 1 ابتدائي' : 'Mathématiques 1AP' ?></span>
    </div>

    <div style="display:grid;grid-template-columns:1fr auto;gap:3rem;align-items:center;" class="hero-subject-grid">
      <div>
        <div class="hero-badge" style="margin-bottom:1.5rem;background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.3);">
          🇩🇿 <?= $lang === 'ar' ? 'برنامج وزارة التربية الوطنية — الجزائر' : 'Programme MEN Algérie · 1ère Année Primaire' ?>
        </div>
        <h1 style="font-size:clamp(1.8rem,4vw,3rem);color:white;margin-bottom:1rem;line-height:1.2;">
          <?php if ($lang === 'ar'): ?>
            <span style="font-family:var(--font-arabic);"><?= e($presentation['page_titre']['titre_ar'] ?? 'الرياضيات') ?></span>
          <?php else: ?>
            <?= e($presentation['page_titre']['titre_fr'] ?? 'Mathématiques 1AP') ?>
          <?php endif; ?>
        </h1>
        <p style="color:rgba(255,255,255,.8);font-size:1.1rem;max-width:560px;margin-bottom:2rem;line-height:1.7;">
          <?= e($presentation['page_titre']['sous_titre_fr'] ?? '') ?>
        </p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <?php if (isLoggedIn()): ?>
          <a href="<?= APP_URL ?>/cours/maths_dz_lecon_001" class="btn btn-lg" style="background:white;color:#2e7d32;font-weight:700;" id="btn-start-maths">
            🚀 <?= $lang === 'ar' ? 'ابدأ الآن' : 'Commencer maintenant' ?>
          </a>
          <?php else: ?>
          <a href="<?= APP_URL ?>/auth/register" class="btn btn-lg" style="background:white;color:#2e7d32;font-weight:700;" id="btn-register-maths">
            <?= $lang === 'ar' ? 'ابدأ مجاناً' : 'Commencer gratuitement' ?>
          </a>
          <?php endif; ?>
          <a href="#programme" class="btn btn-ghost btn-lg" style="border-color:rgba(255,255,255,.4);color:rgba(255,255,255,.9);">
            <?= $lang === 'ar' ? 'استكشف البرنامج' : 'Voir le programme' ?>
          </a>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;">
        <div style="width:160px;height:160px;border-radius:2rem;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:6rem;line-height:1;font-weight:900;color:rgba(255,255,255,.9);">
          π
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Stats -->
<section style="background:var(--clr-surface);border-bottom:1px solid var(--clr-border);">
  <div class="container" style="padding:2rem var(--space-6);">
    <div style="display:flex;gap:2.5rem;flex-wrap:wrap;justify-content:center;">
      <?php foreach ($stats as $stat): ?>
      <div style="text-align:center;">
        <div style="font-size:2rem;font-weight:900;color:#66bb6a;" data-count="<?= preg_replace('/[^0-9]/', '', $stat['valeur']) ?>">
          <?= e($stat['valeur']) ?>
        </div>
        <div style="font-size:0.8rem;color:var(--clr-text-muted);margin-top:.25rem;"><?= e($stat['label_fr']) ?></div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Programme -->
<section class="section" id="programme">
  <div class="container">
    <div class="section-header">
      <span class="section-tag" style="background:rgba(0,200,83,.1);color:#66bb6a;"><?= $lang === 'ar' ? 'البرنامج الدراسي' : 'Programme officiel' ?></span>
      <h2 class="section-title"><?= $lang === 'ar' ? '3 فصول · دروس الرياضيات' : '3 trimestres · Leçons de maths' ?></h2>
    </div>

    <div x-data="{ activeTab: 1 }" style="max-width:900px;margin:0 auto;">
      <div style="display:flex;gap:.5rem;margin-bottom:2rem;background:var(--clr-surface);border-radius:var(--radius-lg);padding:.25rem;">
        <?php for ($t = 1; $t <= 3; $t++): ?>
        <button @click="activeTab = <?= $t ?>"
          :class="activeTab === <?= $t ?> ? '' : 'btn-ghost'"
          :style="activeTab === <?= $t ?> ? 'background:#2e7d32;color:white;' : ''"
          class="btn btn-sm" style="flex:1;border:none;"
          id="maths-tab-<?= $t ?>">
          <?= $lang === 'ar' ? "الفصل $t" : "Trimestre $t" ?>
        </button>
        <?php endfor; ?>
      </div>

      <?php for ($t = 1; $t <= 3; $t++): ?>
      <div x-show="activeTab === <?= $t ?>" x-transition>
        <?php if (!empty($programme["trimestre_$t"])): ?>
        <div class="card-glass" style="padding:1.5rem;margin-bottom:1.5rem;border-radius:var(--radius-xl);border-color:rgba(0,200,83,.15);">
          <h3 style="font-size:1rem;margin-bottom:.75rem;color:#66bb6a;">
            🎯 <?= e($programme["trimestre_$t"]['titre_fr'] ?? '') ?>
          </h3>
          <ul style="display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem;">
            <?php foreach ($programme["trimestre_$t"]['objectifs_fr'] ?? [] as $obj): ?>
            <li style="display:flex;align-items:flex-start;gap:.5rem;font-size:.875rem;color:var(--clr-text-muted);">
              <span style="color:var(--clr-success);flex-shrink:0;margin-top:2px;">✓</span>
              <?= e($obj) ?>
            </li>
            <?php endforeach; ?>
          </ul>
        </div>
        <?php endif; ?>

        <div style="display:flex;flex-direction:column;gap:.625rem;">
          <?php foreach ($leconsByTrimestre[$t] ?? [] as $lecon): ?>
          <a href="<?= APP_URL ?>/cours/<?= e($lecon['id']) ?>"
            class="lesson-card" style="text-decoration:none;border-color:rgba(0,200,83,.1);">
            <div class="lesson-num" style="background:rgba(46,125,50,.2);color:#66bb6a;">
              <?= $lecon['numero'] ?>
            </div>
            <div class="lesson-info">
              <div class="lesson-title">
                <?= $typeIcons[$lecon['type']] ?? '🔢' ?>
                <?= $lang === 'ar' ? e($lecon['titre_ar'] ?? $lecon['titre_fr']) : e($lecon['titre_fr']) ?>
              </div>
              <div class="lesson-meta"><?= $lecon['duree_minutes'] ?> min · <?= ucfirst($lecon['type']) ?> · Sem.<?= $lecon['semaine'] ?></div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-faint)" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <?php endforeach; ?>
        </div>

        <div style="text-align:center;margin-top:1.5rem;">
          <a href="<?= APP_URL ?>/auth/<?= isLoggedIn() ? '' : 'register' ?>" class="btn btn-outline" style="border-color:#388e3c;color:#66bb6a;" id="btn-maths-plus-t<?= $t ?>">
            <?= $lang === 'ar' ? "اعرض جميع دروس الفصل $t" : "Voir toutes les leçons du trimestre $t →" ?>
          </a>
        </div>
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
      <span class="section-tag" style="background:rgba(0,200,83,.1);color:#66bb6a;">⭐ <?= $lang === 'ar' ? 'آراء الأولياء' : 'Avis parents' ?></span>
      <h2 class="section-title"><?= $lang === 'ar' ? 'ماذا يقولون؟' : 'Ce qu\'ils en pensent' ?></h2>
    </div>
    <div class="grid grid-3">
      <?php foreach ($temoignages as $t): ?>
      <div class="card-glass" style="padding:1.75rem;border-radius:var(--radius-xl);">
        <div style="display:flex;gap:.25rem;margin-bottom:1rem;">
          <?php for ($i = 0; $i < ($t['note'] ?? 5); $i++): ?><span style="color:#fbbf24;">★</span><?php endfor; ?>
        </div>
        <p style="font-size:.875rem;color:var(--clr-text-muted);line-height:1.6;margin-bottom:1rem;">"<?= e($t['texte_fr'] ?? '') ?>"</p>
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
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <?php foreach ($faq as $i => $item): ?>
      <div x-data="{ open: false }" style="border:1px solid var(--clr-border);border-radius:var(--radius-lg);overflow:hidden;">
        <button @click="open = !open"
          style="width:100%;padding:1.25rem 1.5rem;background:var(--clr-surface);display:flex;justify-content:space-between;align-items:center;border:none;cursor:pointer;text-align:left;"
          id="faq-maths-<?= $i ?>">
          <span style="font-weight:600;color:var(--clr-text);font-size:.95rem;"><?= e($item['question_fr']) ?></span>
          <svg :style="open ? 'transform:rotate(180deg)' : ''" style="transition:.2s;flex-shrink:0;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-muted)" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
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

<!-- CTA -->
<section style="background:linear-gradient(135deg,#1b5e20,#0d2010);padding:4rem 0;text-align:center;">
  <div class="container">
    <h2 style="color:white;margin-bottom:1rem;"><?= $lang === 'ar' ? 'ابدأ رحلة الرياضيات اليوم' : 'Commencez l\'aventure Maths aujourd\'hui' ?></h2>
    <p style="color:rgba(255,255,255,.7);margin-bottom:2rem;"><?= $lang === 'ar' ? '115 درساً · مجاني في الجزائر' : '115 leçons conformes MEN · Gratuit en Algérie' ?></p>
    <a href="<?= APP_URL ?>/<?= isLoggedIn() ? 'cours/maths_dz_lecon_001' : 'auth/register' ?>" class="btn btn-lg" style="background:white;color:#2e7d32;font-weight:700;" id="cta-maths-final">
      🚀 <?= $lang === 'ar' ? 'ابدأ الآن' : 'Commencer maintenant' ?>
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
