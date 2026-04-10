<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/db.php';

// Initialisation du SEO
$page_title = $page_title ?? 'FreeGeny - Soutien Scolaire Numérique';
$page_description = $page_description ?? 'La plateforme éducative premium pour les élèves en Algérie et dans le monde arabe. Arabe, Maths et plus.';
$current_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

// Point 3 : Détection du Pays (Simplifiée pour le test, peut être liée à une API IP)
if (!isset($_SESSION['user_country'])) {
    $_SESSION['user_country'] = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'; // Détection via Cloudflare ou par défaut DZ
}
$is_dz = ($_SESSION['user_country'] === 'DZ');

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>" dir="<?php echo ($lang == 'ar' ? 'rtl' : 'ltr'); ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO de Base -->
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $page_description; ?>">
    <link rel="canonical" href="<?php echo $current_url; ?>">
    
    <!-- SEO Multilingue (Hreflang) -->
    <link rel="alternate" hreflang="fr" href="<?php echo APP_URL; ?>/fr/">
    <link rel="alternate" hreflang="ar" href="<?php echo APP_URL; ?>/ar/">
    
    <!-- Open Graph / Social Media (Facebook, WhatsApp) -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo $current_url; ?>">
    <meta property="og:title" content="<?php echo $page_title; ?>">
    <meta property="og:description" content="<?php echo $page_description; ?>">
    <meta property="og:image" content="<?php echo APP_URL; ?>/assets/img/og-preview.jpg">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo $page_title; ?>">
    <meta name="twitter:description" content="<?php echo $page_description; ?>">

    <!-- Styles -->
    <link rel="stylesheet" href="<?php echo APP_URL; ?>/assets/css/main.css">
    <link rel="stylesheet" href="<?php echo APP_URL; ?>/assets/css/components.css">
    <?php if ($lang == 'ar'): ?>
        <link rel="stylesheet" href="<?php echo APP_URL; ?>/assets/css/rtl.css">
    <?php endif; ?>

    <!-- Fonts Premium (Google Fonts) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">

    <!-- Scripts de base -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50 text-gray-900 font-sans">
    
    <!-- Barre de détection pays (Point 3) -->
    <?php if ($is_dz): ?>
    <div class="bg-orange-600 text-white text-center py-1 text-sm font-bold">
        🇩🇿 Offre spéciale Algérie : Accès gratuit au programme 1AP !
    </div>
    <?php endif; ?>

    <nav class="navbar bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/'; ?>" class="flex items-center space-x-2">
                    <span class="text-2xl font-black text-orange-600">FreeGeny</span>
                </a>
                <!-- Drapeau du Pays (Point 1 Mondial) -->
                <div class="flex items-center bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                    <img src="https://flagcdn.com/w40/<?php echo strtolower($country); ?>.png" 
                         alt="<?php echo $country; ?>" 
                         class="w-6 h-auto rounded-sm shadow-sm">
                    <span class="ml-2 text-xs font-bold text-gray-500 uppercase"><?php echo $country; ?></span>
                </div>
            </div>

            <div class="hidden md:flex space-x-8 font-semibold">
                <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/algeria/1ap/arabe'; ?>" class="hover:text-orange-600">Arabe</a>
                <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/algeria/1ap/mathematiques'; ?>" class="hover:text-orange-600">Maths</a>
                <a href="#" class="hover:text-orange-600">Tarifs</a>
            </div>

            <div class="flex items-center space-x-4">
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="<?php echo APP_URL; ?>/dashboard/parent" class="btn btn-primary btn-sm">Mon Dashboard</a>
                <?php else: ?>
                    <a href="<?php echo APP_URL; ?>/auth/login" class="text-gray-600 hover:text-orange-600 font-bold">Connexion</a>
                    <a href="<?php echo APP_URL; ?>/auth/register" class="btn btn-orange btn-sm">S'inscrire</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
