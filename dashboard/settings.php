<?php
/**
 * dashboard/settings.php - Personnalisation Élite (Thèmes & Avatars)
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

initSession();

if (empty($_SESSION['logged_in'])) {
    header("Location: /auth/login");
    exit;
}

$user_id = $_SESSION['user_id'];
$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$user_id]);

include_once __DIR__ . '/../includes/header.php';
?>

<div class="bg-slate-50 min-h-screen pb-20" style="font-family: 'DM Sans', sans-serif;">
    <div class="max-w-5xl mx-auto px-6 py-16">
        
        <div class="mb-16">
            <h1 class="text-4xl font-black text-slate-900 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Personnalisation</h1>
            <p class="text-slate-500 font-light mt-1">Configurez votre expérience Cockpit Elite.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-12">
            
            <!-- Choix du Thème -->
            <div class="md:col-span-2 space-y-12">
                <div class="bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
                    <h3 class="text-2xl font-black text-slate-900 mb-8 tracking-tight">Thème du Cockpit</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <?php 
                        $themes = [
                            ['id' => 'orange', 'name' => 'Signature', 'color' => '#f97316'],
                            ['id' => 'blue', 'name' => 'Océan', 'color' => '#0ea5e9'],
                            ['id' => 'purple', 'name' => 'Royal', 'color' => '#8b5cf6'],
                            ['id' => 'teal', 'name' => 'Forêt', 'color' => '#10b981'],
                            ['id' => 'rose', 'name' => 'Énergie', 'color' => '#f43f5e'],
                            ['id' => 'slate', 'name' => 'Nuit', 'color' => '#0f172a']
                        ];
                        foreach($themes as $theme):
                        ?>
                        <button onclick="updateTheme('<?= $theme['id'] ?>', '<?= $theme['color'] ?>')" class="group relative p-6 rounded-3xl border-2 border-slate-50 hover:border-orange-200 transition-all text-center <?= ($_SESSION['user_theme']['id'] ?? 'orange') === $theme['id'] ? 'border-orange-500 bg-orange-50/20' : '' ?>">
                            <div class="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg" style="background-color: <?= $theme['color'] ?>"></div>
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-600"><?= $theme['name'] ?></span>
                        </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Choix de l'Avatar -->
                <div class="bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
                    <h3 class="text-2xl font-black text-slate-900 mb-8 tracking-tight">Mon Avatar d'Expert</h3>
                    <div class="grid grid-cols-3 sm:grid-cols-4 gap-6">
                        <?php 
                        $avatars = [
                            ['id' => 'robot', 'icon' => 'fa-robot', 'bg' => 'bg-slate-900'],
                            ['id' => 'scientist', 'icon' => 'fa-flask', 'bg' => 'bg-blue-600'],
                            ['id' => 'book', 'icon' => 'fa-book-open', 'bg' => 'bg-orange-600'],
                            ['id' => 'brain', 'icon' => 'fa-brain', 'bg' => 'bg-purple-600'],
                            ['id' => 'microscope', 'icon' => 'fa-microscope', 'bg' => 'bg-teal-600'],
                            ['id' => 'rocket', 'icon' => 'fa-rocket', 'bg' => 'bg-indigo-900'],
                            ['id' => 'star', 'icon' => 'fa-star', 'bg' => 'bg-amber-500'],
                            ['id' => 'heart', 'icon' => 'fa-heart', 'bg' => 'bg-rose-600']
                        ];
                        foreach($avatars as $avatar):
                        ?>
                        <button onclick="updateAvatar('<?= $avatar['icon'] ?>', '<?= $avatar['bg'] ?>')" class="group p-4 rounded-3xl border-2 border-slate-50 hover:border-blue-200 transition-all text-center <?= ($_SESSION['user_avatar_config']['icon'] ?? 'fa-user') === $avatar['icon'] ? 'border-blue-500 bg-blue-50/20' : '' ?>">
                            <div class="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md <?= $avatar['bg'] ?>">
                                <i class="fa-solid <?= $avatar['icon'] ?> text-xl"></i>
                            </div>
                        </button>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Preview Card -->
            <div class="space-y-8">
                <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden transition-all duration-500" id="preview-card">
                    <div class="relative z-10">
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 block">Aperçu du Profil</span>
                        <div class="flex items-center gap-5 mb-10">
                            <div class="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-2xl <?= $_SESSION['user_avatar_config']['bg'] ?? 'bg-orange-600' ?>" id="preview-avatar-box">
                                <i class="fa-solid <?= $_SESSION['user_avatar_config']['icon'] ?? 'fa-user' ?>" id="preview-avatar-icon"></i>
                            </div>
                            <div>
                                <h4 class="text-2xl font-black tracking-tight leading-none"><?= htmlspecialchars($_SESSION['user_name']) ?></h4>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Expert Parent</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div class="h-full bg-orange-600 w-3/4" id="preview-theme-bar"></div>
                            </div>
                            <p class="text-[11px] font-medium text-slate-400">Progression du profil : 75%</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>

<script>
function updateTheme(id, color) {
    fetch('/api/auth/update_preferences.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'theme', id: id, color: color })
    }).then(() => {
        document.getElementById('preview-theme-bar').style.backgroundColor = color;
        location.reload(); // Recharger pour appliquer globalement
    });
}

function updateAvatar(icon, bg) {
    fetch('/api/auth/update_preferences.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'avatar', icon: icon, bg: bg })
    }).then(() => {
        document.getElementById('preview-avatar-icon').className = 'fa-solid ' + icon;
        document.getElementById('preview-avatar-box').className = 'w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-2xl ' + bg;
        location.reload();
    });
}
</script>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>
