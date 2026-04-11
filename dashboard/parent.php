<?php
/**
 * Dashboard Parent - Intégration Totale FreeGeny
 */
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (!isset($_SESSION['logged_in'])) { 
    $requestUri = $_SERVER['REQUEST_URI'];
    preg_match('/^\/([A-Z]{2}-[a-z]{2})/', $requestUri, $matches);
    $loc = $matches[1] ?? 'DZ-fr';
    header("Location: /$loc/auth/login"); 
    exit; 
}

$userId = $_SESSION['user_id'];

// 1. Traitement POST (Mise à jour)
$success_msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $prenom = htmlspecialchars(trim($_POST['prenom'] ?? ''));
    $nom    = htmlspecialchars(trim($_POST['nom'] ?? ''));
    $phone  = htmlspecialchars(trim($_POST['telephone'] ?? ''));
    $color  = $_POST['couleur'] ?? '#ea580c';
    $fullName = trim($prenom . ' ' . $nom);

    DB::execute(
        "UPDATE users SET full_name = ?, phone = ?, preferred_color = ? WHERE id = ?",
        [$fullName, $phone, $color, $userId]
    );
    $_SESSION['user_name'] = $fullName;
    $success_msg = 'Profil mis à jour.';
}

// 2. Data Fetch
$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
$childrenCount = DB::fetchOne("SELECT COUNT(*) as total FROM children WHERE parent_id = ?", [$userId])['total'];
$initials = getInitials($user['full_name']);
$nameParts = explode(' ', $user['full_name'], 2);
$prenom = $nameParts[0] ?? '';
$nom = $nameParts[1] ?? '';
$currentAvatar = $user['profile_photo'] ?? '';
$accentColor = $user['preferred_color'] ?? '#ea580c';

// On force les variables nécessaires pour le header
$country = $user['declared_country'] ?: 'DZ';
$lang = 'fr'; // Par défaut pour le moment

// INCLUSION DU HEADER OFFICIEL
include_once __DIR__ . '/../includes/header.php';
?>

<style>
    /* Ajustements pour le Dashboard à l'intérieur du layout global */
    .dashboard-container { min-height: calc(100vh - 96px); display: flex; }
    .dashboard-sidebar { width: 280px; background: #fff; border-right: 1px solid #f1f5f9; padding: 2rem; flex-shrink: 0; }
    .dashboard-content { flex: 1; padding: 3rem; background: #fafafa; }
    .nav-btn { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 1.25rem; font-weight: 800; font-size: 0.875rem; color: #64748b; transition: all 0.3s; margin-bottom: 0.5rem; text-decoration: none; }
    .nav-btn:hover { background: #f8fafc; color: #0f172a; }
    .nav-btn.active { background: <?= $accentColor ?>10; color: <?= $accentColor ?>; }
    
    @media (max-width: 1024px) {
        .dashboard-container { flex-direction: column; }
        .dashboard-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #f1f5f9; }
    }
</style>

<main class="dashboard-container">
    
    <!-- DASHBOARD SIDEBAR -->
    <aside class="dashboard-sidebar hidden lg:block">
        <div class="mb-10 text-center">
            <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-slate-50 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden cursor-pointer" onclick="Alpine.store('vault').open = true">
                <?php if ($currentAvatar): ?>
                    <img src="<?= $currentAvatar ?>" class="w-full h-full object-cover">
                <?php else: ?>
                    <span class="text-2xl font-black text-slate-300"><?= $initials ?></span>
                <?php endif; ?>
            </div>
            <h3 class="text-sm font-black text-slate-900 mb-1"><?= $user['full_name'] ?></h3>
            <p class="text-[9px] font-black text-orange-600 uppercase tracking-widest italic">Parent Elite</p>
        </div>

        <nav>
            <a href="/<?= $country ?>-<?= $lang ?>/dashboard/parent" class="nav-btn active">📊 Mon Profil</a>
            <a href="/<?= $country ?>-<?= $lang ?>/dashboard/children" class="nav-btn">👶 Mes Enfants</a>
            <a href="#" class="nav-btn">🛡️ Contrôle Parental</a>
            <hr class="my-6 border-slate-100">
            <a href="/api/auth/logout.php" class="nav-btn text-red-500 hover:bg-red-50">🚪 Déconnexion</a>
        </nav>
    </aside>

    <!-- DASHBOARD MAIN CONTENT -->
    <div class="dashboard-content">
        <div class="max-w-4xl mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-6 mb-12">
                <div>
                    <h1 class="text-5xl font-black text-slate-900 tracking-tighter italic">Tableau de Bord</h1>
                    <p class="text-slate-400 font-bold italic"><?php echo __('hero_subtitle'); ?></p>
                </div>
                <?php if ($success_msg): ?>
                    <div class="px-6 py-3 bg-green-50 text-green-600 rounded-2xl font-black text-xs italic shadow-sm border border-green-100 animate-bounce">
                        ✓ <?= $success_msg ?>
                    </div>
                <?php endif; ?>
            </div>

            <form method="POST" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <!-- Avatar -->
                <div class="lg:col-span-1">
                    <div class="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 text-center">
                        <div class="w-24 h-24 mx-auto mb-6 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden cursor-pointer group" onclick="Alpine.store('vault').open = true">
                             <?php if ($currentAvatar): ?>
                                <img src="<?= $currentAvatar ?>" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                            <?php else: ?>
                                <span class="text-3xl font-black text-slate-200"><?= $initials ?></span>
                            <?php endif; ?>
                        </div>
                        <button type="button" onclick="Alpine.store('vault').open = true" class="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all italic shadow-xl">
                            Modifier la photo
                        </button>
                    </div>
                </div>

                <!-- Fields -->
                <div class="lg:col-span-2">
                    <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-3">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 italic">Prénom</label>
                                <input type="text" name="prenom" value="<?= $prenom ?>" class="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 outline-none" required>
                            </div>
                            <div class="space-y-3">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 italic">Nom</label>
                                <input type="text" name="nom" value="<?= $nom ?>" class="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 outline-none" required>
                            </div>
                            <div class="space-y-3 md:col-span-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 italic">Téléphone Elite</label>
                                <input type="tel" name="telephone" value="<?= $user['phone'] ?>" placeholder="+213..." class="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 outline-none">
                            </div>
                        </div>

                        <div class="mt-10 pt-10 border-t border-slate-50">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 italic mb-6 block">Couleur d'Ambiance</label>
                            <div class="flex flex-wrap gap-4">
                                <?php
                                $colors = ['#ea580c', '#2563eb', '#7c3aed', '#059669', '#dc2626', '#374151'];
                                foreach ($colors as $hex):
                                ?>
                                    <div class="w-12 h-12 rounded-2xl cursor-pointer transition-all hover:scale-110 shadow-sm border-4 <?= $accentColor == $hex ? 'border-slate-900 shadow-xl scale-105' : 'border-white' ?>"
                                         style="background: <?= $hex ?>;"
                                         onclick="document.getElementById('color_field').value = '<?= $hex ?>'; this.parentElement.querySelectorAll('div').forEach(d=>d.classList.remove('border-slate-900','shadow-xl','scale-105')); this.classList.add('border-slate-900','shadow-xl','scale-105');">
                                    </div>
                                <?php endforeach; ?>
                                <input type="hidden" name="couleur" id="color_field" value="<?= $accentColor ?>">
                            </div>
                        </div>

                        <div class="mt-12 flex justify-end">
                            <button type="submit" class="bg-orange-600 py-5 px-12 text-white text-xs font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-orange-100 hover:bg-orange-700 transition-all transform hover:-translate-y-1 italic">
                                Enregistrer mon profil elite
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</main>

<!-- VAULT MODAL (Via Alpine Store pour être accessible partout) -->
<div x-data x-show="$store.vault.open" x-cloak class="fixed inset-0 z-[200] flex items-center justify-center p-6">
    <div class="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl" @click="$store.vault.open = false"></div>
    <div class="relative bg-white w-full max-w-4xl rounded-[4rem] p-12 shadow-2xl overflow-hidden glass-card" x-transition>
        <div class="flex justify-between items-center mb-10">
            <h3 class="text-4xl font-black text-slate-900 italic tracking-tighter leading-none px-4">Voûte FreeGeny</h3>
            <button @click="$store.vault.open = false" class="w-14 h-14 bg-slate-50 rounded-2xl font-black text-slate-400">✕</button>
        </div>

        <div class="space-y-12">
            <label class="block p-10 bg-orange-50/50 rounded-[3rem] border-2 border-dashed border-orange-100 hover:border-orange-500 cursor-pointer text-center group transition-all">
                <span class="text-4xl block mb-3 group-hover:-translate-y-1 transition-transform">📸</span>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Portrait Personnel (Moteur Elite)</span>
                <input type="file" class="hidden" @change="$store.vault.upload($event)">
            </label>

            <div class="max-h-[40vh] overflow-y-auto custom-scroll pr-6">
                <?php
                $avatarStyles = ['micah' => ['Oliver','Caleb','Jack','Avery','Riley','Jordan'], 'avataaars' => ['Robert','Kimberly','Matthew','Susan','James','Linda']];
                foreach ($avatarStyles as $style => $seeds): ?>
                    <h4 class="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6 mt-10 italic px-4">— STYLE <?= strtoupper($style) ?> —</h4>
                    <div class="grid grid-cols-3 md:grid-cols-6 gap-6 px-4">
                        <?php foreach ($seeds as $seed): 
                            $link = "https://api.dicebear.com/7.x/$style/svg?seed=$seed&backgroundColor=f8fafc";
                        ?>
                        <button @click="$store.vault.select('<?= $link ?>')" class="aspect-square bg-slate-50 rounded-[2rem] p-2 border-2 border-transparent hover:border-orange-500 transition-all transform hover:scale-105 shadow-sm">
                            <img src="<?= $link ?>" class="w-full h-full">
                        </button>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <div x-show="$store.vault.loading" class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-[210]">
             <p class="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse italic">Synchronisation Elite Identity...</p>
        </div>
    </div>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('vault', {
            open: false,
            loading: false,
            async upload(e) {
                const formData = new FormData(); formData.append('avatar_file', e.target.files[0]);
                this.loading = true;
                const res = await fetch('/api/user/upload_avatar.php', { method: 'POST', body: formData });
                if (res.ok) window.location.reload(); else { alert('Erreur'); this.loading = false; }
            },
            async select(url) {
                this.loading = true;
                await fetch('/api/user/upload_avatar.php', { method: 'POST', body: JSON.stringify({ avatar_choice: url }) });
                window.location.reload();
            }
        })
    })
</script>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>
