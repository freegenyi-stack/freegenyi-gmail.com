<?php
/**
 * auth/login.php - Elite Login Page
 * PRÉREQUIS :
 *   - /assets/js/lottie.min.js
 *   - /assets/animations/education.json
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
<body class="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">

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
        <div class="w-full max-w-md">
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.07)] border border-white p-10 pt-14 relative">

                <!-- Logo flottant -->
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 whitespace-nowrap">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
                </div>

                <div class="mb-8 text-center">
                    <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight mb-1">Se connecter.</h1>
                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Accédez à votre cockpit FreeGeny</p>
                </div>

                <form action="/api/auth/login.php" method="POST" class="space-y-5">
                    <div>
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-900 mb-1.5 px-1">E-mail</label>
                        <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all font-bold text-slate-950">
                    </div>
                    <div>
                        <div class="flex justify-between mb-1.5 px-1">
                            <label class="text-[9px] font-black uppercase tracking-widest text-slate-900">Mot de passe</label>
                            <a href="/forgot-password" class="text-[8px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest">Oublié ?</a>
                        </div>
                        <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all font-bold text-slate-950">
                    </div>
                    <div class="pt-2">
                        <button type="submit" class="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-xl">
                            Entrer dans le cockpit →
                        </button>
                    </div>
                </form>

                <p class="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Pas encore de compte ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 hover:underline ml-1">S'inscrire</a>
                </p>
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
                path:      '/assets/animations/education.json'
            });
        });
    </script>
</body>
</html>
