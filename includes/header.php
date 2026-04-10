<?php
// FreeGeny — Header HTML universel
// Usage : require_once INCLUDES_PATH . '/header.php';
// Variables attendues : $pageTitle, $pageDescription, $lang, $isRtl
?>
<!DOCTYPE html>
<html lang="<?= e($lang ?? 'fr') ?>" dir="<?= ($isRtl ?? false) ? 'rtl' : 'ltr' ?>" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <!-- SEO -->
  <title><?= e($pageTitle ?? 'FreeGeny — Éducation Algérienne Officielle') ?></title>
  <meta name="description" content="<?= e($pageDescription ?? 'Plateforme éducative conforme au programme algérien du MEN. Leçons interactives, exercices et jeux pour enfants 5-12 ans.') ?>">
  <meta name="keywords" content="éducation algérie, programme scolaire algérie, 1AP, arabe, mathématiques, enfants, freegeny">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="<?= e(APP_URL . $_SERVER['REQUEST_URI']) ?>">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="<?= e(APP_URL . $_SERVER['REQUEST_URI']) ?>">
  <meta property="og:title" content="<?= e($pageTitle ?? 'FreeGeny') ?>">
  <meta property="og:description" content="<?= e($pageDescription ?? 'La plateforme éducative officielle pour les enfants algériens.') ?>">
  <meta property="og:image" content="<?= ASSETS_URL ?>/images/og-image.png">
  <meta property="og:site_name" content="FreeGeny">
  <meta property="og:locale" content="<?= $lang === 'ar' ? 'ar_DZ' : 'fr_DZ' ?>">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= e($pageTitle ?? 'FreeGeny') ?>">
  <meta name="twitter:image" content="<?= ASSETS_URL ?>/images/og-image.png">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="<?= ASSETS_URL ?>/images/favicon.svg">
  <link rel="apple-touch-icon" href="<?= ASSETS_URL ?>/images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Styles FreeGeny -->
  <link rel="stylesheet" href="<?= ASSETS_URL ?>/css/main.css?v=<?= APP_VERSION ?>">
  <link rel="stylesheet" href="<?= ASSETS_URL ?>/css/components.css?v=<?= APP_VERSION ?>">
  <?php if ($isRtl ?? false): ?>
  <link rel="stylesheet" href="<?= ASSETS_URL ?>/css/rtl.css?v=<?= APP_VERSION ?>">
  <?php endif; ?>

  <!-- Alpine.js (CDN) -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "FreeGeny",
    "url": "https://freegeny.com",
    "description": "Plateforme éducative conforme au programme officiel algérien MEN",
    "address": {"@type": "PostalAddress", "addressCountry": "DZ"}
  }
  </script>

  <?php if (isset($extraHead)) echo $extraHead; ?>
</head>
<body class="<?= ($isRtl ?? false) ? 'rtl' : 'ltr' ?>" x-data="freegenyApp()">

  <!-- Navigation -->
  <nav class="navbar" id="main-nav">
    <div class="container">
      <div class="navbar-inner">

        <!-- Logo -->
        <a href="<?= APP_URL ?>" class="navbar-logo" aria-label="FreeGeny accueil">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#FF6B35"/>
              <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Inter">F</text>
            </svg>
          </div>
          <span class="logo-text">FreeGeny</span>
        </a>

        <!-- Menu desktop -->
        <ul class="navbar-menu" id="nav-menu">
          <li><a href="<?= APP_URL ?>" class="nav-link <?= ($_SERVER['REQUEST_URI'] === '/' ? 'active' : '') ?>"><?= t('nav.home') ?></a></li>
          <li><a href="<?= APP_URL ?>/algeria/1ap/arabe" class="nav-link"><?= t('subjects.arabe') ?></a></li>
          <li><a href="<?= APP_URL ?>/algeria/1ap/mathematiques" class="nav-link"><?= t('subjects.maths') ?></a></li>
          <?php if (isLoggedIn()): ?>
          <li><a href="<?= APP_URL ?>/dashboard/parent" class="nav-link"><?= t('nav.dashboard') ?></a></li>
          <?php endif; ?>
        </ul>

        <!-- Langue + Auth -->
        <div class="navbar-actions">
          <!-- Sélecteur de langue -->
          <div class="lang-switcher">
            <a href="?lang=fr" class="lang-btn <?= ($lang === 'fr' ? 'active' : '') ?>" title="Français">FR</a>
            <a href="?lang=ar" class="lang-btn <?= ($lang === 'ar' ? 'active' : '') ?>" title="عربية">ع</a>
          </div>

          <?php if (isLoggedIn()): ?>
            <div class="user-menu" x-data="{ open: false }">
              <button @click="open = !open" class="user-avatar-btn" aria-label="Menu utilisateur">
                <div class="user-avatar"><?= strtoupper(substr(currentUser()['full_name'] ?? 'U', 0, 1)) ?></div>
              </button>
              <div class="user-dropdown" x-show="open" @click.away="open = false" x-transition>
                <div class="user-info">
                  <strong><?= e(currentUser()['full_name'] ?? '') ?></strong>
                  <span><?= e(currentUser()['email'] ?? '') ?></span>
                </div>
                <a href="<?= APP_URL ?>/dashboard/parent" class="dropdown-item"><?= t('nav.dashboard') ?></a>
                <a href="<?= APP_URL ?>/api/auth/logout" class="dropdown-item text-danger"><?= t('nav.logout') ?></a>
              </div>
            </div>
          <?php else: ?>
            <a href="<?= APP_URL ?>/auth/login" class="btn btn-ghost btn-sm"><?= t('nav.login') ?></a>
            <a href="<?= APP_URL ?>/auth/register" class="btn btn-primary btn-sm"><?= t('nav.register') ?></a>
          <?php endif; ?>

          <!-- Bouton hamburger mobile -->
          <button class="hamburger" id="nav-toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>
    </div>
  </nav>

  <!-- Main content wrapper -->
  <main id="main-content">
