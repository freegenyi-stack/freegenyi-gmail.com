require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

initSession();

try {
    if (!isset($_SESSION['logged_in'])) { 
        header('Location: /auth/login'); 
        exit; 
    }

    $userId = $_SESSION['user_id'] ?? 0;
    $user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
    
    if (!$user) {
        session_destroy();
        header('Location: /auth/login');
        exit;
    }

    $initials = getInitials($user['full_name']);
    $avatarColor = getAvatarColor($user['full_name']);

    $children = DB::fetchAll("SELECT * FROM children WHERE parent_id = ?", [$userId]);
    $notifications = DB::fetchAll("SELECT * FROM notifications WHERE user_id = ? AND is_read = 0", [$userId]);
} catch (Exception $e) {
    die("Erreur Critique : " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="fr" x-data="{ 
    tab: 'overview', 
    sidebarOpen: true,
    profileOpen: false,
    notificationsOpen: false,
    childSelected: null
}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elite Command Center - FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; background: #fafafa; }
        .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5); }
        .sidebar-item.active { background: #0f172a; color: white; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="text-slate-900 min-h-screen">

    <!-- OVERLAYS -->
    <div x-show="profileOpen" @click="profileOpen = false" class="fixed inset-0 bg-black/10 z-40 transition-opacity" x-cloak></div>

    <div class="flex h-screen overflow-hidden">
        
        <!-- SIDEBAR ELITE (Points 2, 5, 6, 8) -->
        <aside class="bg-white border-r border-slate-100 flex-shrink-0 transition-all duration-300"
               :class="sidebarOpen ? 'w-80' : 'w-24'">
            <div class="h-full flex flex-col p-6">
                <!-- Logo -->
                <div class="mb-12 flex items-center justify-between">
                    <img src="/assets/img/logo.png" class="h-8 transition-all" :class="sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'" alt="Logo">
                    <button @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-slate-50 rounded-xl transition-all">
                        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    </button>
                </div>

                <!-- Navigation Hub -->
                <nav class="space-y-2 flex-grow">
                    <template x-for="item in [
                        { id: 'overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Vue d\'ensemble' },
                        { id: 'family', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Ma Famille' },
                        { id: 'education', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Suivi Éducatif' },
                        { id: 'controls', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Contrôles Parentaux' },
                        { id: 'messages', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', label: 'Messages' }
                    ]">
                        <button @click="tab = item.id" 
                                class="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold sidebar-item"
                                :class="tab === item.id ? 'active' : 'text-slate-400 hover:text-slate-900 group'">
                            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/></svg>
                            <span class="truncate transition-all" :class="sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'" x-text="item.label"></span>
                        </button>
                    </template>
                </nav>

                <!-- Settings -->
                <div class="mt-8 pt-8 border-t border-slate-50 space-y-2">
                    <button @click="tab = 'settings'" 
                            class="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold sidebar-item text-slate-400 hover:text-slate-900"
                            :class="tab === 'settings' ? 'active' : ''">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <span x-show="sidebarOpen">Paramètres</span>
                    </button>
                    <a href="/api/auth/logout.php" class="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        <span x-show="sidebarOpen">Déconnexion</span>
                    </a>
                </div>
            </div>
        </aside>

        <!-- MAIN AREA -->
        <main class="flex-grow flex flex-col overflow-hidden">
            
            <!-- HEADER ELITE (Point 1, 4, 13) -->
            <header class="bg-white border-b border-slate-100 h-24 flex items-center justify-between px-10 flex-shrink-0">
                <div class="flex items-center space-x-6">
                    <h2 class="text-xl font-black italic tracking-tighter" x-text="tab.toUpperCase()"></h2>
                    <div class="h-6 w-px bg-slate-100"></div>
                    <div class="flex items-center space-x-2">
                        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Système Live</span>
                    </div>
                </div>

                <div class="flex items-center space-x-6">
                    <!-- Notifications Hub (Point 4) -->
                    <div class="relative">
                        <button @click="notificationsOpen = !notificationsOpen" 
                                class="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-orange-600 transition-all relative">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            <span class="absolute top-0 right-0 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-full border-4 border-white flex items-center justify-center">3</span>
                        </button>
                    </div>

                    <!-- Profile Dropdown (Point 1, 6) -->
                    <div class="relative">
                        <button @click="profileOpen = !profileOpen" class="flex items-center space-x-4 p-1 pl-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
                            <div class="text-right hidden sm:block">
                                <p class="text-[11px] font-black text-slate-900 leading-none mb-1"><?php echo $user['full_name']; ?></p>
                                <span class="bg-orange-100 text-orange-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Parent Premium</span>
                            </div>
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl" 
                                 style="background: <?php echo $avatarColor; ?>;">
                                <?php echo $initials; ?>
                            </div>
                        </button>

                        <!-- Menu Avatar Cliquable (Point 13) -->
                        <div x-show="profileOpen" x-cloak 
                             class="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-slate-50 p-6 z-50 overflow-hidden">
                            <div class="text-center mb-8">
                                <div class="w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center text-white font-black text-3xl mb-4 shadow-2xl" style="background: <?php echo $avatarColor; ?>;">
                                    <?php echo $initials; ?>
                                </div>
                                <h4 class="font-black text-slate-900"><?php echo $user['full_name']; ?></h4>
                                <p class="text-xs text-slate-400 italic">ID-<?php echo str_pad($user['id'], 6, '0', STR_PAD_LEFT); ?></p>
                            </div>
                            <div class="space-y-1 mb-6">
                                <button @click="tab = 'settings'; profileOpen = false" class="w-full flex items-center space-x-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
                                    <span class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">⚙️</span>
                                    <span class="text-xs font-bold text-slate-600">Paramètres du compte</span>
                                </button>
                                <button @click="tab = 'subscription'; profileOpen = false" class="w-full flex items-center space-x-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
                                    <span class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center italic">💎</span>
                                    <span class="text-xs font-bold text-slate-600">Abonnement Elite</span>
                                </button>
                            </div>
                            <a href="/api/auth/logout.php" class="block w-full text-center py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Déconnexion</a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- VIEWPORT -->
            <div class="flex-grow overflow-y-auto p-10">

                <!-- TAB: OVERVIEW (Points 3, 7, 11) -->
                <div x-show="tab === 'overview'" x-transition x-cloak>
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
                        <!-- Stat Card: Global Progress -->
                        <div class="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                            <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl transform group-hover:scale-125 transition-transform duration-1000"></div>
                            <div class="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <span class="inline-block px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest italic mb-6">Objectifs de la semaine</span>
                                    <h3 class="text-4xl font-black mb-4">Progression : 68%</h3>
                                    <p class="text-slate-400 font-medium italic">Vos enfants avancent 15% plus vite que la moyenne nationale ! 🚀</p>
                                </div>
                                <div class="mt-10 h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div class="h-full bg-orange-600 w-[68%] rounded-full shadow-[0_0_20px_rgba(234,88,12,0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Stat Card: Time -->
                        <div class="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-between">
                            <div class="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-2xl">⏳</div>
                            <div>
                                <h4 class="text-4xl font-black mb-1">12h 45</h4>
                                <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic leading-none">Temps d'apprentissage</p>
                            </div>
                        </div>

                        <!-- Stat Card: Achievements -->
                        <div class="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-between">
                            <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">🏆</div>
                            <div>
                                <h4 class="text-4xl font-black mb-1">24</h4>
                                <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic leading-none">Nouveaux Badges</p>
                            </div>
                        </div>
                    </div>

                    <!-- Activity List (Point 3) -->
                    <div class="bg-white border border-slate-100 rounded-[3rem] p-12">
                        <div class="flex items-center justify-between mb-10">
                            <h3 class="text-2xl font-black italic tracking-tighter">Dernières Activités</h3>
                            <button class="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">Voir tout le rapport</button>
                        </div>
                        <template x-if="children.length === 0">
                            <div class="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <div class="text-5xl mb-6">👶</div>
                                <p class="font-bold text-slate-400 italic mb-8">Commencez par ajouter votre premier enfant pour activer le Command Center.</p>
                                <button @click="tab = 'family'" class="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">+ Ajouter mon enfant</button>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- TAB: FAMILY (Point 2, 7) -->
                <div x-show="tab === 'family'" x-transition x-cloak>
                    <div class="flex items-center justify-between mb-10">
                        <h2 class="text-4xl font-black tracking-tighter italic">Gestion de la Famille</h2>
                        <button class="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 hover:rotate-2 transition-all">+ Ajouter un enfant</button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <!-- Empty Placeholder -->
                         <div class="bg-white border-2 border-dashed border-slate-200 p-12 rounded-[3.5rem] flex flex-col items-center justify-center text-center opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer group">
                             <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-6 group-hover:rotate-12 transition-all">👶</div>
                             <p class="font-black text-slate-300 uppercase text-xs tracking-widest italic">Place disponible</p>
                         </div>
                    </div>
                </div>

                <!-- TAB: SETTINGS (Point 6, 9, 12) -->
                <div x-show="tab === 'settings'" x-transition x-cloak>
                    <div class="max-w-4xl">
                        <h2 class="text-4xl font-black tracking-tighter italic mb-12">Paramètres Élite</h2>
                        
                        <div class="space-y-8">
                            <!-- Personal Info -->
                            <div class="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100">
                                <h3 class="text-xl font-black mb-8 flex items-center">
                                    <span class="mr-4">👤</span> Infos Personnelles
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Nom Complet</label>
                                        <input type="text" value="<?php echo $user['full_name']; ?>" class="w-full px-8 py-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all font-bold">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Email</label>
                                        <input type="email" value="<?php echo $user['email']; ?>" class="w-full px-8 py-5 bg-slate-100/50 rounded-2xl border border-transparent transition-all font-bold text-slate-400 cursor-not-allowed" readonly>
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">Numéro de téléphone</label>
                                        <input type="tel" value="<?php echo $user['phone']; ?>" class="w-full px-8 py-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all font-bold">
                                    </div>
                                </div>
                                <div class="mt-10 flex justify-end">
                                    <button class="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all duration-300">Enregistrer les modifications</button>
                                </div>
                            </div>

                            <!-- Preferences -->
                            <div class="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                                <h3 class="text-xl font-black mb-8">⚙️ Préférences Système</h3>
                                <div class="space-y-6">
                                    <div class="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                                        <div>
                                            <p class="font-black text-slate-900 leading-none mb-1">Mode Sombre</p>
                                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Optimiser pour le soir</p>
                                        </div>
                                        <button class="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-all">
                                            <div class="w-6 h-6 bg-white rounded-full shadow-sm"></div>
                                        </button>
                                    </div>
                                    <div class="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-orange-100">
                                        <div>
                                            <p class="font-black text-orange-900 leading-none mb-1 text-sm">Notifications Email</p>
                                            <p class="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Recevoir les rapports hebdomadaires</p>
                                        </div>
                                        <button class="w-14 h-8 bg-orange-600 rounded-full relative p-1 transition-all">
                                            <div class="w-6 h-6 bg-white rounded-full shadow-sm translate-x-6"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>

</body>
</html>
