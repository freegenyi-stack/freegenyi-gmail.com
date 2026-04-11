<?php
require_once __DIR__ . '/../config/app.php';
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>S'inscrire | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        body { 
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(135deg, #fffcf9 0%, #fff7ed 50%, #ffedd5 100%);
            background-attachment: fixed;
        }
        [x-cloak] { display: none !important; }
        .auth-card { max-height: 85vh; overflow-y: auto; scrollbar-width: none; }
        .auth-card::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">

    <!-- Background Decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div class="absolute top-[10%] right-[10%] w-[35%] h-[35%] bg-orange-200 blur-[100px] rounded-full"></div>
        <div class="absolute bottom-[20%] left-[5%] w-[25%] h-[25%] bg-blue-100 blur-[80px] rounded-full"></div>
    </div>

    <div class="w-full max-w-2xl relative z-10 py-2">
        <!-- Logo -->
        <div class="text-center mb-2">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="inline-block relative scale-90">
                <span class="text-xl font-black text-slate-900 tracking-tighter uppercase">FreeGeny</span>
                <span class="absolute -bottom-1 -right-4 text-[10px] font-bold text-orange-600 font-[Caveat] rotate-3 text-nowrap">free the genius on your child</span>
            </a>
        </div>

        <!-- Register Card -->
        <div class="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-white auth-card" 
             x-data="{ role: 'parent' }">
            
            <div class="text-center mb-6">
                <h1 class="text-2xl font-black text-slate-900 mb-1 tracking-tight">Inscription</h1>
                <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest text-orange-600">Choisissez votre profil</p>
            </div>

            <!-- Compact Role Selector -->
            <div class="flex gap-2 mb-6">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'" class="flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <span class="text-[10px] font-black uppercase tracking-widest">Parent</span>
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'" class="flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 7l9-4 9 4v10H3V7z"/></svg>
                    <span class="text-[10px] font-black uppercase tracking-widest">École</span>
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'" class="flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    <span class="text-[10px] font-black uppercase tracking-widest">ONG</span>
                </button>
            </div>

            <!-- Social Register -->
            <a :href="'/api/auth/google_register.php?role=' + role" class="w-full flex items-center justify-center space-x-4 bg-white border border-slate-100 py-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm mb-6">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                </svg>
                <span class="text-[11px] font-black text-slate-700 tracking-widest uppercase">Inscription Google</span>
            </a>

            <div class="relative flex items-center justify-center mb-6 text-center">
                <div class="w-full border-t border-slate-100"></div>
                <span class="absolute bg-white px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 leading-none">ou par e-mail</span>
            </div>

            <!-- Email Form (Grid) -->
            <form action="/api/auth/register.php" method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" name="role" :value="role">
                
                <div class="md:col-span-2">
                    <input type="text" name="full_name" required :placeholder="role === 'parent' ? 'Nom Complet' : 'Nom organisation'" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all text-[13px] font-medium">
                </div>

                <div>
                    <input type="email" name="email" required placeholder="E-mail" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all text-[13px] font-medium">
                </div>

                <div>
                    <input type="password" name="password" required placeholder="Mot de passe" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all text-[13px] font-medium">
                </div>

                <div class="md:col-span-2 mt-2">
                    <button type="submit" class="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-700 transition-all">
                        Lancer l'inscription
                    </button>
                </div>
            </form>

            <p class="mt-6 text-center text-[13px] font-medium text-slate-400">
                Déjà inscrit ? 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 font-black hover:underline uppercase text-[11px] ml-2">Connexion</a>
            </p>
        </div>

        <div class="mt-4 text-center">
            <p class="text-[8px] font-black uppercase tracking-widest text-slate-300 mx-auto max-w-sm">
                En créant un compte, vous acceptez nos 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/terms" class="hover:text-slate-500">Conditions</a> & 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/privacy" class="hover:text-slate-500">Confidentialité</a>
            </p>
        </div>
    </div>

</body>
</html>
