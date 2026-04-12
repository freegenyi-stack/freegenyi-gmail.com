<?php
/**
 * auth/register.php - Elite Register Page
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
    <style>
        [x-cloak] { display: none !important; }
        body { 
            font-family: 'DM Sans', sans-serif;
            background: radial-gradient(circle at top left, #f8fafc, #f1f5f9, #e2e8f0);
            background-attachment: fixed;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6 relative">

    <!-- Background Decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div class="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-200 blur-[150px] rounded-full"></div>
        <div class="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-blue-200 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-2xl relative z-10">
        <!-- Logo -->
        <div class="text-center mb-10">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="inline-block text-center">
                <span class="text-3xl font-black text-slate-900 tracking-tighter uppercase" style="font-family: 'Plus Jakarta Sans', sans-serif;">FreeGeny</span>
                <span class="block text-lg font-bold text-orange-600 font-caveat mt-1">free the genius on your child</span>
            </a>
        </div>

        <!-- Register Card -->
        <div class="bg-white/80 backdrop-blur-2xl rounded-[3.5rem] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-white" x-data="{ role: 'parent' }">
            
            <div class="text-center mb-12">
                <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Créer un compte.</h1>
                <p class="text-slate-500 font-light">Choisissez votre profil pour commencer l'aventure.</p>
            </div>

            <!-- Role Selector (Elite Style) -->
            <div class="grid grid-cols-3 gap-3 mb-12">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-slate-950 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'" class="py-4 px-4 rounded-2xl transition-all flex flex-col items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/></svg>
                    <span class="text-[9px] font-black uppercase tracking-widest">Parent</span>
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'" class="py-4 px-4 rounded-2xl transition-all flex flex-col items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.58 2.387a.75.75 0 01.84 0l8.25 5.25a.75.75 0 010 1.252l-8.25 5.25a.75.75 0 01-.84 0l-8.25-5.25a.75.75 0 010-1.252l8.25-5.25zM22 11.75a.75.75 0 00-.75-.75H2.75a.75.75 0 000 1.5h18.5a.75.75 0 00.75-.75zM2.75 14.75a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75zM2.75 18.5a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75z"/></svg>
                    <span class="text-[9px] font-black uppercase tracking-widest">École</span>
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-teal-600 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'" class="py-4 px-4 rounded-2xl transition-all flex flex-col items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.716 3.99 1.933A5.485 5.485 0 0115 3c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>
                    <span class="text-[9px] font-black uppercase tracking-widest">ONG</span>
                </button>
            </div>

            <!-- Google Register -->
            <a :href="'/api/auth/google_register.php?role=' + role" class="w-full flex items-center justify-center gap-4 bg-white border border-slate-100 py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-sm mb-10 group">
                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                </svg>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-700">Inscription Express</span>
            </a>

            <div class="relative flex items-center justify-center mb-10">
                <div class="w-full border-t border-slate-100"></div>
                <span class="absolute bg-white/0 px-4 text-[9px] font-black uppercase tracking-[0.25em] text-slate-300">ou classiquement</span>
            </div>

            <!-- Email Form -->
            <form action="/api/auth/register.php" method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="hidden" name="role" :value="role">
                <div class="md:col-span-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1" x-text="role === 'parent' ? 'Nom Complet' : 'Nom de l\'organisation'"></label>
                    <input type="text" name="full_name" required placeholder="Ex: Jean Martin" class="w-full bg-slate-50/50 border border-slate-100 focus:border-orange-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium">
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1">E-mail</label>
                    <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50/50 border border-slate-100 focus:border-orange-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium">
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-1">Mot de passe</label>
                    <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50/50 border border-slate-100 focus:border-orange-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all text-sm font-medium">
                </div>
                <div class="md:col-span-2 mt-4 text-center">
                    <button type="submit" class="w-full bg-slate-950 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-200">
                        Créer mon cockpit
                    </button>
                    <p class="mt-8 text-xs text-slate-400 font-light">
                        Déjà inscrit ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 font-bold hover:underline ml-1">Connectez-vous</a>
                    </p>
                </div>
            </form>
        </div>

        <div class="mt-10 flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-60">
            <a href="/privacy" class="hover:text-slate-900 transition-colors">Confidentialité</a>
            <span class="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
            <a href="/terms" class="hover:text-slate-900 transition-colors">Conditions</a>
            <span class="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
            <a href="/contact" class="hover:text-slate-900 transition-colors">Support Technique</a>
        </div>
    </div>

</body>
</html>
