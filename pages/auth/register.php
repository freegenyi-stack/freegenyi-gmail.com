<?php
// ============================================================
// Page — Inscription
// ============================================================
require_once __DIR__ . '/../../config/app.php';
initSession();
requireGuest();

$lang  = detectLang();
$isRtl = in_array($lang, RTL_LANGS);
$translations = loadLang($lang);

$pageTitle       = 'Créer un compte — FreeGeny';
$pageDescription = 'Inscrivez-vous gratuitement sur FreeGeny et aidez votre enfant à s\'épanouir dans le programme algérien officiel.';

// Liste des pays principaux
$countries = [
  'DZ' => 'Algérie 🇩🇿', 'MA' => 'Maroc 🇲🇦', 'TN' => 'Tunisie 🇹🇳',
  'FR' => 'France 🇫🇷', 'BE' => 'Belgique 🇧🇪', 'CA' => 'Canada 🇨🇦',
  'GB' => 'Royaume-Uni 🇬🇧', 'DE' => 'Allemagne 🇩🇪', 'US' => 'États-Unis 🇺🇸',
  'EG' => 'Égypte 🇪🇬', 'LY' => 'Libye 🇱🇾', 'MR' => 'Mauritanie 🇲🇷',
];

require_once INCLUDES_PATH . '/header.php';
?>

<div class="auth-container" style="padding:3rem 1rem;">
  <div class="auth-card" style="max-width:500px;" x-data="registerForm()">

    <div class="auth-logo">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FF6B35"/>
        <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Inter">F</text>
      </svg>
      FreeGeny
    </div>

    <h1 class="auth-title"><?= t('auth.register.title') ?></h1>
    <p class="auth-subtitle">
      <?= $lang === 'ar' ? 'أنشئ حساباً مجانياً وتابع تقدم طفلك' : 'Créez votre compte gratuit pour suivre la progression de votre enfant' ?>
    </p>

    <!-- Alert -->
    <div x-show="error" x-text="error" class="alert alert-error" style="margin-bottom:1.5rem;display:none;" x-transition></div>
    <div x-show="success" class="alert alert-success" style="margin-bottom:1.5rem;display:none;" x-transition>
      <?= $lang === 'ar' ? '✓ تم إنشاء حسابك! جاري التحويل...' : '✓ Compte créé ! Redirection en cours...' ?>
    </div>

    <form @submit.prevent="submit" id="register-form" novalidate>

      <div class="form-group">
        <label class="form-label" for="reg-name"><?= t('auth.register.name') ?></label>
        <input
          type="text"
          id="reg-name"
          x-model="form.full_name"
          class="form-input"
          autocomplete="name"
          :placeholder="'<?= $lang === 'ar' ? 'محمد بن علي' : 'Ahmed Bensalem' ?>'"
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="reg-email"><?= t('auth.register.email') ?></label>
        <input
          type="email"
          id="reg-email"
          x-model="form.email"
          class="form-input"
          autocomplete="email"
          placeholder="votre@email.com"
          required
        >
      </div>

      <div class="grid grid-2" style="gap:1rem;">
        <div class="form-group">
          <label class="form-label" for="reg-pass"><?= t('auth.register.password') ?></label>
          <input
            :type="showPass ? 'text' : 'password'"
            id="reg-pass"
            x-model="form.password"
            class="form-input"
            autocomplete="new-password"
            placeholder="••••••••"
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-confirm"><?= t('auth.register.confirm') ?></label>
          <input
            :type="showPass ? 'text' : 'password'"
            id="reg-confirm"
            x-model="form.confirm"
            class="form-input"
            autocomplete="new-password"
            placeholder="••••••••"
            required
          >
        </div>
      </div>

      <div class="form-group">
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;color:var(--clr-text-muted);">
          <input type="checkbox" x-model="showPass" style="width:16px;height:16px;accent-color:var(--clr-accent);">
          <?= $lang === 'ar' ? 'إظهار كلمة المرور' : 'Afficher le mot de passe' ?>
        </label>
      </div>

      <div class="form-group">
        <label class="form-label" for="reg-country"><?= t('auth.register.country') ?></label>
        <select id="reg-country" x-model="form.country" class="form-select">
          <?php foreach ($countries as $code => $name): ?>
          <option value="<?= e($code) ?>" <?= $code === 'DZ' ? 'selected' : '' ?>><?= e($name) ?></option>
          <?php endforeach; ?>
        </select>
        <p class="form-hint">
          <?= $lang === 'ar' ? '* يحدد البلد نوع الاشتراك (مجاني أو مدفوع).' : '* Le pays détermine votre type d\'accès (gratuit ou premium).' ?>
        </p>
      </div>

      <!-- Password strength -->
      <div class="form-group" x-show="form.password.length > 0">
        <div style="display:flex;gap:0.25rem;margin-bottom:0.25rem;">
          <div style="flex:1;height:4px;border-radius:2px;" :style="{ background: strength >= 1 ? '#ff4444' : 'var(--clr-border)' }"></div>
          <div style="flex:1;height:4px;border-radius:2px;" :style="{ background: strength >= 2 ? '#ff9800' : 'var(--clr-border)' }"></div>
          <div style="flex:1;height:4px;border-radius:2px;" :style="{ background: strength >= 3 ? '#00C853' : 'var(--clr-border)' }"></div>
        </div>
        <p style="font-size:0.75rem;" :style="{ color: strength >= 3 ? '#00C853' : strength >= 2 ? '#ff9800' : '#ff4444' }">
          <span x-text="strengthLabel"></span>
        </p>
      </div>

      <button type="submit" id="register-submit"
        class="btn btn-primary w-full btn-lg"
        :class="{ 'btn-loading': loading }"
        :disabled="loading">
        <span x-show="!loading"><?= t('auth.register.submit') ?></span>
        <span x-show="loading" style="display:none;"><?= $lang === 'ar' ? 'جاري الإنشاء...' : 'Création en cours...' ?></span>
      </button>

      <p style="font-size:0.75rem;color:var(--clr-text-faint);text-align:center;margin-top:1rem;">
        <?= t('auth.register.terms') ?>
        <a href="<?= APP_URL ?>/terms" style="color:var(--clr-accent);"><?= $lang === 'ar' ? 'الشروط' : 'Conditions d\'utilisation' ?></a>
      </p>

    </form>

    <div class="auth-footer">
      <?= t('auth.register.has_account') ?>
      <a href="<?= APP_URL ?>/auth/login" style="color:var(--clr-accent);font-weight:600;"><?= t('auth.register.login') ?></a>
    </div>

  </div>
</div>

<script>
function registerForm() {
  return {
    form: { full_name:'', email:'', password:'', confirm:'', country:'DZ' },
    error: '', success: false, loading: false, showPass: false,

    get strength() {
      const p = this.form.password;
      if (!p) return 0;
      let s = 0;
      if (p.length >= 8) s++;
      if (/[A-Z]/.test(p) || /[0-9]/.test(p)) s++;
      if (/[^A-Za-z0-9]/.test(p) && p.length >= 10) s++;
      return s;
    },

    get strengthLabel() {
      const labels = {
        1: '<?= $lang === 'ar' ? 'ضعيف' : 'Faible' ?>',
        2: '<?= $lang === 'ar' ? 'متوسط' : 'Moyen' ?>',
        3: '<?= $lang === 'ar' ? 'قوي ✓' : 'Fort ✓' ?>',
      };
      return labels[this.strength] || '';
    },

    async submit() {
      this.error = '';
      if (!this.form.full_name || !this.form.email || !this.form.password) {
        this.error = '<?= $lang === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Veuillez remplir tous les champs.' ?>';
        return;
      }
      if (this.form.password !== this.form.confirm) {
        this.error = '<?= t('auth.register.error.match') ?>';
        return;
      }
      if (this.form.password.length < 8) {
        this.error = '<?= $lang === 'ar' ? 'كلمة المرور قصيرة جداً (8 أحرف على الأقل).' : 'Mot de passe trop court (8 caractères minimum).' ?>';
        return;
      }
      this.loading = true;
      try {
        const res = await apiFetch('<?= APP_URL ?>/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(this.form),
        });
        if (res.ok && res.data.success) {
          this.success = true;
          setTimeout(() => { window.location.href = res.data.redirect || '<?= APP_URL ?>/dashboard/parent'; }, 1500);
        } else {
          this.error = res.data.error || '<?= t('error.generic') ?>';
        }
      } catch (e) {
        this.error = '<?= t('error.generic') ?>';
      } finally {
        this.loading = false;
      }
    }
  };
}
</script>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>
