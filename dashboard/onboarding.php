<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V1 RESTORED + SAFE EXECUTION)
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

// Préparation du prénom sécurisé
$full_name_raw = ($user && !empty($user['full_name'])) ? $user['full_name'] : ($_SESSION['user_name'] ?? 'Parent');
$parts = explode(' ', trim($full_name_raw));
$first_name = !empty($parts[0]) ? $parts[0] : 'Parent';

// Liste des Wilayas d'Algérie
$wilayas_dz = [
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Oum El Bouaghi', 'c' => '04000'],
    ['n' => 'Batna', 'c' => '05000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Biskra', 'c' => '07000'], ['n' => 'Béchar', 'c' => '08000'],
    ['n' => 'Blida', 'c' => '09000'], ['n' => 'Bouira', 'c' => '10000'], ['n' => 'Alger', 'c' => '16000'], ['n' => 'Sétif', 'c' => '19000'], ['n' => 'Oran', 'c' => '31000'], ['n' => 'Constantine', 'c' => '25000']
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['child_name'])) {
    $phone = $_POST['phone'] ?? null;
    if ($phone) DB::execute("UPDATE users SET phone = ? WHERE id = ?", [$phone, $user_id]);
    
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email)) {
        MailManager::sendInviteParent($spouse_email, $first_name, $user_id);
    }
    
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no text-size-adjust=none">
    <title>Bienvenue | FreeGeny Onboarding</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #fff; margin: 0; padding: 0; height: 100vh; overflow: hidden; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .bg-custom { background-color: #0d1117; } /* Anthracite premium */
        .slide-enter { animation: slideUp 0.4s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body x-data="onboardingApp()">

    <div class="flex h-screen w-full overflow-hidden">
        
        <!-- SIDE ARGUMENTAIRE (V1 STYLE) -->
        <div class="hidden lg:flex flex-col flex-1 bg-custom text-white p-20 justify-center relative">
            <div class="max-w-xl space-y-10">
                <div x-show="step === 1" class="space-y-6 slide-enter">
                    <span class="inline-block px-4 py-2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">L'Excellence mondiale</span>
                    <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">Votre enfant n'a plus aucune frontière.</h1>
                    <div class="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 pt-6 uppercase tracking-widest leading-loose">
                        <div>
                            <p>• Mathématiques de Singapour</p>
                            <p>• Cambridge (UK)</p>
                            <p>• Finnish Model</p>
                        </div>
                        <div>
                            <p>• STEM / STEAM</p>
                            <p>• Montessori</p>
                        </div>
                    </div>
                </div>

                <div x-show="step === 2" x-cloak class="space-y-6 slide-enter">
                    <span class="inline-block px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">Équipe Familiale</span>
                    <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">L'éducation est un sport d'équipe.</h1>
                </div>

                <div x-show="step === 3" x-cloak class="space-y-6 slide-enter">
                    <span class="inline-block px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">Le Petit Génie</span>
                    <h1 class="text-6xl font-title font-black leading-tight tracking-tighter">Cycle Primaire Exclusivement.</h1>
                </div>
            </div>

            <!-- DOTS INDICATOR (V1) -->
            <div class="absolute bottom-20 left-20 flex gap-4">
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 1 ? 'bg-orange-500 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 2 ? 'bg-blue-500 w-12' : 'bg-slate-800 w-4'"></div>
                <div class="h-1.5 rounded-full transition-all duration-300" :class="step === 3 ? 'bg-green-500 w-12' : 'bg-slate-800 w-4'"></div>
            </div>
        </div>

        <!-- FORM SIDE -->
        <div class="flex-1 flex flex-col justify-between bg-white overflow-hidden">
            <div class="flex-1 flex flex-col justify-center px-10 md:px-24">
                
                <form action="" method="POST" class="max-w-md w-full mx-auto space-y-8">
                    
                    <!-- STEP 1 : ROLE -->
                    <div x-show="step === 1" class="space-y-10">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none">Bonjour, <?= htmlspecialchars($first_name) ?>.</h3>
                            <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4 italic">Étape 1 sur 3 — Votre rôle</p>
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
                                <input type="tel" name="phone" placeholder="+213..." value="<?= htmlspecialchars($user['phone'] ?? '') ?>" class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-slate-900 outline-none focus:border-black transition-all">
                            </div>
                        </div>

                        <button type="button" @click="step = 2" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl">Suivant →</button>
                    </div>

                    <!-- STEP 2 : INVITATION -->
                    <div x-show="step === 2" x-cloak class="space-y-8 slide-enter">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none">Équipe Familiale.</h3>
                            <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4 italic">Étape 2 sur 3 — Inviter le conjoint</p>
                        </div>
                        
                        <div class="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 space-y-6">
                            <p class="text-sm text-slate-600 leading-relaxed font-bold">
                                Lier le compte du deuxième parent pour un suivi synchronisé.
                            </p>
                            <input type="email" name="spouse_email" placeholder="Email conjoint (Optionnel)" class="w-full bg-white border-2 border-slate-200 px-4 py-4 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-500 transition-all">
                        </div>

                        <div class="flex gap-4">
                            <button type="button" @click="step = 1" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px]">←</button>
                            <button type="button" @click="step = 3" class="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Étape Suivante</button>
                        </div>
                    </div>

                    <!-- STEP 3 : CHILD (PRIMARY ONLY) -->
                    <div x-show="step === 3" x-cloak class="space-y-4 slide-enter">
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight leading-none">L'Enfant.</h3>
                        
                        <div class="space-y-3">
                            <input type="text" name="child_name" required placeholder="Prénom de l'enfant" class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-4 rounded-xl font-bold text-slate-950 shadow-sm focus:border-green-600 outline-none">
                            
                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-400 uppercase">Pays</label>
                                    <div class="relative">
                                        <select x-model="childCountry" name="child_country" class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-xs appearance-none">
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
                                    <label class="text-[10px] font-black text-slate-400 uppercase">Niveau</label>
                                    <select name="child_level" required class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-xs">
                                        <template x-for="lvl in (levels[childCountry] || levels['INT'])" :key="lvl">
                                            <option :value="lvl" x-text="lvl"></option>
                                        </template>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-400 uppercase">Ville / Province</label>
                                    <select name="child_region" class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-xs">
                                        <option value="">Sélectionner...</option>
                                        <template x-if="childCountry === 'DZ'">
                                            <template x-for="w in wilayas" :key="w.c">
                                                <option :value="w.n" x-text="w.n + ' ' + w.c"></option>
                                            </template>
                                        </template>
                                    </select>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-400 uppercase">Âge</label>
                                    <input type="number" name="child_age" min="5" max="13" required class="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold text-xs">
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-blue-600 uppercase tracking-widest">École fréquentée</label>
                                <input type="text" name="child_school" placeholder="Taper le nom de l'école..." class="w-full bg-slate-50 border-2 border-blue-100 p-4 rounded-xl font-bold text-xs">
                            </div>
                        </div>

                        <div class="flex gap-4 pt-2">
                            <button type="button" @click="step = 2" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px]">←</button>
                            <button type="submit" class="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-slate-900 transition-all">Démarrer !</button>
                        </div>
                    </div>
                </form>
            </div>

            <div class="p-8 text-center">
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">
                    Sécurisé et Chiffré par FreeGeny Core
                </p>
            </div>
        </div>
    </div>

    <!-- DATA ISOLATION TO PREVENT CRASH -->
    <script>
        function onboardingApp() {
            return {
                step: 1,
                role: 'Maman',
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
