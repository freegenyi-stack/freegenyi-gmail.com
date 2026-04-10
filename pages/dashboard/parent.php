<?php
// ============================================================
// Page — Dashboard Parent
// ============================================================
require_once __DIR__ . '/../../config/app.php';
initSession();
requireLogin(APP_URL . '/dashboard/parent');

$lang  = detectLang();
$isRtl = in_array($lang, RTL_LANGS);
$translations = loadLang($lang);

$user = currentUser();

// Récupérer les enfants du parent
$children = DB::fetchAll(
    "SELECT * FROM children WHERE parent_id = ? ORDER BY created_at ASC",
    [$user['id']]
);

// Enfant actif (depuis session ou le premier)
$activeChildId = $_SESSION['active_child_id'] ?? ($children[0]['id'] ?? null);
if (isset($_GET['child'])) {
    $activeChildId = (int)$_GET['child'];
    $_SESSION['active_child_id'] = $activeChildId;
}

$activeChild = null;
$stats = null;
$bySubject = [];
$last7days = [];
$achievements = [];

if ($activeChildId) {
    $activeChild = DB::fetchOne(
        "SELECT * FROM children WHERE id = ? AND parent_id = ?",
        [$activeChildId, $user['id']]
    );
    if ($activeChild) {
        $stats = DB::fetchOne("SELECT * FROM v_child_stats WHERE child_id = ?", [$activeChildId]);
        $bySubject = DB::fetchAll(
          "SELECT subject, COUNT(*) as total, SUM(status='completed') as completed,
           ROUND(AVG(CASE WHEN status='completed' THEN score END),1) as avg_score
           FROM child_progress WHERE child_id = ? GROUP BY subject",
          [$activeChildId]
        );
        $last7days = DB::fetchAll(
          "SELECT DATE(created_at) as day, COUNT(*) as exercises, SUM(is_correct) as correct
           FROM exercise_attempts WHERE child_id = ?
           AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
           GROUP BY DATE(created_at) ORDER BY day ASC",
          [$activeChildId]
        );
        $achievements = DB::fetchAll(
          "SELECT badge_type, earned_at FROM achievements WHERE child_id = ? ORDER BY earned_at DESC LIMIT 6",
          [$activeChildId]
        );
    }
}

// Calcul du pourcentage de progression global
$progressPct = 0;
if ($stats && ($stats['lessons_total'] ?? 0) > 0) {
    $progressPct = round(($stats['lessons_completed'] / $stats['lessons_total']) * 100);
}

$pageTitle = t('nav.dashboard') . ' — FreeGeny';
$pageDescription = 'Suivez la progression scolaire de votre enfant en temps réel.';

require_once INCLUDES_PATH . '/header.php';
?>

<div class="dashboard-layout">

  <!-- ========= SIDEBAR ========= -->
  <aside class="dashboard-sidebar">

    <!-- Sélecteur enfant -->
    <div style="margin-bottom:1.5rem;">
      <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--clr-text-faint);margin-bottom:0.75rem;">
        <?= t('dashboard.child_select') ?>
      </p>

      <?php if ($children): ?>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <?php foreach ($children as $child): ?>
          <a href="?child=<?= $child['id'] ?>"
            style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-radius:var(--radius-lg);border:1.5px solid <?= $child['id'] == $activeChildId ? 'var(--clr-accent)' : 'var(--clr-border)' ?>;background:<?= $child['id'] == $activeChildId ? 'rgba(255,107,53,0.08)' : 'transparent' ?>;transition:all .2s;text-decoration:none;"
            id="child-<?= $child['id'] ?>">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--clr-primary),var(--clr-accent));display:flex;align-items:center;justify-content:center;font-weight:700;color:white;flex-shrink:0;font-size:1.1rem;">
              <?= strtoupper(mb_substr($child['name'], 0, 1)) ?>
            </div>
            <div>
              <div style="font-size:0.9rem;font-weight:600;color:var(--clr-text);"><?= e($child['name']) ?></div>
              <div style="font-size:0.75rem;color:var(--clr-text-muted);"><?= e($child['grade']) ?> · <?= $child['streak_days'] ?>🔥</div>
            </div>
          </a>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

      <a href="#" id="add-child-btn"
        style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem;border-radius:var(--radius-lg);border:1.5px dashed var(--clr-border);color:var(--clr-text-muted);font-size:0.875rem;margin-top:0.5rem;transition:all .2s;"
        onclick="document.getElementById('modal-add-child').style.display='flex';return false;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <?= t('dashboard.add_child') ?>
      </a>
    </div>

    <!-- Navigation sidebar -->
    <nav>
      <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--clr-text-faint);margin-bottom:0.75rem;">Navigation</p>
      <ul style="display:flex;flex-direction:column;gap:0.25rem;">
        <?php
        $navItems = [
          ['#', '📊', $lang === 'ar' ? 'التقدم' : 'Progression'],
          [APP_URL . '/algeria/1ap/arabe', '📚', t('subjects.arabe')],
          [APP_URL . '/algeria/1ap/mathematiques', '🔢', t('subjects.maths')],
        ];
        foreach ($navItems as [$href, $icon, $label]):
        ?>
        <li>
          <a href="<?= $href ?>" style="display:flex;align-items:center;gap:0.625rem;padding:0.625rem 0.75rem;border-radius:var(--radius-md);color:var(--clr-text-muted);font-size:0.875rem;transition:all .2s;text-decoration:none;"
            onmouseover="this.style.background='var(--clr-surface-2)';this.style.color='var(--clr-text)'"
            onmouseout="this.style.background='';this.style.color='var(--clr-text-muted)'">
            <span><?= $icon ?></span> <?= e($label) ?>
          </a>
        </li>
        <?php endforeach; ?>
      </ul>
    </nav>

    <!-- Monetisation badge -->
    <?php $mono = getSessionMonetization(); ?>
    <?php if ($mono['tier'] === 'free_ads'): ?>
    <div style="margin-top:auto;padding-top:1.5rem;border-top:1px solid var(--clr-border);margin-top:2rem;">
      <div class="badge badge-success" style="display:block;text-align:center;padding:.5rem;">
        🇩🇿 <?= $lang === 'ar' ? 'وصول مجاني — الجزائر' : 'Accès gratuit — Algérie' ?>
      </div>
    </div>
    <?php endif; ?>

  </aside>

  <!-- ========= CONTENU PRINCIPAL ========= -->
  <div class="dashboard-content">

    <!-- Header dashboard -->
    <div class="dashboard-header">
      <h1><?= t('dashboard.welcome', ['name' => e($user['full_name'])]) ?></h1>
      <p style="color:var(--clr-text-muted);">
        <?= $lang === 'ar'
          ? 'مرحباً بك في لوحة تحكم الأولياء — تابع تقدم أطفالك'
          : 'Bienvenue dans votre espace parent — suivez la progression de vos enfants' ?>
      </p>
    </div>

    <?php if (!$activeChild): ?>
    <!-- Pas d'enfant -->
    <div style="text-align:center;padding:4rem 2rem;background:var(--clr-surface);border-radius:var(--radius-2xl);border:2px dashed var(--clr-border);">
      <div style="font-size:4rem;margin-bottom:1rem;">👶</div>
      <h2 style="margin-bottom:0.75rem;"><?= $lang === 'ar' ? 'أضف ملف طفلك الأول' : 'Ajoutez le profil de votre premier enfant' ?></h2>
      <p style="margin-bottom:2rem;max-width:400px;margin:0 auto 2rem;"><?= $lang === 'ar' ? 'أضف طفلك لتتمكن من متابعة نتائجه وتقدمه الدراسي.' : 'Ajoutez votre enfant pour suivre ses résultats et sa progression scolaire.' ?></p>
      <button class="btn btn-primary btn-lg" onclick="document.getElementById('modal-add-child').style.display='flex'">
        <?= t('dashboard.add_child') ?>
      </button>
    </div>

    <?php else: ?>

    <!-- ====== STATS CARTES ====== -->
    <div class="grid grid-4" style="margin-bottom:2rem;">

      <!-- Progression -->
      <div class="stat-card" style="background:linear-gradient(135deg,rgba(26,35,126,0.3),rgba(41,53,176,0.1));border-color:rgba(63,81,181,0.3);">
        <div class="stat-card-icon" style="background:rgba(63,81,181,0.15);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c83f5" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-card-value"><?= $progressPct ?>%</div>
        <div class="stat-card-label"><?= t('dashboard.progress') ?></div>
        <div class="progress-bar-container" style="margin-top:0.75rem;">
          <div class="progress-bar-fill" style="width:<?= $progressPct ?>%;"></div>
        </div>
      </div>

      <!-- Streak -->
      <div class="stat-card" style="background:linear-gradient(135deg,rgba(255,107,53,0.15),rgba(255,107,53,0.05));border-color:rgba(255,107,53,0.3);">
        <div class="stat-card-icon" style="background:rgba(255,107,53,0.15);">
          <span style="font-size:1.5rem;">🔥</span>
        </div>
        <div class="stat-card-value"><?= (int)($activeChild['streak_days'] ?? 0) ?></div>
        <div class="stat-card-label"><?= t('dashboard.streak') ?> <?= $lang === 'ar' ? 'متتالية' : 'jours consécutifs' ?></div>
      </div>

      <!-- XP -->
      <div class="stat-card" style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(124,58,237,0.05));border-color:rgba(124,58,237,0.3);">
        <div class="stat-card-icon" style="background:rgba(124,58,237,0.2);">
          <span style="font-size:1.5rem;">⭐</span>
        </div>
        <div class="stat-card-value"><?= number_format((int)($activeChild['xp_total'] ?? 0)) ?></div>
        <div class="stat-card-label"><?= t('dashboard.xp_total') ?></div>
      </div>

      <!-- Score moyen -->
      <div class="stat-card" style="background:linear-gradient(135deg,rgba(0,200,83,0.15),rgba(0,200,83,0.05));border-color:rgba(0,200,83,0.3);">
        <div class="stat-card-icon" style="background:rgba(0,200,83,0.15);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="stat-card-value"><?= $stats['avg_score'] ?? '—' ?><span style="font-size:1rem;color:var(--clr-text-muted)">/10</span></div>
        <div class="stat-card-label"><?= $lang === 'ar' ? 'متوسط النقاط' : 'Score moyen' ?></div>
      </div>

    </div>

    <!-- ====== PROGRESSION PAR MATIÈRE + RING ====== -->
    <div class="grid grid-2" style="margin-bottom:2rem;">

      <!-- Anneau de progression -->
      <div class="card" style="display:flex;align-items:center;justify-content:center;flex-direction:column;padding:2rem;">
        <h3 style="margin-bottom:1.5rem;font-size:1rem;"><?= $lang === 'ar' ? 'التقدم الإجمالي' : 'Progression globale' ?></h3>
        <?php
          $r = 54;
          $circumference = 2 * M_PI * $r;
          $dashOffset = $circumference - ($progressPct / 100) * $circumference;
        ?>
        <div class="progress-ring-container" style="margin-bottom:1rem;">
          <svg width="140" height="140" class="progress-ring" data-percent="<?= $progressPct ?>">
            <circle cx="70" cy="70" r="<?= $r ?>" fill="none" stroke="var(--clr-surface-2)" stroke-width="12"/>
            <circle class="progress-ring-fill" cx="70" cy="70" r="<?= $r ?>" fill="none"
              stroke="url(#ring-grad)" stroke-width="12" stroke-linecap="round"
              stroke-dasharray="<?= $circumference ?>"
              stroke-dashoffset="<?= $dashOffset ?>"/>
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="var(--clr-accent)"/>
                <stop offset="100%" stop-color="#ff9a3c"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="progress-ring-label">
            <span class="progress-ring-pct"><?= $progressPct ?>%</span>
            <span class="progress-ring-sub"><?= $lang === 'ar' ? 'مكتمل' : 'complété' ?></span>
          </div>
        </div>
        <p style="font-size:0.875rem;color:var(--clr-text-muted);text-align:center;">
          <?= (int)($stats['lessons_completed'] ?? 0) ?> / <?= (int)($stats['lessons_total'] ?? 0) ?> <?= $lang === 'ar' ? 'درس' : 'leçons' ?>
        </p>
      </div>

      <!-- Par matière -->
      <div class="card" style="padding:1.5rem;">
        <h3 style="margin-bottom:1.5rem;font-size:1rem;"><?= $lang === 'ar' ? 'التقدم حسب المادة' : 'Progression par matière' ?></h3>
        <?php if ($bySubject): foreach ($bySubject as $sub): ?>
        <?php
          $subPct = ($sub['total'] > 0) ? round(($sub['completed'] / $sub['total']) * 100) : 0;
          $subIcon = $sub['subject'] === 'arabe' ? '📖' : '🔢';
          $subLabel = $sub['subject'] === 'arabe' ? t('subjects.arabe') : t('subjects.maths');
        ?>
        <div style="margin-bottom:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.375rem;">
            <span style="font-size:0.875rem;font-weight:600;"><?= $subIcon ?> <?= e($subLabel) ?></span>
            <span style="font-size:0.875rem;color:var(--clr-text-muted);"><?= $subPct ?>% · <?= $sub['avg_score'] ?? '—' ?>/10</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width:<?= $subPct ?>%;"></div>
          </div>
        </div>
        <?php endforeach; else: ?>
        <p style="color:var(--clr-text-muted);text-align:center;padding:2rem 0;">
          <?= $lang === 'ar' ? 'لا يوجد نشاط بعد' : 'Aucune activité pour l\'instant' ?>
        </p>
        <?php endif; ?>

        <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--clr-border);">
          <a href="<?= APP_URL ?>/algeria/1ap/arabe" class="btn btn-primary w-full btn-sm">
            <?= $lang === 'ar' ? '→ ابدأ درساً جديداً' : '→ Commencer une leçon' ?>
          </a>
        </div>
      </div>

    </div>

    <!-- ====== ACTIVITÉ 7 JOURS ====== -->
    <div class="card" style="padding:1.5rem;margin-bottom:2rem;">
      <h3 style="margin-bottom:1.5rem;font-size:1rem;"><?= $lang === 'ar' ? 'نشاط آخر 7 أيام' : 'Activité des 7 derniers jours' ?></h3>
      <?php if ($last7days): ?>
      <div style="display:flex;gap:0.75rem;align-items:flex-end;height:100px;">
        <?php
        $maxEx = max(array_column($last7days, 'exercises') ?: [1]);
        // Générer les 7 derniers jours
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $d = date('Y-m-d', strtotime("-$i days"));
            $days[$d] = 0;
        }
        foreach ($last7days as $row) { $days[$row['day']] = (int)$row['exercises']; }
        foreach ($days as $date => $count):
          $h = $maxEx > 0 ? max(8, round(($count / $maxEx) * 80)) : 8;
          $dayName = date('D', strtotime($date));
        ?>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.375rem;">
          <div style="width:100%;height:<?= $h ?>px;background:<?= $count > 0 ? 'var(--clr-accent)' : 'var(--clr-surface-2)' ?>;border-radius:var(--radius-sm);transition:height .3s ease;" title="<?= $count ?> exercices"></div>
          <span style="font-size:0.65rem;color:var(--clr-text-faint);"><?= $dayName ?></span>
        </div>
        <?php endforeach; ?>
      </div>
      <?php else: ?>
      <p style="color:var(--clr-text-muted);text-align:center;padding:1.5rem 0;"><?= t('dashboard.no_activity') ?></p>
      <?php endif; ?>
    </div>

    <!-- ====== BADGES ====== -->
    <?php if ($achievements): ?>
    <div class="card" style="padding:1.5rem;">
      <h3 style="margin-bottom:1.25rem;font-size:1rem;">🏆 <?= $lang === 'ar' ? 'الأوسمة الأخيرة' : 'Derniers badges obtenus' ?></h3>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
        <?php foreach ($achievements as $ach): ?>
        <div class="badge badge-accent" style="padding:.5rem .75rem;font-size:.875rem;">
          🌟 <?= e($ach['badge_type']) ?>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endif; ?>

    <?php endif; // fin activeChild ?>
  </div><!-- /dashboard-content -->
</div><!-- /dashboard-layout -->

<!-- ========= MODAL AJOUTER ENFANT ========= -->
<div id="modal-add-child" class="modal-overlay" style="display:none;" x-data="addChildForm()">
  <div class="modal" @click.stop>
    <div class="modal-header">
      <h3 class="card-title"><?= t('dashboard.add_child') ?></h3>
      <button class="modal-close" onclick="document.getElementById('modal-add-child').style.display='none'">✕</button>
    </div>
    <div class="modal-body">
      <div x-show="error" x-text="error" class="alert alert-error" style="margin-bottom:1rem;display:none;"></div>
      <div class="form-group">
        <label class="form-label"><?= $lang === 'ar' ? 'اسم الطفل' : 'Prénom de l\'enfant' ?></label>
        <input type="text" x-model="child.name" class="form-input" placeholder="<?= $lang === 'ar' ? 'أحمد' : 'Ahmed' ?>">
      </div>
      <div class="grid grid-2" style="gap:1rem;">
        <div class="form-group">
          <label class="form-label"><?= $lang === 'ar' ? 'العمر' : 'Âge' ?></label>
          <input type="number" x-model="child.age" class="form-input" min="5" max="12" placeholder="6">
        </div>
        <div class="form-group">
          <label class="form-label"><?= $lang === 'ar' ? 'المستوى' : 'Niveau' ?></label>
          <select x-model="child.grade" class="form-select">
            <option value="1AP">1ère Année Primaire</option>
            <option value="2AP">2ème Année Primaire</option>
            <option value="3AP">3ème Année Primaire</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="document.getElementById('modal-add-child').style.display='none'">
        <?= $lang === 'ar' ? 'إلغاء' : 'Annuler' ?>
      </button>
      <button class="btn btn-primary" @click="submit" :class="{'btn-loading':loading}" :disabled="loading">
        <?= $lang === 'ar' ? 'إضافة' : 'Ajouter' ?>
      </button>
    </div>
  </div>
</div>

<script>
function addChildForm() {
  return {
    child: { name:'', age: 6, grade:'1AP', language:'ar' },
    loading: false, error: '',
    async submit() {
      if (!this.child.name) { this.error = '<?= $lang === 'ar' ? 'أدخل اسم الطفل.' : "Entrez le prénom de l'enfant." ?>'; return; }
      this.loading = true; this.error = '';
      const res = await apiFetch('<?= APP_URL ?>/api/child/add', {
        method:'POST', body: JSON.stringify(this.child)
      });
      if (res.ok && res.data.success) {
        window.location.reload();
      } else {
        this.error = res.data.error || '<?= t('error.generic') ?>';
        this.loading = false;
      }
    }
  };
}
</script>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>
