<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (FINAL POLISHED VERSION)
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
require_once __DIR__ . '/../includes/MailManager.php';

if (empty($_SESSION['logged_in'])) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/auth/login");
    exit;
}

$user_id = $_SESSION['user_id'] ?? 0;
// 1. DÉTECTION PRIORITAIRE : Est-ce un co-parent invité ?
$hasChildrenAsSecondary = DB::fetchOne("SELECT id FROM children WHERE secondary_parent_id = ? LIMIT 1", [$user_id]);

if ($hasChildrenAsSecondary) {
    // Il a déjà un enfant lié, on le propulse au Cockpit direct !
    DB::execute("UPDATE users SET onboarding_step = 4 WHERE id = ?", [$user_id]);
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/dashboard/parent");
    exit;
}

$user = DB::fetchOne("SELECT id, full_name, phone, onboarding_step FROM users WHERE id = ?", [$user_id]);
$full_name_raw = ($user && !empty($user['full_name'])) ? $user['full_name'] : ($_SESSION['user_name'] ?? 'Parent');
$parts = explode(' ', trim($full_name_raw));
$first_name = !empty($parts[0]) ? $parts[0] : 'Parent';
$onboarding_step = $user['onboarding_step'] ?? 1;
$phone_val = $user['phone'] ?? '';

// Liste des Wilayas avec Codes Postaux (Format demandé)
$wilayas_dz = [
    ['n' => 'Alger 16000', 'c' => '16000'],
    ['n' => 'Béjaïa 06000', 'c' => '06000'],
    ['n' => 'Oran 31000', 'c' => '31000'],
    ['n' => 'Sétif 19000', 'c' => '19000'],
    ['n' => 'Constantine 25000', 'c' => '25000'],
    ['n' => 'Blida 09000', 'c' => '09000'],
    ['n' => 'Tizi Ouzou 15000', 'c' => '15000'],
    ['n' => 'Annaba 23000', 'c' => '23000'],
    ['n' => 'Chlef 02000', 'c' => '02000'],
    ['n' => 'Laghouat 03000', 'c' => '03000'],
    ['n' => 'Batna 05000', 'c' => '05000'],
    ['n' => 'Sidi Bel Abbès 22000', 'c' => '22000']
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['child_name'])) {
    $phone = $_POST['phone'] ?? null;
    if ($phone) DB::execute("UPDATE users SET phone = ? WHERE id = ?", [$phone, $user_id]);
    
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email)) MailManager::sendInviteParent($spouse_email, $first_name, $user_id);
    
    $child_name = trim($_POST['child_name'] ?? '');
    if (!empty($child_name)) {
        $age = (int)$_POST['child_age'];
        $lvl = $_POST['child_level'];
        $cnt = $_POST['child_country'];
        $school = $_POST['child_school'] ?? '';
        DB::execute("INSERT INTO children (parent_id, first_name, age, country, grade_level, school_name) VALUES (?, ?, ?, ?, ?, ?)", [$user_id, $child_name, $age, $cnt, $lvl, $school]);
    }
    // Marquage comme terminé (Sync)
    DB::execute("UPDATE users SET onboarding_step = 4 WHERE id = ?", [$user_id]);
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/dashboard/parent");
    exit;
}
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue | FreeGeny Elite</title>
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
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body x-data="onboardingApp()">

    <div class="w-full max-w-[1250px] min-h-[100dvh] lg:h-[720px] premium-card flex flex-col lg:flex-row overflow-hidden md:overflow-visible">
        
        <!-- LEFT PANEL (60%) -->
        <div class="w-full lg:w-[58%] bg-argumentaire text-white p-10 md:p-20 flex flex-col justify-between relative rounded-t-[3.5rem] lg:rounded-t-none lg:rounded-l-[3.5rem]">
            
            <div x-show="step === 1" class="absolute top-10 left-10 slide-up">
                <span class="inline-block px-4 py-2 bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-orange-600/20">L'Excellence mondiale</span>
            </div>
            <div x-show="step === 2" x-cloak class="absolute top-10 left-10 slide-up">
                <span class="inline-block px-4 py-2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-blue-600/20">Équipe Familiale</span>
            </div>
            <div x-show="step === 3" x-cloak class="absolute top-10 left-10 slide-up">
                <span class="inline-block px-4 py-2 bg-green-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-green-600/20">Le petit Génie</span>
            </div>

            <div class="flex-1"></div>

            <div x-show="step === 1" class="space-y-4 slide-up mb-6">
                <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">Votre enfant n'a plus aucune frontière.</h1>
                <div class="grid grid-cols-2 gap-4 text-[12px] font-bold text-slate-500 pt-2 uppercase tracking-[0.1em] leading-relaxed">
                    <div class="space-y-4 text-slate-400">
                        <p>• Mathématiques de Singapour</p>
                        <p>• Cambridge (UK)</p>
                        <p>• Finnish Model</p>
                    </div>
                    <div class="space-y-4 text-slate-400">
                        <p>• STEM / STEAM</p>
                        <p>• Montessori</p>
                    </div>
                </div>
            </div>

            <div x-show="step === 2" x-cloak class="space-y-4 slide-up mb-6">
                <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">L'éducation est un sport d'équipe.</h1>
                <p class="text-slate-500 font-bold text-sm tracking-widest uppercase">Synchronisez vos efforts pour son succès.</p>
            </div>

            <div x-show="step === 3" x-cloak class="space-y-4 slide-up mb-6">
                <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">Cycle Primaire Exclusivement.</h1>
                <p class="text-slate-500 font-bold text-sm tracking-widest uppercase italic">Un accompagnement sur mesure pour ses débuts.</p>
            </div>

            <div class="absolute bottom-12 right-12 flex gap-4">
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 1 ? 'bg-orange-600 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 2 ? 'bg-blue-600 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 3 ? 'bg-green-600 w-12' : 'bg-slate-800 w-4'"></div>
            </div>
        </div>

        <!-- RIGHT PANEL (FORM) -->
        <div class="flex-1 flex flex-col justify-between p-8 md:p-16 bg-white overflow-hidden relative rounded-b-[3.5rem] lg:rounded-b-none lg:rounded-r-[3.5rem]">
            
            <a href="/<?php echo ($country ?? 'DZ') . '-' . ($lang ?? 'fr'); ?>/" class="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap group z-[100] cursor-pointer">
                <img src="/assets/img/logo.png" alt="FreeGeny" class="h-9 w-auto">
                <span class="text-xl font-black text-slate-950 uppercase font-title tracking-tighter hover:text-orange-600 transition-colors">Free<span class="text-orange-600">Geny</span></span>
            </a>

            <div class="max-w-sm mx-auto w-full h-full flex flex-col justify-center">
                
                <!-- STEP 1 -->
                <div x-show="step === 1" class="space-y-12 slide-up pt-10">
                    <div>
                        <h1 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none text-center">Bonjour, <?= htmlspecialchars($first_name) ?>.</h1>
                        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-6 text-center italic">Étape 1 sur 3 — Votre rôle de garant</p>
                    </div>

                    <div class="space-y-8">
                        <div class="grid grid-cols-3 gap-2">
                            <label class="cursor-pointer">
                                <input type="radio" value="Maman" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:bg-slate-950 peer-checked:text-white transition-all uppercase text-[10px] h-14 flex items-center justify-center">Maman</div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" value="Papa" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:bg-slate-950 peer-checked:text-white transition-all uppercase text-[10px] h-14 flex items-center justify-center">Papa</div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" value="Tuteur" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:bg-slate-950 peer-checked:text-white transition-all uppercase text-[10px] h-14 flex items-center justify-center">Tuteur</div>
                            </label>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-300">Numéro de téléphone</label>
                            <input type="tel" x-model="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-slate-950 outline-none">
                        </div>
                    </div>
                    <button type="button" @click="isInvited ? window.location.href='/<?= $country ?>-<?= $lang ?>/dashboard/parent' : saveStep(2)" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-orange-600 transition-all">
                        <span x-text="isInvited ? 'Rejoindre ma famille →' : 'Suivant →'"></span>
                    </button>
                </div>

                <!-- STEP 2 -->
                <div x-show="step === 2" x-cloak class="space-y-12 slide-up pt-10">
                    <div>
                        <h1 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none text-center">Équipe Familiale.</h1>
                        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-6 text-center italic">Étape 2 sur 3 — Inviter le conjoint</p>
                    </div>
                    <div class="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 space-y-6">
                        <p class="text-[13px] text-slate-600 font-bold text-center">Synchronisez vos efforts pour son succès.</p>
                        <input type="email" x-model="spouse_email" placeholder="Email du conjoint (Optionnel)" class="w-full bg-white border-2 border-slate-100 px-4 py-4 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-500">
                    </div>
                    <div class="flex gap-4">
                        <button type="button" @click="saveStep(1)" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px]">←</button>
                        <button type="button" @click="saveStep(3)" class="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-orange-600 transition-all">Étape Suivante</button>
                    </div>
                </div>

                <!-- STEP 3 : LE PETIT GÉNIE (CORRIGÉ) -->
                <form action="" method="POST" x-show="step === 3" x-cloak class="space-y-6 slide-up pt-2">
                    <input type="hidden" name="parent_role" :value="role">
                    <input type="hidden" name="phone" :value="phone">
                    <input type="hidden" name="spouse_email" :value="spouse_email">

                    <div class="text-center">
                        <h3 class="text-3xl font-black font-title text-slate-950 tracking-tight leading-none">Le petit Génie</h3>
                        <p class="text-orange-600 font-bold text-[10px] uppercase tracking-widest mt-3 italic">étape finale : son parcours académique</p>
                    </div>

                    <div class="space-y-4">
                        <div class="space-y-1">
                            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Prénom de l'enfant</label>
                            <input type="text" name="child_name" required placeholder="Son prénom" class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3.5 rounded-xl font-bold text-slate-950 focus:border-green-600 transition-all outline-none">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3">
                            <!-- SÉLECTEUR PAYS DESIGN ACCUEIL -->
                            <div class="space-y-1 relative" x-data="{ open: false }">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Pays</label>
                                <button type="button" @click="open = !open" class="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold text-xs flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <img :src="'https://flagcdn.com/w20/' + childCountry.toLowerCase() + '.png'" class="w-4 h-auto">
                                        <span x-text="childCountry"></span>
                                    </div>
                                    <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.64 15.08L6.46 9.89a.75.75 0 011.06-1.06L12 13.5l4.47-4.47a.75.75 0 111.06 1.06l-5.18 5.18a.75.75 0 01-1.06 1.06z"/></svg>
                                </button>
                                <div x-show="open" @click.away="open = false" class="absolute mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl z-[100] max-h-48 overflow-y-auto custom-scroll">
                                    <input type="hidden" name="child_country" :value="childCountry">
                                    <?php foreach ($supported_regions as $code => $info): ?>
                                    <div @click="childCountry = '<?= $code ?>'; open = false" class="p-2 hover:bg-slate-50 flex items-center gap-3 cursor-pointer">
                                        <img src="https://flagcdn.com/w20/<?= strtolower($code) ?>.png" class="w-4 h-auto">
                                        <span class="text-[10px] font-bold text-slate-700"><?= $info['name'] ?></span>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Niveau</label>
                                <select name="child_level" required class="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold text-xs appearance-none">
                                    <template x-for="lvl in (levels[childCountry] || levels['INT'])" :key="lvl">
                                        <option :value="lvl" x-text="lvl"></option>
                                    </template>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Wilaya / Province</label>
                                <select name="child_region" class="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold text-xs appearance-none">
                                    <template x-if="childCountry === 'DZ'">
                                        <template x-for="w in wilayas" :key="w.c">
                                            <option :value="w.n" x-text="w.n"></option>
                                        </template>
                                    </template>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Âge</label>
                                <input type="number" name="child_age" min="5" max="13" required class="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold text-xs">
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[9px] font-black text-blue-600 uppercase tracking-widest px-1">Établissement scolaire</label>
                            <input type="text" list="schools" name="child_school" placeholder="Rechercher ou saisir l'école..." class="w-full bg-slate-50 border-2 border-blue-100 p-4 rounded-xl font-bold text-xs">
                            <datalist id="schools">
                                <option value="École El Excellence">
                                <option value="Lycée International">
                                <option value="École Montessori">
                                <option value="Établissement Privé Les Génies">
                            </datalist>
                        </div>
                    </div>

                    <div class="flex gap-4 pt-2">
                        <button type="button" @click="saveStep(2)" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] hover:bg-slate-50 transition-all">←</button>
                        <button type="submit" class="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-slate-900 transition-all shadow-green-600/10">Démarrer !</button>
                    </div>
                </form>
            </div>
            <div class="h-8"></div>
        </div>
    </div>

    <script>
        function onboardingApp() {
            return {
                step: <?= (int)($onboarding_step) ?>,
                isInvited: <?= $is_invited ? 'true' : 'false' ?>,
                role: 'Maman',
                phone: '<?= htmlspecialchars($phone_val) ?>',
                spouse_email: '',
                childCountry: '<?= $country ?>',
                wilayas: <?= json_encode($wilayas_dz) ?>,
                levels: {
                    'DZ': ['1AP', '2AP', '3AP', '4AP', '5AP'],
                    'MA': ['1AP', '2AP', '3AP', '4AP', '5AP', '6AP'],
                    'TN': ['1ère Année', '2ème Année', '3ème Année', '4ème Année', '5ème Année', '6ème Année'],
                    'FR': ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
                    'US': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
                    'INT': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
                },

                // Initialisation & Polling (MISSION 1 SYNC)
                init() {
                    console.log("Onboarding sync active...");
                    setInterval(() => {
                        fetch('/api/auth/check_status.php')
                            .then(r => r.json())
                            .then(data => {
                                if (data.verified && data.step && data.step !== this.step) {
                                    console.log("Sync redirection vers étape " + data.step);
                                    this.step = data.step;
                                }
                            });
                    }, 3000);
                },

                // Sauvegarde de l'étape en base de données
                saveStep(newStep) {
                    const formData = new FormData();
                    formData.append('step', newStep);
                    fetch('/api/dashboard/update_onboarding_step.php', {
                        method: 'POST',
                        body: formData
                    });
                    this.step = newStep;
                    
                    // Si Maman invitée et qu'elle a fini l'étape 1, on peut la rediriger ou lui montrer le dashboard
                    if (this.isInvited && newStep === 2) {
                         // On laisse le bouton s'en occuper ou on force ici
                    }
                }
            }
        }
    </script>
</body>
</html>
