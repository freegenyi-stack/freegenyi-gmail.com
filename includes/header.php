<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/db.php';
$page_title = $page_title ?? 'Soutien Scolaire';
$is_rtl = $is_rtl ?? false;
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>" dir="<?php echo $is_rtl ? 'rtl' : 'ltr'; ?>" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreeGeny | <?php echo $page_title; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: { extend: { colors: { primary: '#ea580c' }, screens: { 'xs': '400px' } } }
        }
    </script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="icon" type="image/png" href="<?php echo APP_URL; ?>/favicon.png?v=3.0">
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'Inter', sans-serif; }
        .rtl-flip { transform: scaleX(-1); }
    </style>
</head>
<body class="bg-white text-gray-900 font-sans" x-data="{ mobileMenuOpen: false }">
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
        <div class="container mx-auto px-4 h-20 flex justify-between items-center">
            
            <div class="flex items-center space-x-2 md:space-x-6 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                <a href="<?php echo APP_URL . '/' . $country . '-' . $lang . '/'; ?>">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png?v=3.0" class="h-8 md:h-11 w-auto" alt="Logo">
                </a>
                
                <div class="hidden sm:block relative" x-data="{ open: false }">
                    <button @click="open = !open" class="flex items-center space-x-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-2xl hover:bg-white transition-all">
                        <img src="https://flagcdn.com/w40/<?php echo strtolower($country); ?>.png" class="w-6 h-auto rounded-sm">
                        <span class="text-[10px] font-black text-orange-600"><?php echo $country; ?></span>
                    </button>
                    <div x-show="open" @click.away="open = false" x-cloak class="absolute mt-3 w-72 bg-white border border-gray-100 rounded-[2rem] shadow-2xl z-[150] py-6 max-h-96 overflow-y-auto">
                        <div class="px-6 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><?php echo __('change_region', 'Region (English)'); ?></div>
                        <?php foreach ($supported_regions as $code => $info): $l = $info['langs'][0]; ?>
                            <a href="<?php echo APP_URL . '/' . $code . '-' . $l . '/'; ?>" class="flex items-center px-6 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition">
                                <img src="https://flagcdn.com/w20/<?php echo strtolower($code); ?>.png" class="w-5 h-auto <?php echo $is_rtl ? 'ml-3' : 'mr-3'; ?> rounded-sm">
                                <span class="font-bold text-sm"><?php echo $info['name']; ?></span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <div class="hidden md:flex items-center space-x-4 lg:space-x-6 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="text-xs lg:text-sm font-bold text-gray-600 hover:text-orange-600"><?php echo __('about'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/goals" class="text-xs lg:text-sm font-bold text-gray-600 hover:text-orange-600"><?php echo __('goals'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="text-xs lg:text-sm font-bold text-gray-600 hover:text-orange-600"><?php echo __('parents'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="text-xs lg:text-sm font-bold text-gray-600 hover:text-orange-600"><?php echo __('schools'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="text-xs lg:text-sm font-bold text-gray-600 hover:text-orange-600"><?php echo __('ngos'); ?></a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="text-xs lg:text-sm font-bold text-gray-600 hover:text-orange-600"><?php echo __('shop', 'Magasin'); ?></a>
            </div>

            <div class="flex items-center space-x-2 md:space-x-4 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="hidden sm:block text-xs lg:text-sm font-black text-gray-900 uppercase tracking-widest">
                    <?php echo __('login'); ?>
                </a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-orange-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg hover:bg-orange-700 transition">
                    <?php echo __('register'); ?>
                </a>
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-orange-600 bg-orange-50 rounded-xl">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" stroke-width="2.5"></path></svg>
                </button>
            </div>
        </div>

        <div x-show="mobileMenuOpen" x-cloak class="fixed inset-0 z-[200] md:hidden">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="mobileMenuOpen = false"></div>
            <div class="absolute <?php echo $is_rtl ? 'left-0' : 'right-0'; ?> top-0 bottom-0 w-80 bg-white p-8 shadow-2xl overflow-y-auto"
                 x-show="mobileMenuOpen" x-transition:enter="transition duration-300 transform" x-transition:enter-start="<?php echo $is_rtl ? '-translate-x-full' : 'translate-x-full'; ?>" x-transition:enter-end="translate-x-0">
                <div class="flex justify-between items-center mb-10">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png" class="h-8 w-auto">
                    <button @click="mobileMenuOpen = false" class="p-2 bg-gray-100 rounded-xl"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"></path></svg></button>
                </div>
                <div class="flex flex-col space-y-6">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="text-xl font-black text-gray-900"><?php echo __('about'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/goals" class="text-xl font-black text-gray-900"><?php echo __('goals'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="text-xl font-black text-gray-900"><?php echo __('parents'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="text-xl font-black text-gray-900"><?php echo __('schools'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="text-xl font-black text-gray-900"><?php echo __('ngos'); ?></a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="text-xl font-black text-gray-900"><?php echo __('shop'); ?></a>
                    <hr>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-xl font-black text-orange-600"><?php echo __('login'); ?></a>
                </div>
            </div>
        </div>
    </nav>
