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
$initials = $_SESSION['user_initials'] ?? getInitials($userName);
$avatarColor = getAvatarColor($userName);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Parent - FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5); }
        .sidebar-item:hover { background: rgba(234, 88, 12, 0.05); color: #EA580C; }
        .sidebar-item.active { background: #EA580C; color: white; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.2); }
    </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 min-h-screen flex">

    <!-- SIDEBAR -->
    <aside class="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 sticky top-0 h-screen overflow-y-auto">
        <div class="mb-12">
            <img src="/assets/img/logo.png" class="h-10" alt="FreeGeny">
        </div>

        <nav class="space-y-3 flex-grow">
            <a href="#" class="sidebar-item active flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span>Vue d'ensemble</span>
            </a>
            <a href="#" class="sidebar-item flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-slate-400 transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <span>Mes Enfants</span>
            </a>
            <a href="#" class="sidebar-item flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-slate-400 transition-all duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <span>Statistiques</span>
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

    <!-- CONTENT AREA -->
    <main class="flex-grow p-6 lg:p-12 overflow-y-auto max-h-screen">
        <!-- HEADER -->
        <header class="flex items-center justify-between mb-12">
            <div>
                <h2 class="text-3xl font-black tracking-tight mb-2">Bonjour, <?php echo explode(' ', $userName)[0]; ?> 👋</h2>
                <p class="text-slate-400 font-medium">Bonne journée et bienvenue sur votre espace.</p>
            </div>

            <!-- PROFILE AVATAR (Checklist Elite) -->
            <div class="flex items-center space-x-6">
                <!-- Notifications -->
                <button class="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-orange-600 transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </button>
                
                <!-- The Premium Avatar -->
                <div class="group relative cursor-pointer">
                    <div class="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg shadow-xl shadow-slate-200 transition-all group-hover:scale-110" style="background: <?php echo $avatarColor; ?>;">
                        <?php echo $initials; ?>
                    </div>
                    <!-- Menu Tooltip dropdown simulated -->
                    <div class="absolute right-0 mt-4 w-64 glass rounded-3xl p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                        <div class="mb-4">
                            <p class="font-bold text-sm"><?php echo $userName; ?></p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest"><?php echo $_SESSION['user_email']; ?></p>
                        </div>
                        <div class="space-y-2 border-t border-slate-100 pt-4">
                            <a href="#" class="block text-xs font-bold text-slate-500 hover:text-orange-600">Mon Profil</a>
                            <a href="#" class="block text-xs font-bold text-slate-500 hover:text-orange-600">Thèmes & Préférences</a>
                            <a href="/api/auth/logout.php" class="block text-xs font-bold text-red-500">Déconnexion</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- DASHBOARD GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div class="lg:col-span-2 glass p-10 rounded-[2.5rem] relative overflow-hidden group">
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl transition-transform group-hover:scale-125"></div>
                <h3 class="text-xl font-black mb-10 relative z-10">Résumé de l'activité 📈</h3>
                
                <!-- Empty state placeholder -->
                <div class="text-center py-10 relative z-10">
                    <div class="w-20 h-20 bg-slate-50 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                        <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <p class="text-slate-400 font-bold text-sm mb-8 italic">Commencez par ajouter votre premier enfant.</p>
                    <button class="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1">
                        + Ajouter un enfant
                    </button>
                </div>
            </div>

            <div class="glass p-10 rounded-[2.5rem]">
                <h3 class="text-xl font-black mb-8">Nouveautés 🎁</h3>
                <div class="space-y-6">
                    <div class="flex items-center space-x-4 p-4 rounded-3xl bg-orange-50 border border-orange-100/50">
                        <span class="text-2xl">⚡</span>
                        <div>
                            <p class="font-bold text-orange-900 text-sm">Mode Arabe activé !</p>
                            <p class="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Voir les cours</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4 p-4 rounded-3xl bg-blue-50 border border-blue-100/50">
                        <span class="text-2xl">✨</span>
                        <div>
                            <p class="font-bold text-blue-900 text-sm">Nouveaux badges</p>
                            <p class="text-[10px] text-blue-600 font-bold uppercase tracking-widest">En savoir plus</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

</body>
</html>
