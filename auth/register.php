<?php
/**
 * auth/register.php - Elite Register Page (ISOLATED IFRAME IMPLEMENTATION)
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
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; overflow-x: hidden; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.98); border: 1px solid rgba(255, 255, 255, 1); }
        input { font-size: 0.9rem !important; }
    </style>
</head>
<body class="min-h-screen w-full flex items-center justify-center p-6 relative">

    <div class="fixed inset-0 opacity-40 pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-100 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 relative z-10">
        
        <!-- Conteneur Animation Gauche (ISOLATED IFRAME) -->
        <div class="hidden lg:block flex-1 text-center">
            <div class="relative w-[500px] h-[500px] mx-auto overflow-hidden rounded-full">
                <!-- Utilisation de l'iframe pour isoler Lottie de tout conflit -->
                <iframe src="/assets/animations/isolated-genius.html" style="width: 100%; height: 100%; border: none; background: transparent;" scrolling="no"></iframe>
            </div>
            <div class="mt-4">
                <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 leading-none uppercase">Libérez leur génie.</h2>
                <p class="text-slate-500 font-light text-xl">L'excellence éducative sans frontières.</p>
            </div>
        </div>

        <!-- Right Side: Form Card -->
        <div class="w-full max-w-lg">
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.06)] p-10 pt-12 relative" x-data="{ role: 'parent' }">
                
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter leading-none">Free<span class="text-orange-600">Geny</span></span>
                </div>

                <div class="mb-6 mt-2">
                    <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight leading-none mb-2">Inscription.</h1>
                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Cockpit d'exception pour futurs génies</p>
                </div>

                <div class="flex bg-slate-50 p-1.5 rounded-2xl gap-2 mb-6 border border-slate-100">
                    <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Parent</button>
                    <button @click="role = 'school'" :class="role === 'school' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">École</button>
                    <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">ONG</button>
                </div>

                <form action="/api/auth/register.php" method="POST" class="space-y-4">
                    <input type="hidden" name="role" :value="role">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">Nom Complet</label>
                            <input type="text" name="full_name" required placeholder="Ex: Jean Martin" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all font-bold text-slate-950">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">E-mail</label>
                            <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all font-bold text-slate-950">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">Téléphone</label>
                            <input type="tel" name="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all font-bold text-slate-950">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">Mot de passe</label>
                        <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all font-bold text-slate-950">
                    </div>
                    <div class="pt-4">
                        <button type="submit" class="w-full bg-slate-950 text-white py-4.5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                            Créer mon accès génie
                        </button>
                    </div>
                </form>

                <p class="mt-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Déjà inscrit ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 hover:underline">Se connecter</a>
                </p>
            </div>
        </div>
    </div>

    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>
