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
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.07)] border border-white p-8 pt-10 relative" x-data="{ role: 'parent' }">
                
                <!-- Logo flottant (cliquable → accueil) -->
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 whitespace-nowrap hover:shadow-xl transition-shadow">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
                </a>

                <div class="mb-4 mt-2">
                    <h1 class="text-2xl font-black text-slate-950 font-title tracking-tight mb-0.5">Inscription.</h1>
                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Cockpit d'exception pour futurs génies</p>
                </div>

                <!-- Sélecteur de rôle -->
                <div class="flex bg-slate-50 p-1 rounded-2xl gap-2 mb-3 border border-slate-100">
                    <button @click="role = 'parent'" :class="role==='parent' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all">Parent</button>
                    <button @click="role = 'school'" :class="role==='school' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all">École</button>
                    <button @click="role = 'ngo'"    :class="role==='ngo'    ? 'bg-teal-600 text-white shadow-lg'   : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all">ONG</button>
                </div>

                <!-- Bouton Google -->
                <a href="/api/auth/google.php" class="flex items-center justify-center gap-3 w-full border-2 border-slate-100 hover:border-orange-400 bg-white hover:bg-orange-50 text-slate-700 font-bold py-2.5 rounded-2xl transition-all duration-200 shadow-sm mb-3 group">
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <span class="text-[11px] uppercase tracking-widest group-hover:text-orange-600 transition-colors">S'inscrire avec Google</span>
                </a>

                <!-- Séparateur -->
                <div class="flex items-center gap-3 mb-3">
                    <div class="flex-1 h-px bg-slate-100"></div>
                    <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">ou</span>
                    <div class="flex-1 h-px bg-slate-100"></div>
                </div>

                <form action="/api/auth/register.php" method="POST" class="space-y-2">
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
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/terms" class="text-[9px] font-bold text-orange-500 hover:text-orange-700 uppercase tracking-widest transition-colors">Conditions d'utilisation</a>
                    <span class="text-orange-300">·</span>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/privacy" class="text-[9px] font-bold text-orange-500 hover:text-orange-700 uppercase tracking-widest transition-colors">Politique de confidentialité</a>
                    <span class="text-orange-300">·</span>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/cookies" class="text-[9px] font-bold text-orange-500 hover:text-orange-700 uppercase tracking-widest transition-colors">Cookies</a>
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
