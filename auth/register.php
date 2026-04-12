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

    <!-- Background Pattern Subtle -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ea580c\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

    <div class="w-full max-w-6xl h-full md:h-[90vh] glass-card md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-white flex overflow-hidden relative z-10" x-data="{ role: 'parent' }">
        
        <!-- Left Side: Immersive & Lottie -->
        <div class="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-16 relative overflow-hidden">
            <div class="absolute inset-0 opacity-20">
                <div class="absolute top-0 right-0 w-96 h-96 bg-orange-600 blur-[150px] rounded-full"></div>
                <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 blur-[150px] rounded-full"></div>
            </div>
            
            <div class="relative z-10 text-center">
                <lottie-player src="https://lottie.host/7905a5a9-455c-4e8c-8594-e0eb29977598/EBy6FCHM4m.json" background="transparent" speed="1" style="width: 400px; height: 400px;" loop autoplay class="mx-auto"></lottie-player>
                <h2 class="text-4xl font-black text-white font-title tracking-tight mb-4 mt-8">Libérez leur génie.</h2>
                <p class="text-slate-400 font-light text-lg">Rejoignez l'écosystème éducatif de référence.</p>
            </div>
        </div>

        <!-- Right Side: Compact Form -->
        <div class="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto bg-white/50">
            
            <!-- Header/Logo -->
            <div class="flex justify-between items-center mb-8">
                <a href="/" class="flex items-center gap-3 group">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-10 w-auto">
                    <span class="text-xl font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
                </a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors">Déjà inscrit ?</a>
            </div>

            <div class="mb-6">
                <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight mb-2">Créer un compte.</h1>
                <p class="text-slate-500 text-sm font-light leading-relaxed">Prêt pour l'excellence mondiale ?</p>
            </div>

            <!-- Role Tabs (Compact) -->
            <div class="flex bg-slate-100 p-1.5 rounded-2xl gap-2 mb-8">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Parent</button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">École</button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">ONG</button>
            </div>

            <!-- Google Register (Enhanced) -->
            <a :href="'/api/auth/google_register.php?role=' + role" class="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-3.5 rounded-2xl hover:border-orange-600 hover:bg-orange-50 transition-all group mb-8">
                <div class="bg-white p-1 rounded-lg shadow-sm">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12.48 10.92V14.51h6.29c-.21 1.07-.81 1.98-1.63 2.58l3.15 2.44c1.84-1.7 2.92-4.2 2.92-7.21 0-.61-.05-1.21-.15-1.79H12.48z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </div>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Inscription Express</span>
            </a>

            <form action="/api/auth/register.php" method="POST" class="space-y-4">
                <input type="hidden" name="role" :value="role">
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1" x-text="role === 'parent' ? 'Nom Complet' : 'Nom de l\'organisation'"></label>
                        <input type="text" name="full_name" required placeholder="Ex: Jean Martin" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold leading-none">
                    </div>
                    
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">E-mail</label>
                        <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold leading-none">
                    </div>

                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">Téléphone <span class="text-slate-300 font-normal italic">(Optionnel)</span></label>
                        <input type="tel" name="phone" placeholder="+213 ..." class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold leading-none">
                    </div>

                    <div class="col-span-2">
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">Mot de passe</label>
                        <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-xs font-bold leading-none">
                    </div>
                </div>

                <div class="pt-4">
                    <button type="submit" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                        Créer mon accès génie
                    </button>
                </div>
            </form>

            <!-- Footer (Tiny) -->
            <div class="mt-auto pt-8 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <p>&copy; 2024 FreeGeny Elite</p>
                <div class="flex gap-4">
                    <a href="/privacy" class="hover:text-orange-600 transition-colors underline decoration-slate-200 underline-offset-4">Confidentialité</a>
                    <a href="/terms" class="hover:text-orange-600 transition-colors underline decoration-slate-200 underline-offset-4">Conditions</a>
                </div>
            </div>

        </div>
    </div>

</body>
</html>
