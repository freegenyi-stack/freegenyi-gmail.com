<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V3)
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
require_once __DIR__ . '/../includes/MailManager.php';

// Redirige au login si non connecté
if (empty($_SESSION['logged_in'])) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/auth/login");
    exit;
}

$user_id = $_SESSION['user_id'];
$user = DB::fetchOne("SELECT id, full_name, phone FROM users WHERE id = ?", [$user_id]);

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $phone = $_POST['phone'] ?? null;
    $role = $_POST['parent_role'] ?? 'Maman';
    
    // 1. Mise à jour Parent
    if ($phone) {
        DB::execute("UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?", [$phone, $user_id]);
        $_SESSION['phone'] = $phone;
    }
    
    // 2. Invitation conjoint
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email)) {
        MailManager::sendInviteParent($spouse_email, $user['full_name'], $user_id);
    }
    
    // 3. Insertion de l'enfant
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
    <title>Onboarding | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
    levels: {
        'DZ': ['1AP', '2AP', '3AP', '4AP', '5AP'],
        'MA': ['1AP', '2AP', '3AP', '4AP', '5AP', '6AP'],
        'TN': ['1ère Année', '2ème Année', '3ème Année', '4ème Année', '5ème Année', '6ème Année'],
        'FR': ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        'US': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        'INT': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
    },
    wilayas: [
        { name: 'Adrar', code: '01000' }, { name: 'Chlef', code: '02000' }, { name: 'Laghouat', code: '03000' }, 
        { name: 'Oum El Bouaghi', code: '04000' }, { name: 'Batna', code: '05000' }, { name: 'Béjaïa', code: '06000' }, 
        { name: 'Biskra', code: '07000' }, { name: 'Béchar', code: '08000' }, { name: 'Blida', code: '09000' }
        // ... (on peut peupler le reste après)
    ],
    next() { this.step++ },
    prev() { this.step-- }
}">

    <div class="w-full max-w-[1200px] min-h-[600px] flex flex-col lg:flex-row bg-white lg:rounded-[3rem] lg:shadow-2xl overflow-hidden shadow-none rounded-none">
        
        <!-- LEFT AREA -->
        <div class="hidden lg:flex flex-col flex-1 bg-slate-900 text-white p-12 justify-center relative">
            <div class="relative z-20">
                <div x-show="step === 1">
                    <span class="text-orange-500 font-caveat text-4xl block mb-4">L'Excellence mondiale</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Votre enfant n'a plus aucune frontière.</h2>
                </div>
                <div x-show="step === 2" x-cloak>
                    <span class="text-blue-400 font-caveat text-4xl block mb-4">Travail d'Équipe</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Un suivi magique, un foyer uni.</h2>
                </div>
                <div x-show="step === 3" x-cloak>
                    <span class="text-green-400 font-caveat text-4xl block mb-4">Le Petit Génie</span>
                    <h2 class="text-5xl font-black font-title leading-tight mb-8">Le cycle primaire libéré.</h2>
                </div>
            </div>
            
            <div class="absolute bottom-12 left-12 flex gap-2">
                <div class="h-1 lg:h-1.5 transition-all duration-300" :class="step >= 1 ? 'w-12 bg-orange-500' : 'w-4 bg-slate-800'"></div>
                <div class="h-1 lg:h-1.5 transition-all duration-300" :class="step >= 2 ? 'w-12 bg-blue-500' : 'w-4 bg-slate-800'"></div>
                <div class="h-1 lg:h-1.5 transition-all duration-300" :class="step >= 3 ? 'w-12 bg-green-500' : 'w-4 bg-slate-800'"></div>
            </div>
        </div>

        <!-- RIGHT AREA -->
        <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white">
            <form action="" method="POST" class="max-w-md mx-auto w-full space-y-8">
                
                <!-- STEP 1: ROLES (TEXT ONLY) -->
                <div x-show="step === 1" class="slide-enter space-y-6">
                    <h3 class="text-3xl font-black font-title text-slate-900 tracking-tighter">Votre Rôle</h3>
                    <div class="grid grid-cols-1 gap-3">
                        <label class="cursor-pointer">
                            <input type="radio" name="parent_role" value="Maman" class="hidden peer" checked>
                            <div class="p-4 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:text-orange-600 transition">Maman</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="parent_role" value="Papa" class="hidden peer">
                            <div class="p-4 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:text-orange-600 transition">Papa</div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="parent_role" value="Tuteur légal" class="hidden peer">
                            <div class="p-4 border-2 border-slate-100 rounded-xl font-bold text-slate-700 peer-checked:border-orange-500 peer-checked:text-orange-600 transition">Tuteur légal</div>
                        </label>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Numéro de téléphone</label>
                        <input type="tel" name="phone" value="<?= htmlspecialchars($user['phone'] ?? '') ?>" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-5 rounded-xl outline-none font-bold text-slate-900">
                    </div>
                    <button type="button" @click="next()" class="w-full py-5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition shadow-xl">Continuer →</button>
                </div>

                <!-- STEP 2: INVITATION -->
                <div x-show="step === 2" x-cloak class="slide-enter space-y-6">
                    <h3 class="text-3xl font-black font-title text-slate-900 tracking-tighter">Invitation Conjoint</h3>
                    <p class="text-sm text-slate-500 font-medium leading-relaxed">Invitez le deuxième parent à rejoindre l'espace familial.</p>
                    <div class="space-y-4">
                        <input type="email" name="spouse_email" placeholder="email@conjoint.com" class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-5 rounded-xl outline-none font-bold text-slate-900">
                    </div>
                    <div class="flex gap-3">
                        <button type="button" @click="prev()" class="px-6 py-5 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px]">←</button>
                        <button type="button" @click="next()" class="flex-1 py-5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition shadow-xl">Suivant</button>
                    </div>
                </div>

                <!-- STEP 3: ENFANT -->
                <div x-show="step === 3" x-cloak class="slide-enter space-y-5">
                    <h3 class="text-3xl font-black font-title text-slate-900 tracking-tighter text-center lg:text-left">Cycle Primaire</h3>
                    <input type="text" name="child_name" placeholder="Prénom de l'enfant" required class="w-full bg-slate-50 border-2 border-slate-100 py-4 px-5 rounded-xl outline-none font-bold text-slate-900">
                    
                    <div class="grid grid-cols-2 gap-3">
                        <!-- PAYS EXACTEMENT COMME ACCUEIL -->
                        <div class="space-y-1">
                            <label class="text-[10px] font-black tracking-widest text-slate-400">Pays</label>
                            <div class="relative">
                                <select x-model="childCountry" name="child_country" class="w-full bg-slate-50 border-2 border-slate-100 py-3.5 pl-10 pr-4 rounded-xl font-bold text-slate-800 text-xs appearance-none">
                                    <?php foreach ($supported_regions as $code => $info): ?>
                                        <option value="<?= $code ?>" <?= $country == $code ? 'selected' : '' ?>><?= $info['name'] ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <img :src="'https://flagcdn.com/w20/' + childCountry.toLowerCase() + '.png'" class="w-4 h-auto rounded-sm">
                                </div>
                            </div>
                        </div>
                        <!-- NIVEAUX DYNAMIQUES -->
                        <div class="space-y-1">
                            <label class="text-[10px] font-black tracking-widest text-slate-400">Niveau Primaire</label>
                            <select name="child_level" class="w-full bg-slate-50 border-2 border-slate-100 py-3.5 px-4 rounded-xl font-bold text-slate-800 text-xs appearance-none">
                                <template x-for="lvl in levels[childCountry] || levels['INT']" :key="lvl">
                                    <option :value="lvl" x-text="lvl"></option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black tracking-widest text-slate-400">Région (Wilaya)</label>
                            <select name="child_region" class="w-full bg-slate-50 border-2 border-slate-100 py-3.5 px-4 rounded-xl font-bold text-slate-800 text-xs appearance-none">
                                <option value="">Choisir...</option>
                                <template x-if="childCountry === 'DZ'">
                                    <template x-for="w in wilayas" :key="w.code">
                                        <option :value="w.name" x-text="w.name + ' ' + w.code"></option>
                                    </template>
                                </template>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black tracking-widest text-slate-400">Âge</label>
                            <input type="number" name="child_age" min="5" max="12" class="w-full bg-slate-50 border-2 border-slate-100 py-3.5 px-4 rounded-xl font-bold text-slate-800 text-xs">
                        </div>
                    </div>

                    <input type="text" name="child_school" placeholder="Nom de l'école" class="w-full bg-white border-2 border-slate-100 focus:border-blue-500 py-4 px-5 rounded-xl font-bold text-slate-900 text-sm">
                    
                    <div class="flex gap-3">
                        <button type="button" @click="prev()" class="px-6 py-5 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px]">←</button>
                        <button type="submit" class="flex-1 py-5 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition shadow-xl">C'est parti !</button>
                    </div>
                </div>

                <div class="pt-6 text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                    Sécurisé et Chiffré par FreeGeny Core
                </div>
            </form>
        </div>
    </div>
</body>
</html>
