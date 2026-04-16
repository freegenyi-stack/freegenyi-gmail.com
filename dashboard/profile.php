<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (empty($_SESSION['logged_in'])) {
    header('Location: /');
    exit;
}

$user_id = $_SESSION['user_id'];
$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$user_id]);

include_once __DIR__ . '/../includes/header.php';
?>

<main class="min-h-screen pt-24 pb-12 px-6 bg-slate-50/50">
    <div class="max-w-4xl mx-auto">
        
        <header class="mb-10 text-center sm:text-left">
            <h1 class="text-3xl font-black text-slate-950 tracking-tight font-title">Mon Profil</h1>
            <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Paramètres personnels et sécurité</p>
        </header>

        <?php if (isset($_GET['success'])): ?>
            <div class="mb-6 bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl font-bold text-sm slide-up">
                ✅ <?php echo htmlspecialchars(urldecode($_GET['success'])); ?>
            </div>
        <?php endif; ?>

        <?php if (isset($_GET['error'])): ?>
            <div class="mb-6 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-bold text-sm slide-up">
                ⚠️ <?php echo htmlspecialchars(urldecode($_GET['error'])); ?>
            </div>
        <?php endif; ?>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- SECTION INFOS -->
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 sm:p-10">
                    <h2 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2.5"/></svg>
                        </span>
                        Informations personnelles
                    </h2>

                    <form action="/api/auth/update-profile.php" method="POST" class="space-y-6">
                        <?php CSRF::insertInput(); ?>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Nom Complet</label>
                                <input type="text" name="full_name" value="<?php echo htmlspecialchars($user['full_name']); ?>" required class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3.5 rounded-2xl outline-none transition-all font-semibold text-slate-950">
                            </div>
                            <div>
                                <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Email (Non modifiable)</label>
                                <input type="email" value="<?php echo htmlspecialchars($user['email']); ?>" disabled class="w-full bg-slate-100 border-2 border-slate-100 px-4 py-3.5 rounded-2xl font-semibold text-slate-400 cursor-not-allowed">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Téléphone</label>
                                <input type="tel" name="phone" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>" placeholder="+213..." class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3.5 rounded-2xl outline-none transition-all font-semibold text-slate-950">
                            </div>
                        </div>
                        <button type="submit" class="bg-slate-950 text-white rounded-2xl px-8 py-4 text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all">
                            Enregistrer les modifications
                        </button>
                    </form>
                </div>
            </div>

            <!-- SECTION SÉCURITÉ -->
            <div class="space-y-6">
                <div class="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 sm:p-10">
                    <h2 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </span>
                        Sécurité
                    </h2>

                    <form action="/api/auth/change-password-logged.php" method="POST" class="space-y-6">
                        <?php CSRF::insertInput(); ?>
                        <div>
                            <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Ancien mot de passe</label>
                            <input type="password" name="old_password" required class="w-full bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white px-4 py-3.5 rounded-2xl outline-none transition-all font-semibold text-slate-950">
                        </div>
                        <div class="h-px bg-slate-50"></div>
                        <div>
                            <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Nouveau mot de passe</label>
                            <input type="password" name="new_password" required class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3.5 rounded-2xl outline-none transition-all font-semibold text-slate-950">
                        </div>
                        <div>
                            <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Confirmation</label>
                            <input type="password" name="confirm_password" required class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-4 py-3.5 rounded-2xl outline-none transition-all font-semibold text-slate-950">
                        </div>
                        <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all">
                            Mettre à jour
                        </button>
                    </form>
                </div>
            </div>

        </div>
    </div>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>
