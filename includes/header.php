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
    <title>FreeGeny | Premium Education</title>
    
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
    
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="icon" type="image/png" href="<?php echo APP_URL; ?>/favicon.png?v=4.0">
    
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; letter-spacing: -0.01em; }
        .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(0,0,0,0.05); }
        
        /* Dropdown Elevation */
        .dropdown-shadow { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.12); }
        
        /* FORCE ORANGE SCROLLBAR - BRUTE SPECIFICITY */
        div.custom-scroll {
            scrollbar-width: thin !important;
            scrollbar-color: #ea580c transparent !important;
        }
        div.custom-scroll::-webkit-scrollbar { 
            width: 2px !important; 
            display: block !important;
        }
        div.custom-scroll::-webkit-scrollbar-track { 
            background: transparent !important; 
        }
        div.custom-scroll::-webkit-scrollbar-thumb { 
            background-color: #ea580c !important; 
            border-radius: 50px !important;
            border: none !important;
        }
        div.custom-scroll::-webkit-scrollbar-thumb:hover { 
            background-color: #c2410c !important; 
        }

        .nav-link { position: relative; transition: color 0.3s; }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -4px; left: 0; background-color: #ea580c; transition: width 0.3s; }
        .nav-link:hover::after { width: 100%; }
    </style>
</head>
<body class="bg-white text-slate-900" x-data="{ mobileMenuOpen: false }">

    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100] h-24 flex items-center">
        <div class="max-w-7xl mx-auto px-12 flex justify-between items-center w-full">
            
            <div class="flex items-center space-x-8 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                <?php $home_slug = strtoupper($_COOKIE['freegeny_home'] ?? 'DZ') . '-' . $lang; ?>
                <a href="/<?php echo $home_slug; ?>/" class="transition hover:scale-105 transform">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png?v=4.0" class="h-10 md:h-12 w-auto" alt="Logo">
                </a>

                <div class="hidden md:block relative" x-data="{ open: false }">
                    <button @click="open = !open" 
                            class="flex items-center space-x-3 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?> bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group">
                        <img src="https://flagcdn.com/w40/<?php echo strtolower($country); ?>.png" class="w-7 h-auto rounded-sm transition-transform">
                        <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-tighter"><?php echo $country; ?></span>
                        <svg class="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"></path></svg>
                    </button>

                    <div x-show="open" @click.away="open = false" x-cloak 
                         id="force-refresh-scroll"
                         class="absolute mt-5 w-80 glass-card rounded-[2.5rem] shadow-2xl z-[150] p-6 origin-top overflow-y-auto max-h-[70vh] custom-scroll"
                         x-transition:enter="transition ease-out duration-200 transform"
                         x-transition:enter-start="opacity-0 -translate-y-4 scale-95">
                        
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2"><?php echo __('select_region', 'Global Access'); ?></div>
                        <div class="grid grid-cols-1 gap-1">
                            <?php foreach ($supported_regions as $code => $info): 
                                $is_selected = ($country === $code);
                            ?>
                                <div class="p-0.5">
                                    <div class="flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 <?php echo $is_selected ? 'bg-orange-50 border border-orange-100 shadow-sm' : 'bg-slate-50/50 hover:bg-white hover:shadow-md'; ?>">
                                        <div class="flex items-center space-x-3 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                                            <img src="https://flagcdn.com/w20/<?php echo strtolower($code); ?>.png" class="w-5 h-auto rounded-sm">
                                            <span class="font-bold text-sm <?php echo $is_selected ? 'text-orange-600' : 'text-slate-700'; ?> transition-colors"><?php echo $info['name']; ?></span>
                                        </div>
                                        <div class="flex space-x-1 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                                            <?php foreach ($info['langs'] as $l): ?>
                                                <a href="/<?php echo $code . '-' . $l; ?>/" 
                                                   class="px-2 py-1 text-[10px] font-black rounded-lg transition <?php echo ($country==$code && $lang==$l) ? 'bg-orange-600 text-white' : 'bg-white text-slate-400 hover:text-orange-600 hover:shadow-sm'; ?>">
                                                    <?php echo strtoupper($l); ?>
                                                </a>
                                            <?php endforeach; ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden lg:flex items-center space-x-10 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="nav-link text-sm font-bold text-slate-600 hover:text-orange-600"><?php echo __('about'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/goals" class="nav-link text-sm font-bold text-slate-600 hover:text-orange-600"><?php echo __('goals'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="nav-link text-sm font-bold text-slate-600 hover:text-orange-600"><?php echo __('parents'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="nav-link text-sm font-bold text-slate-600 hover:text-orange-600"><?php echo __('schools'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="nav-link text-sm font-bold text-slate-600 hover:text-orange-600"><?php echo __('ngos'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="nav-link text-sm font-bold text-slate-600 hover:text-orange-600"><?php echo __('shop'); ?></a>
            </div>

            <div class="flex items-center space-x-6 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                <?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
                    <!-- USER MENU (Geist Style) -->
                    <div class="relative" x-data="{ userOpen: false }">
                        <button @click="userOpen = !userOpen" @click.away="userOpen = false" 
                                class="flex items-center space-x-3 bg-white border border-slate-200 p-1.5 pr-4 rounded-xl hover:border-slate-950 transition-all group">
                            <div class="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center text-[11px] font-bold text-white shadow-sm overflow-hidden border border-white">
                                <?php if (isset($_SESSION['user_avatar']) && $_SESSION['user_avatar']): ?>
                                    <img src="<?php echo $_SESSION['user_avatar']; ?>" class="w-full h-full object-cover">
                                <?php else: ?>
                                    <?php echo strtoupper(substr($_SESSION['user_name'] ?? 'U', 0, 1)); ?>
                                <?php endif; ?>
                            </div>
                            <span class="text-sm font-semibold text-slate-950 tracking-tight font-next hidden sm:block leading-none">
                                <?php echo explode(' ', $_SESSION['user_name'] ?? 'Compte')[0]; ?>
                            </span>
                            <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-300" :class="userOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M19 9l-7 7-7-7"></path></svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <div x-show="userOpen" x-cloak 
                             x-transition:enter="transition ease-out duration-100 transform"
                             x-transition:enter-start="opacity-0 translate-y-2 scale-95"
                             class="absolute right-0 mt-3 w-56 bg-white rounded-xl border border-slate-100 dropdown-shadow z-[200] overflow-hidden p-1.5">
                             
                             <div class="px-4 py-3 border-b border-slate-50 mb-1">
                                <p class="text-[11px] font-medium text-slate-400 mb-0.5">Compte vérifié</p>
                                <p class="text-sm font-bold text-slate-950 truncate"><?php echo $_SESSION['user_name'] ?? 'Utilisateur'; ?></p>
                             </div>

                             <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/parent" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all group">
                                <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <span class="text-sm font-medium text-slate-700 font-next transition-colors">Tableau de bord</span>
                             </a>

                             <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all group relative">
                                <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                <span class="text-sm font-medium text-slate-700 font-next transition-colors">Notifications</span>
                                <span class="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                             </a>

                             <div class="mt-1 border-t border-slate-50 pt-1">
                                 <a href="/api/auth/logout.php" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all group">
                                    <svg class="w-4 h-4 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    <span class="text-sm font-medium text-red-600 font-next">Se déconnecter</span>
                                 </a>
                             </div>
                        </div>
                    </div>
                <?php else: ?>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="hidden sm:block text-[13px] font-extrabold text-slate-900 uppercase tracking-widest hover:text-orange-600 transition">
                        <?php echo __('login'); ?>
                    </a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 hover:shadow-2xl hover:-translate-y-0.5 transition transform duration-300">
                        <?php echo __('register'); ?>
                    </a>
                <?php endif; ?>
                
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-3 bg-slate-50 text-slate-600 rounded-2xl border border-slate-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" stroke-width="2.5"></path></svg>
                </button>
            </div>
        </div>

        <div x-show="mobileMenuOpen" x-cloak class="fixed inset-0 z-[200] lg:hidden">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="mobileMenuOpen = false"></div>
            <div class="absolute <?php echo $is_rtl ? 'left-0' : 'right-0'; ?> top-0 bottom-0 w-80 bg-white p-10 shadow-2xl overflow-y-auto"
                 x-show="mobileMenuOpen" x-transition:enter="transition duration-300 transform" x-transition:enter-start="<?php echo $is_rtl ? '-translate-x-full' : 'translate-x-full'; ?>" x-transition:enter-end="translate-x-0">
                <div class="flex justify-between items-center mb-12">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png" class="h-10 w-auto">
                    <button @click="mobileMenuOpen = false" class="p-2 bg-slate-100 rounded-xl"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"></path></svg></button>
                </div>
                <div class="flex flex-col space-y-8">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="text-2xl font-black text-slate-900"><?php echo __('about'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/goals" class="text-2xl font-black text-slate-900"><?php echo __('goals'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="text-2xl font-black text-slate-900"><?php echo __('parents'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="text-2xl font-black text-slate-900"><?php echo __('schools'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="text-2xl font-black text-slate-900"><?php echo __('ngos'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="text-2xl font-black text-slate-900"><?php echo __('shop'); ?></a>
                    <hr class="border-slate-100">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-2xl font-black text-orange-600"><?php echo __('login'); ?></a>
                </div>
            </div>
        </div>
    </nav>
