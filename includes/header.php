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

        /* Animations & Status */
        .status-pulse {
            animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .ping-red {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
        }
    </style>
    
    <?php if (isset($_SESSION['user_theme'])): ?>
    <style>
        :root {
            --primary-color: <?php echo $_SESSION['user_theme']['primary'] ?? '#ea580c'; ?>;
        }
        .text-orange-600, .hover\:text-orange-600:hover { color: var(--primary-color) !important; }
        .bg-orange-600, .hover\:bg-orange-600:hover { background-color: var(--primary-color) !important; }
    </style>
    <?php endif; ?>
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
                    $profile_complete = ($_SESSION['user_profile_pct'] ?? 0) >= 100;
                    
                    // Notification count (vague 2)
                    $unread_notifs = DB::fetchOne("SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND is_read = 0", [$_SESSION['user_id']]);
                    $notif_count = (int)($unread_notifs['total'] ?? 0);
                ?>
                    <div class="relative" x-data="{ userMenuOpen: false }">
                        <button @click="userMenuOpen = !userMenuOpen" class="flex items-center gap-2 focus:outline-none group relative">
                            <!-- Avatar Circle -->
                            <div class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[11px] border-2 border-white shadow-md overflow-hidden group-hover:scale-105 transition-transform relative">
                                <?php if (isset($_SESSION['user_avatar_config']['icon'])): ?>
                                    <div class="w-full h-full flex items-center justify-center <?= $_SESSION['user_avatar_config']['bg'] ?? 'bg-slate-900' ?>">
                                        <i class="fa-solid <?= $_SESSION['user_avatar_config']['icon'] ?> text-lg"></i>
                                    </div>
                                <?php elseif (isset($_SESSION['user_avatar']) && $_SESSION['user_avatar']): ?>
                                    <img src="<?php echo $_SESSION['user_avatar']; ?>" class="w-full h-full object-cover">
                                <?php else: ?>
                                    <?php echo $user_initials; ?>
                                <?php endif; ?>
                            </div>

                            <svg class="ml-1 w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                        </button>

                        <!-- Dropdown Menu (Glassmorphism) -->
                        <div x-show="userMenuOpen" @click.away="userMenuOpen = false" x-cloak 
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0 translate-y-1 scale-95"
                             x-transition:enter-end="opacity-100 translate-y-0 scale-100"
                             class="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 py-2 z-[200] overflow-hidden">
                            
                            <!-- User Info Header -->
                            <div class="px-5 py-4 border-b border-slate-50 bg-slate-50/50 mb-1">
                                <p class="text-[9px] font-black uppercase text-green-600 tracking-widest flex items-center gap-1.5 mb-0.5">
                                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Connecté
                                </p>
                                <p class="text-xs font-bold text-slate-900 truncate"><?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
                                <p class="text-[10px] text-slate-500 font-medium italic mt-0.5">Role : <?php echo ucfirst($_SESSION['user_role'] ?? 'Parent'); ?></p>
                            </div>

                            <!-- Critical Action: Profile Completion -->
                            <?php if (!$profile_complete): ?>
                            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/profile" class="flex items-center justify-between px-5 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all group">
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-user-pen opacity-70"></i> Compléter mon profil
                                </span>
                                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            </a>
                            <?php endif; ?>

                            <!-- Main Links -->
                            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/parent" class="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                                <i class="fa-solid fa-gauge-high w-4 opacity-50"></i> Tableau de bord
                            </a>
                            
                            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/history" class="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                                <i class="fa-solid fa-clock-rotate-left w-4 opacity-50"></i> Mon Historique
                            </a>

                            <a href="#" class="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all opacity-50 cursor-not-allowed">
                                <i class="fa-solid fa-message w-4 opacity-50"></i> Notifications
                                <?php if ($notif_count > 0): ?>
                                    <span class="ml-auto text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold"><?= $notif_count ?></span>
                                <?php else: ?>
                                    <span class="ml-auto text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">Bientôt</span>
                                <?php endif; ?>
                            </a>

                            <div class="h-px bg-slate-50 my-1"></div>

                            <!-- Settings / Layout -->
                            <button @click="userMenuOpen = false; $dispatch('open-theme-modal')" class="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                                <i class="fa-solid fa-palette w-4 opacity-50"></i> Personnalisation
                            </button>

                            <!-- Logout -->
                            <a href="/api/auth/logout.php" class="flex items-center gap-3 px-5 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all border-t border-slate-50 mt-1">
                                <i class="fa-solid fa-right-from-bracket w-4 opacity-70"></i> Déconnexion
                            </a>
                        </div>
                    </div>

                    <!-- Chat Trigger (Vague 4) -->
                    <button @click="$dispatch('open-chat')" class="relative p-2 text-slate-500 hover:text-orange-600 transition-colors group">
                        <i class="fa-solid fa-comments text-lg"></i>
                        <template x-if="notif_count > 0">
                            <span class="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-[9px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                <?= $notif_count ?>
                            </span>
                        </template>
                    </button>
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
            <div class="overflow-y-auto px-6 pt-5 pb-0 custom-scroll space-y-2.5">
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
                        <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="w-full text-center py-4 rounded-xl font-black text-white bg-slate-900 hover:bg-orange-600 shadow-xl shadow-slate-900/10 transition uppercase tracking-widest text-[11px]">Rejoindre</a>
                        <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="w-full text-center py-4 rounded-xl font-black text-slate-900 bg-white border border-slate-200 hover:border-orange-300 transition shadow-sm text-[11px] uppercase tracking-widest">Connexion</a>
                    </div>
                <?php else: ?>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/parent.php" class="block w-full text-center py-3.5 rounded-xl font-black text-white bg-slate-900 hover:bg-slate-800 transition uppercase tracking-widest text-[11px] shadow-xl">Mon Tableau de bord</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <div class="h-14"></div>

    <!-- MODALE DE PERSONNALISATION (Vague 3) -->
    <div x-data="{ 
        isOpen: false, 
        currentPrimary: '<?= $_SESSION['user_theme']['primary'] ?? '#ea580c' ?>',
        currentAvatarId: '<?= $_SESSION['user_avatar_config']['id'] ?? '' ?>',
        colors: [
            { name: 'Orange FreeGeny', hex: '#ea580c' },
            { name: 'Bleu Royal', hex: '#2563eb' },
            { name: 'Vert Émeraude', hex: '#059669' },
            { name: 'Violet Élite', hex: '#7c3aed' },
            { name: 'Rose Passion', hex: '#db2777' },
            { name: 'Ardoise Sophistiquée', hex: '#475569' }
        ],
        async setTheme(color) {
            this.currentPrimary = color;
            document.documentElement.style.setProperty('--primary-color', color);
            await fetch('/api/auth/update-theme.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: { primary: color } })
            });
        },
        async setAvatar(id, icon, bg) {
            this.currentAvatarId = id;
            await fetch('/api/auth/update-theme.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatar: { id, icon, bg } })
            });
            // Update local UI immediately (optionally reload or use Alpine state for header)
            window.location.reload(); 
        }
    }" 
    @open-theme-modal.window="isOpen = true"
    x-show="isOpen" 
    x-cloak 
    class="fixed inset-0 z-[300] flex items-center justify-center px-4">
        
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isOpen = false"></div>
        
        <div x-show="isOpen" 
             x-transition:enter="transition ease-out duration-300 transform"
             x-transition:enter-start="opacity-0 translate-y-8"
             x-transition:enter-end="opacity-100 translate-y-0"
             class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            
            <div class="p-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-black text-slate-900 tracking-tight">Personnalisation 🎨</h2>
                    <button @click="isOpen = false" class="text-slate-400 hover:text-slate-900">
                        <i class="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <p class="text-sm text-slate-500 mb-8 font-medium">Choisissez l'ambiance qui vous inspire pour accompagner la réussite de vos enfants.</p>

                <!-- Color Selection -->
                <div class="space-y-4">
                    <label class="text-[11px] font-black uppercase text-slate-400 tracking-widest">Couleur Principale</label>
                    <div class="grid grid-cols-3 gap-3">
                        <template x-for="color in colors" :key="color.hex">
                            <button @click="setTheme(color.hex)" 
                                    class="h-12 rounded-xl flex items-center justify-center transition-all border-2"
                                    :style="'background-color: ' + color.hex"
                                    :class="currentPrimary === color.hex ? 'border-slate-900 shadow-lg scale-105' : 'border-transparent opacity-80 hover:opacity-100'">
                                <i x-show="currentPrimary === color.hex" class="fa-solid fa-check text-white"></i>
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Avatar Expert Selection -->
                <div class="mt-8 space-y-4">
                    <label class="text-[11px] font-black uppercase text-slate-400 tracking-widest">Avatar Expert 🏆</label>
                    <div class="grid grid-cols-3 gap-3">
                        <?php 
                        $experts = [
                            ['id' => 'scientist', 'icon' => 'fa-flask-vial', 'name' => 'Explorateur', 'bg' => 'bg-blue-500'],
                            ['id' => 'math', 'icon' => 'fa-calculator', 'name' => 'Génie Math', 'bg' => 'bg-orange-500'],
                            ['id' => 'lit', 'icon' => 'fa-feather-pointed', 'name' => 'Philosophe', 'bg' => 'bg-emerald-500'],
                            ['id' => 'artist', 'icon' => 'fa-palette', 'name' => 'Artiste', 'bg' => 'bg-purple-500'],
                            ['id' => 'astro', 'icon' => 'fa-user-astronaut', 'name' => 'Astronaute', 'bg' => 'bg-indigo-500'],
                            ['id' => 'tech', 'icon' => 'fa-laptop-code', 'name' => 'Codeur', 'bg' => 'bg-slate-700']
                        ];
                        foreach ($experts as $e):
                        ?>
                        <button @click="setAvatar('<?= $e['id'] ?>', '<?= $e['icon'] ?>', '<?= $e['bg'] ?>')" 
                                class="flex flex-col items-center p-3 rounded-2xl border-2 transition-all group"
                                :class="currentAvatarId === '<?= $e['id'] ?>' ? 'border-slate-900 bg-slate-50' : 'border-slate-50 hover:border-slate-200'">
                            <div class="w-10 h-10 rounded-full <?= $e['bg'] ?> text-white flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                                <i class="fa-solid <?= $e['icon'] ?>"></i>
                            </div>
                            <span class="text-[9px] font-bold text-slate-600 mt-2"><?= $e['name'] ?></span>
                        </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="h-px bg-slate-100 my-8"></div>

                <!-- Dark Mode Placeholder -->
                <div class="flex items-center justify-between opacity-50">
                    <div>
                        <p class="text-xs font-bold text-slate-900 uppercase tracking-widest">Mode Sombre</p>
                        <p class="text-[10px] text-slate-500">Idéal pour les sessions du soir.</p>
                    </div>
                    <div class="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-not-allowed">
                        <div class="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>

                <button @click="isOpen = false" class="w-full mt-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors shadow-xl">
                    Terminer
                </button>
            </div>
        </div>
    </div>

    <!-- ELITE CHAT PANEL (Vague 4 - Mobile First) -->
    <div x-data="{ 
        isOpen: false,
        view: 'list', -- 'list' or 'chat'
        conversations: [],
        currentConv: null,
        messages: [],
        newMessage: '',
        userId: <?= $_SESSION['user_id'] ?? 0 ?>,

        async loadConversations() {
            const res = await fetch('/api/chat/get_conversations.php');
            const data = await res.json();
            this.conversations = data.conversations || [];
        },
        async openChat(conv) {
            this.currentConv = conv;
            this.view = 'chat';
            await this.loadMessages();
            this.scrollToBottom();
        },
        async loadMessages() {
            if (!this.currentConv) return;
            const res = await fetch('/api/chat/get_messages.php?conversation_id=' + this.currentConv.id);
            const data = await res.json();
            this.messages = data.messages || [];
        },
        async sendMessage() {
            if (!this.newMessage.trim()) return;
            const res = await fetch('/api/chat/send_message.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: this.currentConv.id, message: this.newMessage })
            });
            if (res.ok) {
                this.newMessage = '';
                await this.loadMessages();
                this.scrollToBottom();
            }
        },
        scrollToBottom() {
            setTimeout(() => {
                const el = this.$refs.msgContainer;
                if (el) el.scrollTop = el.scrollHeight;
            }, 100);
        }
    }"
    @open-chat.window="isOpen = true; loadConversations()"
    x-show="isOpen"
    x-cloak
    class="fixed inset-0 z-[400] overflow-hidden">
        
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="isOpen = false"></div>

        <div class="absolute right-0 top-0 bottom-0 w-full md:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300"
             x-show="isOpen" x-transition:enter="translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="translate-x-0" x-transition:leave-end="translate-x-full">
            
            <!-- Header -->
            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div class="flex items-center gap-3">
                    <button x-show="view === 'chat'" @click="view = 'list'" class="p-2 text-slate-500">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <h3 class="font-black text-slate-900 tracking-tight" x-text="view === 'list' ? 'Messagerie 💬' : 'Discussion'"></h3>
                </div>
                <button @click="isOpen = false" class="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>

            <!-- Conversations List -->
            <div x-show="view === 'list'" class="flex-1 overflow-y-auto custom-scroll">
                <template x-if="conversations.length === 0">
                    <div class="p-20 text-center">
                        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <i class="fa-solid fa-comment-slash text-2xl"></i>
                        </div>
                        <p class="text-slate-400 font-bold text-sm">Pas encore de discussion.</p>
                    </div>
                </template>
                <div class="divide-y divide-slate-50">
                    <template x-for="conv in conversations" :key="conv.id">
                        <button @click="openChat(conv)" class="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group">
                            <div class="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 relative shrink-0">
                                <i class="fa-solid fa-users"></i>
                                <span x-show="conv.unread_count > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center" x-text="conv.unread_count"></span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-bold text-slate-900 text-sm" x-text="conv.type === 'family' ? 'Ma Famille' : 'Discussion Directe'"></span>
                                    <span class="text-[10px] text-slate-400" x-text="conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''"></span>
                                </div>
                                <p class="text-xs text-slate-500 truncate" x-text="conv.last_message || 'Démarrer la discussion...'"></p>
                            </div>
                        </button>
                    </template>
                </div>
            </div>

            <!-- Chat View -->
            <div x-show="view === 'chat'" class="flex-1 flex flex-col overflow-hidden">
                <div class="flex-1 overflow-y-auto p-5 space-y-4 custom-scroll" x-ref="msgContainer">
                    <template x-for="msg in messages" :key="msg.id">
                        <div class="flex flex-col" :class="msg.sender_id == userId ? 'items-end' : 'items-start'">
                            <div class="max-w-[80%] p-3 rounded-2xl text-sm" 
                                 :class="msg.sender_id == userId ? 'bg-slate-900 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'">
                                <p x-text="msg.message"></p>
                            </div>
                            <span class="text-[9px] text-slate-400 mt-1" x-text="new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})"></span>
                        </div>
                    </template>
                </div>
                <!-- Input -->
                <div class="p-4 border-t border-slate-100 bg-slate-50">
                    <div class="relative flex items-center">
                        <input type="text" x-model="newMessage" @keydown.enter="sendMessage()" placeholder="Votre message..." 
                               class="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 shadow-sm transition-all">
                        <button @click="sendMessage()" class="absolute right-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition-colors">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div><?php // End of Header ?>
