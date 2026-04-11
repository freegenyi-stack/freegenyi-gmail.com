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

    <div class="w-full max-w-2xl relative z-10 py-4">
        <!-- Logo -->
        <div class="text-center mb-4">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="inline-block relative">
                <span class="text-2xl font-black text-slate-900 tracking-tighter uppercase">FreeGeny</span>
                <span class="absolute -bottom-1 -right-6 text-sm font-bold text-orange-600 font-[Caveat] rotate-3 text-nowrap">free the genius on your child</span>
            </a>
        </div>

        <!-- Register Card -->
        <div class="bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-white auth-card" 
             x-data="{ role: 'parent' }">
            
            <div class="text-center mb-6">
                <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Créer votre compte</h1>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Étape d'inscription</p>
            </div>

            <!-- Role Selector -->
            <div class="grid grid-cols-3 gap-3 mb-6">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'border-orange-600 bg-orange-50 shadow-md' : 'border-slate-50 hover:border-slate-100'" class="border-2 p-4 rounded-[1.5rem] transition-all flex flex-col items-center group">
                    <div :class="role === 'parent' ? 'text-orange-600' : 'text-slate-300 group-hover:text-slate-400'" class="mb-3">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                    </div>
                    <span :class="role === 'parent' ? 'text-orange-600' : 'text-slate-500'" class="text-[10px] font-black uppercase tracking-widest">Parent</span>
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'border-blue-600 bg-blue-50/50 shadow-lg' : 'border-slate-100 hover:border-slate-200'" class="border-2 p-6 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <div :class="role === 'school' ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'" class="mb-3">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 7l9-4 9 4v10H3V7z"/><path d="M9 21V11h6v10"/></svg>
                    </div>
                    <span :class="role === 'school' ? 'text-blue-600' : 'text-slate-500'" class="text-[10px] font-black uppercase tracking-widest">École</span>
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'border-teal-600 bg-teal-50/50 shadow-lg' : 'border-slate-100 hover:border-slate-200'" class="border-2 p-6 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <div :class="role === 'ngo' ? 'text-teal-600' : 'text-slate-300 group-hover:text-slate-400'" class="mb-3">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    </div>
                    <span :class="role === 'ngo' ? 'text-teal-600' : 'text-slate-500'" class="text-[10px] font-black uppercase tracking-widest">ONG</span>
                </button>
            </div>

            <!-- Social Register -->
            <a :href="'/api/auth/google_register.php?role=' + role" class="w-full flex items-center justify-center space-x-4 bg-white border border-slate-100 py-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-sm mb-4">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span class="text-[12px] font-black text-slate-700 tracking-tight uppercase">Continuer avec Google</span>
            </a>

            <div class="relative flex items-center justify-center mb-6">
                <div class="w-full border-t border-slate-100"></div>
                <span class="absolute bg-white px-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">ou par e-mail</span>
            </div>

            <!-- Email Form -->
            <form action="/api/auth/register.php" method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" name="role" :value="role">
                
                <div class="md:col-span-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4" x-text="role === 'parent' ? 'Nom Complet' : 'Nom de l\'organisation'"></label>
                    <input type="text" name="full_name" required placeholder="Ex: Jean Martin" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-6 py-4 rounded-3xl outline-none transition-all text-sm font-medium">
                </div>

                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">E-mail Professionnel</label>
                    <input type="email" name="email" required placeholder="nom@domaine.com" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-6 py-4 rounded-3xl outline-none transition-all text-sm font-medium">
                </div>

                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Mot de passe</label>
                    <input type="password" name="password" required placeholder="••••••••" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-6 py-4 rounded-3xl outline-none transition-all text-sm font-medium">
                </div>

                <div class="md:col-span-2">
                    <button type="submit" class="w-full bg-orange-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-all shadow-[0_20px_50px_rgba(234,88,12,0.2)]">
                        Lancer l'inscription
                    </button>
                </div>
            </form>

            <p class="mt-6 text-center text-sm font-medium text-slate-400 uppercase tracking-tight">
                Déjà inscrit ? 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 font-black hover:underline uppercase text-[12px] ml-2">Se connecter</a>
            </p>
        </div>

        <div class="mt-4 text-center">
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-300 leading-loose mx-auto max-w-sm">
                En créant un compte, vous acceptez notre 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/terms" class="text-slate-400 hover:text-slate-600">Politique de Confidentialité</a> 
                et nos 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/terms" class="text-slate-400 hover:text-slate-600">Conditions d'Utilisation</a>.
            </p>
        </div>
    </div>

</body>
</html>
