<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

// Sécurité : Rediriger si non connecté
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: /auth/login');
    exit;
}

$userName = $_SESSION['user_name'];
$userEmail = strtolower($_SESSION['user_email']); // Correction minuscules
$initials = $_SESSION['user_initials'] ?? getInitials($userName);
$avatarColor = getAvatarColor($userName);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Espace - FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5); }
        .sidebar-item:hover { background: rgba(234, 88, 12, 0.05); color: #EA580C; }
        .sidebar-item.active { background: #EA580C; color: white; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.2); }
    </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 min-h-screen flex" x-data="{ openProfile: false, openAvatars: false }">

    <!-- SIDEBAR -->
    <aside class="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 sticky top-0 h-screen overflow-y-auto">
        <div class="mb-12">
            <img src="/assets/img/logo.png" class="h-10" alt="FreeGeny">
        </div>
        <nav class="space-y-3 flex-grow">
            <a href="#" class="sidebar-item active flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span>Tableau de bord</span>
            </a>
            <a href="#" class="sidebar-item flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-slate-400 transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <span>Mes Enfants</span>
            </a>
            <a href="#" class="sidebar-item flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-slate-400 transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Paramètres</span>
            </a>
        </nav>
        <div class="mt-8 pt-8 border-t border-slate-50">
            <a href="/api/auth/logout.php" class="flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span>Déconnexion</span>
            </a>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-grow p-6 lg:p-12 overflow-y-auto max-h-screen relative">
        
        <!-- TOP HEADER -->
        <header class="flex items-center justify-between mb-16 relative z-40">
            <div>
                <h2 class="text-3xl font-black tracking-tight mb-2">Bonjour, <?php echo explode(' ', $userName)[0]; ?> 👋</h2>
                <p class="text-slate-400 font-medium italic">Nous sommes ravis de vous revoir.</p>
            </div>

            <div class="flex items-center space-x-6 relative">
                <!-- Notifications (Premium Style) -->
                <button class="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-orange-600 transition-all hover:rotate-12">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </button>

                <!-- PROFILE DROPDOWN (AlpineJS for Stability) -->
                <div class="relative" @click.away="openProfile = false">
                    <button @click="openProfile = !openProfile" class="group flex items-center space-x-3 outline-none">
                        <!-- Modern Avatar Container -->
                        <div class="relative">
                            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-slate-200 transition-all group-hover:rotate-6 scale-100 group-hover:scale-105" 
                                 style="background: <?php echo $avatarColor; ?>;">
                                <?php echo $initials; ?>
                            </div>
                            <!-- Status Indicator -->
                            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>
                        <div class="hidden md:block text-left">
                            <p class="font-black text-sm"><?php echo $userName; ?></p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Parent Elite</p>
                        </div>
                        <svg class="w-4 h-4 text-slate-300 transition-transform" :class="openProfile ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>

                    <!-- Dropdown Menu -->
                    <div x-show="openProfile" 
                         x-transition:enter="transition ease-out duration-200" 
                         x-transition:enter-start="opacity-0 translate-y-4"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-end="opacity-0 translate-y-4"
                         class="absolute right-0 mt-4 w-72 glass rounded-[2.5rem] p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] z-50 overflow-hidden" x-cloak>
                        
                        <!-- Mini Profile Card -->
                        <div class="flex flex-col items-center mb-6 pt-2">
                             <div class="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-3xl mb-4 shadow-2xl" style="background: <?php echo $avatarColor; ?>;">
                                <?php echo $initials; ?>
                                <button @click="openAvatars = true" class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-3xl text-sm">📷</button>
                             </div>
                             <p class="font-black text-slate-900"><?php echo $userName; ?></p>
                             <p class="text-[11px] text-slate-400 font-bold lowercase"><?php echo $userEmail; ?></p>
                        </div>

                        <!-- Menu Options -->
                        <div class="space-y-1 mb-6 border-t border-slate-100 pt-6">
                            <a href="#" class="flex items-center space-x-4 p-3 rounded-2xl hover:bg-orange-50 group/item transition-all">
                                <div class="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center text-orange-600">👤</div>
                                <span class="text-xs font-black text-slate-600 group-hover/item:text-orange-600 italic">Modifier Profil</span>
                            </a>
                            <a href="#" class="flex items-center space-x-4 p-3 rounded-2xl hover:bg-blue-50 group/item transition-all">
                                <div class="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600">🎨</div>
                                <span class="text-xs font-black text-slate-600 group-hover/item:text-blue-600 italic">Thème : Royal Blue</span>
                            </a>
                            <a href="#" class="flex items-center space-x-4 p-3 rounded-2xl hover:bg-purple-50 group/item transition-all">
                                <div class="w-10 h-10 rounded-xl bg-purple-100/50 flex items-center justify-center text-purple-600">🔒</div>
                                <span class="text-xs font-black text-slate-600 group-hover/item:text-purple-600 italic">Sécurité</span>
                            </a>
                        </div>

                        <a href="/api/auth/logout.php" class="block w-full text-center py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                            Déconnexion
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- AVATAR CHOOSER MODAL (Elite Checklist) -->
        <div x-show="openAvatars" class="fixed inset-0 z-[100] flex items-center justify-center p-6" x-cloak>
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="openAvatars = false"></div>
            <div class="w-full max-w-2xl bg-white rounded-[3rem] p-10 relative z-10 shadow-3xl text-center">
                <h3 class="text-3xl font-black mb-8">Choisissez votre identité 🎭</h3>
                
                <div class="grid grid-cols-4 md:grid-cols-6 gap-6 mb-12">
                    <!-- Photo Upload Button -->
                    <div class="group relative aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all">
                        <span class="text-2xl mb-1">📤</span>
                        <span class="text-[8px] font-black uppercase text-slate-400 group-hover:text-orange-600 text-center px-1">Upload Photo</span>
                        <input type="file" class="absolute inset-0 opacity-0 cursor-pointer">
                    </div>
                    
                    <!-- Pre-defined avatars library -->
                    <?php for($i=1; $i<=11; $i++): ?>
                        <div class="aspect-square bg-slate-100 rounded-3xl cursor-pointer hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-4xl border-4 border-transparent hover:border-orange-500">
                            <?php 
                            $icons = ['🦁','🦊','🐼','🤖','👽','🦸','🐱','🐶','🦉','🦖','🥷']; 
                            echo $icons[$i-1] ?? '🎭'; 
                            ?>
                        </div>
                    <?php endfor; ?>
                </div>

                <div class="flex space-x-4">
                    <button @click="openAvatars = false" class="flex-grow bg-slate-100 py-5 rounded-2xl font-black text-xs uppercase tracking-widest">Annuler</button>
                    <button class="flex-grow bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200">Enregistrer</button>
                </div>
            </div>
        </div>

        <!-- MAIN DASHBOARD CONTENT (Cards) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div class="lg:col-span-2 space-y-10">
                <!-- Welcome Banner -->
                <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-[3.5rem] text-white relative overflow-hidden group">
                     <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-1000"></div>
                     <div class="relative z-10">
                        <span class="inline-block px-4 py-2 bg-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 italic">Abonnement Gratuit</span>
                        <h4 class="text-4xl font-black mb-4">Prêt pour une nouvelle leçon ?</h4>
                        <p class="text-slate-400 font-medium mb-8 max-w-md italic">Suivez le parcours éducatif de vos enfants et débloquez de nouveaux contenus chaque semaine.</p>
                        <button class="bg-white text-slate-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all duration-500">
                             Démarrer les cours
                        </button>
                     </div>
                </div>

                <!-- Children Grid Section -->
                <div class="glass p-10 rounded-[3rem]">
                    <div class="flex items-center justify-between mb-8">
                        <h4 class="text-xl font-black">Ma Famille 🏠</h4>
                        <button class="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">+ Ajouter enfant</button>
                    </div>
                    <!-- Empty State for children -->
                    <div class="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-12 text-center">
                        <div class="w-16 h-16 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl shadow-sm border border-slate-50">👶</div>
                        <p class="font-bold text-slate-400 italic mb-0">Aucun enfant ajouté pour le moment</p>
                    </div>
                </div>
            </div>

            <!-- Sidebar Info -->
            <div class="space-y-8">
                 <div class="glass p-8 rounded-[3rem]">
                    <h4 class="text-lg font-black mb-6 italic">Accès Rapide ⚡</h4>
                    <div class="space-y-4">
                        <div class="p-5 rounded-3xl bg-white shadow-sm border border-slate-50 flex items-center justify-between group cursor-pointer hover:border-orange-200 transition-all">
                             <div class="flex items-center space-x-4">
                                <span class="w-10 h-10 rounded-xl bg-orange-100/30 flex items-center justify-center">📅</span>
                                <span class="font-bold text-sm text-slate-700">Calendrier</span>
                             </div>
                             <span class="text-slate-200 group-hover:text-orange-300 transition-colors">→</span>
                        </div>
                        <div class="p-5 rounded-3xl bg-white shadow-sm border border-slate-50 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all text-blue-900">
                             <div class="flex items-center space-x-4">
                                <span class="w-10 h-10 rounded-xl bg-blue-100/30 flex items-center justify-center">🎁</span>
                                <span class="font-bold text-sm">Récompenses</span>
                             </div>
                             <span class="text-slate-200 group-hover:text-blue-300 transition-colors">→</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </main>

</body>
</html>
