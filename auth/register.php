<?php
/**
 * auth/register.php - Elite Register Page (Anti-Scroll Edition)
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
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    <style>
        [x-cloak] { display: none !important; }
        body { 
            font-family: 'DM Sans', sans-serif;
            background: #f8fafc;
        }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.98); border: 1px solid rgba(255, 255, 255, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="h-screen w-full overflow-hidden flex items-center justify-center p-4 relative">

    <!-- Background Decoration Subtle -->
    <div class="absolute inset-0 opacity-40 pointer-events-none">
        <div class="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-100 blur-[120px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-blue-100 blur-[100px] rounded-full"></div>
    </div>

    <div class="w-full max-w-lg relative z-10 flex flex-col items-center">
        
        <!-- Logo Top -->
        <a href="/" class="flex items-center gap-2 mb-6 group hover:scale-105 transition-transform">
            <img src="/assets/img/logo.png" alt="FreeGeny" class="h-10 w-auto">
            <span class="text-xl font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
        </a>

        <!-- Main Card -->
        <div class="w-full glass-card rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] p-8 md:p-10 relative overflow-hidden" x-data="{ role: 'parent' }">
            
            <!-- Floating Animation (Tiny) -->
            <div class="absolute top-4 right-8 w-24 h-24 opacity-80">
                <lottie-player src="https://lottie.host/7905a5a9-455c-4e8c-8594-e0eb29977598/EBy6FCHM4m.json" background="transparent" speed="1" loop autoplay></lottie-player>
            </div>

            <div class="mb-6 relative z-10">
                <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight leading-none mb-2">Créer un compte.</h1>
                <p class="text-slate-400 text-xs font-light">Accédez à l'excellence mondiale.</p>
            </div>

            <!-- Role Selector -->
            <div class="flex bg-slate-50 p-1.5 rounded-2xl gap-2 mb-6 border border-slate-100">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Parent</button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">École</button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">ONG</button>
            </div>

            <!-- Social Auth -->
            <a :href="'/api/auth/google_register.php?role=' + role" class="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-3 rounded-2xl hover:border-orange-600 hover:bg-orange-50 transition-all group mb-6">
                <div class="bg-white p-1 rounded-lg">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </div>
                <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">Inscription Express</span>
            </a>

            <div class="relative flex items-center justify-center mb-6 text-slate-100">
                <div class="w-full border-t border-slate-100"></div>
                <span class="absolute bg-white px-3 text-[8px] font-bold uppercase tracking-widest text-slate-300">ou classiquement</span>
            </div>

            <form action="/api/auth/register.php" method="POST" class="space-y-4">
                <input type="hidden" name="role" :value="role">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-[8px] font-black uppercase tracking-widest text-slate-900 mb-2 px-1" x-text="role === 'parent' ? 'Nom Complet' : 'Nom organisation'"></label>
                        <input type="text" name="full_name" required placeholder="Ex: Jean Martin" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all text-xs font-bold leading-none text-slate-900">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label class="block text-[8px] font-black uppercase tracking-widest text-slate-900 mb-2 px-1">E-mail</label>
                        <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all text-xs font-bold leading-none text-slate-900">
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label class="block text-[8px] font-black uppercase tracking-widest text-slate-900 mb-2 px-1">Téléphone <span class="text-slate-300 font-normal italic">(Opt)</span></label>
                        <input type="tel" name="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all text-xs font-bold leading-none text-slate-900">
                    </div>
                    <div class="col-span-2">
                        <label class="block text-[8px] font-black uppercase tracking-widest text-slate-900 mb-2 px-1">Mot de passe</label>
                        <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all text-xs font-bold leading-none text-slate-900">
                    </div>
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                        Créer mon accès génie
                    </button>
                </div>
            </form>

            <p class="mt-6 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Déjà inscrit ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 hover:underline">Se connecter</a>
            </p>
        </div>

        <!-- Footer Tiny -->
        <div class="mt-6 flex gap-6 text-[8px] font-bold uppercase tracking-widest text-slate-300">
            <a href="/privacy" class="hover:text-slate-900 transition-colors">Confidentialité</a>
            <a href="/terms" class="hover:text-slate-900 transition-colors">Conditions</a>
            <a href="/contact" class="hover:text-slate-900 transition-colors">Support</a>
        </div>

    </div>

</body>
</html>
