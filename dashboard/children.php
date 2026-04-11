<?php
/**
 * Gestion des Enfants - Intégration Totale FreeGeny
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
$success = ''; $error = '';

// 1. Traitement BDD
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'ajouter') {
        $prenom  = trim($_POST['prenom'] ?? '');
        $nom     = trim($_POST['nom'] ?? '');
        $naiss   = $_POST['naissance'] ?? '';
        $niveau  = $_POST['niveau'] ?? '';
        $couleur = $_POST['avatar_color'] ?? '#ea580c';
        if ($prenom && $nom && $naiss && $niveau) {
            $pin = str_pad(rand(1000,9999), 4, '0', STR_PAD_LEFT);
            $alias = strtolower($prenom).rand(100,999);
            DB::insert("INSERT INTO children (parent_id, first_name, last_name, birth_date, grade_level, avatar_color, pin_code, child_id_alias) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [$userId, $prenom, $nom, $naiss, $niveau, $couleur, $pin, $alias]);
            $success = "Profil ajouté avec succès !";
        }
    }
    if ($action === 'toggle_actif') {
         $id = (int)$_POST['enfant_id'];
         DB::execute("UPDATE children SET is_active = NOT is_active WHERE id = ? AND parent_id = ?", [$id, $userId]);
    }
}

$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
$enfants = DB::fetchAll("SELECT * FROM children WHERE parent_id = ? ORDER BY created_at DESC", [$userId]);
$accentColor = $user['preferred_color'] ?? '#ea580c';

$country = $user['declared_country'] ?: 'DZ';
$lang = 'fr';

$niveaux = ['Maternelle','CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème'];
$palette = ['#ea580c', '#2563eb', '#7c3aed', '#059669', '#dc2626', '#374151'];

include_once __DIR__ . '/../includes/header.php';
?>

<style>
    .dashboard-container { min-height: calc(100vh - 96px); display: flex; }
    .dashboard-sidebar { width: 280px; background: #fff; border-right: 1px solid #f1f5f9; padding: 2rem; flex-shrink: 0; }
    .dashboard-content { flex: 1; padding: 3rem; background: #fafafa; }
    .nav-btn { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 1.25rem; font-weight: 800; font-size: 0.875rem; color: #64748b; transition: all 0.3s; margin-bottom: 0.5rem; text-decoration: none; }
    .nav-btn:hover { background: #f8fafc; color: #0f172a; }
    .nav-btn.active { background: <?= $accentColor ?>10; color: <?= $accentColor ?>; }
    .pin-blur { filter: blur(4px); transition: filter 0.2s; cursor: pointer; }
    .pin-blur:hover { filter: blur(0); }
</style>

<main class="dashboard-container">
    <aside class="dashboard-sidebar hidden lg:block">
        <nav>
            <a href="/<?= $country ?>-<?= $lang ?>/dashboard/parent" class="nav-btn">📊 Mon Profil</a>
            <a href="/<?= $country ?>-<?= $lang ?>/dashboard/children" class="nav-btn active">👶 Mes Enfants</a>
            <a href="#" class="nav-btn">🛡️ Contrôle Parental</a>
            <hr class="my-6 border-slate-100">
            <a href="/api/auth/logout.php" class="nav-btn text-red-500 hover:bg-red-50">🚪 Déconnexion</a>
        </nav>
    </aside>

    <div class="dashboard-content">
        <div class="max-w-6xl mx-auto">
            <div class="flex items-center justify-between mb-12">
                <div>
                    <h1 class="text-5xl font-black text-slate-900 tracking-tighter italic">Mes Enfants Elite</h1>
                    <p class="text-slate-400 font-bold italic">Gérez les accès et les profils scolaires</p>
                </div>
                <button onclick="Alpine.store('childModal').open = true" class="bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all italic shadow-2xl">
                    + Ajouter un enfant
                </button>
            </div>

            <?php if ($success): ?><p class="mb-8 p-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs italic animate-pulse">✓ <?= $success ?></p><?php endif; ?>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php foreach ($enfants as $e): 
                    $cInit = strtoupper(substr($e['first_name'],0,1).(isset($e['last_name'][0])?substr($e['last_name'],0,1):''));
                ?>
                <div class="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden relative <?= $e['is_active'] ? '' : 'opacity-50' ?>">
                    <div class="flex items-center space-x-5 mb-8">
                        <div class="w-16 h-16 rounded-[1.75rem] flex items-center justify-center text-white text-2xl font-black shadow-inner" style="background: <?= $e['avatar_color'] ?>"><?= $cInit ?></div>
                        <div>
                            <h3 class="text-xl font-black text-slate-900 leading-tight tracking-tight"><?= $e['first_name'] ?></h3>
                            <p class="text-[10px] font-black text-slate-400 uppercase italic mt-1"><?= $e['grade_level'] ?></p>
                        </div>
                    </div>
                    
                    <div class="space-y-4 py-6 border-t border-slate-50 italic">
                        <div class="flex justify-between text-xs font-bold"><span class="text-slate-400">Identifiant :</span> <span class="text-slate-900"><?= $e['child_id_alias'] ?></span></div>
                        <div class="flex justify-between text-xs font-bold"><span class="text-slate-400">Code PIN :</span> <span class="text-orange-600 pin-blur"><?= $e['pin_code'] ?></span></div>
                    </div>

                    <div class="flex gap-3 pt-6 border-t border-slate-50">
                        <form method="POST" class="flex-1"><input type="hidden" name="action" value="toggle_actif"><input type="hidden" name="enfant_id" value="<?= $e['id'] ?>"><button type="submit" class="w-full py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 italic transition-all"><?= $e['is_active'] ? 'Désactiver' : 'Activer' ?></button></form>
                        <button class="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">🗑</button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</main>

<!-- MODAL AJOUTER ENFANT -->
<div x-data x-show="$store.childModal.open" x-cloak class="fixed inset-0 z-[200] flex items-center justify-center p-6 text-slate-900">
    <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl" @click="$store.childModal.open = false"></div>
    <div class="relative bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl glass-card" x-transition>
        <h3 class="text-4xl font-black italic tracking-tighter mb-8 px-4">Nouvel Enfant Elite</h3>
        <form method="POST" class="space-y-8">
            <input type="hidden" name="action" value="ajouter">
            <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase px-4 italic text-orange-600">Prénom</label><input type="text" name="prenom" class="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-orange-500/10 outline-none" required></div>
                <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase px-4 italic text-orange-600">Nom</label><input type="text" name="nom" class="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-orange-500/10 outline-none" required></div>
                <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase px-4 italic">Naissance</label><input type="date" name="naissance" class="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold" required></div>
                <div class="space-y-2"><label class="text-[10px] font-black text-slate-400 uppercase px-4 italic">Niveau</label><select name="niveau" class="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none"><option value="">Choisir</option><?php foreach ($niveaux as $n): ?><option value="<?= $n ?>"><?= $n ?></option><?php endforeach; ?></select></div>
            </div>
            <div class="pt-6 border-t border-slate-50"><p class="text-[10px] font-black text-slate-400 uppercase mb-4 px-4 italic">Teinte Avatar</p><div class="flex flex-wrap gap-4 px-4"><?php foreach ($palette as $c): ?><div class="w-10 h-10 rounded-2xl cursor-pointer shadow-sm border-2 border-white hover:scale-110 transition-all" style="background:<?= $c ?>" @click="document.getElementById('cinput').value = '<?= $c ?>'; $el.parentElement.querySelectorAll('div').forEach(x => x.style.borderColor = 'white'); $el.style.borderColor = 'black'"></div><?php endforeach; ?><input type="hidden" name="avatar_color" id="cinput" value="<?= $palette[0] ?>"></div></div>
            <button type="submit" class="w-full py-6 bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-3xl hover:bg-orange-700 shadow-2xl shadow-orange-100 transition-all italic transform hover:-translate-y-1">Initialiser le Profil Enfant</button>
        </form>
    </div>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('childModal', { open: false });
    });
</script>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>
