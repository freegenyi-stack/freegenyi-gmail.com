<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (FINAL V1 POLISHED)
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
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Oum El Bouaghi', 'c' => '04000'],
    ['n' => 'Batna', 'c' => '05000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Biskra', 'c' => '07000'], ['n' => 'Béchar', 'c' => '08000'],
    ['n' => 'Blida', 'c' => '09000'], ['n' => 'Bouira', 'c' => '10000'], ['n' => 'Alger', 'c' => '16000'], ['n' => 'Sétif', 'c' => '19000'], ['n' => 'Oran', 'c' => '31000'], ['n' => 'Constantine', 'c' => '25000']
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
        DB::execute("INSERT INTO children (parent_id, name, age, country, grade) VALUES (?, ?, ?, ?, ?)", [$user_id, $child_name, $age, $cnt, $lvl]);
    }
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/dashboard/parent");
    exit;
}
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
        body { font-family: 'DM Sans', sans-serif; background: #fdfdfd; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; margin: 0; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .premium-card { background: white; border-radius: 3.5rem; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.03); position: relative; }
        .bg-argumentaire { background-color: #0d1117; border-radius: 3rem 0 0 3rem; overflow: hidden; }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body x-data="onboardingApp()">

    <div class="w-full max-w-[1250px] h-[720px] premium-card flex overflow-visible lg:flex-row flex-col">
        
        <!-- LEFT PANEL (60% WIDE) -->
        <div class="lg:w-[58%] bg-argumentaire text-white p-20 flex flex-col justify-between relative">
            
            <!-- HEADER : Step 1 -->
            <div x-show="step === 1" class="absolute top-10 left-10 slide-up">
                <span class="inline-block px-4 py-2 bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-orange-600/20">L'Excellence mondiale</span>
            </div>

            <!-- HEADER : Step 2 -->
            <div x-show="step === 2" x-cloak class="absolute top-10 left-10 slide-up">
                <span class="inline-block px-4 py-2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-blue-600/20">Équipe Familiale</span>
            </div>

            <!-- HEADER : Step 3 -->
            <div x-show="step === 3" x-cloak class="absolute top-10 left-10 slide-up">
                <span class="inline-block px-4 py-2 bg-green-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg shadow-green-600/20">Le Petit Génie</span>
            </div>

            <div class="flex-1"></div>

            <!-- FOOTER ARGUMENTS -->
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
                <p class="text-slate-500 font-bold text-sm tracking-widest uppercase">Un accompagnement sur mesure pour ses débuts.</p>
            </div>

            <!-- DOTS -->
            <div class="absolute bottom-12 right-12 flex gap-4">
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 1 ? 'bg-orange-600 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 2 ? 'bg-blue-500 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 3 ? 'bg-green-500 w-12' : 'bg-slate-800 w-4'"></div>
            </div>
        </div>

        <!-- RIGHT PANEL (FORM) -->
        <div class="flex-1 flex flex-col justify-between p-16 bg-white overflow-hidden relative rounded-r-[3.5rem]">
            
            <a href="/<?= $country ?>-<?= $lang ?>/" class="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap group">
                <img src="/assets/img/logo.png" alt="FreeGeny" class="h-9 w-auto">
                <span class="text-xl font-black text-slate-950 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
            </a>

            <div class="max-w-sm mx-auto w-full h-full flex flex-col justify-center">
                
                <!-- STEP 1 : ROLE -->
                <div x-show="step === 1" class="space-y-12 slide-up pt-10">
                    <div>
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none text-center">Bonjour, <?= htmlspecialchars($first_name) ?>.</h3>
                        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-6 text-center italic">Étape 1 sur 3 — Votre rôle de garant</p>
                    </div>

                    <div class="space-y-8">
                        <div class="grid grid-cols-3 gap-2">
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Maman" class="hidden peer" checked x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:border-slate-950 peer-checked:text-white peer-checked:bg-slate-950 transition-all uppercase text-[10px] tracking-tighter leading-none flex items-center justify-center h-14">Maman</div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Papa" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:border-slate-950 peer-checked:text-white peer-checked:bg-slate-950 transition-all uppercase text-[10px] tracking-tighter leading-none flex items-center justify-center h-14">Papa</div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Tuteur" class="hidden peer" x-model="role">
                                <div class="py-4 border-2 border-slate-100 rounded-xl text-center font-bold text-slate-400 peer-checked:border-slate-950 peer-checked:text-white peer-checked:bg-slate-950 transition-all uppercase text-[10px] tracking-tighter leading-none flex items-center justify-center h-14">Tuteur Légal</div>
                            </label>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Numéro de téléphone</label>
                            <input type="tel" name="phone" x-model="phone" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-slate-900 outline-none focus:border-black transition-all">
                        </div>
                    </div>

                    <button type="button" @click="step = 2" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl">Suivant →</button>
                </div>

                <!-- STEP 2 : INVITATION -->
                <div x-show="step === 2" x-cloak class="space-y-12 slide-up pt-10">
                    <div>
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none text-center">Équipe Familiale.</h3>
                        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-6 text-center italic">Étape 2 sur 3 — Inviter le conjoint</p>
                    </div>

                    <div class="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 space-y-6">
                        <p class="text-[13px] text-slate-600 leading-relaxed font-bold text-center">Synchronisez vos efforts pour son succès.</p>
                        <input type="email" name="spouse_email" x-model="spouse_email" placeholder="Email du conjoint (Optionnel)" class="w-full bg-white border-2 border-slate-200 px-4 py-4 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-500 transition-all shadow-sm">
                    </div>

                    <div class="flex gap-4">
                        <button type="button" @click="step = 1" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">←</button>
                        <button type="button" @click="step = 3" class="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl">Étape Suivante</button>
                    </div>
                </div>

                <!-- STEP 3 : L'ENFANT -->
                <form action="" method="POST" x-show="step === 3" x-cloak class="space-y-6 slide-up pt-2">
                    <input type="hidden" name="parent_role" :value="role">
                    <input type="hidden" name="phone" :value="phone">
                    <input type="hidden" name="spouse_email" :value="spouse_email">

                    <div class="text-center">
                        <h3 class="text-3xl font-black font-title text-slate-950 tracking-tight leading-none">L'Enfant.</h3>
                        <p class="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-3 italic">Étape finale : Son parcours académique</p>
                    </div>

                    <div class="space-y-4">
                        <div class="space-y-1">
                            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Prénom de l'héros</label>
                            <input type="text" name="child_name" required placeholder="Son prénom" class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-xl font-bold text-slate-950 focus:border-green-600 transition-all outline-none">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Pays</label>
                                <div class="relative">
                                    <select x-model="childCountry" name="child_country" class="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold text-xs appearance-none">
                                        <?php foreach ($supported_regions as $code => $info): ?>
                                            <option value="<?= $code ?>"><?= $info['name'] ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                    <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <img :src="'https://flagcdn.com/w20/' + childCountry.toLowerCase() + '.png'" class="w-4 h-auto">
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Niveau</label>
                                <select name="child_level" required class="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold text-xs">
                                    <template x-for="lvl in (levels[childCountry] || levels['INT'])" :key="lvl">
                                        <option :value="lvl" x-text="lvl"></option>
                                    </template>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Ville / Province</label>
                                <select name="child_region" class="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold text-xs">
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
                            <input type="text" name="child_school" placeholder="Rechercher une école..." class="w-full bg-slate-50 border-2 border-blue-100 p-4 rounded-xl font-bold text-xs shadow-inner">
                        </div>
                    </div>

                    <div class="flex gap-4 pt-2">
                        <button type="button" @click="step = 2" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] hover:bg-slate-50 transition-all">←</button>
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
                step: 1,
                role: 'Maman',
                phone: '',
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
                }
            }
        }
    </script>
</body>
</html>
