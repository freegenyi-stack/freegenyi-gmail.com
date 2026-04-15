<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/db.php';
$is_rtl = $is_rtl ?? false;
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>" dir="<?php echo $is_rtl ? 'rtl' : 'ltr'; ?>" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    $seo_title = $seo_title ?? "FreeGeny | " . __("Premium Education", "L'excellence éducative libérée");
    $seo_desc  = $seo_desc ?? __("discover_freegeny", "Découvrez FreeGeny, la plateforme premium d'éducation sur-mesure pour révéler le génie de votre enfant.");
    $current_url = APP_URL . htmlspecialchars(explode('?', $_SERVER['REQUEST_URI'])[0]);
    ?>
    <title><?= htmlspecialchars($seo_title) ?></title>
    <meta name="description" content="<?= htmlspecialchars($seo_desc) ?>">
    
    <!-- URL Canonique -->
    <link rel="canonical" href="<?= $current_url ?>">

    <!-- Hreflang Tags (International SEO Parfait) -->
    <?php
    $path_without_locale = preg_replace('#^/([A-Z]{2})-([a-z]{2})#', '', explode('?', $_SERVER['REQUEST_URI'])[0]);
    if ($path_without_locale === '' || $path_without_locale === '/') $path_without_locale = '/';

    foreach ($supported_regions as $cCode => $info) {
        foreach ($info['langs'] as $lCode) {
            $href = APP_URL . '/' . $cCode . '-' . $lCode . ($path_without_locale === '/' ? '/' : $path_without_locale);
            echo '    <link rel="alternate" hreflang="' . strtolower($lCode) . '-' . strtolower($cCode) . '" href="' . $href . '">' . "\n";
        }
    }
    ?>
    <link rel="alternate" hreflang="x-default" href="<?= APP_URL ?>/">

    <!-- Open Graph / Réseaux Sociaux -->
    <meta property="og:title" content="<?= htmlspecialchars($seo_title) ?>">
    <meta property="og:description" content="<?= htmlspecialchars($seo_desc) ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= $current_url ?>">
    <meta property="og:image" content="<?= APP_URL ?>/assets/img/logo.png">
    <meta name="twitter:card" content="summary_large_image">
    
    <!-- Polices premium -->
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="icon" type="image/png" href="<?php echo APP_URL; ?>/favicon.png?v=4.0">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { primary: '#ea580c', secondary: '#1e293b' },
                    borderRadius: { '3xl': '1.5rem', '4xl': '2rem' }
                }
            }
        }
    </script>

    <style>
        [x-cloak] { display: none !important; }
        body { 
            font-family: 'DM Sans', sans-serif; 
            font-weight: 300;
            -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, h4, .font-title { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            font-weight: 600;
        }
        .font-caveat { font-family: 'Caveat', cursive; }
        
        .glass-nav { 
            background: rgba(255, 255, 255, 0.85); 
            backdrop-filter: blur(12px); 
            border-bottom: 1px solid rgba(0,0,0,0.05); 
        }
        .nav-link { 
            position: relative; 
            transition: color 0.2s; 
            font-family: 'DM Sans', sans-serif;
            font-weight: 500;
        }
        .nav-link::after { 
            content: ''; 
            position: absolute; 
            width: 0; 
            height: 2px; 
            bottom: -4px; 
            left: 0; 
            background-color: #ea580c; 
            transition: width 0.3s; 
        }
        .nav-link:hover::after { width: 100%; }

        /* Custom Scrollbar */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body class="bg-white text-slate-900" x-data="{ mobileMenuOpen: false }">

    <!-- ========== HEADER (Glass Edition) ========== -->
    <nav class="glass-nav fixed top-0 w-full z-[120] h-14 flex items-center">
        <div class="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center w-full">
            <div class="flex items-center gap-6">
                <?php $home_slug = strtoupper($_COOKIE['freegeny_home'] ?? 'DZ') . '-' . $lang; ?>
                <a href="/<?php echo $home_slug; ?>/" class="flex items-center gap-2 md:gap-3 transition hover:scale-105 group">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 md:h-10 w-auto">
                    <span class="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase font-title leading-none">
                        Free<span class="text-orange-600">Geny</span>
                    </span>
                </a>
                
                <!-- Sélecteur de pays -->
                <div class="hidden md:block relative" x-data="{ open: false }">
                    <button @click="open = !open" class="flex items-center gap-2 bg-white/60 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-white transition text-[10px] font-bold text-slate-600 uppercase">
                        <img src="https://flagcdn.com/w40/<?php echo strtolower($country); ?>.png" class="w-5 h-auto rounded-sm">
                        <?php echo $country; ?>
                        <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                    </button>
                    <div x-show="open" @click.away="open = false" x-cloak x-transition class="absolute mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 p-4 z-[150] max-h-[60vh] overflow-y-auto custom-scroll">
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Région</p>
                        <?php foreach ($supported_regions as $code => $info): ?>
                            <div class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div class="flex items-center gap-3">
                                    <img src="https://flagcdn.com/w20/<?php echo strtolower($code); ?>.png" class="w-4 h-auto">
                                    <span class="text-xs font-bold text-slate-700"><?php echo $info['name']; ?></span>
                                </div>
                                <div class="flex gap-1">
                                    <?php foreach ($info['langs'] as $l): ?>
                                        <a href="/<?php echo $code . '-' . $l; ?>/" class="px-2 py-1 text-[9px] font-black rounded-md <?php echo ($country==$code && $lang==$l) ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400 hover:text-orange-600'; ?>">
                                            <?php echo strtoupper($l); ?>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Navigation Desktop -->
            <div class="hidden lg:flex items-center gap-7">
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="nav-link text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600">À propos</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/approach" class="nav-link text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600">Approche</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="nav-link text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600">Parents</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="nav-link text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600">Écoles</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="nav-link text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600">ONG</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/science" class="nav-link text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600">Science</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="nav-link text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600">Boutique</a>
            </div>

            <!-- Avatar / Auth -->
            <div class="flex items-center gap-4">
                <?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): 
                    $user_initials = $_SESSION['user_initials'] ?? mb_strtoupper(mb_substr($_SESSION['user_name'] ?? 'U', 0, 2));
                ?>
                    <div class="relative" x-data="{ userMenuOpen: false }">
                        <button @click="userMenuOpen = !userMenuOpen" class="flex items-center gap-2 focus:outline-none group relative">
                            <div class="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[11px] border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                                <?php if (isset($_SESSION['user_avatar']) && $_SESSION['user_avatar']): ?>
                                    <img src="<?php echo $_SESSION['user_avatar']; ?>" class="w-full h-full object-cover">
                                <?php else: ?>
                                    <?php echo $user_initials; ?>
                                <?php endif; ?>
                            </div>
                            <?php if (empty($_SESSION['user_phone'])): ?>
                                <span class="absolute top-0 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            <?php endif; ?>
                            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                        </button>
                        <div x-show="userMenuOpen" @click.away="userMenuOpen = false" x-cloak x-transition class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden">
                            <div class="px-5 py-3 border-b border-slate-50 mb-1">
                                <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Connecté</p>
                                <p class="text-xs font-bold text-slate-900 truncate"><?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
                            </div>
                            <?php if (empty($_SESSION['user_phone'])): ?>
                            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/profile" class="block px-5 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all font-sans relative">
                                Compléter profil <span class="absolute right-4 top-[14px] w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            </a>
                            <?php endif; ?>
                            <a href="/dashboard/parent.php" class="block px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all font-sans">Tableau de bord</a>
                            <a href="/api/auth/logout.php" class="block px-5 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all font-sans">Déconnexion</a>
                        </div>
                    </div>
                <?php else: ?>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="hidden md:block text-[11px] font-black uppercase text-slate-900 tracking-widest hover:text-orange-600 transition p-2">Connexion</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="hidden sm:block bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-orange-600 transition transform duration-300">Rejoindre</a>
                <?php endif; ?>
                
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 rounded-xl transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" stroke-width="2.5"></path></svg>
                </button>
            </div>
        </div>

    </nav>
    
    <!-- Menu Mobile (Premium Design - OUTSIDE NAV TO ESCAPE PARENT Z-INDEX) -->
    <div x-show="mobileMenuOpen" x-cloak class="fixed inset-0 lg:hidden" style="z-index: 99999!important;" x-transition:enter="transition duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100">
        <div class="absolute inset-0" style="background-color: rgba(15, 23, 42, 0.98) !important;" @click="mobileMenuOpen = false"></div>
        <div class="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm flex flex-col shadow-2xl border-l-[6px] border-orange-600" style="background: linear-gradient(180deg, #ffffff 0%, #fffcf5 100%) !important; opacity: 1 !important; z-index: 100000!important;" x-show="mobileMenuOpen" x-transition:enter="transition duration-300 transform" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0">
            
            <!-- En-tête du menu -->
            <div class="flex justify-between items-center p-6 border-b border-slate-50">
                <a href="/<?php echo $home_slug; ?>/" class="flex items-center gap-3">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-xl font-black text-slate-900 tracking-tighter uppercase font-title leading-none">Free<span class="text-orange-600">Geny</span></span>
                </a>
                <button @click="mobileMenuOpen = false" class="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" stroke-width="2.5"></path></svg>
                </button>
            </div>
            
            <!-- Liens de navigation -->
            <div class="flex-1 overflow-y-auto px-6 pt-5 pb-2 custom-scroll space-y-2.5">
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="block text-[17px] font-medium text-slate-800 hover:text-orange-600 transition-colors font-title tracking-tight">À propos</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/approach" class="block text-[17px] font-medium text-slate-800 hover:text-orange-600 transition-colors font-title tracking-tight">Approche</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="block text-[17px] font-medium text-slate-800 hover:text-orange-600 transition-colors font-title tracking-tight">Parents</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="block text-[17px] font-medium text-slate-800 hover:text-orange-600 transition-colors font-title tracking-tight">Écoles</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="block text-[17px] font-medium text-slate-800 hover:text-orange-600 transition-colors font-title tracking-tight">ONG</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/science" class="block text-[17px] font-medium text-slate-800 hover:text-orange-600 transition-colors font-title tracking-tight">Science</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="block text-[17px] font-medium text-slate-800 hover:text-orange-600 transition-colors font-title tracking-tight">Boutique</a>
                <div class="h-px bg-slate-100 my-2.5"></div>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/investors" class="block text-sm font-medium text-slate-500 hover:text-orange-600 font-title tracking-tight">Investisseurs</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/blog" class="block text-sm font-medium text-slate-500 hover:text-orange-600 font-title tracking-tight">Blog</a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/press" class="block text-sm font-medium text-slate-500 hover:text-orange-600 font-title tracking-tight">Espace Presse</a>
            </div>
            
            <!-- Footer du menu (Auth Actions) -->
            <div class="p-4 bg-slate-50/50 border-t border-slate-100">
                <?php if (empty($_SESSION['logged_in'])): ?>
                    <div class="flex flex-col gap-3">
                        <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="w-full text-center py-4 rounded-xl font-black text-slate-900 bg-white border border-slate-200 hover:border-orange-300 transition shadow-sm text-[11px] uppercase tracking-widest">Connexion</a>
                        <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="w-full text-center py-4 rounded-xl font-black text-white bg-slate-900 hover:bg-orange-600 shadow-xl shadow-slate-900/10 transition uppercase tracking-widest text-[11px]">Rejoindre</a>
                    </div>
                <?php else: ?>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/parent.php" class="block w-full text-center py-3.5 rounded-xl font-black text-white bg-slate-900 hover:bg-slate-800 transition uppercase tracking-widest text-[11px] shadow-xl">Mon Tableau de bord</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <div class="h-14"></div><?php // End of Header ?>
