<?php
/**
 * dashboard/portal_local.php - Elite Academic Portal
 */
require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon École | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'DM Sans', sans-serif; background: #0f172a; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-8 text-white relative overflow-hidden">
    <div class="fixed inset-0 opacity-20 pointer-events-none">
        <div class="absolute inset-0 bg-blue-600 blur-[200px] rounded-full"></div>
    </div>
    
    <div class="relative z-10 text-center max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] shadow-3xl">
        <div class="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22.5 12.75a.75.75 0 00-.75-.75H13.5v7.5h8.25a.75.75 0 00.75-.75v-6zM12 19.5v-7.5H2.25a.75.75 0 00-.75.75v6a.75.75 0 00.75.75H12z"/></svg>
        </div>
        <h1 class="text-5xl font-black mb-6 font-title tracking-tighter">Mon École</h1>
        <p class="text-xl text-blue-200/60 font-light mb-12">Ici, tu trouveras ton programme officiel en Algérie. Prêt à devenir le premier de la classe ?</p>
        <div class="flex flex-col gap-4">
            <a href="#" class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl">Entrer dans la classe</a>
            <a href="/dashboard/child_lobby.php" class="text-blue-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">Retour au Lobby</a>
        </div>
    </div>
</body>
</html>
