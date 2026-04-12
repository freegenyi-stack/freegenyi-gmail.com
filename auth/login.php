<?php
/**
 * auth/login.php - Elite Login Page (DATA-URI LOTTIE)
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
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Lecteur Lottie Standard -->
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.98); border: 1px solid rgba(255, 255, 255, 1); }
        input { font-size: 0.9rem !important; }
    </style>
</head>
<body class="h-screen w-full overflow-hidden flex items-center justify-center p-6 relative">

    <div class="absolute inset-0 opacity-50 pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-50 blur-[150px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-50 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        
        <!-- Conteneur Animation Gauche -->
        <div class="hidden lg:block flex-1 max-w-md text-center">
            <div class="relative w-[450px] h-[450px] mx-auto">
                <!-- ANIMATION ENCODÉE (DATA URI) : AUCUN APPEL RÉSEAU -->
                <lottie-player 
                    src='data:application/json;base64,eyJ2IjoiNS41LjciLCJmciI6NjAsImlwIjowLCJvcCI6MTgwLCJ3Ijo1MDAsImgiOjUwMCwib m0iOiJFbGl0ZSBQdWxzZSIsImRkZCI6MCwiYXNzZXRzIjpbXSwibGF5ZXJzIjpbeyJkZG QiOjAsImluZCI6MSwidHkiOjQsIm5tIjoiQ2lyY2xlIiwic3IiOjEsImtzIjp7Im8iOnsi YSI6MCwibSI6MTAwfSwiciI6eyJhIjowLCJrIjowfSwicCI6eyJhIjowLCJrIjpbMjUwLD I1MCwwXX0sImEiOnsiYSI6MCwibSI6WzAsMCwwXX0sInMiOnsiYSI6MSwibSI6W3siaI ieIjpbMC42NjcsMC42NjcsMC42NjcsMC42NjddLCJ5IjpbMSwxLDEsMV19LCJvIjp7Ing iOlswLjMzMywwLjMzMywwLjMzMywwLjMzM10sInkiOlswLDAsMCwwXX0sInQiOjAsInMi Ols4MCw4MCwxMDBdfSx7InQiOjkwLCJzIjpbMTQwLDE0MCwxMDBdfSx7InQiOjE4MCwic yI6WzgwLDgwLDEwMF19XX19LCJzaGFwZXMiOlt7InR5IjoiZ3IiLCJpdCI6W3siZCI6MS widHkiOiJlbCIsInMiOnsiYSI6MCwibSI6WzMwMCwzMDBdfSwicCI6eyJhIjowLCJrIjp bMCwwXX0sIm5tIjoiQm9keSJ9LHsidHkiOiJmbCIsImMiOnsiYSI6MCwibSI6WzAuOTMs MC40LDAuMSwxXX0sIm8iOnsiYSI6MCwibSI6MTAwfSwibm0iOiJGaWxsIn0seyJ0eSI6I nRyIiwicCI6eyJhIjowLCJrIjpbMCwwXX0sImEiOnsiYSI6MCwibSI6WzAsMF19LCJzIj p7ImFfIjowLCJrIjpbMTAwLDEwMF19LCJyIjp7ImEiOjAsInZhbHVlIjp0cnVlfSwibyI OnsiYSI6MCwibSI6MTBwfSwibm0iOiJUcmFuc2Zvcm0ifV0sIm5tIjoiR3JvdXAiLCJu cCI6Mn1dfV19' 
                    background="transparent" 
                    speed="1" 
                    style="width: 450px; height: 450px;" 
                    loop 
                    autoplay>
                </lottie-player>
            </div>
            <div class="mt-[-20px]">
                <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 leading-none">Bon retour.</h2>
                <p class="text-slate-500 font-light text-xl">L'aventure de l'excellence continue.</p>
            </div>
        </div>

        <!-- Right Side: Form Card -->
        <div class="w-full max-w-md">
            <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.06)] p-10 pt-12 md:pt-14 relative" x-data="{}">
                
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 text-center">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                    <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter leading-none">Free<span class="text-orange-600">Geny</span></span>
                </div>

                <div class="mb-8 mt-2 text-center">
                    <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight leading-none mb-2">Se connecter.</h1>
                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Accédez à votre cockpit FreeGeny</p>
                </div>

                <form action="/api/auth/login.php" method="POST" class="space-y-6">
                    <div>
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950 mb-2 px-1">E-mail</label>
                        <input type="email" name="email" required placeholder="nom@exemple.com" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all font-bold text-slate-950">
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-2 px-1">
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-950">Mot de passe</label>
                            <a href="/forgot-password" class="text-[8px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest">Oublié ?</a>
                        </div>
                        <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-5 py-4 rounded-xl outline-none transition-all font-bold text-slate-950">
                    </div>
                    <div class="pt-2">
                        <button type="submit" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                            Entrer dans le cockpit
                        </button>
                    </div>
                </form>

                <p class="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Pas encore de compte ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 hover:underline ml-1">S'inscrire</a>
                </p>
            </div>
        </div>
    </div>

    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>
