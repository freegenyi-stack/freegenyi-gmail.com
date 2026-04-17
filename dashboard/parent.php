<?php
/**
 * dashboard/parent.php - Elite Dashboard Version (Unified Family Support)
 */
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

// 1. SÉCURITÉ : Redirection immédiate si non connecté (AVANT TOUT AFFICHAGE)
if (empty($_SESSION['logged_in'])) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/auth/login");
    exit;
}

$user_id = $_SESSION['user_id'];

// 2. RÉCUPÉRATION DES ENFANTS
try {
    $children_raw = DB::fetchAll(
        "SELECT * FROM children WHERE parent_id = ?", 
        [$user_id]
    );
} catch (Throwable $e) {
    $children_raw = [];
}

// 3. LOGIQUE MÉTIER : Redirection si aucun enfant trouvé
if (empty($children_raw)) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/dashboard/onboarding");
    exit;
}

// 4. PRÉPARATION DES DONNÉES
$children = [];
foreach ($children_raw as $child) {
    $children[] = [
        'id' => $child['id'],
        'name' => $child['first_name'] ?? 'Enfant',
        'grade' => $child['grade_level'] ?? 'N/A',
        'xp' => $child['xp_total'] ?? 0,
        'progress' => $child['progress_percent'] ?? 0,
        'interest' => $child['field_of_interest'] ?? 'Exploration',
        'subjects' => [
            ['name' => 'Arabe', 'score' => 0, 'color' => 'orange'],
            ['name' => 'Maths', 'score' => 0, 'color' => 'blue'],
            ['name' => 'Science', 'score' => 0, 'color' => 'teal']
        ]
    ];
}

// 5. MAINTENANT ON PEUT AFFICHER LE HEADER
require_once __DIR__ . '/../includes/header.php';
?>

<div class="bg-slate-50 min-h-screen" style="font-family: 'DM Sans', sans-serif;">
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        <!-- Header du Dashboard -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
                <h1 class="text-4xl font-black text-slate-900 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Cockpit Parent</h1>
                <p class="text-slate-500 font-light mt-1">Gérez et suivez l'évolution de vos petits génies.</p>
            </div>
            <div class="flex gap-4 w-full md:w-auto">
                <a href="/dashboard/add_child.php" class="flex-1 md:flex-none text-center bg-white border border-slate-200 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-xl transition-all">
                    + Ajouter un enfant
                </a>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-12">
            
            <!-- Colonne Principale : Enfants -->
            <div class="lg:col-span-2 space-y-12">
                <?php foreach($children as $child): ?>
                <div class="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group">
                    <div class="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div class="relative z-10">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                            <div class="flex items-center gap-6">
                                <div class="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl relative">
                                    🦊
                                    <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-600 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold">
                                        ✓
                                    </div>
                                </div>
                                <div>
                                    <h2 class="text-3xl font-black text-slate-900 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;"><?php echo htmlspecialchars($child['name']); ?></h2>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Niveau : <?php echo $child['grade']; ?></span>
                                        <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Premium Plus</span>
                                    </div>
                                </div>
                            </div>
                            <a href="/dashboard/child_lobby.php?id=<?php echo $child['id']; ?>" class="w-full md:w-auto bg-slate-950 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-200 text-center">
                                Mode Apprenant
                            </a>
                        </div>

                        <!-- Stats Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 text-center">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">XP</p>
                                <p class="text-2xl font-black text-slate-900"><?php echo number_format($child['xp']); ?></p>
                            </div>
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 text-center">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Progrès</p>
                                <p class="text-2xl font-black text-slate-900"><?php echo $child['progress']; ?>%</p>
                            </div>
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 text-center">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Passion</p>
                                <p class="text-xl font-black text-slate-900 truncate"><?php echo $child['interest']; ?></p>
                            </div>
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 text-center">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Statut</p>
                                <p class="text-2xl font-black text-orange-600">Élite</p>
                            </div>
                        </div>

                        <!-- Emotional Boost -->
                        <div class="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-[2.5rem] border border-orange-100/50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div class="flex items-center gap-5">
                                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 18.254l-5.233 2.75 1-5.827L3.535 11.05l5.85-.85L12 4.873l2.615 5.327 5.85.85-4.232 4.127 1 5.827L12 18.254z"/></svg>
                                </div>
                                <div class="text-center md:text-left">
                                    <h4 class="text-sm font-black text-orange-950 uppercase tracking-tight">Boost émotionnel</h4>
                                    <p class="text-xs text-orange-600 font-medium italic">Encouragez <?php echo $child['name']; ?> maintenant.</p>
                                </div>
                            </div>
                            <button class="bg-white text-orange-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-xl transition-all">Enregistrer</button>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Colonne Latérale : Outils -->
            <div class="space-y-12">
                <div class="bg-white rounded-[2.5rem] p-10 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 14h.01M16 10h.01M16 6h.01M2 17h20a2 2 0 002-2V7a2 2 0 00-2-2H2a2 2 0 00-2 2v8a2 2 0 002 2zm16-12v11l-5-5-5 5V5h10z"/></svg>
                        </div>
                        <h3 class="text-xl font-black text-slate-900 leading-tight">Printable Factory</h3>
                    </div>
                    <p class="text-sm text-slate-500 font-light leading-relaxed mb-8">Générez ses cahiers de révision personnalisés basés sur ses points faibles.</p>
                    <button class="w-full bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">Générer le dossier</button>
                </div>

                <div class="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-orange-600 blur-[80px] opacity-20"></div>
                    <div class="relative z-10">
                        <span class="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-6 block">Le Pont suggère</span>
                        <p class="text-xl font-bold leading-relaxed mb-10" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                            "<?php echo $children[0]['name']; ?> a excellé en Maths. Offrez-lui une partie de foot au parc ce samedi ?"
                        </p>
                        <div class="flex gap-4">
                            <button class="flex-1 bg-orange-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all">Valider</button>
                            <button class="flex-1 bg-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Ignorer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
