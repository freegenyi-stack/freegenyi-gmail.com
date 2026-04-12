<?php
require_once __DIR__ . '/../config/app.php';
// Simulation pour le lobby
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
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        body { font-family: 'Outfit', sans-serif; overflow: hidden; }
        .portal-card:hover .portal-icon { transform: scale(1.1) rotate(5deg); }
        .floating { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
    </style>
</head>
<body class="bg-slate-950 min-h-screen text-white relative flex flex-col items-center justify-center p-8">

    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none opacity-20">
        <div class="absolute top-10 left-10 w-64 h-64 bg-blue-600 blur-[120px] rounded-full floating"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-orange-600 blur-[150px] rounded-full floating" style="animation-delay: -3s;"></div>
    </div>

    <!-- Top Bar -->
    <div class="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <div class="flex items-center space-x-6">
            <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center">
                <span class="text-3xl">🦊</span>
            </div>
            <div>
                <h1 class="text-2xl font-black tracking-tight">Salut, <?php echo $child_name; ?> !</h1>
                <div class="flex items-center space-x-2">
                    <span class="text-xs font-black uppercase tracking-widest text-orange-500"><?php echo $xp; ?> points XP</span>
                    <div class="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-orange-600 w-2/3"></div>
                    </div>
                </div>
            </div>
        </div>
        <a href="/dashboard/parent.php" class="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/20 transition-all">
            Menu Parent
        </a>
    </div>

    <!-- The 3 Portals -->
    <div class="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        <!-- Portal 1: Academic -->
        <a href="/dashboard/portal_local.php" class="portal-card group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 text-center hover:bg-white/10 transition-all duration-500">
            <div class="absolute inset-0 bg-blue-600/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="portal-icon w-32 h-32 bg-blue-600/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-2xl shadow-blue-600/20">
                <svg class="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h2 class="text-3xl font-black mb-4 tracking-tighter">Mon École</h2>
            <p class="text-blue-300/60 font-medium text-sm leading-relaxed">Le programme officiel de ma classe en Algérie.</p>
            <div class="mt-8 inline-flex items-center space-x-2 text-blue-400 font-black uppercase tracking-widest text-[10px]">
                <span>Entrer dans l'univers</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3"/></svg>
            </div>
        </a>

        <!-- Portal 2: World Exploration -->
        <a href="/dashboard/portal_world.php" class="portal-card group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 text-center hover:bg-white/10 transition-all duration-500 scale-110">
            <div class="absolute inset-0 bg-orange-600/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="portal-icon w-40 h-40 bg-orange-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-[0_20px_50px_rgba(234,88,12,0.3)]">
                <svg class="w-20 h-20 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke-width="2"/></svg>
            </div>
            <h2 class="text-4xl font-black mb-4 tracking-tighter">Le Monde</h2>
            <p class="text-orange-200/60 font-medium text-sm leading-relaxed">Singapour, Oxford et bien d'autres défis !</p>
            <div class="mt-8 inline-flex items-center space-x-2 text-orange-500 font-black uppercase tracking-widest text-[11px]">
                <span>Découvrir</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="3"/></svg>
            </div>
        </a>

        <!-- Portal 3: Magic Arena -->
        <a href="/dashboard/portal_magic.php" class="portal-card group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 text-center hover:bg-white/10 transition-all duration-500">
            <div class="absolute inset-0 bg-teal-600/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="portal-icon w-32 h-32 bg-teal-600/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-2xl shadow-teal-600/20">
                <svg class="w-16 h-16 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h2 class="text-3xl font-black mb-4 tracking-tighter">L'Arène</h2>
            <p class="text-teal-300/60 font-medium text-sm leading-relaxed">Défis magiques et jeux d'intelligence.</p>
            <div class="mt-8 inline-flex items-center space-x-2 text-teal-400 font-black uppercase tracking-widest text-[10px]">
                <span>Prêt à jouer ?</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3"/></svg>
            </div>
        </a>

    </div>

    <!-- Mascotte Message -->
    <div class="fixed bottom-10 flex items-center space-x-8 max-w-2xl bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
        <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <span class="text-4xl">🦊</span>
        </div>
        <p class="text-slate-300 font-medium leading-relaxed italic">
            "Alors <?php echo $child_name; ?>, prêt pour une nouvelle aventure ? N'oublie pas de checker ton <span class="text-orange-500 font-black">Boost</span> envoyé par tes parents !"
        </p>
    </div>

</body>
</html>
