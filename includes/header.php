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
    <nav class="glass-nav fixed top-0 w-full z-[120] h-20 flex items-center">
        <div class="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center w-full">
            <div class="flex items-center gap-6">
                <?php $home_slug = strtoupper($_COOKIE['freegeny_home'] ?? 'DZ') . '-' . $lang; ?>
                <a href="/<?php echo $home_slug; ?>/" class="flex items-center gap-3 transition hover:scale-105 group">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-10 w-auto">
                    <span class="text-2xl font-black text-slate-900 tracking-tighter uppercase font-title leading-none">
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
                    $user_initials = strtoupper(substr($_SESSION['user_name'] ?? 'U', 0, 1));
                ?>
                    <div class="relative" x-data="{ userMenuOpen: false }">
                        <button @click="userMenuOpen = !userMenuOpen" class="flex items-center gap-2 focus:outline-none group">
                            <div class="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[11px] border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                                <?php if (isset($_SESSION['user_avatar']) && $_SESSION['user_avatar']): ?>
                                    <img src="<?php echo $_SESSION['user_avatar']; ?>" class="w-full h-full object-cover">
                                <?php else: ?>
                                    <?php echo $user_initials; ?>
                                <?php endif; ?>
                            </div>
                            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                        </button>
                        <div x-show="userMenuOpen" @click.away="userMenuOpen = false" x-cloak x-transition class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden">
                            <div class="px-5 py-3 border-b border-slate-50 mb-1">
                                <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Connecté</p>
                                <p class="text-xs font-bold text-slate-900 truncate"><?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
                            </div>
                            <a href="/dashboard/parent.php" class="block px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all font-sans">Tableau de bord</a>
                            <a href="/api/auth/logout.php" class="block px-5 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all font-sans">Déconnexion</a>
                        </div>
                    </div>
                <?php else: ?>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="hidden sm:block text-[11px] font-black uppercase text-slate-900 tracking-widest hover:text-orange-600 transition p-2">Connexion</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-slate-900 text-white px-7 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-orange-600 transition transform duration-300">Rejoindre</a>
                <?php endif; ?>
                
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-3 bg-white border border-slate-200 text-slate-600 rounded-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" stroke-width="2.5"></path></svg>
                </button>
            </div>
        </div>

        <!-- Menu Mobile -->
        <div x-show="mobileMenuOpen" x-cloak class="fixed inset-0 z-[200] lg:hidden" x-transition:enter="transition duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100">
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-md" @click="mobileMenuOpen = false"></div>
            <div class="absolute right-0 top-0 bottom-0 w-80 bg-white p-10 shadow-2xl flex flex-col" x-show="mobileMenuOpen" x-transition:enter="transition duration-300 transform" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0">
                <div class="flex justify-between items-center mb-16">
                    <span class="text-xl font-black text-slate-900 tracking-tighter uppercase font-title">FreeGeny</span>
                    <button @click="mobileMenuOpen = false" class="p-2 bg-slate-100 rounded-xl"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"></path></svg></button>
                </div>
                <div class="flex flex-col gap-8">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="text-2xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title">À propos</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/approach" class="text-2xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title">Approche</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="text-2xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title">Parents</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="text-2xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title">Écoles</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="text-2xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title">ONG</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/science" class="text-2xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title">Science</a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="text-2xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title">Boutique</a>
                    <hr class="border-slate-100">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-2xl font-black text-orange-600 font-title">Connexion</a>
                </div>
                <div class="mt-auto">
                    <p class="font-caveat text-lg text-slate-400">free the genius on your child</p>
                </div>
            </div>
        </div>
    </nav>
    <div class="h-20"></div>
