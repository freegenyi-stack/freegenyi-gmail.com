<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V7 - STRICT USER PLAN)
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

$first_name = ($user && !empty($user['full_name'])) ? explode(' ', trim($user['full_name']))[0] : 'Parent';

// Liste des Wilayas d'Algérie (Exemple, à compléter si besoin)
$wilayas_dz = [
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Alger', 'c' => '16000'], ['n' => 'Oran', 'c' => '31000'], ['n' => 'Constantine', 'c' => '25000'], ['n' => 'Sétif', 'c' => '19000']
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Logique de sauvegarde (Phone, Invite, Child)
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Onboarding | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; height: 100vh; overflow: hidden; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .bg-custom { background: #111827; } /* Pas de noir, anthracite premium avant photo */
        .vercel-input { border: 1px solid #eaeaea; outline: none; transition: border-color 0.2s; }
        .vercel-input:focus { border-color: #000; }
    </style>
</head>
<body class="bg-white" x-data="onboarding()">

    <div class="flex h-full w-full">
        <!-- LEFT PANEL (ARGUMENTAIRE) -->
        <div class="hidden lg:flex flex-col flex-1 bg-custom text-white p-16 justify-center relative">
            <div class="space-y-6 max-w-lg">
                <div x-show="step === 1" class="space-y-4">
                    <h2 class="text-orange-500 font-bold text-xl uppercase tracking-widest">L'Excellence mondiale</h2>
                    <h1 class="text-5xl font-title font-black leading-tight">Votre enfant n'a plus aucune frontière.</h1>
                    <div class="space-y-2 text-slate-400 font-medium text-lg pt-4">
                        <p>• Mathématiques de Singapour</p>
                        <p>• Cambridge (UK)</p>
                        <p>• Finnish Model</p>
                        <p>• STEM / STEAM</p>
                        <p>• Montessori</p>
                    </div>
                </div>
                <div x-show="step === 2" x-cloak class="space-y-4">
                    <h2 class="text-blue-400 font-bold text-xl uppercase tracking-widest">Équipe Familiale</h2>
                    <h1 class="text-5xl font-title font-black leading-tight border-l-4 border-blue-400 pl-8">L'éducation est un sport d'équipe.</h1>
                </div>
                <div x-show="step === 3" x-cloak class="space-y-4">
                    <h2 class="text-green-400 font-bold text-xl uppercase tracking-widest">Le Petit Génie</h2>
                    <h1 class="text-5xl font-title font-black leading-tight border-l-4 border-green-400 pl-8">Cycle Primaire Exclusivement.</h1>
                </div>
            </div>

            <!-- Indicateur de diapo / cercles -->
            <div class="absolute bottom-12 left-16 flex gap-3">
                <div class="w-3 h-3 rounded-full transition-all" :class="step === 1 ? 'bg-orange-500 w-8' : 'bg-slate-700'"></div>
                <div class="w-3 h-3 rounded-full transition-all" :class="step === 2 ? 'bg-blue-400 w-8' : 'bg-slate-700'"></div>
                <div class="w-3 h-3 rounded-full transition-all" :class="step === 3 ? 'bg-green-400 w-8' : 'bg-slate-700'"></div>
            </div>
        </div>

        <!-- RIGHT PANEL (FORM) -->
        <div class="flex-1 flex flex-col justify-between p-8 md:p-16 h-full overflow-hidden">
            <div class="max-w-md mx-auto w-full pt-10">
                <form action="" method="POST" class="space-y-8">
                    
                    <!-- STEP 1: ROLES & PHONE -->
                    <div x-show="step === 1" class="space-y-8">
                        <div>
                            <h3 class="text-3xl font-title font-black tracking-tighter">Votre rôle</h3>
                            <p class="text-slate-500">Bonjour <?= htmlspecialchars($first_name) ?>, comment souhaitez-vous être identifié ?</p>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <template x-for="r in ['Maman', 'Papa', 'Tuteur légal']">
                                <label class="cursor-pointer">
                                    <input type="radio" name="parent_role" :value="r" class="hidden peer" x-model="role">
                                    <div class="p-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 peer-checked:border-black peer-checked:text-black transition uppercase text-xs tracking-widest text-center">
                                        <span x-text="r"></span>
                                    </div>
                                </label>
                            </template>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Numéro de téléphone</label>
                            <input type="tel" name="phone" placeholder="+213..." class="w-full vercel-input p-4 rounded-xl font-bold bg-slate-50">
                        </div>
                        <button type="button" @click="step = 2" class="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Suivant →</button>
                    </div>

                    <!-- STEP 2: INVITE SPOUSE -->
                    <div x-show="step === 2" x-cloak class="space-y-8">
                        <div>
                            <h3 class="text-3xl font-title font-black tracking-tighter">Invite Conjoint</h3>
                            <p class="text-slate-500 leading-relaxed text-sm">Synchronisez vos comptes pour un suivi partagé en temps réel de vos enfants.</p>
                        </div>
                        <div class="p-8 border-2 border-slate-50 rounded-3xl bg-slate-50/50 space-y-4">
                            <input type="email" name="spouse_email" placeholder="Email du conjoint..." class="w-full vercel-input p-4 rounded-xl font-bold bg-white">
                            <p class="text-[10px] text-slate-400 italic">Il/Elle recevra une invitation pour valider sa session.</p>
                        </div>
                        <div class="flex gap-4">
                            <button type="button" @click="step = 1" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-bold uppercase text-[10px]">←</button>
                            <button type="button" @click="step = 3" class="flex-1 py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Étape Suivante</button>
                        </div>
                    </div>

                    <!-- STEP 3: CHILD (PRIMARY ONLY) -->
                    <div x-show="step === 3" x-cloak class="space-y-4">
                        <div>
                            <h3 class="text-3xl font-title font-black tracking-tighter">L'Enfant</h3>
                            <p class="text-slate-500 text-sm">Nous personnalisons l'expérience pour son pays et son niveau.</p>
                        </div>

                        <input type="text" name="child_name" placeholder="Prénom de l'enfant" required class="w-full vercel-input p-4 rounded-xl font-bold">
                        
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold uppercase text-slate-400">Pays de résidence</label>
                                <div class="relative">
                                    <select x-model="childCountry" name="child_country" class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-slate-50 appearance-none">
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
                                <label class="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Niveau (Primaire Officiel)</label>
                                <select name="child_level" required class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-slate-50">
                                    <template x-for="lvl in (levels[childCountry] || levels['INT'])" :key="lvl">
                                        <option :value="lvl" x-text="lvl"></option>
                                    </template>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold uppercase text-slate-400">Ville / Province</label>
                                <select name="child_region" class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-slate-50">
                                    <option value="">Sélectionner...</option>
                                    <template x-if="childCountry === 'DZ'">
                                        <template x-for="w in wilayas" :key="w.c">
                                            <option :value="w.n" x-text="w.n + ' ' + w.c"></option>
                                        </template>
                                    </template>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-bold uppercase text-slate-400">Âge</label>
                                <input type="number" name="child_age" min="5" max="13" required class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-white">
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase text-blue-500">École (Uploader/Recherche)</label>
                            <input type="text" name="child_school" placeholder="Taper le nom de l'école..." class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-slate-50 focus:bg-white transition shadow-inner">
                        </div>

                        <div class="flex gap-4">
                            <button type="button" @click="step = 2" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-bold uppercase text-[10px]">←</button>
                            <button type="submit" class="flex-1 py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/20">Démarrer l'Aventure !</button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- FOOTER - FIX OVERFLOW (ZÉRO SCROLL) -->
            <div class="pb-4 text-center">
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">
                    Sécurisé et Chiffré par FreeGeny Core
                </p>
            </div>
        </div>
    </div>

    <script>
        function onboarding() {
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
