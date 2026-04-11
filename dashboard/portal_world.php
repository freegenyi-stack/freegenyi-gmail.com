<?php
require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Le Monde | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap" rel="stylesheet">
</head>
<body class="bg-slate-900 min-h-screen flex items-center justify-center text-white font-['Outfit']">
    <div class="text-center p-12 bg-white/5 backdrop-blur-xl rounded-[4rem] border border-white/10 max-w-2xl">
        <span class="text-8xl mb-8 block">🌍</span>
        <h1 class="text-5xl font-black mb-6">Le Monde</h1>
        <p class="text-xl opacity-80 mb-12">Découvre les secrets du monde, apprends l'anglais d'Oxford et les maths de Singapour !</p>
        <a href="/dashboard/child_lobby.php" class="inline-block px-12 py-5 bg-orange-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm">Retour au Lobby</a>
    </div>
</body>
</html>
