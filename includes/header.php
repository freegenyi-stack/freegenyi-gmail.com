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
    <!-- SEO Dynamique par Pays -->
    <?php 
    $display_country = $supported_regions[$country]['name'] ?? 'Monde';
    $page_title = "FreeGeny " . $display_country . " | " . $page_title;
    ?>
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $page_description; ?> - Accédez au programme scolaire officiel de <?php echo $display_country; ?>.">
    <link rel="canonical" href="<?php echo $current_url; ?>">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?php echo APP_URL; ?>/favicon.png">
    
    <!-- SEO International : Balises Hreflang Dynamiques (50+ Pays) -->
    <?php foreach ($supported_regions as $code => $info): ?>
        <?php foreach ($info['langs'] as $l): ?>
            <link rel="alternate" hreflang="<?php echo strtolower($l) . '-' . strtolower($code); ?>" href="<?php echo APP_URL . '/' . $code . '-' . $l . '/'; ?>">
        <?php endforeach; ?>
    <?php endforeach; ?>
    <link rel="alternate" hreflang="x-default" href="<?php echo APP_URL; ?>/">
    
    <!-- Données Structurées JSON-LD (Professionnel) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "FreeGeny",
      "url": "<?php echo APP_URL; ?>",
      "logo": "<?php echo APP_URL; ?>/assets/img/logo.png",
      "sameAs": [
        "https://facebook.com/freegeny",
        "https://instagram.com/freegeny"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "<?php echo APP_URL; ?>",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "<?php echo APP_URL; ?>/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
    
    <!-- Frameworks (Tailwind CSS v3 + Alpine.js) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1a237e',
                        accent: '#FF6B35',
                        brand: {
                            50: '#fff7ed',
                            100: '#ffedd5',
                            500: '#FF6B35',
                            600: '#ea580c',
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                        arabic: ['Noto Sans Arabic', 'serif'],
                    }
                }
            }
        }
    </script>

    <!-- Open Graph / Social Media (Facebook, WhatsApp) -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo $current_url; ?>">
    <meta property="og:title" content="<?php echo $page_title; ?>">
    <meta property="og:description" content="<?php echo $page_description; ?>">
    <meta property="og:image" content="<?php echo APP_URL; ?>/assets/img/og-preview.png">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo $page_title; ?>">
    <meta name="twitter:description" content="<?php echo $page_description; ?>">

    <!-- Styles -->
    <link rel="stylesheet" href="<?php echo APP_URL; ?>/assets/css/main.css?v=2.0">
    <link rel="stylesheet" href="<?php echo APP_URL; ?>/assets/css/components.css?v=2.0">
    <?php if ($lang == 'ar'): ?>
        <link rel="stylesheet" href="<?php echo APP_URL; ?>/assets/css/rtl.css?v=2.0">
    <?php endif; ?>

    <!-- Fonts Premium (Google Fonts) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">

    <!-- Scripts de base -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-white text-gray-900 font-sans">
    
    <nav class="navbar bg-white border-b border-gray-100 sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-6">
                <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/'; ?>" class="flex items-center">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png?v=2.0" alt="FreeGeny" class="h-10 w-auto">
                </a>
                
                <!-- Sélecteur de Pays Ultra-Design (Point 1 Mondial) -->
                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" class="flex items-center space-x-2 bg-orange-50 border border-orange-100 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-white hover:shadow-md transition duration-200">
                        <img src="https://flagcdn.com/w40/<?php echo strtolower($country); ?>.png" 
                             alt="<?php echo $country; ?>" 
                             class="w-6 h-auto rounded-sm shadow-sm">
                        <span class="text-xs font-bold text-orange-600"><?php echo $country; ?></span>
                        <svg class="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    <!-- Menu Déroulant Premium avec Fond Doux -->
                    <div x-show="open" @click.away="open = false" 
                         class="absolute mt-3 w-72 bg-orange-50/95 backdrop-blur-md border border-orange-100 rounded-3xl shadow-2xl z-[100] py-3 max-h-96 overflow-y-auto transform origin-top-left"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 translate-y-2 scale-95"
                         x-transition:enter-end="opacity-100 translate-y-0 scale-100">
                        
                        <div class="px-5 py-2 text-[10px] font-black text-orange-400 uppercase tracking-widest border-b border-orange-100 mb-2">
                             <?php echo __('change_region', 'Sélectionner votre région'); ?>
                        </div>
                        
                        <div class="grid grid-cols-1 gap-1 px-2">
                            <?php foreach ($supported_regions as $code => $info): 
                                $l = $info['langs'][0]; 
                            ?>
                                <a href="<?php echo APP_URL . '/' . $code . '-' . $l . '/'; ?>" 
                                   class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-white hover:text-orange-600 rounded-2xl transition-all duration-200 group">
                                    <img src="https://flagcdn.com/w20/<?php echo strtolower($code); ?>.png" class="w-5 h-auto mr-3 rounded-sm shadow-sm group-hover:scale-110 transition-transform">
                                    <span class="font-semibold"><?php echo $info['name']; ?></span>
                                    <?php if($code === $country): ?>
                                        <span class="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    <?php endif; ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <div class="hidden md:flex space-x-8 font-semibold">
                <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/algeria/1ap/arabe'; ?>" class="hover:text-orange-600"><?php echo __('arabic'); ?></a>
                <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/algeria/1ap/mathematiques'; ?>" class="hover:text-orange-600"><?php echo __('maths'); ?></a>
                <a href="#" class="hover:text-orange-600"><?php echo __('pricing'); ?></a>
            </div>

            <div class="flex items-center space-x-4">
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/dashboard/parent'; ?>" class="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition">
                        <?php echo __('dashboard'); ?>
                    </a>
                <?php else: ?>
                    <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/auth/login'; ?>" class="text-gray-600 hover:text-orange-600 font-bold">
                        <?php echo __('login'); ?>
                    </a>
                    <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/auth/register'; ?>" class="bg-orange-500 text-white px-5 py-2 rounded-xl font-black hover:bg-orange-600 shadow-md transition">
                        <?php echo __('register'); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </nav>
