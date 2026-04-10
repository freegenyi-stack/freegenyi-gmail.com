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
    
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="icon" type="image/png" href="<?php echo APP_URL; ?>/favicon.png?v=4.0">
    
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }
        .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.05); }
        
        /* SCROLLBAR ULTRA-FINE (Next.js/React Style) */
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #ea580c; }

        .nav-link { position: relative; transition: color 0.3s; }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -4px; left: 0; background-color: #ea580c; transition: width 0.3s; }
        .nav-link:hover::after { width: 100%; }
    </style>
</head>
<body class="bg-white text-slate-900" x-data="{ mobileMenuOpen: false }">

    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100] h-24 flex items-center">
        <div class="container mx-auto px-6 flex justify-between items-center">
            
            <div class="flex items-center space-x-8 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                <a href="/<?php echo $country . '-' . $lang; ?>/" class="transition hover:scale-105 transform">
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
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="hidden sm:block text-[13px] font-extrabold text-slate-900 uppercase tracking-widest hover:text-orange-600 transition">
                    <?php echo __('login'); ?>
                </a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 hover:shadow-2xl hover:-translate-y-0.5 transition transform duration-300">
                    <?php echo __('register'); ?>
                </a>
                
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
