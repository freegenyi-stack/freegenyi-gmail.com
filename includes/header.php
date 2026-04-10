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
    
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm" x-data="{ mobileMenuOpen: false }">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center h-20">
                
                <!-- GAUCHE : Logo & Sélecteur -->
                <div class="flex items-center space-x-4 lg:space-x-8">
                    <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/'; ?>" class="flex-shrink-0">
                        <img src="<?php echo APP_URL; ?>/assets/img/logo.png?v=2.0" alt="FreeGeny" class="h-10 lg:h-12 w-auto">
                    </a>
                    
                    <!-- Sélecteur de Pays (Desktop) -->
                    <div class="hidden sm:block relative" x-data="{ open: false }">
                        <button @click="open = !open" class="flex items-center space-x-3 bg-orange-50 border border-orange-100 px-3 py-2 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300">
                            <img src="https://flagcdn.com/w40/<?php echo strtolower($country); ?>.png" class="w-6 h-auto rounded-sm shadow-sm">
                            <span class="text-xs font-black text-orange-600 uppercase tracking-tighter"><?php echo $country; ?></span>
                            <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="3"></path></svg>
                        </button>

                        <div x-show="open" @click.away="open = false" 
                             class="absolute mt-3 w-72 bg-orange-50/98 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-2xl z-[150] py-4 max-h-[70vh] overflow-y-auto"
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0 translate-y-4 scale-95">
                            <div class="px-6 py-2 text-[10px] font-black text-orange-400 uppercase tracking-widest border-b border-orange-100/50 mb-3"><?php echo __('change_region'); ?></div>
                            <div class="grid grid-cols-1 gap-1 px-3">
                                <?php foreach ($supported_regions as $code => $info): $l = $info['langs'][0]; ?>
                                    <a href="<?php echo APP_URL . '/' . $code . '-' . $l . '/'; ?>" 
                                       class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-white hover:text-orange-600 rounded-2xl transition-all duration-200 group">
                                        <img src="https://flagcdn.com/w20/<?php echo strtolower($code); ?>.png" class="w-5 h-auto mr-4 rounded-sm shadow-sm group-hover:scale-110 transition-transform">
                                        <span class="font-bold"><?php echo $info['name']; ?></span>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CENTRE : Navigation Desktop -->
                <div class="hidden md:flex items-center space-x-6">
                    <a href="#" class="text-sm font-bold text-gray-600 hover:text-orange-600 transition"><?php echo __('about'); ?></a>
                    <a href="#" class="text-sm font-bold text-gray-600 hover:text-orange-600 transition"><?php echo __('goals'); ?></a>
                    <a href="#" class="text-sm font-bold text-gray-600 hover:text-orange-600 transition"><?php echo __('parents'); ?></a>
                    <a href="#" class="text-sm font-bold text-gray-600 hover:text-orange-600 transition"><?php echo __('schools'); ?></a>
                    <a href="#" class="text-sm font-bold text-gray-600 hover:text-orange-600 transition"><?php echo __('ngos'); ?></a>
                </div>

                <!-- DROITE : Connexion & Menu Mobile -->
                <div class="flex items-center space-x-3 md:space-x-4">
                    <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/auth/login'; ?>" 
                       class="hidden sm:inline-flex items-center text-sm font-black text-gray-900 uppercase tracking-wider hover:text-orange-600 transition">
                        <?php echo __('login'); ?>
                    </a>
                    
                    <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/auth/register'; ?>" 
                       class="bg-orange-600 text-white px-5 md:px-7 py-2.5 md:py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-700 hover:shadow-xl transition transform hover:-translate-y-0.5">
                        <?php echo __('register'); ?>
                    </a>

                    <!-- Bouton Menu Mobile (Hamburger) -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" stroke-width="2.5" stroke-linecap="round"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- MENU MOBILE (Overlay) -->
        <div x-show="mobileMenuOpen" 
             class="fixed inset-0 z-[200] md:hidden"
             x-transition:enter="transition infinite duration-300">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="mobileMenuOpen = false"></div>
            <div class="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-8 transform transition ease-out duration-300"
                 x-transition:enter="translate-x-full"
                 x-transition:enter-end="translate-x-0"
                 x-transition:leave="translate-x-0"
                 x-transition:leave-end="translate-x-full">
                
                <div class="flex justify-between items-center mb-10">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png" class="h-8 w-auto">
                    <button @click="mobileMenuOpen = false" class="p-2 bg-gray-100 rounded-xl">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"></path></svg>
                    </button>
                </div>

                <div class="flex flex-col space-y-6">
                    <a href="#" class="text-xl font-black text-gray-900 transition hover:text-orange-600"><?php echo __('about'); ?></a>
                    <a href="#" class="text-xl font-black text-gray-900 transition hover:text-orange-600"><?php echo __('goals'); ?></a>
                    <a href="#" class="text-xl font-black text-gray-900 transition hover:text-orange-600"><?php echo __('parents'); ?></a>
                    <a href="#" class="text-xl font-black text-gray-900 transition hover:text-orange-600"><?php echo __('schools'); ?></a>
                    <a href="#" class="text-xl font-black text-gray-900 transition hover:text-orange-600"><?php echo __('ngos'); ?></a>
                    <hr class="border-gray-100">
                    <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/auth/login'; ?>" class="text-xl font-black text-orange-600"><?php echo __('login'); ?></a>
                </div>
            </div>
        </div>
    </nav>
