<?php
/**
 * auth/register.php - Elite Register Page (Max Compatibility Edition)
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
            background: #f8fafc;
        }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.98); border: 1px solid rgba(255, 255, 255, 1); }
        input { font-size: 0.9rem !important; }
        .anim-container {
            mask-image: linear-gradient(to bottom, black 80%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent);
        }
    </style>
</head>
<body class="h-screen w-full overflow-hidden flex items-center justify-center p-6 relative">

    <div class="absolute inset-0 opacity-50 pointer-events-none">
        <div class="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-50 blur-[150px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 relative z-10">
        
        <!-- Left Side: High-Quality Animation Fallback (GIF Premium) -->
        <div class="hidden lg:block flex-1 max-w-xl text-center">
            <div class="anim-container">
                <!-- Animation Premium de substitution ultra-compatible -->
                <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/29656184209583.5d5542f5615f4.gif" alt="Educational Genius" class="w-full h-auto mx-auto rounded-[3rem] mix-blend-multiply opacity-90 scale-110">
            </div>
            <div class="mt-4">
                <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 leading-none">Libérez leur génie.</h2>
                <p class="text-slate-500 font-light text-xl">Rejoignez l'élite éducative dès aujourd'hui.</p>
            </div>
        </div>

        <!-- Right Side: Form Card -->
        <div class="w-full max-w-lg">
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.06)] p-8 md:p-10 pt-12 md:pt-14 relative" x-data="{ role: 'parent' }">
                
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter leading-none">Free<span class="text-orange-600">Geny</span></span>
                </div>

                <div class="mb-5 mt-2">
                    <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight leading-none mb-1.5">Créer un compte.</h1>
                    <p class="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none">Cockpit d'exception pour génies</p>
                </div>

                <!-- Role Selector -->
                <div class="flex bg-slate-50 p-1 rounded-2xl gap-2 mb-4 border border-slate-100">
                    <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Parent</button>
                    <button @click="role = 'school'" :class="role === 'school' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">École</button>
                    <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'" class="flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">ONG</button>
                </div>

                <!-- Google Register -->
                <a :href="'/api/auth/google_register.php?role=' + role" class="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-3 rounded-2xl hover:border-orange-600 hover:bg-orange-50 transition-all group mb-4">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="Google">
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">Inscription Express</span>
                </a>

                <div class="relative flex items-center justify-center mb-4 text-slate-100">
                    <div class="w-full border-t border-slate-100"></div>
                    <span class="absolute bg-white px-3 text-[8px] font-bold uppercase tracking-widest text-slate-300">ou classiquement</span>
                </div>

                <form action="/api/auth/register.php" method="POST" class="space-y-3.5">
                    <input type="hidden" name="role" :value="role">
                    <div class="grid grid-cols-2 gap-3.5">
                        <div class="col-span-2">
                            <label class="block text-[8px] font-black uppercase tracking-widest text-slate-950 mb-1 px-1" x-text="role === 'parent' ? 'Nom Complet' : 'Nom organisation'"></label>
                            <input type="text" name="full_name" required placeholder="Ex: Jean Martin" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all font-bold leading-none text-slate-950">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[8px] font-black uppercase tracking-widest text-slate-950 mb-1 px-1">E-mail</label>
                            <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all font-bold leading-none text-slate-950">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[8px] font-black uppercase tracking-widest text-slate-950 mb-1 px-1">Téléphone</label>
                            <input type="tel" name="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all font-bold leading-none text-slate-950">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[8px] font-black uppercase tracking-widest text-slate-950 mb-1 px-1">Mot de passe</label>
                            <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-3 rounded-xl outline-none transition-all font-bold leading-none text-slate-950">
                        </div>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                            Créer mon accès génie
                        </button>
                    </div>
                </form>

                <p class="mt-4 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Déjà inscrit ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 hover:underline">Se connecter</a>
                </p>
            </div>
        </div>
    </div>

</body>
</html>
