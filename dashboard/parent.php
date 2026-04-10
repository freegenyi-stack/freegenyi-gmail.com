<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

initSession();

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
$userEmail = strtolower($user['email']);
?>
<!DOCTYPE html>
<html lang="fr" x-data="{ menuOpen: false }">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elite Dashboard - FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; background: #F8FAFC; }
        .glass { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.4); }
        .menu-item:hover { background: rgba(234, 88, 12, 0.05); transform: translateX(5px); }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="min-h-screen relative overflow-hidden">

    <!-- FOND ÉPURÉ (Page Vierge) -->
    <div class="absolute inset-0 z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[120px]"></div>
    </div>

    <!-- MAIN INTERFACE -->
    <div class="relative z-10 w-full h-screen flex flex-col p-8 md:p-12">
        
        <!-- TOP HEADER -->
        <header class="flex justify-between items-center">
            <div class="group cursor-pointer">
                <img src="/assets/img/logo.png" class="h-10 opacity-50 group-hover:opacity-100 transition-opacity" alt="FreeGeny">
            </div>

            <!-- THE ELITE AVATAR (Command Center Trigger) -->
            <div class="relative" @click.away="menuOpen = false">
                <button @click="menuOpen = !menuOpen" 
                        class="flex items-center space-x-4 p-2 pl-6 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 group">
                    <div class="text-right hidden sm:block">
                        <p class="text-xs font-black text-slate-900 leading-none mb-1"><?php echo $user['full_name']; ?></p>
                        <span class="text-[9px] font-black text-orange-600 uppercase tracking-widest italic leading-none">Parent Elite ⭐</span>
                    </div>
                    <div class="relative">
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:rotate-6 transition-transform" 
                             style="background: <?php echo $avatarColor; ?>;">
                            <?php echo $initials; ?>
                        </div>
                        <!-- Status Badge (Point 1) -->
                        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                </button>

                <!-- ELITE COMMAND CENTER DROPDOWN (13 Points Vision) -->
                <div x-show="menuOpen" 
                     x-transition:enter="transition ease-out duration-300 transform"
                     x-transition:enter-start="opacity-0 translate-y-10 scale-95"
                     x-transition:leave="transition ease-in duration-200 transform"
                     x-transition:leave-end="opacity-0 translate-y-10 scale-95"
                     class="absolute right-0 mt-6 w-[350px] md:w-[450px] glass rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-[100]" x-cloak>
                    
                    <!-- Header Profil (Point 1, 6) -->
                    <div class="p-8 bg-slate-900 text-white relative">
                        <div class="absolute top-0 right-0 p-8 opacity-10">
                            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                        </div>
                        <div class="relative z-10 flex items-center space-x-6">
                            <div class="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black bg-white/10 border border-white/20">
                                <?php echo $initials; ?>
                            </div>
                            <div>
                                <h3 class="text-xl font-black tracking-tight leading-none mb-1"><?php echo $user['full_name']; ?></h3>
                                <p class="text-[10px] text-white/40 font-bold lowercase tracking-wider"><?php echo $userEmail; ?></p>
                                <span class="inline-block mt-3 px-3 py-1 bg-orange-600 rounded-full text-[8px] font-black uppercase tracking-widest italic">Abonnement Premium</span>
                            </div>
                        </div>
                    </div>

                    <!-- Scrollable Content Area -->
                    <div class="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                        
                        <!--SECTION: MA FAMILLE (Point 2) -->
                        <div class="p-4">
                            <h4 class="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic">Ma Famille 🏠</h4>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-transparent hover:border-orange-200 transition-all cursor-pointer group">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">👶</div>
                                        <div>
                                            <p class="text-sm font-black text-slate-700">Aucun enfant lié</p>
                                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ajouter un profil</p>
                                        </div>
                                    </div>
                                    <span class="text-slate-300 group-hover:text-orange-500 transition-colors">+</span>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION: SUIVI & PERF (Point 3, 7, 11) -->
                        <div class="p-4 grid grid-cols-2 gap-4">
                            <div class="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                                <p class="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2 italic">Progression</p>
                                <p class="text-2xl font-black text-blue-900 leading-none">0%</p>
                            </div>
                            <div class="p-5 bg-purple-50/50 rounded-[2rem] border border-purple-100/50">
                                <p class="text-[8px] font-black text-purple-600 uppercase tracking-widest mb-2 italic">Temps / J</p>
                                <p class="text-2xl font-black text-purple-900 leading-none">0h</p>
                            </div>
                        </div>

                        <!-- SECTION: CONTROLES & RÉGLAGES (Point 5, 6, 9, 12) -->
                        <div class="p-4 space-y-2">
                            <h4 class="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Centre de Contrôle ⚙️</h4>
                            <button class="w-full text-left flex items-center space-x-4 p-4 rounded-3xl menu-item transition-all duration-300">
                                <span class="w-10 h-10 rounded-2xl bg-orange-100/30 flex items-center justify-center">🔐</span>
                                <span class="text-xs font-black text-slate-600 italic">Contrôles Parentaux</span>
                            </button>
                            <button class="w-full text-left flex items-center space-x-4 p-4 rounded-3xl menu-item transition-all duration-300">
                                <span class="w-10 h-10 rounded-2xl bg-blue-100/30 flex items-center justify-center">🔔</span>
                                <span class="text-xs font-black text-slate-600 italic">Notifications (3)</span>
                            </button>
                            <button class="w-full text-left flex items-center space-x-4 p-4 rounded-3xl menu-item transition-all duration-300">
                                <span class="w-10 h-10 rounded-2xl bg-purple-100/30 flex items-center justify-center">💬</span>
                                <span class="text-xs font-black text-slate-600 italic">Messagerie Support</span>
                            </button>
                            <button class="w-full text-left flex items-center space-x-4 p-4 rounded-3xl menu-item transition-all duration-300">
                                <span class="w-10 h-10 rounded-2xl bg-slate-100/30 flex items-center justify-center">🏆</span>
                                <span class="text-xs font-black text-slate-600 italic">Mes Badges Parent</span>
                            </button>
                        </div>
                    </div>

                    <!-- Footer Action -->
                    <div class="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                        <a href="/api/auth/logout.php" class="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-[0.3em] italic transition-colors">Déconnexion Sécurisée</a>
                    </div>
                </div>
            </div>
        </header>

        <!-- CENTER CONTENT (Vierge pour l'instant) -->
        <main class="flex-grow flex items-center justify-center text-center">
            <div class="max-w-xl opacity-20">
                <h1 class="text-5xl font-black tracking-tighter text-slate-300 mb-6 italic">Zen Zone</h1>
                <p class="text-slate-300 font-bold uppercase tracking-[0.4em] text-xs italic">Explorez votre univers via le profil elite</p>
            </div>
        </main>

        <!-- FOOTER INFO -->
        <footer class="flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
            <div>FreeGeny 2026 — Système Haute Sécurité</div>
            <div class="hidden md:block">Accès Premium : DZ-fr / DZ-ar Supporté</div>
        </footer>

    </div>

</body>
</html>
