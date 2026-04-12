<?php
/**
 * auth/register.php - Elite Register Page (ROBUST JS IMPLEMENTATION)
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
    
    <!-- Lottie-web (Plus robuste que le player component) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; overflow-x: hidden; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.98); border: 1px solid rgba(255, 255, 255, 1); }
        input { font-size: 0.9rem !important; }
        #lottie-animation { width: 100%; height: 100%; max-width: 500px; max-height: 500px; margin: 0 auto; }
    </style>
</head>
<body class="min-h-screen w-full flex items-center justify-center p-6 relative">

    <!-- Background Shapes -->
    <div class="fixed inset-0 opacity-40 pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-100 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 relative z-10">
        
        <!-- Left Side -->
        <div class="hidden lg:block flex-1 text-center">
            <div id="lottie-animation"></div>
            <div class="mt-4">
                <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 leading-none uppercase">Libérez leur génie.</h2>
                <p class="text-slate-500 font-light text-xl">L'excellence éducative sans frontières.</p>
            </div>
        </div>

        <!-- Right Side -->
        <div class="w-full max-w-lg">
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.06)] p-10 pt-12 relative" x-data="{ role: 'parent' }">
                
                <!-- Logo -->
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter leading-none">Free<span class="text-orange-600">Geny</span></span>
                </div>

                <div class="mb-6 mt-2">
                    <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight leading-none mb-2">Inscription.</h1>
                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none tracking-widest">Le futur commence ici</p>
                </div>

                <!-- Role Selector -->
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

    <!-- Scripts -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Animation JSON (Elite Pulse)
            const animData = {"v":"5.5.7","fr":60,"ip":0,"op":180,"w":500,"h":500,"nm":"ElitePulse","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Shape","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[50]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":90,"s":[100]},{"t":180,"s":[50]}]},"r":{"a":0,"k":0},"p":{"a":0,"k":[250,250,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[100,100,100]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":90,"s":[115,115,100]},{"t":180,"s":[100,100,100]}]}},"shapes":[{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[250,250]},"p":{"a":0,"k":[0,0]},"nm":"Ellipse"},{"ty":"fl","c":{"a":0,"k":[0.93,0.4,0.1,1]},"o":{"a":0,"k":15},"nm":"Fill"},{"ty":"st","c":{"a":0,"k":[0.93,0.4,0.1,1]},"o":{"a":0,"k":50},"w":{"a":0,"k":2},"nm":"Stroke"},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"nm":"Transform"}]}]} ]};
            
            try {
                lottie.loadAnimation({
                    container: document.getElementById('lottie-animation'),
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: animData
                });
            } catch (e) {
                console.error("Lottie Error:", e);
                // Fallback visuel simple si Lottie échoue vraiment (un cercle CSS)
                document.getElementById('lottie-animation').innerHTML = '<div class="w-64 h-64 bg-orange-100 rounded-full mx-auto animate-pulse flex items-center justify-center"><i class="fas fa-rocket text-orange-600 text-6xl"></i></div>';
            }
        });
    </script>
</body>
</html>
