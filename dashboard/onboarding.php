<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (RECONSTRUCTED CARD DESIGN)
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
require_once __DIR__ . '/../includes/MailManager.php';

if (empty($_SESSION['logged_in'])) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/auth/login");
    exit;
}

$user_id = $_SESSION['user_id'] ?? 0;
$user = DB::fetchOne("SELECT id, full_name, phone FROM users WHERE id = ?", [$user_id]);

$full_name_raw = ($user && !empty($user['full_name'])) ? $user['full_name'] : ($_SESSION['user_name'] ?? 'Parent');
$parts = explode(' ', trim($full_name_raw));
$first_name = !empty($parts[0]) ? $parts[0] : 'Parent';

$wilayas_dz = [
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Alger', 'c' => '16000'], ['n' => 'Sétif', 'c' => '19000'], ['n' => 'Oran', 'c' => '31000']
];
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue | FreeGeny Onboarding</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #f3f4f6; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .premium-card { background: white; border-radius: 3rem; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.12), 0 30px 60px -30px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,1); }
        .bg-argumentaire { background-color: #0f172a; border-radius: 2.5rem 0 0 2.5rem; }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>

    <div class="w-full max-w-[1200px] h-[750px] premium-card flex overflow-hidden lg:flex-row flex-col" x-data="onboardingApp()">
        
        <!-- LEFT PANEL : ARGUMENTAIRE V1 -->
        <div class="lg:w-[45%] bg-argumentaire text-white p-16 flex flex-col justify-center relative">
            <div x-show="step === 1" class="space-y-6 slide-up">
                <span class="inline-block px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">L'Excellence mondiale</span>
                <h1 class="text-5xl font-title font-black leading-tight tracking-tighter">Votre enfant n'a plus aucune frontière.</h1>
                <div class="grid grid-cols-1 gap-1 text-[11px] font-bold text-slate-500 pt-6 uppercase tracking-[0.1em] leading-relaxed">
                    <p>• Mathématiques de Singapour</p>
                    <p>• Cambridge (UK)</p>
                    <p>• Finnish Model</p>
                    <p>• STEM / STEAM</p>
                    <p>• Montessori</p>
                </div>
            </div>

            <div x-show="step === 2" x-cloak class="space-y-6 slide-up">
                <span class="inline-block px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">Équipe Familiale</span>
                <h1 class="text-5xl font-title font-black leading-tight tracking-tighter">L'éducation est un sport d'équipe.</h1>
            </div>

            <div x-show="step === 3" x-cloak class="space-y-6 slide-up">
                <span class="inline-block px-4 py-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">Le Petit Génie</span>
                <h1 class="text-5xl font-title font-black leading-tight tracking-tighter">Cycle Primaire Exclusivement.</h1>
            </div>

            <!-- DOTS -->
            <div class="absolute bottom-12 left-16 flex gap-3">
                <div class="w-2 h-2 rounded-full transition-all duration-300" :class="step === 1 ? 'bg-orange-500 w-8' : 'bg-slate-700'"></div>
                <div class="w-2 h-2 rounded-full transition-all duration-300" :class="step === 2 ? 'bg-blue-500 w-8' : 'bg-slate-700'"></div>
                <div class="w-2 h-2 rounded-full transition-all duration-300" :class="step === 3 ? 'bg-green-500 w-8' : 'bg-slate-700'"></div>
            </div>
        </div>

        <!-- RIGHT PANEL : FORM -->
        <div class="flex-1 flex flex-col justify-between p-16 bg-white overflow-hidden relative">
            <div class="max-w-md mx-auto w-full h-full flex flex-col justify-center">
                
                <!-- STEP 1 -->
                <div x-show="step === 1" class="space-y-10 slide-up">
                    <div>
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight">Bonjour, <?= htmlspecialchars($first_name) ?>.</h3>
                        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Étape 1 — Votre rôle</p>
                    </div>

                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Maman" class="hidden peer" checked x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-2xl text-center font-bold text-slate-400 peer-checked:border-orange-500 peer-checked:text-orange-600 transition-all uppercase text-[11px] tracking-widest">Maman</div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Papa" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-2xl text-center font-bold text-slate-400 peer-checked:border-orange-500 peer-checked:text-orange-600 transition-all uppercase text-[11px] tracking-widest">Papa</div>
                            </label>
                            <label class="cursor-pointer col-span-2 group">
                                <input type="radio" name="parent_role" value="Tuteur" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-2xl text-center font-bold text-slate-400 peer-checked:border-slate-800 peer-checked:text-slate-900 transition-all uppercase text-[11px] tracking-widest">Tuteur Légal</div>
                            </label>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-300">Numéro de téléphone</label>
                            <input type="tel" name="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-slate-900 outline-none focus:border-black transition-all">
                        </div>
                    </div>

                    <button type="button" @click="step = 2" class="w-full bg-slate-950 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl">Continuer →</button>
                </div>

                <!-- STEP 2 -->
                <div x-show="step === 2" x-cloak class="space-y-8 slide-up">
                    <h3 class="text-4xl font-black font-title">Invitation.</h3>
                    <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Étape 2 — Inviter le conjoint</p>
                    <div class="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <input type="email" placeholder="Email du conjoint..." class="w-full p-4 rounded-xl border-2 border-slate-200 font-bold outline-none focus:border-blue-500">
                    </div>
                    <div class="flex gap-4">
                        <button type="button" @click="step = 1" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px]">←</button>
                        <button type="button" @click="step = 3" class="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Suivant</button>
                    </div>
                </div>

                <!-- STEP 3 -->
                <div x-show="step === 3" x-cloak class="space-y-8 slide-up">
                    <h3 class="text-4xl font-black font-title">L'Enfant.</h3>
                    <div class="space-y-4">
                        <input type="text" placeholder="Prénom de l'enfant" class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                    </div>
                    <div class="flex gap-4">
                        <button type="button" @click="step = 2" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px]">←</button>
                        <button type="button" class="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl">Terminer</button>
                    </div>
                </div>

            </div>

            <!-- FOOTER -->
            <div class="text-center">
                <p class="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em] italic mb-4">
                    Sécurisé et Chiffré par FreeGeny Core
                </p>
            </div>
        </div>
    </div>

    <script>
        function onboardingApp() {
            return {
                step: 1,
                role: 'Maman'
            }
        }
    </script>
</body>
</html>
