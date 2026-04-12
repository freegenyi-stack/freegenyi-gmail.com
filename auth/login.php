<?php
/**
 * auth/login.php - Elite Login Page (Ultimate Animation Fix)
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
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <style>
        [x-cloak] { display: none !important; }
        body { 
            font-family: 'DM Sans', sans-serif;
            background: #f8fafc;
        }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.98); border: 1px solid rgba(255, 255, 255, 1); }
        input { font-size: 0.9rem !important; }
    </style>
</head>
<body class="h-screen w-full overflow-hidden flex items-center justify-center p-6 relative">

    <!-- Subtle Background BG -->
    <div class="absolute inset-0 opacity-50 pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-50 blur-[150px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-50 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        
        <!-- Conteneur Animation Gauche -->
        <div class="hidden lg:block flex-1 max-w-md text-center">
            <div class="relative w-[450px] h-[450px] mx-auto opacity-90">
                <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script> 
                <dotlottie-player src="https://lottie.host/8046dd4d-3754-47ef-8067-1834958f310f/zL2E1lIeM3.json" background="transparent" speed="1" style="width: 450px; height: 450px;" loop autoplay></dotlottie-player>
            </div>
            <div class="mt-[-20px]">
                <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 leading-none">Bon retour.</h2>
                <p class="text-slate-500 font-light text-xl">L'aventure de l'excellence continue.</p>
            </div>
        </div>

        <!-- Right Side: Form Card -->
        <div class="w-full max-w-md">
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.06)] p-10 pt-12 md:pt-14 relative">
                
                <!-- Logo Incrusté -->
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 text-center">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter leading-none">Free<span class="text-orange-600">Geny</span></span>
                </div>

                <div class="mb-8 mt-2 text-center">
                    <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight leading-none mb-2">Se connecter.</h1>
                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Accédez à votre cockpit FreeGeny</p>
                </div>

                <a href="/api/auth/google_login.php" class="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl hover:border-orange-600 hover:bg-orange-50 transition-all group mb-8 shadow-sm">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="Google">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Continuer avec Google</span>
                </a>

                <div class="relative flex items-center justify-center mb-8 text-slate-100">
                    <div class="w-full border-t border-slate-100"></div>
                    <span class="absolute bg-white px-3 text-[8px] font-bold uppercase tracking-widest text-slate-300">ou par e-mail</span>
                </div>

                <form action="/api/auth/login.php" method="POST" class="space-y-6">
                    <div>
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">E-mail</label>
                        <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all font-bold leading-none text-slate-900">
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-2 px-1">
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950">Mot de passe</label>
                            <a href="/forgot-password" class="text-[8px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest">Oublié ?</a>
                        </div>
                        <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all font-bold leading-none text-slate-900">
                    </div>
                    <div class="pt-2">
                        <button type="submit" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                            Entrer dans le cockpit
                        </button>
                    </div>
                </form>

                <p class="mt-8 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Pas encore de compte ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 hover:underline ml-1">S'inscrire</a>
                </p>
            </div>
        </div>
    </div>

    <!-- Scripts at the end -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

</body>
</html>
