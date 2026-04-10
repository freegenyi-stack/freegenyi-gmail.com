<?php
// ============================================================
// Page — Login
// ============================================================
require_once __DIR__ . '/../../config/app.php';
initSession();
requireGuest(); // Redirige si déjà connecté

$lang  = detectLang();
$isRtl = in_array($lang, RTL_LANGS);
$translations = loadLang($lang);

$pageTitle       = 'Connexion — FreeGeny';
$pageDescription = 'Connectez-vous à votre espace FreeGeny pour suivre la progression de vos enfants.';

require_once INCLUDES_PATH . '/header.php';
?>

<div class="auth-container">
  <div class="auth-card" x-data="loginForm()">

    <!-- Logo -->
    <div class="auth-logo">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FF6B35"/>
        <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Inter">F</text>
      </svg>
      FreeGeny
    </div>

    <h1 class="auth-title"><?= t('auth.login.title') ?></h1>
    <p class="auth-subtitle">
      <?= $lang === 'ar' ? 'أدخل بياناتك للوصول إلى لوحة التحكم' : 'Entrez vos identifiants pour accéder à votre espace' ?>
    </p>

    <!-- Alert erreur -->
    <div x-show="error" x-text="error" class="alert alert-error" style="margin-bottom:1.5rem;display:none;" x-transition></div>

    <!-- Formulaire -->
    <form @submit.prevent="submit" id="login-form" novalidate>

      <div class="form-group">
        <label class="form-label" for="login-email"><?= t('auth.login.email') ?></label>
        <input
          type="email"
          id="login-email"
          name="email"
          x-model="form.email"
          class="form-input"
          autocomplete="email"
          placeholder="votre@email.com"
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="login-password">
          <?= t('auth.login.password') ?>
          <a href="<?= APP_URL ?>/auth/forgot-password" style="float:<?= $isRtl ? 'left' : 'right' ?>;font-size:0.8rem;color:var(--clr-accent);">
            <?= t('auth.login.forgot') ?>
          </a>
        </label>
        <div style="position:relative;">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="login-password"
            name="password"
            x-model="form.password"
            class="form-input"
            autocomplete="current-password"
            placeholder="••••••••"
            style="padding-right:3rem;"
            required
          >
          <button type="button" @click="showPassword = !showPassword"
            style="position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--clr-text-muted);cursor:pointer;"
            :aria-label="showPassword ? 'Masquer' : 'Afficher'">
            <svg x-show="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg x-show="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-full btn-lg" id="login-submit" :class="{ 'btn-loading': loading }" :disabled="loading">
        <span x-show="!loading"><?= t('auth.login.submit') ?></span>
        <span x-show="loading" style="display:none;"><?= $lang === 'ar' ? 'جاري تسجيل الدخول...' : 'Connexion en cours...' ?></span>
      </button>

    </form>

    <div class="auth-footer">
      <?= t('auth.login.no_account') ?>
      <a href="<?= APP_URL ?>/auth/register" style="color:var(--clr-accent);font-weight:600;"><?= t('auth.login.register') ?></a>
    </div>

  </div>
</div>

<script>
function loginForm() {
  return {
    form: { email: '', password: '' },
    error: '',
    loading: false,
    showPassword: false,

    async submit() {
      this.error = '';
      if (!this.form.email || !this.form.password) {
        this.error = '<?= $lang === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Veuillez remplir tous les champs.' ?>';
        return;
      }
      this.loading = true;
      try {
        const res = await apiFetch('<?= APP_URL ?>/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(this.form),
        });
        if (res.ok && res.data.success) {
          window.location.href = res.data.redirect || '<?= APP_URL ?>/dashboard/parent';
        } else {
          this.error = res.data.error || '<?= t('auth.login.error') ?>';
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
