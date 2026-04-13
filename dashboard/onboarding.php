<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V4)
 * EXTREME PRECISION MODE
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

// Préparation du prénom pour l'affichage (Fallback si vide)
$full_name_raw = ($user && !empty($user['full_name'])) ? $user['full_name'] : ($_SESSION['user_name'] ?? 'Parent');
$first_name = explode(' ', trim($full_name_raw))[0];
if (empty($first_name)) $first_name = 'Parent';

// Préparation des pays pour JS (Synchronisé avec app.php)
$countries_js = json_encode($supported_regions);

// Liste complète des 58 Wilayas d'Algérie
$wilayas_dz = [
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Oum El Bouaghi', 'c' => '04000'],
    ['n' => 'Batna', 'c' => '05000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Biskra', 'c' => '07000'], ['n' => 'Béchar', 'c' => '08000'],
    ['n' => 'Blida', 'c' => '09000'], ['n' => 'Bouira', 'c' => '10000'], ['n' => 'Tamanrasset', 'c' => '11000'], ['n' => 'Tébessa', 'c' => '12000'],
    ['n' => 'Tlemcen', 'c' => '13000'], ['n' => 'Tiaret', 'c' => '14000'], ['n' => 'Tizi Ouzou', 'c' => '15000'], ['n' => 'Alger', 'c' => '16000'],
    ['n' => 'Djelfa', 'c' => '17000'], ['n' => 'Jijel', 'c' => '18000'], ['n' => 'Sétif', 'c' => '19000'], ['n' => 'Saïda', 'c' => '20000'],
    ['n' => 'Skikda', 'c' => '21000'], ['n' => 'Sidi Bel Abbès', 'c' => '22000'], ['n' => 'Annaba', 'c' => '23000'], ['n' => 'Guelma', 'c' => '24000'],
    ['n' => 'Constantine', 'c' => '25000'], ['n' => 'Médéa', 'c' => '26000'], ['n' => 'Mostaganem', 'c' => '27000'], ['n' => 'M\'Sila', 'c' => '28000'],
    ['n' => 'Mascara', 'c' => '29000'], ['n' => 'Ouargla', 'c' => '30000'], ['n' => 'Oran', 'c' => '31000'], ['n' => 'El Bayadh', 'c' => '32000'],
    ['n' => 'Illizi', 'c' => '33000'], ['n' => 'Bordj Bou Arréridj', 'c' => '34000'], ['n' => 'Boumerdès', 'c' => '35000'], ['n' => 'El Tarf', 'c' => '36000'],
    ['n' => 'Tindouf', 'c' => '37000'], ['n' => 'Tissemsilt', 'c' => '38000'], ['n' => 'El Oued', 'c' => '39000'], ['n' => 'Khenchela', 'c' => '40000'],
    ['n' => 'Souk Ahras', 'c' => '41000'], ['n' => 'Tipaza', 'c' => '42000'], ['n' => 'Mila', 'c' => '43000'], ['n' => 'Aïn Defla', 'c' => '44000'],
    ['n' => 'Naâma', 'c' => '45000'], ['n' => 'Aïn Témouchent', 'c' => '46000'], ['n' => 'Ghardaïa', 'c' => '47000'], ['n' => 'Relizane', 'c' => '48000'],
    ['n' => 'El M\'Ghair', 'c' => '49000'], ['n' => 'El Meniaa', 'c' => '50000'], ['n' => 'Ouled Djellal', 'c' => '51000'], ['n' => 'Bordj Baji Mokhtar', 'c' => '52000'],
    ['n' => 'Béni Abbès', 'c' => '53000'], ['n' => 'Timimoun', 'c' => '54000'], ['n' => 'Touggourt', 'c' => '55000'], ['n' => 'Djanet', 'c' => '56000'],
    ['n' => 'In Salah', 'c' => '57000'], ['n' => 'In Guezzam', 'c' => '58000']
];

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $phone = $_POST['phone'] ?? null;
    $role = $_POST['parent_role'] ?? 'Maman';
    
    if ($phone) {
        DB::execute("UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?", [$phone, $user_id]);
    }
    
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email)) {
        MailManager::sendInviteParent($spouse_email, $user['full_name'], $user_id);
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
    <title>Compléter Profil | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #fafafa; min-height: 100vh; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-caveat { font-family: 'Caveat', cursive; }
        .slide-enter { animation: slideIn 0.3s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="flex items-center justify-center p-0 lg:p-8" x-data="{ 
    step: 1,
    childCountry: '<?= $country ?>',
    countries: <?= $countries_js ?>,
    wilayas: <?= json_encode($wilayas_dz) ?>,
    schoolSearch: '',
    levels: {
        'DZ': ['1AP', '2AP', '3AP', '4AP', '5AP'],
        'MA': ['1AP', '2AP', '3AP', '4AP', '5AP', '6AP'],
        'TN': ['1ère Année', '2ème Année', '3ème Année', '4ème Année', '5ème Année', '6ème Année'],
        'FR': ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        'US': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        'INT': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
    },
    next() { this.step++ },
    prev() { this.step-- }
}">

    <div class="w-full max-w-[1200px] min-h-[600px] flex flex-col lg:flex-row bg-white lg:rounded-[3rem] lg:shadow-2xl overflow-hidden shadow-none rounded-none border border-slate-100">
        
        <!-- LEFT AREA : ARGUMENTAIRE PRECISE -->
        <div class="hidden lg:flex flex-col flex-1 bg-slate-900 text-white p-12 justify-center relative">
            <div class="relative z-20">
                <div x-show="step === 1">
                    <span class="text-orange-500 font-caveat text-4xl block mb-4">L'Excellence mondiale</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Votre enfant n'a plus aucune frontière.</h2>
                </div>
                <div x-show="step === 2" x-cloak>
                    <span class="text-blue-400 font-caveat text-4xl block mb-4">Suivi Premium</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Un foyer uni autour du génie.</h2>
                </div>
                <div x-show="step === 3" x-cloak>
                    <span class="text-green-400 font-caveat text-4xl block mb-4">Le Petit Génie</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Cycle Primaire Exclusivement.</h2>
                </div>
            </div>
            <div class="absolute bottom-12 left-12 flex gap-2">
                <div class="h-1.5 transition-all duration-300" :class="step >= 1 ? 'w-12 bg-orange-500' : 'w-4 bg-slate-800'"></div>
                <div class="h-1.5 transition-all duration-300" :class="step >= 2 ? 'w-12 bg-blue-500' : 'w-4 bg-slate-800'"></div>
                <div class="h-1.5 transition-all duration-300" :class="step >= 3 ? 'w-12 bg-green-500' : 'w-4 bg-slate-800'"></div>
            </div>
        </div>

        <!-- RIGHT AREA : FORMULAIRE -->
        <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white">
            <form action="" method="POST" class="max-w-md mx-auto w-full space-y-8">
                
                <div x-show="step === 1" class="slide-enter space-y-6">
                    <div>
                        <h3 class="text-4xl font-black font-title text-slate-950 tracking-tighter">Bonjour, <?= htmlspecialchars($first_name) ?>.</h3>
                        <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Votre rôle de garant</p>
                    </div>

                    <div class="space-y-3">
                        <label class="block text-xs font-black uppercase tracking-wider text-slate-700">Vous êtes :</label>
                        <div class="grid grid-cols-1 gap-2">
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Maman" class="hidden peer" checked>
                                <div class="py-4 px-6 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50/30 transition shadow-sm">Maman</div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Papa" class="hidden peer">
                                <div class="py-4 px-6 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50/30 transition shadow-sm">Papa</div>
                            </label>
                            <label class="cursor-pointer group">
                                <input type="radio" name="parent_role" value="Tuteur légal" class="hidden peer">
                                <div class="py-4 px-6 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50/30 transition shadow-sm">Tuteur légal</div>
                            </label>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Numéro de téléphone</label>
                        <input type="tel" name="phone" value="<?= htmlspecialchars($user['phone'] ?? '') ?>" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-xl outline-none font-bold text-slate-900 shadow-inner">
                    </div>
                    <button type="button" @click="next()" class="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition shadow-2xl">Continuer →</button>
                </div>

                <!-- STEP 2: INVITATION -->
                <div x-show="step === 2" x-cloak class="slide-enter space-y-6">
                    <h3 class="text-4xl font-black font-title text-slate-950 tracking-tighter">Équipe Familiale</h3>
                    <p class="text-sm text-slate-500 font-medium leading-relaxed">Invitez le deuxième parent ou co-tuteur pour un suivi partagé en temps réel.</p>
                    <div class="space-y-4">
                        <input type="email" name="spouse_email" placeholder="Email du conjoint (ex: maman@gmail.com)" class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-xl outline-none font-bold text-slate-900 shadow-inner">
                    </div>
                    <div class="flex gap-4">
                        <button type="button" @click="prev()" class="px-8 py-5 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px]">←</button>
                        <button type="button" @click="next()" class="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition shadow-xl">Étape Suivante</button>
                    </div>
                </div>

                <!-- STEP 3: ENFANT (FULL PRECISION) -->
                <div x-show="step === 3" x-cloak class="slide-enter space-y-4">
                    <h3 class="text-4xl font-black font-title text-slate-950 tracking-tighter">Enfant (Primaire)</h3>
                    <input type="text" name="child_name" placeholder="Prénom de l'enfant" required class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-xl outline-none font-bold text-slate-900 shadow-sm transition focus:border-green-600">
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Pays (Sync Accueil)</label>
                            <div class="relative">
                                <select x-model="childCountry" name="child_country" class="w-full bg-slate-50 border-2 border-slate-100 py-4 pl-12 pr-4 rounded-xl font-bold text-slate-800 text-xs appearance-none">
                                    <template x-for="(info, code) in countries" :key="code">
                                        <option :value="code" x-text="info.name" :selected="code === childCountry"></option>
                                    </template>
                                </select>
                                <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <img :src="'https://flagcdn.com/w40/' + childCountry.toLowerCase() + '.png'" class="w-5 h-auto rounded-sm">
                                </div>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Niveau Primaire</label>
                            <select name="child_level" required class="w-full bg-green-50 border-2 border-green-200 py-4 px-4 rounded-xl font-bold text-green-900 text-xs appearance-none">
                                <template x-for="lvl in (levels[childCountry] || levels['INT'])" :key="lvl">
                                    <option :value="lvl" x-text="lvl"></option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Wilaya / Province</label>
                            <select name="child_region" class="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl font-bold text-slate-800 text-xs appearance-none">
                                <option value="">Choisir...</option>
                                <template x-if="childCountry === 'DZ'">
                                    <template x-for="w in wilayas" :key="w.c">
                                        <option :value="w.n" x-text="w.n + ' ' + w.c"></option>
                                    </template>
                                </template>
                                <option value="Autre">- Autre -</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Âge</label>
                            <input type="number" name="child_age" min="5" max="13" class="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl font-bold text-slate-800 text-xs">
                        </div>
                    </div>

                    <!-- RECHERCHE ECOLE (SYSTEME SEARCHABLE) -->
                    <div class="space-y-1" x-data="{ open: false }">
                        <label class="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2"><i class="fa-solid fa-school"></i> École fréquentée (Monde entier)</label>
                        <div class="relative">
                            <input type="text" x-model="schoolSearch" name="child_school" @focus="open = true" placeholder="Taper le nom de l'école..." class="w-full bg-white border-2 border-blue-100 focus:border-blue-500 py-4 px-6 rounded-xl font-bold text-slate-900 text-sm shadow-sm">
                            <div x-show="open && schoolSearch.length > 2" @click.away="open = false" class="absolute z-[100] top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-xs">
                                <div class="p-3 text-slate-400 font-bold uppercase tracking-widest text-[9px]">Suggérer : "<span x-text="schoolSearch"></span>"</div>
                                <div class="px-3 py-2 text-slate-500 italic">Si votre école n'est pas listée, validez votre saisie pour l'ajouter à notre base mondiale.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-4 pt-4">
                        <button type="button" @click="prev()" class="px-8 py-5 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px]">←</button>
                        <button type="submit" class="flex-1 py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-950 transition shadow-xl shadow-green-600/30">Démarrer l'Aventure !</button>
                    </div>
                </div>

                <div class="pt-6 text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
                    Sécurisé et Chiffré par FreeGeny Core
                </div>
            </form>
        </div>
    </div>
</body>
</html>
