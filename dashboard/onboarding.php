<?php
/**
 * dashboard/onboarding.php - The Elite Onboarding Experience
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

// Redirige au login si non connecté
if (empty($_SESSION['logged_in'])) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/auth/login");
    exit;
}

$user_id = $_SESSION['user_id'];

// Initialisation via la BDD pour voir s'il a déjà rempli
$user = DB::query("SELECT id, first_name, last_name, phone FROM users WHERE id = ?", [$user_id])->fetch();

// Traitement du formulaire final en AJAX ou POST basique (Ici POST pour la robustesse)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $phone = $_POST['phone'] ?? null;
    $role = $_POST['parent_role'] ?? 'Maman';
    // Mettre à jour le parent
    if ($phone) {
        DB::execute("UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?", [$phone, $user_id]);
        $_SESSION['phone'] = $phone;
    }
    
    // Insérer l'enfant si fourni
    $child_name = trim($_POST['child_name'] ?? '');
    $child_age = (int)($_POST['child_age'] ?? 0);
    $child_level = $_POST['child_level'] ?? '';
    
    if (!empty($child_name) && $child_age > 0) {
        $stmt = DB::execute("INSERT INTO children (parent_id, first_name, age, education_level, created_at) VALUES (?, ?, ?, ?, NOW())",
            [$user_id, $child_name, $child_age, $child_level]);
    }
    
    // Si un email conjoint est fourni (simulation)
    $spouse_email = trim($_POST['spouse_email'] ?? '');
    if (!empty($spouse_email)) {
        // Todo: Mailer logique
    }
    
    // Terminé !
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/dashboard/parent");
    exit;
}

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-caveat { font-family: 'Caveat', cursive; }
        .glass-card { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); }
        .slide-enter { animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .slide-exit { animation: slideOutLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px) scale(0.98); }
            to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideOutLeft {
            from { opacity: 1; transform: translateX(0) scale(1); }
            to { opacity: 0; transform: translateX(-30px) scale(0.98); }
        }
    </style>
</head>
<body class="min-h-[100dvh] w-full flex items-center justify-center bg-slate-50 relative overflow-hidden" x-data="{ 
    step: 1,
    maxSteps: 3,
    direction: 1,
    nextStep() { 
        if(this.step < this.maxSteps) { this.direction = 1; this.step++; } 
    },
    prevStep() { 
        if(this.step > 1) { this.direction = -1; this.step--; } 
    }
}">

    <!-- Background magique -->
    <div class="fixed inset-0 pointer-events-none opacity-40">
        <div class="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-orange-200 rounded-full blur-[150px]"></div>
        <div class="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-200 rounded-full blur-[150px]"></div>
    </div>

    <!-- Container Principal (Split Screen) -->
    <div class="w-full max-w-[1400px] h-[100dvh] lg:h-[85vh] lg:rounded-[3rem] lg:shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 bg-white/50 border-0 lg:border border-white/60">
        
        <!-- ======================= GAUCHE : LE RÊVE ======================= -->
        <div class="hidden lg:flex flex-col flex-1 bg-slate-950 text-white relative p-16 items-center justify-center overflow-hidden">
            <!-- Particules de fond -->
            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
            
            <div class="relative w-full max-w-lg z-10">
                
                <!-- Slide 1 -->
                <div x-show="step === 1" x-transition:enter="transition ease-out duration-700 delay-200" x-transition:enter-start="opacity-0 translate-y-8" x-transition:enter-end="opacity-100 translate-y-0" class="absolute inset-0 flex flex-col justify-center">
                    <span class="text-orange-500 font-caveat text-3xl mb-4 ml-1">L'Excellence mondiale</span>
                    <h2 class="text-5xl font-title font-black leading-[1.1] mb-8 tracking-tighter">Votre enfant n'a plus aucune frontière.</h2>
                    <div class="flex flex-wrap gap-3">
                        <span class="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/5 backdrop-blur-md">Mathématiques de Singapour</span>
                        <span class="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/5 backdrop-blur-md">Cambridge (UK)</span>
                        <span class="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/5 backdrop-blur-md">Finnish Model</span>
                        <span class="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/5 backdrop-blur-md">STEM / STEAM</span>
                        <span class="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/5 backdrop-blur-md">Montessori</span>
                    </div>
                </div>

                <!-- Slide 2 -->
                <div x-show="step === 2" x-transition:enter="transition ease-out duration-700 delay-200" x-transition:enter-start="opacity-0 translate-y-8" x-transition:enter-end="opacity-100 translate-y-0" x-cloak class="absolute inset-0 flex flex-col justify-center">
                    <span class="text-blue-400 font-caveat text-3xl mb-4 ml-1">Le village éducatif</span>
                    <h2 class="text-5xl font-title font-black leading-[1.1] mb-6 tracking-tighter">Un suivi magique, un foyer uni.</h2>
                    <p class="text-slate-300 text-lg font-light leading-relaxed mb-6">Restez synchronisés. Suivez les progrès ensemble, recevez des alertes en temps réel et concertez-vous facilement avec les enseignants du monde entier.</p>
                    <div class="flex gap-4 items-center">
                        <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><i class="fa-solid fa-bell text-orange-500"></i></div>
                        <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><i class="fa-solid fa-comments text-blue-400"></i></div>
                        <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><i class="fa-solid fa-chart-line text-green-400"></i></div>
                    </div>
                </div>

                <!-- Slide 3 -->
                <div x-show="step === 3" x-transition:enter="transition ease-out duration-700 delay-200" x-transition:enter-start="opacity-0 translate-y-8" x-transition:enter-end="opacity-100 translate-y-0" x-cloak class="absolute inset-0 flex flex-col justify-center">
                    <span class="text-green-400 font-caveat text-3xl mb-4 ml-1">Gratuit. Global. Solidaire.</span>
                    <h2 class="text-5xl font-title font-black leading-[1.1] mb-6 tracking-tighter">Le pouvoir du clic magique.</h2>
                    <p class="text-slate-300 text-lg font-light leading-relaxed">
                        Passez d'un système éducatif à un autre, d'une culture à une autre, en maîtrisant les langues d'un glissement de doigt. Et pendant que votre enfant s'élève, FreeGeny reverse ses ressources pour parrainer des enfants dans les régions défavorisées du monde.
                    </p>
                </div>

            </div>
            
            <!-- Logo bas -->
            <div class="absolute bottom-10 left-16 flex items-center gap-3">
                <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 brightness-0 invert opacity-90">
                <span class="text-xl font-black uppercase font-title tracking-tighter text-white">Free<span class="text-orange-500">Geny</span></span>
            </div>
            
            <!-- Indicateur de progression visuel -->
            <div class="absolute bottom-12 right-16 flex gap-2">
                <div class="h-1.5 rounded-full transition-all duration-500" :class="step >= 1 ? 'w-8 bg-orange-500' : 'w-4 bg-slate-800'"></div>
                <div class="h-1.5 rounded-full transition-all duration-500" :class="step >= 2 ? 'w-8 bg-blue-400' : 'w-4 bg-slate-800'"></div>
                <div class="h-1.5 rounded-full transition-all duration-500" :class="step >= 3 ? 'w-8 bg-green-400' : 'w-4 bg-slate-800'"></div>
            </div>
        </div>

        <!-- ======================= DROITE : LE FORMULAIRE ======================= -->
        <div class="flex-1 bg-white relative flex flex-col overflow-y-auto custom-scroll w-full lg:max-w-xl">
            
            <!-- En-tête mobile -->
            <div class="lg:hidden p-6 pb-0 flex items-center gap-3">
                <img src="/assets/img/logo.png" alt="FreeGeny" class="h-6">
                <span class="text-lg font-black uppercase font-title tracking-tighter text-slate-900">Free<span class="text-orange-500">Geny</span></span>
            </div>

            <div class="p-8 sm:p-12 lg:p-16 flex-1 flex flex-col justify-center">
                <form action="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/onboarding" method="POST" id="onboardingForm" class="w-full">
                    
                    <!-- STEP 1 : Profil du garant -->
                    <div x-show="step === 1" x-transition:enter="slide-enter" class="space-y-6">
                        <div>
                            <h3 class="text-3xl font-black font-title text-slate-950 tracking-tight">Bonjour <?= htmlspecialchars($user['first_name'] ?? 'Parent') ?> !</h3>
                            <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Étape 1 sur 3 — Faisons connaissance</p>
                        </div>
                        
                        <div class="space-y-5 mt-8">
                            <div>
                                <label class="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Quel est votre rôle ?</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <label class="cursor-pointer">
                                        <input type="radio" name="parent_role" value="Maman" class="peer hidden" checked>
                                        <div class="py-3 sm:py-4 px-4 rounded-xl border-2 border-slate-100 peer-checked:border-orange-500 peer-checked:bg-orange-50 text-center transition-all">
                                            <span class="block font-bold text-slate-800 peer-checked:text-orange-700 text-sm">Maman</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="parent_role" value="Papa" class="peer hidden">
                                        <div class="py-3 sm:py-4 px-4 rounded-xl border-2 border-slate-100 peer-checked:border-orange-500 peer-checked:bg-orange-50 text-center transition-all">
                                            <span class="block font-bold text-slate-800 peer-checked:text-orange-700 text-sm">Papa</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer col-span-2">
                                        <input type="radio" name="parent_role" value="Tuteur Légal" class="peer hidden">
                                        <div class="py-3 sm:py-4 px-4 rounded-xl border-2 border-slate-100 peer-checked:border-slate-800 peer-checked:bg-slate-50 text-center transition-all">
                                            <span class="block font-bold text-slate-800 text-sm">Tuteur Légal / Autre</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Téléphone (Optionnel mais recommandé pour les alertes)</label>
                                <input type="tel" name="phone" placeholder="+213..." value="<?= htmlspecialchars($user['phone'] ?? '') ?>" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-500 focus:bg-white px-4 py-3.5 rounded-xl outline-none transition-all font-semibold text-slate-900">
                            </div>
                        </div>

                        <div class="pt-8 text-right">
                            <button type="button" @click="nextStep()" class="bg-slate-900 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-slate-900/20">Suivant →</button>
                        </div>
                    </div>

                    <!-- STEP 2 : Inviter le conjoint -->
                    <div x-show="step === 2" x-transition:enter="slide-enter" x-cloak class="space-y-6">
                        <div>
                            <h3 class="text-3xl font-black font-title text-slate-950 tracking-tight">Le travail d'équipe.</h3>
                            <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Étape 2 sur 3 — Impliquer l'autre parent</p>
                        </div>
                        
                        <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mt-6">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 shadow-sm"><i class="fa-solid fa-envelope"></i></div>
                            <h4 class="font-bold text-slate-900 mb-2">Inviter le deuxième parent</h4>
                            <p class="text-sm text-slate-600 leading-relaxed font-medium mb-5">
                                Permettez à votre conjoint d'avoir son propre accès pour suivre l'évolution, recevoir les alertes des professeurs et se concerter avec vous en temps réel.
                            </p>
                            
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-wider text-blue-800 mb-1">Email du conjoint (Optionnel)</label>
                                <input type="email" name="spouse_email" placeholder="email@exemple.com" class="w-full bg-white border-2 border-blue-100 focus:border-blue-500 px-4 py-3.5 rounded-xl outline-none transition-all font-semibold text-slate-900">
                            </div>
                        </div>

                        <div class="pt-8 flex justify-between">
                            <button type="button" @click="prevStep()" class="text-slate-500 hover:text-slate-800 px-2 py-3 font-bold uppercase tracking-widest text-[10px] transition-all">← Précédent</button>
                            <button type="button" @click="nextStep()" class="bg-slate-900 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-lg">Continuer →</button>
                        </div>
                    </div>

                    <!-- STEP 3 : Ajouter l'enfant -->
                    <div x-show="step === 3" x-transition:enter="slide-enter" x-cloak class="space-y-6">
                        <div>
                            <h3 class="text-3xl font-black font-title text-slate-950 tracking-tight">Le Héros de l'histoire.</h3>
                            <p class="text-slate-500 font-bold text-[11px] uppercase tracking-widest mt-2">Étape 3 sur 3 — Ajouter votre premier enfant</p>
                        </div>
                        
                        <div class="space-y-5 mt-8">
                            <div>
                                <label class="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Prénom de l'enfant *</label>
                                <input type="text" name="child_name" required placeholder="Ex: Lina" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-500 focus:bg-white px-4 py-3.5 rounded-xl outline-none transition-all font-semibold text-slate-900 shadow-sm">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Âge *</label>
                                    <input type="number" name="child_age" min="3" max="18" required placeholder="Ex: 8" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-500 focus:bg-white px-4 py-3.5 rounded-xl outline-none transition-all font-semibold text-slate-900">
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Cycle principal</label>
                                    <select name="child_level" class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-500 focus:bg-white px-4 py-3.5 rounded-xl outline-none transition-all font-semibold text-slate-900 appearance-none cursor-pointer">
                                        <option value="Preschool">Pré-scolaire (Maternelle)</option>
                                        <option value="Primary">Primaire</option>
                                        <option value="Middle">Collège (Moyen)</option>
                                        <option value="High">Lycée (Secondaire)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="pt-8 flex justify-between">
                            <button type="button" @click="prevStep()" class="text-slate-500 hover:text-slate-800 px-2 py-3 font-bold uppercase tracking-widest text-[10px] transition-all">← Retour</button>
                            <button type="submit" class="bg-orange-600 hover:bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-orange-600/30">
                                Démarrer l'aventure !
                            </button>
                        </div>
                    </div>

                </form>
            </div>

            <!-- Footer safe area -->
            <div class="p-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Sécurisé et Chiffré par FreeGeny Core
            </div>
        </div>

    </div>

</body>
</html>
