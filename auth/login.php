<?php
require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        body { 
            font-family: 'Outfit', sans-serif;
            background: radial-gradient(circle at top right, #f8fafc, #f1f5f9, #e2e8f0);
            background-attachment: fixed;
        }
        [x-cloak] { display: none !important; }
        .auth-card { max-height: 95vh; overflow-y: auto; scrollbar-width: none; }
        .auth-card::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">

    <!-- Background Decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-200 blur-[120px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-blue-200 blur-[100px] rounded-full"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
        <!-- Logo -->
        <div class="text-center mb-6">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="inline-block relative">
                <span class="text-2xl font-black text-slate-900 tracking-tighter uppercase">FreeGeny</span>
                <span class="absolute -bottom-1 -right-6 text-sm font-bold text-orange-600 font-[Caveat] rotate-3 text-nowrap">free the genius on your child</span>
            </a>
        </div>

        <!-- Login Card -->
        <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-white auth-card">
            <h1 class="text-2xl font-black text-slate-900 mb-1 tracking-tight">Bon retour !</h1>
            <p class="text-slate-400 text-[13px] font-medium mb-8 uppercase tracking-wider">Connexion sécurisée</p>

            <!-- Google Login -->
            <a href="/api/auth/google_login.php" class="w-full flex items-center justify-center space-x-4 bg-white border border-slate-100 py-3.5 rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-sm mb-6">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span class="text-sm font-bold text-slate-700 tracking-tight">Continuer avec Google</span>
            </a>

            <div class="relative flex items-center justify-center mb-8">
                <div class="w-full border-t border-slate-100"></div>
                <span class="absolute bg-white px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">ou par e-mail</span>
            </div>

            <!-- Form -->
            <form action="/api/auth/login.php" method="POST" class="space-y-5">
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">E-mail</label>
                    <input type="email" name="email" required placeholder="nom@exemple.com" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium">
                </div>
                <div>
                    <div class="flex items-center justify-between mb-2 px-4">
                        <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe</label>
                        <a href="#" class="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">Oublié ?</a>
                    </div>
                    <input type="password" name="password" required placeholder="••••••••" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium">
                </div>

                <button type="submit" class="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-all shadow-[0_20px_50px_rgba(234,88,12,0.2)]">
                    Se connecter
                </button>
            </form>

            <p class="mt-8 text-center text-sm font-medium text-slate-400">
                Pas encore de compte ? 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 font-black hover:underline uppercase text-[12px] ml-2">S'inscrire</a>
            </p>
        </div>

        <div class="mt-6 flex items-center justify-center space-x-6 text-[9px] font-black uppercase tracking-widest text-slate-300">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/privacy" class="hover:text-slate-500 transition-colors">Confidentialité</a>
            <span>•</span>
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/terms" class="hover:text-slate-500 transition-colors">Conditions</a>
            <span>•</span>
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/contact" class="hover:text-slate-500 transition-colors">Support</a>
        </div>
    </div>

</body>
</html>
