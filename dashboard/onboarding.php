<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (STRUCTURAL REFINEMENT V2)
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
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Onboarding | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #fdfdfd; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; margin: 0; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .premium-card { background: white; border-radius: 3.5rem; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.03); position: relative; }
        .bg-argumentaire { background-color: #0d1117; border-radius: 3rem 0 0 3rem; overflow: hidden; }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>

    <div class="w-full max-w-[1250px] h-[720px] premium-card flex overflow-visible lg:flex-row flex-col" x-data="onboardingApp()">
        
        <!-- LEFT PANEL (60% WIDE) : CONTENT TOP & BOTTOM -->
        <div class="lg:w-[58%] bg-argumentaire text-white p-20 flex flex-col justify-between relative">
            
            <!-- HEADER : L'Excellence Mondiale (Orange) -->
            <div x-show="step === 1" class="absolute top-10 left-10 slide-up">
                <span class="inline-block px-4 py-2 bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-orange-600/20">L'Excellence mondiale</span>
            </div>

            <!-- MIDDLE AREA : VOID FOR PHOTO -->
            <div class="flex-1"></div>

            <!-- FOOTER : Arguments RESSERRÉS -->
            <div x-show="step === 1" class="space-y-4 slide-up mb-6">
                <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">Votre enfant n'a plus aucune frontière.</h1>
                <div class="grid grid-cols-2 gap-4 text-[12px] font-bold text-slate-500 pt-2 uppercase tracking-[0.1em] leading-relaxed">
                    <div class="space-y-4">
                        <p>• Mathématiques de Singapour</p>
                        <p>• Cambridge (UK)</p>
                        <p>• Finnish Model</p>
                    </div>
                    <div class="space-y-4">
                        <p>• STEM / STEAM</p>
                        <p>• Montessori</p>
                    </div>
                </div>
            </div>

            <!-- FOOTER : Step 2 Arguments -->
            <div x-show="step === 2" x-cloak class="space-y-4 slide-up mb-6">
                <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">L'éducation est un sport d'équipe.</h1>
                <p class="text-slate-500 font-bold text-sm tracking-widest uppercase">Synchronisez vos efforts pour son succès.</p>
            </div>

            <!-- DOTS INDICATORS (Tout à fait à droite comme demandé) -->
            <div class="absolute bottom-12 right-12 flex gap-4">
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 1 ? 'bg-orange-600 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 2 ? 'bg-blue-500 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 3 ? 'bg-green-500 w-12' : 'bg-slate-800 w-4'"></div>
            </div>
        </div>

        <!-- RIGHT PANEL (FORM) -->
        <div class="flex-1 flex flex-col justify-between p-16 bg-white overflow-hidden relative rounded-r-[3.5rem]">
            
            <!-- LOGO CENTERED -->
            <a href="/<?= $country ?>-<?= $lang ?>/" class="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap group">
                <img src="/assets/img/logo.png" alt="FreeGeny" class="h-9 w-auto">
                <span class="text-xl font-black text-slate-950 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
            </a>

            <div class="max-w-sm mx-auto w-full h-full flex flex-col justify-center">
                
                <!-- STEP 1 -->
                <div x-show="step === 1" class="space-y-12 slide-up pt-10">
                    <div>
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none text-center">Bonjour, <?= htmlspecialchars($first_name) ?>.</h3>
                        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-6 text-center italic">Étape 1 sur 3 — Votre rôle de garant</p>
                    </div>

                    <div class="space-y-8">
                        <div class="grid grid-cols-3 gap-2">
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Maman" class="hidden peer" checked x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:border-slate-950 peer-checked:text-white peer-checked:bg-slate-950 transition-all uppercase text-[10px] tracking-tighter leading-none flex items-center justify-center h-16">Maman</div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Papa" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:border-slate-950 peer-checked:text-white peer-checked:bg-slate-950 transition-all uppercase text-[10px] tracking-tighter leading-none flex items-center justify-center h-16">Papa</div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Tuteur" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:border-slate-950 peer-checked:text-white peer-checked:bg-slate-950 transition-all uppercase text-[10px] tracking-tighter leading-none flex items-center justify-center h-16">Tuteur Légal</div>
                            </label>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Numéro de téléphone</label>
                            <input type="tel" name="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-slate-900 outline-none focus:border-black transition-all">
                        </div>
                    </div>

                    <button type="button" @click="step = 2" class="w-full bg-slate-950 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl shadow-slate-950/10">Suivant →</button>
                </div>

                <!-- STEP 2 : INVITATION -->
                <div x-show="step === 2" x-cloak class="space-y-12 slide-up pt-10">
                    <div>
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none text-center">Équipe Familiale.</h3>
                        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-6 text-center italic">Étape 2 sur 3 — Inviter le conjoint</p>
                    </div>

                    <div class="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 space-y-6">
                        <p class="text-[13px] text-slate-600 leading-relaxed font-bold text-center">
                            Permettez à votre conjoint d'avoir son propre accès pour suivre l'évolution en temps réel.
                        </p>
                        <input type="email" name="spouse_email" placeholder="Email du conjoint (Optionnel)" class="w-full bg-white border-2 border-slate-200 px-4 py-4 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-500 transition-all shadow-sm">
                    </div>

                    <div class="flex gap-4">
                        <button type="button" @click="step = 1" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">←</button>
                        <button type="button" @click="step = 3" class="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl">Étape Suivante</button>
                    </div>
                </div>

                <!-- STEP 3 -->
                <div x-show="step === 3" x-cloak class="slide-up">
                    <h3 class="text-3xl font-black font-title">Finalisation.</h3>
                    <button type="button" @click="step = 3" class="mt-8 bg-black text-white px-8 py-3 rounded-lg">Terminer</button>
                </div>

            </div>

            <!-- FOOTER -->
            <div class="text-center">
                <p class="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em] italic mb-2">
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
