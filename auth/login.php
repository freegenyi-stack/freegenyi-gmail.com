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
    <style>
        [x-cloak] { display: none !important; }
        body { 
            font-family: 'DM Sans', sans-serif;
            background: radial-gradient(circle at top right, #f8fafc, #f1f5f9, #e2e8f0);
            background-attachment: fixed;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6 relative">

    <!-- Background Decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-orange-200 blur-[150px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-200 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
        <!-- Logo -->
        <div class="text-center mb-10">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="inline-block">
                <span class="text-3xl font-black text-slate-900 tracking-tighter uppercase" style="font-family: 'Plus Jakarta Sans', sans-serif;">FreeGeny</span>
                <span class="block text-lg font-bold text-orange-600 font-caveat mt-1 text-center">free the genius on your child</span>
            </a>
        </div>

        <!-- Login Card -->
        <div class="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-white">
            <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Bon retour.</h1>
            <p class="text-slate-500 font-light text-sm mb-10">Accédez à votre cockpit premium.</p>

            <!-- Google Login (Geist Style) -->
            <a href="/api/auth/google_login.php" class="w-full flex items-center justify-center gap-4 bg-slate-950 text-white py-4 rounded-2xl hover:bg-orange-600 transition-all duration-500 shadow-xl hover:shadow-orange-200 group">
                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                </svg>
                <span class="text-xs font-black uppercase tracking-widest">Continuer avec Google</span>
            </a>

            <div class="relative flex items-center justify-center my-10">
                <div class="w-full border-t border-slate-100"></div>
                <span class="absolute bg-white/0 backdrop-blur-none px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">ou par e-mail</span>
            </div>

            <!-- Form -->
            <form action="/api/auth/login.php" method="POST" class="space-y-6">
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1">E-mail</label>
                    <input type="email" name="email" required placeholder="nom@exemple.com" 
                           class="w-full bg-slate-50/50 border border-slate-100 focus:border-orange-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all text-sm">
                </div>
                <div>
                    <div class="flex items-center justify-between mb-3 px-1">
                        <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500">Mot de passe</label>
                        <a href="#" class="text-[9px] font-black text-orange-600 uppercase tracking-widest">Oublié ?</a>
                    </div>
                    <input type="password" name="password" required placeholder="••••••••" 
                           class="w-full bg-slate-50/50 border border-slate-100 focus:border-orange-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all text-sm">
                </div>

                <button type="submit" class="w-full bg-slate-50 border border-slate-200 text-slate-900 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-white hover:shadow-2xl transition-all">
                    Se connecter
                </button>
            </form>

            <p class="mt-10 text-center text-xs text-slate-400 font-light">
                Pas encore de compte ? 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 font-bold hover:underline ml-1">S'inscrire gratuitement</a>
            </p>
        </div>

        <div class="mt-8 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="/privacy" class="hover:text-slate-900 transition-colors">Confidentialité</a>
            <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
            <a href="/terms" class="hover:text-slate-900 transition-colors">Conditions</a>
            <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
            <a href="/contact" class="hover:text-slate-900 transition-colors">Support</a>
        </div>
    </div>

</body>
</html>
