<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience (V2)
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
    
    if ($phone) {
        DB::execute("UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?", [$phone, $user_id]);
        $_SESSION['phone'] = $phone;
    }
    
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email) && filter_var($spouse_email, FILTER_VALIDATE_EMAIL)) {
        MailManager::sendInviteParent($spouse_email, $user['full_name'], $user_id);
    }
    
    $child_name = trim($_POST['child_name'] ?? '');
    $child_age = (int)($_POST['child_age'] ?? 0);
    $child_level = $_POST['child_level'] ?? '';
    $child_country = $_POST['child_country'] ?? $country;
    
    if (!empty($child_name) && $child_age > 0) {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Onboarding | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; height: 100dvh; overflow: hidden; background: #fafafa; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-caveat { font-family: 'Caveat', cursive; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .slide-enter { animation: slideIn 0.4s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        /* Fix for mobile 100vh */
        .h-svh { height: 100dvh; }
    </style>
</head>
<body class="h-svh w-full flex items-center justify-center p-0 lg:p-8" x-data="{ 
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
    regions: {
        'DZ': ['Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'],
        'MA': ['Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès', 'Tanger-Tétouan-Al Hoceïma', 'Souss-Massa'],
        'FR': ['Île-de-France', 'Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes', 'Hauts-de-France', 'Grand Est', 'Occitanie'],
        'INT': ['Europe', 'North America', 'Middle East', 'Africa', 'Asia']
    },
    next() { if(this.step < 3) this.step++ },
    prev() { if(this.step > 1) this.step-- }
}">

    <!-- MAIN CONTAINER -->
    <div class="w-full h-full lg:max-h-[90vh] max-w-[1300px] flex flex-col lg:flex-row bg-white lg:rounded-[3rem] lg:shadow-2xl overflow-hidden relative z-10">
        
        <!-- LEFT: THE DREAM -->
        <div class="hidden lg:flex flex-col flex-1 bg-slate-950 text-white p-16 justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-transparent z-10 opacity-90"></div>
            
            <div class="relative z-20 max-w-md">
                <div x-show="step === 1" x-transition class="space-y-6">
                    <span class="text-orange-500 font-caveat text-4xl block">L'Excellence mondiale</span>
                    <h2 class="text-5xl font-black font-title tracking-tighter leading-[1.1] mb-8">Votre enfant n'a plus aucune frontière.</h2>
                    <ul class="space-y-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                        <li>• Mathématiques de Singapour</li>
                        <li>• Cambridge (UK)</li>
                        <li>• Finnish Model</li>
                        <li>• STEM / STEAM</li>
                        <li>• Montessori</li>
                    </ul>
                </div>
                <div x-show="step === 2" x-transition class="space-y-6" x-cloak>
                    <span class="text-blue-400 font-caveat text-4xl block">Le village éducatif</span>
                    <h2 class="text-5xl font-black font-title tracking-tighter leading-[1.1] mb-8">Un suivi magique, un foyer uni.</h2>
                    <p class="text-slate-400 text-lg leading-relaxed">Concertez-vous avec les enseignants et votre conjoint. L'éducation est un sport d'équipe.</p>
                </div>
                <div x-show="step === 3" x-transition class="space-y-6" x-cloak>
                    <span class="text-green-400 font-caveat text-4xl block">Gratuit & Solidaire</span>
                    <h2 class="text-5xl font-black font-title tracking-tighter leading-[1.1] mb-8">Le pouvoir du clic magique.</h2>
                    <p class="text-slate-400 text-lg leading-relaxed">Passez d'un système à l'autre en un clic. Aidez un enfant ailleurs en éduquant le vôtre ici.</p>
                </div>
            </div>

            <!-- Indicateur Step -->
            <div class="absolute bottom-12 left-16 flex gap-3 z-20">
                <div class="h-1.5 transition-all duration-500" :class="step >= 1 ? 'w-12 bg-orange-500' : 'w-4 bg-slate-800'"></div>
                <div class="h-1.5 transition-all duration-500" :class="step >= 2 ? 'w-12 bg-blue-500' : 'w-4 bg-slate-800'"></div>
                <div class="h-1.5 transition-all duration-500" :class="step >= 3 ? 'w-12 bg-green-500' : 'w-4 bg-slate-800'"></div>
            </div>
        </div>

        <!-- RIGHT: FORMS -->
        <div class="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
            <div class="p-8 lg:p-16 flex-1 flex flex-col justify-center overflow-y-auto custom-scroll">
                <form action="" method="POST" class="max-w-md mx-auto w-full">
                    
                    <!-- STEP 1: Parent -->
                    <div x-show="step === 1" class="slide-enter space-y-8">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-900 tracking-tighter leading-none">Bienvenue, <br><span class="text-orange-600"><?= htmlspecialchars(explode(' ', $user['full_name'])[0]) ?></span>.</h3>
                            <p class="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Étape 1 sur 3 — Votre profil</p>
                        </div>
                        <div class="space-y-6">
                            <div class="grid grid-cols-2 gap-4">
                                <label class="cursor-pointer group">
                                    <input type="radio" name="parent_role" value="Maman" class="hidden peer" checked>
                                    <div class="p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 text-center transition peer-checked:border-orange-500 peer-checked:bg-orange-50">
                                        <div class="text-2xl mb-1">👩</div>
                                        <span class="text-[10px] font-black uppercase text-slate-600 peer-checked:text-orange-700">Maman</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer group">
                                    <input type="radio" name="parent_role" value="Papa" class="hidden peer">
                                    <div class="p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 text-center transition peer-checked:border-blue-500 peer-checked:bg-blue-50">
                                        <div class="text-2xl mb-1">👨</div>
                                        <span class="text-[10px] font-black uppercase text-slate-600 peer-checked:text-blue-700">Papa</span>
                                    </div>
                                </label>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Numéro de téléphone</label>
                                <input type="tel" name="phone" value="<?= htmlspecialchars($user['phone'] ?? '') ?>" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-500 py-4 px-5 rounded-2xl outline-none transition font-bold text-slate-900 shadow-sm">
                            </div>
                        </div>
                        <button type="button" @click="next()" class="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition shadow-xl">Suivant →</button>
                    </div>

                    <!-- STEP 2: Invitation -->
                    <div x-show="step === 2" x-cloak class="slide-enter space-y-8">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-900 tracking-tighter leading-none">Travail <br><span class="text-blue-600">d'Équipe</span>.</h3>
                            <p class="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Étape 2 sur 3 — Invitation conjoint</p>
                        </div>
                        <div class="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 space-y-4">
                            <h4 class="font-bold text-slate-900 flex items-center gap-2">🤝 Invitez le conjoint</h4>
                            <p class="text-[11px] font-medium text-slate-500 leading-relaxed italic">"Donnez un accès direct au deuxième parent pour suivre les progrès ensemble."</p>
                            <input type="email" name="spouse_email" placeholder="email@conjoint.com" class="w-full bg-white border-2 border-blue-200 focus:border-blue-600 py-4 px-5 rounded-2xl outline-none transition font-bold text-slate-900">
                        </div>
                        <div class="flex gap-4">
                            <button type="button" @click="prev()" class="px-6 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px]">←</button>
                            <button type="button" @click="next()" class="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition shadow-xl">Continuer</button>
                        </div>
                    </div>

                    <!-- STEP 3: Enfant (PRIMARY ONLY) -->
                    <div x-show="step === 3" x-cloak class="slide-enter space-y-6">
                        <div>
                            <h3 class="text-4xl font-black font-title text-slate-900 tracking-tighter leading-none">Le Petit <br><span class="text-green-600">Génie</span>.</h3>
                            <p class="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Étape 3 sur 3 — Cycle Primaire Unique</p>
                        </div>
                        <div class="space-y-4">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Prénom de l'enfant</label>
                                <input type="text" name="child_name" required placeholder="Ex: Lina" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-green-600 py-3.5 px-5 rounded-xl outline-none transition font-bold text-slate-900">
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Pays (Détection OK)</label>
                                    <div class="relative">
                                        <select x-model="childCountry" name="child_country" class="w-full bg-slate-100 border-0 py-3.5 pl-11 pr-4 rounded-xl outline-none font-bold text-slate-800 text-xs appearance-none">
                                            <template x-for="(info, code) in levels" :key="code">
                                                <option :value="code" x-text="code"></option>
                                            </template>
                                        </select>
                                        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <img :src="'https://flagcdn.com/w40/' + childCountry.toLowerCase() + '.png'" class="w-5 h-auto rounded-sm">
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Niveau (OFFICIEL)</label>
                                    <select name="child_level" required class="w-full bg-green-50 border-2 border-green-200 py-3.5 px-4 rounded-xl outline-none font-bold text-green-900 text-xs appearance-none">
                                        <template x-for="lvl in levels[childCountry]" :key="lvl">
                                            <option :value="lvl" x-text="lvl"></option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Province / Wilaya</label>
                                    <select name="child_region" class="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold text-slate-800 text-xs appearance-none overflow-hidden">
                                        <option value="">Sélectionner...</option>
                                        <template x-for="reg in regions[childCountry]" :key="reg">
                                            <option :value="reg" x-text="reg"></option>
                                        </template>
                                    </select>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Âge</label>
                                    <input type="number" name="child_age" min="5" max="13" required class="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-xl font-bold text-slate-800 text-xs outline-none">
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 font-bold"><i class="fa-solid fa-school"></i> Établissement Primaire</label>
                                <input type="text" name="child_school" placeholder="Rechercher ou saisir l'école..." class="w-full bg-white border-2 border-blue-50 focus:border-blue-500 py-3.5 px-5 rounded-xl outline-none transition font-bold text-slate-900 shadow-sm text-sm">
                            </div>
                        </div>
                        <div class="flex gap-4 pt-4">
                            <button type="button" @click="prev()" class="px-6 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px]">←</button>
                            <button type="submit" class="flex-1 py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-950 transition shadow-xl">Démarrer !</button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Footer fixed -->
            <div class="p-8 text-center border-t border-slate-50 bg-white/50 shrink-0">
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Garantie Excellence • Primaire Uniquement</p>
                <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">© FreeGeny Core v4.0 — Chiffré bout en bout</p>
            </div>
        </div>
    </div>
</body>
</html>
