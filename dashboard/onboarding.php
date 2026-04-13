<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V1 RECONSTRUCTED + V7 LOGIC)
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

// Préparation du prénom (Fallback si vide)
$full_name_raw = ($user && !empty($user['full_name'])) ? $user['full_name'] : ($_SESSION['user_name'] ?? 'Parent');
$first_name = explode(' ', trim($full_name_raw))[0];
if (empty($first_name)) $first_name = 'Parent';

// Liste des Wilayas d'Algérie
$wilayas_dz = [
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Oum El Bouaghi', 'c' => '04000'],
    ['n' => 'Batna', 'c' => '05000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Biskra', 'c' => '07000'], ['n' => 'Béchar', 'c' => '08000'],
    ['n' => 'Blida', 'c' => '09000'], ['n' => 'Bouira', 'c' => '10000'], ['n' => 'Tamanrasset', 'c' => '11000'], ['n' => 'Tébessa', 'c' => '12000'],
    ['n' => 'Alger', 'c' => '16000'], ['n' => 'Sétif', 'c' => '19000'], ['n' => 'Oran', 'c' => '31000'], ['n' => 'Constantine', 'c' => '25000']
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Compléter mon Profil | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['DM Sans', 'sans-serif'],
                        title: ['Plus Jakarta Sans', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; height: 100vh; overflow: hidden; }
        .bg-argumentaire { background-color: #0f172a; } /* Gris anthracite premium en attendant la photo */
        .slide-enter { animation: slideIn 0.3s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-white">

    <div class="flex h-screen w-full overflow-hidden" x-data="{ 
        step: 1, 
        childCountry: '<?= $country ?>',
        levels: {
            'DZ': ['1AP', '2AP', '3AP', '4AP', '5AP'],
            'MA': ['1AP', '2AP', '3AP', '4AP', '5AP', '6AP'],
            'TN': ['1ère Année', '2ème Année', '3ème Année', '4ème Année', '5ème Année', '6ème Année'],
            'FR': ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
            'US': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
            'INT': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
        },
        wilayas: <?= json_encode($wilayas_dz) ?>,
        nextStep() { this.step++ },
        prevStep() { this.step-- }
    }">

        <!-- LEFT SIDE : ARGUMENTAIRE (THE ONE YOU LOVED) -->
        <div class="hidden lg:flex flex-col flex-1 bg-argumentaire text-white p-20 justify-center relative">
            <div class="space-y-8 max-w-xl">
                <div x-show="step === 1" class="space-y-6">
                    <span class="inline-block px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">L'Excellence mondiale</span>
                    <h1 class="text-6xl font-title font-black leading-[1.1] tracking-tighter">Votre enfant n'a plus aucune frontière.</h1>
                    <div class="grid grid-cols-2 gap-4 text-xs font-bold text-slate-400 pt-8 uppercase tracking-widest leading-loose">
                        <div class="space-y-1">
                            <p>• Mathématiques de Singapour</p>
                            <p>• Cambridge (UK)</p>
                            <p>• Finnish Model</p>
                        </div>
                        <div class="space-y-1">
                            <p>• STEM / STEAM</p>
                            <p>• Montessori</p>
                        </div>
                    </div>
                </div>

                <div x-show="step === 2" x-cloak class="space-y-6 slide-enter">
                    <span class="inline-block px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Équipe Familiale</span>
                    <h1 class="text-6xl font-title font-black leading-[1.1] tracking-tighter">L'éducation est un sport d'équipe.</h1>
                </div>

                <div x-show="step === 3" x-cloak class="space-y-6 slide-enter">
                    <span class="inline-block px-4 py-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Le Petit Génie</span>
                    <h1 class="text-6xl font-title font-black leading-[1.1] tracking-tighter">Cycle Primaire Exclusivement.</h1>
                </div>
            </div>

            <!-- INDICATEUR DE DIAPO (THE DOTS) -->
            <div class="absolute bottom-16 left-20 flex gap-3">
                <div class="w-2 h-2 rounded-full transition-all" :class="step === 1 ? 'bg-orange-500 w-10' : 'bg-slate-700'"></div>
                <div class="w-2 h-2 rounded-full transition-all" :class="step === 2 ? 'bg-blue-500 w-10' : 'bg-slate-700'"></div>
                <div class="w-2 h-2 rounded-full transition-all" :class="step === 3 ? 'bg-green-500 w-10' : 'bg-slate-700'"></div>
            </div>
        </div>

        <!-- RIGHT SIDE : THE FORM -->
        <div class="flex-1 flex flex-col justify-between h-full bg-white relative">
            <div class="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                
                <form action="" method="POST" class="max-w-md w-full mx-auto">
                    
                    <!-- STEP 1 : ROLE -->
                    <div x-show="step === 1" class="space-y-8">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight">Bonjour, <?= htmlspecialchars($first_name) ?>.</h3>
                            <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Étape 1 sur 3 — Votre rôle de garant</p>
                        </div>

                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-3">
                                <label class="cursor-pointer">
                                    <input type="radio" name="parent_role" value="Maman" class="peer hidden" checked>
                                    <div class="py-4 px-4 rounded-xl border-2 border-slate-100 peer-checked:border-orange-500 peer-checked:bg-orange-50 text-center transition-all">
                                        <span class="block font-bold text-slate-800 text-sm">Maman</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer">
                                    <input type="radio" name="parent_role" value="Papa" class="peer hidden">
                                    <div class="py-4 px-4 rounded-xl border-2 border-slate-100 peer-checked:border-orange-500 peer-checked:bg-orange-50 text-center transition-all">
                                        <span class="block font-bold text-slate-800 text-sm">Papa</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer col-span-2">
                                    <input type="radio" name="parent_role" value="Tuteur Légal" class="peer hidden">
                                    <div class="py-4 px-4 rounded-xl border-2 border-slate-100 peer-checked:border-slate-800 peer-checked:bg-slate-50 text-center transition-all">
                                        <span class="block font-bold text-slate-800 text-sm">Tuteur Légal</span>
                                    </div>
                                </label>
                            </div>

                            <div class="space-y-1">
                                <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400">Numéro de téléphone</label>
                                <input type="tel" name="phone" placeholder="+213..." value="<?= htmlspecialchars($user['phone'] ?? '') ?>" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-black focus:bg-white px-4 py-4 rounded-xl outline-none font-bold text-slate-900 transition-all shadow-inner">
                            </div>
                        </div>

                        <button type="button" @click="nextStep()" class="w-full bg-slate-950 hover:bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl">Continuer →</button>
                    </div>

                    <!-- STEP 2 : INVITATION -->
                    <div x-show="step === 2" x-cloak class="space-y-8 slide-enter">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight">Le travail d'équipe.</h3>
                            <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Étape 2 sur 3 — Inviter le conjoint</p>
                        </div>
                        
                        <div class="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8">
                            <h4 class="font-black text-slate-900 mb-2 uppercase text-[12px] tracking-tight">Inviter le deuxième parent</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed font-bold mb-6">
                                Ensemble, suivez les progrès et recevez les alertes en temps réel.
                            </p>
                            <input type="email" name="spouse_email" placeholder="Email du conjoint (Optionnel)" class="w-full bg-white border-2 border-blue-100 focus:border-blue-500 px-4 py-4 rounded-xl outline-none font-bold text-slate-950 shadow-sm">
                        </div>

                        <div class="flex gap-4">
                            <button type="button" @click="prevStep()" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px]">←</button>
                            <button type="button" @click="nextStep()" class="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Suivant</button>
                        </div>
                    </div>

                    <!-- STEP 3 : CHILD (PRIMARY ONLY) -->
                    <div x-show="step === 3" x-cloak class="space-y-5 slide-enter">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-950 tracking-tight">Le Héros.</h3>
                            <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Étape 3 sur 3 — Ajouter votre enfant</p>
                        </div>
                        
                        <div class="space-y-3">
                            <input type="text" name="child_name" required placeholder="Prénom de l'enfant" class="w-full bg-slate-50 border-2 border-slate-100 px-4 py-4 rounded-xl outline-none font-bold text-slate-900">
                            
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
                                    <label class="text-[10px] font-black text-slate-400 uppercase">Niveau (Primaire)</label>
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
                                <label class="text-[10px] font-black text-blue-500 uppercase tracking-widest">École fréquentée</label>
                                <input type="text" name="child_school" placeholder="Taper le nom de l'école..." class="w-full bg-slate-50 border-2 border-blue-50 p-4 rounded-xl font-bold text-xs">
                            </div>
                        </div>

                        <div class="flex gap-4 pt-2">
                            <button type="button" @click="prevStep()" class="px-8 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px]">←</button>
                            <button type="submit" class="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-orange-600/20 transition-all hover:bg-slate-900">Démarrer l'Aventure !</button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- FOOTER : ZÉRO OVERFLOW -->
            <div class="p-6 text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em] italic">
                Sécurisé et Chiffré par FreeGeny Core
            </div>
        </div>

    </div>

</body>
</html>
