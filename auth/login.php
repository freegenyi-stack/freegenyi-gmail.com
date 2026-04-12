<?php
/**
 * auth/login.php - Elite Login Page
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
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        input::placeholder { color: #94a3b8; }
        input { color: #0f172a !important; font-weight: 500 !important; }
    </style>
</head>
<body class="h-screen w-full bg-slate-50 overflow-hidden flex items-center justify-center p-0 md:p-6">

    <div class="w-full max-w-6xl h-full md:h-[90vh] glass-card md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-white flex overflow-hidden relative z-10">
        
        <!-- Left Side: Immersive & Lottie -->
        <div class="hidden lg:flex flex-1 bg-slate-950 items-center justify-center p-16 relative overflow-hidden">
            <div class="absolute inset-0 opacity-20">
                <div class="absolute top-0 right-0 w-96 h-96 bg-blue-600 blur-[150px] rounded-full"></div>
                <div class="absolute bottom-0 left-0 w-96 h-96 bg-orange-600 blur-[150px] rounded-full"></div>
            </div>
            
            <div class="relative z-10 text-center">
                <lottie-player src="https://lottie.host/8046dd4d-3754-47ef-8067-1834958f310f/zL2E1lIeM3.json" background="transparent" speed="1" style="width: 400px; height: 400px;" loop autoplay class="mx-auto"></lottie-player>
                <h2 class="text-4xl font-black text-white font-title tracking-tight mb-4 mt-8">Bon retour.</h2>
                <p class="text-slate-400 font-light text-lg">Poursuivez l'aventure de l'excellence.</p>
            </div>
        </div>

        <!-- Right Side: Compact Form -->
        <div class="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto bg-white/50">
            
            <!-- Header/Logo -->
            <div class="flex justify-between items-center mb-12">
                <a href="/" class="flex items-center gap-3 group">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-10 w-auto">
                    <span class="text-xl font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
                </a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-slate-900 transition-colors underline underline-offset-8 decoration-orange-200">Créer un compte</a>
            </div>

            <div class="mb-10">
                <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight mb-2">Se connecter.</h1>
                <p class="text-slate-500 text-sm font-light leading-relaxed">Accédez à votre cockpit FreeGeny.</p>
            </div>

            <!-- Google Login (Enhanced) -->
            <a href="/api/auth/google_login.php" class="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl hover:border-orange-600 hover:bg-orange-50 transition-all group mb-10">
                <div class="bg-white p-1 rounded-lg shadow-sm">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12.48 10.92V14.51h6.29c-.21 1.07-.81 1.98-1.63 2.58l3.15 2.44c1.84-1.7 2.92-4.2 2.92-7.21 0-.61-.05-1.21-.15-1.79H12.48z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </div>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Continuer avec Google</span>
            </a>

            <div class="relative flex items-center justify-center mb-10 text-slate-200">
                <div class="w-full border-t border-slate-100"></div>
                <span class="absolute bg-white px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">ou via e-mail</span>
            </div>

            <form action="/api/auth/login.php" method="POST" class="space-y-6">
                <div>
                    <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">E-mail</label>
                    <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all text-xs font-bold leading-none">
                </div>
                
                <div>
                    <div class="flex items-center justify-between mb-2 px-1">
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950">Mot de passe</label>
                        <a href="/forgot-password" class="text-[8px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest">Oublié ?</a>
                    </div>
                    <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all text-xs font-bold leading-none">
                </div>

                <div class="pt-4">
                    <button type="submit" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                        Entrer dans le cockpit
                    </button>
                </div>
            </form>

            <!-- Footer (Tiny) -->
            <div class="mt-auto pt-12 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <p>&copy; 2024 FreeGeny Elite</p>
                <div class="flex gap-4 text-slate-400">
                    <a href="/privacy" class="hover:text-slate-900 transition-colors">Confidentialité</a>
                    <a href="/terms" class="hover:text-slate-900 transition-colors">Conditions</a>
                </div>
            </div>

        </div>
    </div>

</body>
</html>
