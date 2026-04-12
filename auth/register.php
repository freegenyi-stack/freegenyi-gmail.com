<?php
/**
 * auth/register.php - Elite Register Page
 * PRÉREQUIS : 
 *   - /assets/js/lottie.min.js   (télécharger depuis cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js)
 *   - /assets/animations/education.json  (télécharger depuis lottie.host)
 */
require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>S'inscrire | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- LOTTIE LOCAL (fichier .js hébergé sur votre serveur) -->
    <script src="/assets/js/lottie.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255,255,255,0.98); }
        input, select { font-size: 0.95rem !important; }
        #lottie-box { width: 500px; height: 500px; margin: 0 auto; }
    </style>
</head>
<body class="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">

    <!-- Background blobs -->
    <div class="fixed inset-0 pointer-events-none opacity-50">
        <div class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-100 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10">
        
        <!-- Left : Animation Lottie locale -->
        <div class="hidden lg:block flex-1 text-center">
            <div id="lottie-box"></div>
            <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 -mt-4 uppercase">Libérez leur génie.</h2>
            <p class="text-slate-500 text-xl font-light">L'aventure de l'excellence commence ici.</p>
        </div>

        <!-- Right : Formulaire -->
        <div class="w-full max-w-lg">
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.07)] border border-white p-10 pt-12 relative" x-data="{ role: 'parent' }">
                
                <!-- Logo flottant (cliquable → accueil) -->
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 whitespace-nowrap hover:shadow-xl transition-shadow">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
                </a>

                <div class="mb-6 mt-2">
                    <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight mb-1">Inscription.</h1>
                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Cockpit d'exception pour futurs génies</p>
                </div>

                <!-- Sélecteur de rôle -->
                <div class="flex bg-slate-50 p-1.5 rounded-2xl gap-2 mb-5 border border-slate-100">
                    <button @click="role = 'parent'" :class="role==='parent' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all">Parent</button>
                    <button @click="role = 'school'" :class="role==='school' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all">École</button>
                    <button @click="role = 'ngo'"    :class="role==='ngo'    ? 'bg-teal-600 text-white shadow-lg'   : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all">ONG</button>
                </div>

                <form action="/api/auth/register.php" method="POST" class="space-y-3">
                    <input type="hidden" name="role" :value="role">
                    <div class="grid grid-cols-2 gap-3">
                        <div class="col-span-2">
                            <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 px-1">Nom Complet</label>
                            <input type="text" name="full_name" required placeholder="Ex: Jean Martin" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-950">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 px-1">E-mail</label>
                            <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-950">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 px-1">Téléphone</label>
                            <input type="tel" name="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-950">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 px-1">Mot de passe</label>
                        <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-950">
                    </div>
                    <div class="pt-2">
                        <button type="submit" class="w-full bg-slate-950 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-xl">
                            Créer mon accès génie →
                        </button>
                    </div>
                </form>

                <p class="mt-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Déjà inscrit ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 hover:underline">Se connecter</a>
                </p>

                <!-- Liens légaux -->
                <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 flex-wrap">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/terms" class="text-[9px] font-bold text-slate-300 hover:text-orange-600 uppercase tracking-widest transition-colors">Conditions d'utilisation</a>
                    <span class="text-slate-200">·</span>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/privacy" class="text-[9px] font-bold text-slate-300 hover:text-orange-600 uppercase tracking-widest transition-colors">Politique de confidentialité</a>
                    <span class="text-slate-200">·</span>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/cookies" class="text-[9px] font-bold text-slate-300 hover:text-orange-600 uppercase tracking-widest transition-colors">Cookies</a>
                </div>
            </div>
        </div>
    </div>

    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <!-- INITIALISATION LOTTIE (fichier JSON local sur votre serveur) -->
    <script>
        // On attend que lottie.min.js soit chargé ET que le DOM soit prêt
        document.addEventListener('DOMContentLoaded', function () {
            if (typeof lottie === 'undefined') {
                console.error('lottie.min.js non chargé. Vérifiez que /assets/js/lottie.min.js existe sur le serveur.');
                return;
            }
            lottie.loadAnimation({
                container: document.getElementById('lottie-box'),
                renderer:  'svg',   // Rendu SVG natif, aucun plugin requis
                loop:      true,
                autoplay:  true,
                path:      '/assets/animations/education.json'  // Fichier JSON local sur VOTRE serveur
            });
        });
    </script>
</body>
</html>
