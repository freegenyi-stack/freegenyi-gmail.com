<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V5 - RESCUE)
 * VERSION ROBUSTE CONTRE LES ERREURS JS
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
require_once __DIR__ . '/../includes/MailManager.php';

// Redirige au login si non connecté
if (empty($_SESSION['logged_in'])) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/auth/login");
    exit;
}

$user_id = $_SESSION['user_id'] ?? 0;
$user = DB::fetchOne("SELECT id, full_name, phone FROM users WHERE id = ?", [$user_id]);

// Préparation du prénom
$full_name_raw = ($user && !empty($user['full_name'])) ? $user['full_name'] : ($_SESSION['user_name'] ?? 'Parent');
$first_name = explode(' ', trim($full_name_raw))[0];
if (empty($first_name)) $first_name = 'Parent';

// Liste des Wilayas
$wilayas_dz = [
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Oum El Bouaghi', 'c' => '04000'],
    ['n' => 'Batna', 'c' => '05000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Biskra', 'c' => '07000'], ['n' => 'Béchar', 'c' => '08000'],
    ['n' => 'Blida', 'c' => '09000'], ['n' => 'Bouira', 'c' => '10000'], ['n' => 'Alger', 'c' => '16000'], ['n' => 'Sétif', 'c' => '19000'], ['n' => 'Oran', 'c' => '31000'], ['n' => 'Constantine', 'c' => '25000']
];

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['child_name'])) {
    $phone = $_POST['phone'] ?? null;
    if ($phone) {
        DB::execute("UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?", [$phone, $user_id]);
    }
    
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email)) {
        MailManager::sendInviteParent($spouse_email, $first_name, $user_id);
    }
    
    $child_name = trim($_POST['child_name'] ?? '');
    $child_age = (int)($_POST['child_age'] ?? 0);
    $child_level = $_POST['child_level'] ?? '';
    $child_country = $_POST['child_country'] ?? $country;
    
    if (!empty($child_name)) {
        DB::execute("INSERT INTO children (parent_id, name, age, country, grade, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [$user_id, $child_name, $child_age, $child_country, $child_level]);
    }
    
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/dashboard/parent");
    exit;
}
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #fafafa; min-height: 100vh; margin: 0; padding: 0; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-caveat { font-family: 'Caveat', cursive; }
        .slide-enter { animation: slideIn 0.3s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="flex items-center justify-center p-0 lg:p-8" x-data="onboardingData()">

    <div class="w-full max-w-[1200px] bg-white lg:rounded-[3rem] lg:shadow-2xl overflow-hidden flex flex-col lg:flex-row shadow-none rounded-none border-b border-slate-100">
        
        <!-- LEFT AREA -->
        <div class="hidden lg:flex flex-col flex-1 bg-slate-900 text-white p-12 justify-center relative min-h-[600px]">
            <div class="relative z-20">
                <div x-show="step === 1">
                    <span class="text-orange-500 font-caveat text-4xl block mb-4">L'Excellence mondiale</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Votre enfant n'a plus aucune frontière.</h2>
                </div>
                <div x-show="step === 2" x-cloak>
                    <span class="text-blue-400 font-caveat text-4xl block mb-4">Famille Unie</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Un suivi partagé en temps réel.</h2>
                </div>
                <div x-show="step === 3" x-cloak>
                    <span class="text-green-400 font-caveat text-4xl block mb-4">Le Petit Génie</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Cycle Primaire Exclusivement.</h2>
                </div>
            </div>
        </div>

        <!-- RIGHT AREA -->
        <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white min-h-[500px]">
            <form action="" method="POST" class="max-w-md mx-auto w-full space-y-8">
                
                <!-- STEP 1: NOM + ROLE -->
                <div x-show="step === 1" class="slide-enter space-y-6">
                    <div>
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tighter">Bonjour, <?= htmlspecialchars($first_name) ?>.</h3>
                        <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Votre rôle de garant</p>
                    </div>

                    <div class="space-y-3">
                        <label class="block text-xs font-black uppercase tracking-wider text-slate-700">Sélectionnez votre rôle :</label>
                        <div class="space-y-2">
                            <label class="block cursor-pointer">
                                <input type="radio" name="parent_role" value="Maman" class="hidden peer" checked>
                                <div class="py-4 px-6 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50/30 transition">Maman</div>
                            </label>
                            <label class="block cursor-pointer">
                                <input type="radio" name="parent_role" value="Papa" class="hidden peer">
                                <div class="py-4 px-6 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50/30 transition">Papa</div>
                            </label>
                            <label class="block cursor-pointer">
                                <input type="radio" name="parent_role" value="Tuteur légal" class="hidden peer">
                                <div class="py-4 px-6 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50/30 transition">Tuteur légal</div>
                            </label>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Numéro de téléphone</label>
                        <input type="tel" name="phone" value="<?= htmlspecialchars($user['phone'] ?? '') ?>" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-xl outline-none font-bold text-slate-900 shadow-inner">
                    </div>
                    <button type="button" @click="step = 2" class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition shadow-xl">Suivant →</button>
                </div>

                <!-- STEP 2: INVITATION -->
                <div x-show="step === 2" x-cloak class="slide-enter space-y-6">
                    <h3 class="text-3xl font-black font-title text-slate-950 tracking-tighter">Équipe Familiale</h3>
                    <p class="text-sm text-slate-500 font-medium leading-relaxed">Invitez le deuxième parent pour un suivi partagé.</p>
                    <input type="email" name="spouse_email" placeholder="Email conjoint (ex: maman@gmail.com)" class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-xl outline-none font-bold text-slate-900 shadow-inner">
                    <div class="flex gap-4">
                        <button type="button" @click="step = 1" class="px-8 py-5 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px]">←</button>
                        <button type="button" @click="step = 3" class="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition">Suivant</button>
                    </div>
                </div>

                <!-- STEP 3: ENFANT -->
                <div x-show="step === 3" x-cloak class="slide-enter space-y-4">
                    <h3 class="text-3xl font-black font-title text-slate-950 tracking-tighter">Votre Enfant</h3>
                    <input type="text" name="child_name" placeholder="Prénom de l'enfant" required class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-xl outline-none font-bold text-slate-900 shadow-sm focus:border-green-600">
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Pays</label>
                            <div class="relative">
                                <select x-model="childCountry" name="child_country" class="w-full bg-slate-50 border-2 border-slate-100 py-3.5 pl-10 pr-4 rounded-xl font-bold text-slate-800 text-xs appearance-none">
                                    <?php foreach ($supported_regions as $code => $info): ?>
                                        <option value="<?= $code ?>"><?= $info['name'] ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <div class="absolute left-3 top-1/2 -translate-y-1/2">
                                    <img :src="'https://flagcdn.com/w20/' + childCountry.toLowerCase() + '.png'" class="w-4 h-auto rounded-sm">
                                </div>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Niveau</label>
                            <select name="child_level" required class="w-full bg-green-50 border-2 border-green-200 py-3.5 px-4 rounded-xl font-bold text-green-900 text-xs appearance-none">
                                <template x-for="lvl in (levels[childCountry] || levels['INT'])" :key="lvl">
                                    <option :value="lvl" x-text="lvl"></option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Wilaya / Province</label>
                            <select name="child_region" class="w-full bg-slate-50 border-2 border-slate-100 py-3.5 px-4 rounded-xl font-bold text-slate-800 text-xs appearance-none">
                                <option value="">Choisir...</option>
                                <template x-if="childCountry === 'DZ'">
                                    <template x-for="w in wilayas" :key="w.c">
                                        <option :value="w.n" x-text="w.n + ' ' + w.c"></option>
                                    </template>
                                </template>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Âge</label>
                            <input type="number" name="child_age" min="5" max="13" required class="w-full bg-slate-50 border-2 border-slate-100 py-3 px-4 rounded-xl font-bold text-slate-800 text-xs">
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-blue-500 font-bold">École fréquentée</label>
                        <input type="text" name="child_school" placeholder="Nom de l'école..." class="w-full bg-white border-2 border-blue-50 focus:border-blue-500 py-4 px-6 rounded-xl font-bold text-slate-900 text-sm shadow-sm">
                    </div>
                    
                    <div class="flex gap-4 pt-4">
                        <button type="button" @click="step = 2" class="px-8 py-5 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px]">←</button>
                        <button type="submit" class="flex-1 py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition shadow-xl shadow-green-600/30">C'est parti !</button>
                    </div>
                </div>

                <!-- Footer incrusté -->
                <div class="pt-10 text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
                    Sécurisé et Chiffré par FreeGeny Core
                </div>
            </form>
        </div>
    </div>

    <script>
        function onboardingData() {
            return {
                step: 1,
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
