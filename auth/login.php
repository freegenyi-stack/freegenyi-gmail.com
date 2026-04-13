<?php
/**
 * auth/login.php - Elite Login Page
 * PRÉREQUIS :
 *   - /assets/js/lottie.min.js
 *   - /assets/animations/connexion.json
 */
require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">

    <!-- LOTTIE LOCAL -->
    <script src="/assets/js/lottie.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255,255,255,0.98); }
        input { font-size: 0.9rem !important; }
        #lottie-box { width: 450px; height: 450px; margin: 0 auto; }
    </style>
</head>
<body class="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden overflow-y-auto">

    <div class="fixed inset-0 pointer-events-none opacity-50">
        <div class="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-100 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-20 relative z-10">

        <!-- Left : Animation Lottie locale -->
        <div class="hidden lg:block flex-1 text-center">
            <div id="lottie-box"></div>
            <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 -mt-4 uppercase">Bon retour.</h2>
            <p class="text-slate-500 text-xl font-light">L'aventure de l'excellence continue.</p>
        </div>

        <!-- Right : Formulaire -->
        <div class="w-full max-w-md mt-6 lg:mt-0">
            <div class="glass-card rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.07)] border border-white p-6 pt-10 sm:p-10 sm:pt-14 relative">

                <!-- Logo flottant (cliquable → accueil) -->
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 bg-white px-6 sm:px-8 py-2 sm:py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-2 sm:gap-3 whitespace-nowrap hover:shadow-xl transition-shadow">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-6 sm:h-8 w-auto">
                    <span class="text-base sm:text-lg font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
                </a>

                <?php if (!empty($_GET['error'])): ?>
                <div class="mt-2 mb-2 bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold px-4 py-3 rounded-2xl leading-relaxed">
                    <?php echo htmlspecialchars(urldecode($_GET['error'])); ?>
                </div>
                <?php elseif (!empty($_GET['info'])): ?>
                <div class="mt-2 mb-2 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold px-4 py-3 rounded-2xl leading-relaxed">
                    <?php echo htmlspecialchars(urldecode($_GET['info'])); ?>
                </div>
                <?php endif; ?>

                <div class="mb-5 sm:mb-8 text-center">
                    <h1 class="text-2xl sm:text-3xl font-black text-slate-950 font-title tracking-tight mb-0.5 sm:mb-1">Se connecter.</h1>
                    <p class="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Accédez à votre cockpit FreeGeny</p>
                </div>

                <!-- Bouton Google -->
                <a href="/api/auth/social.php?provider=google" class="flex items-center justify-center gap-3 w-full border-2 border-slate-100 hover:border-orange-400 bg-white hover:bg-orange-50 text-slate-700 font-bold py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-sm mb-3 group">
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <span class="text-[11px] uppercase tracking-widest group-hover:text-orange-600 transition-colors">Continuer avec Google</span>
                </a>

                <!-- Séparateur -->  
                <div class="flex items-center gap-3 mb-5">
                    <div class="flex-1 h-px bg-slate-100"></div>
                    <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">ou</span>
                    <div class="flex-1 h-px bg-slate-100"></div>
                </div>

                <form action="/api/auth/login.php" method="POST" class="space-y-3 sm:space-y-4">
                    <div>
                        <label class="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 px-1">E-mail</label>
                        <input type="email" name="email" id="email" autocomplete="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl outline-none transition-all font-semibold text-slate-950">
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-1 px-1">
                            <label class="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700">Mot de passe</label>
                            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/forgot-password" class="text-[9px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest">Oublié ?</a>
                        </div>
                        <input type="password" name="password" id="password" autocomplete="current-password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl outline-none transition-all font-semibold text-slate-950">
                    </div>
                    <div class="flex items-center gap-2 px-1 pt-0.5 sm:pt-1">
                        <input type="checkbox" name="remember" id="remember" class="w-4 h-4 accent-orange-600 rounded cursor-pointer">
                        <label for="remember" class="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Se souvenir de moi</label>
                    </div>
                    <div class="pt-1 sm:pt-2">
                        <button type="submit" class="w-full bg-slate-950 text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-xl">
                            Entrer dans le cockpit →
                        </button>
                    </div>
                </form>

                <p class="mt-3 sm:mt-4 text-center text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Pas encore inscrit ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 hover:underline ml-1">S'inscrire</a>
                </p>

                <!-- Liens légaux -->
                <div class="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-slate-100 flex items-center justify-center gap-2 sm:gap-4 flex-wrap pb-2 sm:pb-0">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/terms" class="text-[8px] sm:text-[9px] font-bold text-orange-500 hover:text-orange-700 uppercase tracking-widest transition-colors">Conditions</a>
                    <span class="text-orange-300">·</span>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/privacy" class="text-[8px] sm:text-[9px] font-bold text-orange-500 hover:text-orange-700 uppercase tracking-widest transition-colors">Confidentialité</a>
                    <span class="text-orange-300">·</span>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/cookies" class="text-[8px] sm:text-[9px] font-bold text-orange-500 hover:text-orange-700 uppercase tracking-widest transition-colors">Cookies</a>
                </div>
            </div>
        </div>
    </div>

    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            if (typeof lottie === 'undefined') {
                console.error('lottie.min.js non chargé. Vérifiez que /assets/js/lottie.min.js existe sur le serveur.');
                return;
            }
            lottie.loadAnimation({
                container: document.getElementById('lottie-box'),
                renderer:  'svg',
                loop:      true,
                autoplay:  true,
                path:      '/assets/animations/connexion.json'
            });
        });
    </script>
</body>
</html>
