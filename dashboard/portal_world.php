<?php
/**
 * dashboard/portal_world.php - Elite World Portal
 */
require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Le Monde | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'DM Sans', sans-serif; background: #0f172a; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-8 text-white relative overflow-hidden">
    <div class="fixed inset-0 opacity-20 pointer-events-none">
        <div class="absolute inset-0 bg-orange-600 blur-[200px] rounded-full"></div>
    </div>
    
    <div class="relative z-10 text-center max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] shadow-3xl">
        <div class="w-32 h-32 bg-orange-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM3.5 12c0-1.03.2-1.99.55-2.88l3.12 3.12c.1.1.25.14.38.1l2.5-1c.21-.08.31-.33.22-.53l-1-2.25a.38.38 0 01.12-.46l1.75-1.25c.16-.11.23-.33.16-.51L10.5 4.1a8.55 8.55 0 011.5-.1 8.5 8.5 0 018.5 8.5c0 .38-.03.74-.08 1.1l-2.07-.35a.38.38 0 01-.3-.26l-.75-2.5a.38.38 0 00-.7-.04l-1.5 3a.38.38 0 01-.13.15l-3 2c-.15.1-.22.28-.18.45l.75 2.5c.03.1.11.17.2.2l.5.15c-.24.03-.5.05-.75.05a8.5 8.5 0 01-8.5-8.5z"/></svg>
        </div>
        <h1 class="text-5xl font-black mb-6 font-title tracking-tighter">Le Monde</h1>
        <p class="text-xl text-orange-200/60 font-light mb-12">Singapour, Oxford et bien d'autres défis internationaux t'attendent pour devenir un citoyen du monde.</p>
        <div class="flex flex-col gap-4">
            <a href="#" class="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl">Découvrir le monde</a>
            <a href="/dashboard/child_lobby.php" class="text-orange-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">Retour au Lobby</a>
        </div>
    </div>
</body>
</html>
