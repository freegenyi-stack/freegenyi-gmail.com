<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V6 - VERCEL EDITION)
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

// Préparation du prénom
$full_name_raw = ($user && !empty($user['full_name'])) ? $user['full_name'] : ($_SESSION['user_name'] ?? 'Parent');
$first_name = explode(' ', trim($full_name_raw))[0];
if (empty($first_name)) $first_name = 'Parent';

$wilayas_dz = [
    ['n' => 'Adrar', 'c' => '01000'], ['n' => 'Chlef', 'c' => '02000'], ['n' => 'Laghouat', 'c' => '03000'], ['n' => 'Oum El Bouaghi', 'c' => '04000'],
    ['n' => 'Batna', 'c' => '05000'], ['n' => 'Béjaïa', 'c' => '06000'], ['n' => 'Biskra', 'c' => '07000'], ['n' => 'Béchar', 'c' => '08000'],
    ['n' => 'Blida', 'c' => '09000'], ['n' => 'Bouira', 'c' => '10000'], ['n' => 'Alger', 'c' => '16000'], ['n' => 'Sétif', 'c' => '19000'], ['n' => 'Oran', 'c' => '31000'], ['n' => 'Constantine', 'c' => '25000']
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $phone = $_POST['phone'] ?? null;
    if ($phone) {
        DB::execute("UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?", [$phone, $user_id]);
    }
    
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email)) {
        MailManager::sendInviteParent($spouse_email, $first_name, $user_id);
    }
    
    $child_name = trim($_POST['child_name'] ?? '');
    if (!empty($child_name)) {
        $age = (int)($_POST['child_age'] ?? 7);
        $lvl = $_POST['child_level'] ?? '1AP';
        $cnt = $_POST['child_country'] ?? $country;
        DB::execute("INSERT INTO children (parent_id, name, age, country, grade, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [$user_id, $child_name, $age, $cnt, $lvl]);
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
    <title>Onboarding | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
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
        .vercel-card { transition: all 0.2s ease; border: 1px solid #eaeaea; }
        .vercel-card:hover { border-color: #000; box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
        .vercel-input { border: 1px solid #eaeaea; transition: border-color 0.2s ease; }
        .vercel-input:focus { border-color: #000; outline: none; }
        .slide-up { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-white text-black antialiased min-h-screen flex flex-col items-center justify-center p-6">

    <div class="w-full max-w-4xl" x-data="onboarding()">
        
        <!-- Progress Bar (Sleek Vercel Line) -->
        <div class="w-full h-1 bg-slate-100 mb-16 overflow-hidden">
            <div class="h-full bg-black transition-all duration-500" :style="'width: ' + ((step/3)*100) + '%'"></div>
        </div>

        <div class="space-y-12">
            
            <!-- STEP 1: ROLES (VERCEL GRID) -->
            <div x-show="step === 1" class="slide-up space-y-8">
                <div>
                    <h1 class="text-4xl font-title font-extrabold tracking-tighter mb-2">Bonjour, <?= htmlspecialchars($first_name) ?>.</h1>
                    <p class="text-slate-500 text-lg">Choisissez votre rôle de garant pour commencer l'aventure.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <template x-for="r in ['Maman', 'Papa', 'Tuteur légal']">
                        <label class="cursor-pointer">
                            <input type="radio" name="parent_role" :value="r" class="hidden peer" x-model="role">
                            <div class="vercel-card p-6 rounded-xl bg-white text-center font-bold peer-checked:bg-black peer-checked:text-white peer-checked:border-black">
                                <span x-text="r"></span>
                            </div>
                        </label>
                    </template>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Téléphone de contact</label>
                    <input type="tel" name="phone" placeholder="+213..." class="w-full vercel-input p-4 rounded-xl font-bold bg-slate-50 focus:bg-white">
                </div>

                <button @click="step = 2" class="w-full py-5 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition">Continuer</button>
            </div>

            <!-- STEP 2: INVITATION -->
            <div x-show="step === 2" x-cloak class="slide-up space-y-8">
                <div>
                    <h1 class="text-4xl font-title font-extrabold tracking-tighter mb-2">Équipe Familiale.</h1>
                    <p class="text-slate-500 text-lg">L'éducation est un sport d'équipe. Invitez le conjoint.</p>
                </div>

                <div class="vercel-card p-10 rounded-3xl space-y-4">
                    <input type="email" name="spouse_email" placeholder="Email du conjoint..." class="w-full vercel-input p-4 rounded-xl font-bold bg-slate-50 focus:bg-white">
                    <p class="text-xs text-slate-400 italic">Un lien magique sera envoyé pour synchroniser vos comptes.</p>
                </div>

                <div class="flex gap-4">
                    <button @click="step = 1" class="px-8 py-5 border border-slate-200 rounded-xl font-bold uppercase tracking-widest text-[10px]">Retour</button>
                    <button @click="step = 3" class="flex-1 py-5 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs">Suivant</button>
                </div>
            </div>

            <!-- STEP 3: ENFANT & PAYS (WITH FLAGS) -->
            <div x-show="step === 3" x-cloak class="slide-up space-y-6">
                <div>
                    <h1 class="text-4xl font-title font-extrabold tracking-tighter mb-2">Votre Petit Génie.</h1>
                    <p class="text-slate-500 text-lg">Dernière étape : enregistrons votre enfant.</p>
                </div>

                <form action="" method="POST" class="space-y-4">
                    <input type="hidden" name="child_country" :value="childCountry">
                    
                    <input type="text" name="child_name" placeholder="Prénom de l'enfant" required class="w-full vercel-input p-4 rounded-xl font-bold shadow-sm">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Custom Country Selector -->
                        <div class="relative" x-data="{ open: false }">
                            <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Pays</label>
                            <button @click="open = !open" type="button" class="w-full vercel-input p-4 rounded-xl font-bold flex items-center justify-between text-xs bg-slate-50">
                                <div class="flex items-center gap-2">
                                    <img :src="'https://flagcdn.com/w20/' + childCountry.toLowerCase() + '.png'" class="w-4 h-auto">
                                    <span x-text="countries[childCountry]?.name || childCountry"></span>
                                </div>
                                <i class="fa-solid fa-chevron-down text-[10px] opacity-30"></i>
                            </button>
                            <div x-show="open" @click.away="open = false" class="absolute z-50 top-full left-0 w-full mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl max-h-60 overflow-y-auto p-2">
                                <template x-for="(info, code) in countries" :key="code">
                                    <div @click="childCountry = code; open = false" class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition">
                                        <img :src="'https://flagcdn.com/w20/' + code.toLowerCase() + '.png'" class="w-4 h-auto">
                                        <span class="text-xs font-bold" x-text="info.name"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Niveau Primaire</label>
                            <select name="child_level" class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-slate-50 appearance-none">
                                <template x-for="lvl in (levels[childCountry] || levels['INT'])" :key="lvl">
                                    <option :value="lvl" x-text="lvl"></option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Wilaya / Province</label>
                            <select name="child_region" class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-slate-50 appearance-none">
                                <option value="">Choisir...</option>
                                <template x-if="childCountry === 'DZ'">
                                    <template x-for="w in wilayas" :key="w.c">
                                        <option :value="w.n" x-text="w.n + ' ' + w.c"></option>
                                    </template>
                                </template>
                            </select>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Âge</label>
                            <input type="number" name="child_age" min="5" max="13" class="w-full vercel-input p-4 rounded-xl font-bold text-xs bg-slate-50">
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Établissement</label>
                        <input type="text" name="child_school" placeholder="Rechercher une école..." class="w-full vercel-input p-4 rounded-xl font-bold text-sm bg-slate-50">
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button type="button" @click="step = 2" class="px-8 py-5 border border-slate-200 rounded-xl font-bold uppercase tracking-widest text-[10px]">←</button>
                        <button type="submit" class="flex-1 py-5 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/20 hover:scale-[1.02] transition">Démarrer !</button>
                    </div>
                </form>
            </div>

        </div>

        <div class="mt-20 text-center">
            <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 italic">Sécurisé & Chiffré par FreeGeny Core v6.0</p>
        </div>

    </div>

    <script>
        function onboarding() {
            return {
                step: 1,
                role: 'Maman',
                childCountry: '<?= $country ?>',
                countries: <?= json_encode($supported_regions) ?>,
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</body>
</html>
