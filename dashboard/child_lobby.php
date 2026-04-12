<?php
/**
 * dashboard/child_lobby.php - Elite Lobby Version
 */
require_once __DIR__ . '/../config/app.php';
$child_name = "Amine";
$xp = 1250;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Univers | FreeGeny</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <style>
        [x-cloak] { display: none !important; }
        body { 
            font-family: 'DM Sans', sans-serif; 
            overflow: hidden; 
            background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
        }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-caveat { font-family: 'Caveat', cursive; }

        .portal-card {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .portal-card:hover {
            transform: translateY(-10px) scale(1.02);
        }
        .floating { animation: float 6s ease-in-out infinite; }
        @keyframes float { 
            0%, 100% { transform: translateY(0px); } 
            50% { transform: translateY(-20px); } 
        }
    </style>
</head>
<body class="min-h-screen text-white flex flex-col items-center justify-center p-8 relative">

    <!-- Éléments de fond (Nébuleuse) -->
    <div class="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div class="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full floating"></div>
        <div class="absolute bottom-10 right-10 w-[600px] h-[600px] bg-orange-600/20 blur-[150px] rounded-full floating" style="animation-delay: -3s;"></div>
    </div>

    <!-- Barre supérieure -->
    <div class="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <div class="flex items-center gap-6">
            <div class="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl">
                <span class="text-3xl">🦊</span>
            </div>
            <div>
                <h1 class="text-2xl font-black tracking-tight font-title">Salut, <?php echo $child_name; ?> !</h1>
                <div class="flex items-center gap-3 mt-1">
                    <span class="text-[10px] font-black uppercase tracking-widest text-orange-500"><?php echo number_format($xp); ?> XP</span>
                    <div class="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-orange-600 w-2/3 shadow-[0_0_10px_#ea580c]"></div>
                    </div>
                </div>
            </div>
        </div>
        <a href="/dashboard/parent.php" class="bg-white/5 backdrop-blur-xl px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
            Dashboard Parent
        </a>
    </div>

    <!-- Les 3 Portails (Lobby Principal) -->
    <div class="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        
        <!-- Portail 1 : Local -->
        <a href="/dashboard/portal_local.php" class="portal-card group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 text-center overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="portal-icon w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-[0_20px_50px_rgba(37,99,235,0.3)] group-hover:rotate-6">
                <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22.5 12.75a.75.75 0 00-.75-.75H13.5v7.5h8.25a.75.75 0 00.75-.75v-6zM12 19.5v-7.5H2.25a.75.75 0 00-.75.75v6a.75.75 0 00.75.75H12z"/></svg>
            </div>
            <h2 class="text-3xl font-black mb-4 tracking-tighter font-title">Mon École</h2>
            <p class="text-blue-300/60 font-light text-sm leading-relaxed mb-8">Révise tes leçons de classe en t’amusant.</p>
            <div class="inline-flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                <span>Partir à l'aventure</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-width="3"/></svg>
            </div>
        </a>

        <!-- Portail 2 : World (Scale up focus) -->
        <a href="/dashboard/portal_world.php" class="portal-card group relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[4rem] p-12 text-center overflow-hidden scale-110 shadow-3xl">
            <div class="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="portal-icon w-40 h-40 bg-orange-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-[0_25px_60px_rgba(234,88,12,0.4)] group-hover:-rotate-6">
                <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM3.5 12c0-1.03.2-1.99.55-2.88l3.12 3.12c.1.1.25.14.38.1l2.5-1c.21-.08.31-.33.22-.53l-1-2.25a.38.38 0 01.12-.46l1.75-1.25c.16-.11.23-.33.16-.51L10.5 4.1a8.55 8.55 0 011.5-.1 8.5 8.5 0 018.5 8.5c0 .38-.03.74-.08 1.1l-2.07-.35a.38.38 0 01-.3-.26l-.75-2.5a.38.38 0 00-.7-.04l-1.5 3a.38.38 0 01-.13.15l-3 2c-.15.1-.22.28-.18.45l.75 2.5c.03.1.11.17.2.2l.5.15c-.24.03-.5.05-.75.05a8.5 8.5 0 01-8.5-8.5z"/></svg>
            </div>
            <h2 class="text-4xl font-black mb-4 tracking-tighter font-title text-orange-400">Le Monde</h2>
            <p class="text-orange-200/60 font-light text-sm leading-relaxed mb-8">Explore Singapour, Oxford et relève des défis mondiaux !</p>
            <div class="inline-flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[11px] group-hover:gap-4 transition-all">
                <span>Découvrir</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-width="3"/></svg>
            </div>
        </a>

        <!-- Portail 3 : Magic Arena -->
        <a href="/dashboard/portal_magic.php" class="portal-card group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 text-center overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-teal-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="portal-icon w-32 h-32 bg-teal-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-[0_20px_50px_rgba(13,148,136,0.3)] group-hover:rotate-12">
                <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h2 class="text-3xl font-black mb-4 tracking-tighter font-title">L’Arène</h2>
            <p class="text-teal-300/60 font-light text-sm leading-relaxed mb-8">Jeux de logique et compétitions magiques.</p>
            <div class="inline-flex items-center gap-2 text-teal-400 font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                <span>Prêt à jouer ?</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-width="3"/></svg>
            </div>
        </a>
    </div>

    <!-- Message de la mascotte -->
    <div class="fixed bottom-10 max-w-2xl bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-3xl">
        <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <span class="text-4xl">🦊</span>
        </div>
        <div>
            <p class="text-slate-300 font-light leading-relaxed italic" style="font-family: 'DM Sans', sans-serif;">
                "Alors <span class="text-orange-600 font-black"><?php echo $child_name; ?></span>, prêt pour une nouvelle aventure ? N’oublie pas de vérifier ton <span class="bg-orange-600/20 px-2 rounded text-orange-500 font-bold">Boost vocal</span> envoyé par tes parents !"
            </p>
        </div>
    </div>

</body>
</html>
