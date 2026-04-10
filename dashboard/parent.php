<?php
include_once __DIR__ . '/../config/app.php';

// Protection : Seuls les utilisateurs connectés peuvent accéder
if (empty($_SESSION['logged_in']) || empty($_SESSION['user_id'])) {
    header('Location: /' . $country . '-' . $lang . '/auth/login');
    exit;
}

include_once __DIR__ . '/../includes/header.php';
?>
<main class="py-20 bg-slate-50 min-h-screen">
    <div class="container mx-auto px-6 max-w-6xl">
        <!-- Dashboard Header -->
        <div class="flex items-center justify-between mb-10">
            <div>
                <h1 class="text-4xl font-black text-slate-900 mb-2">Bienvenue, <span class="text-orange-600"><?php echo htmlspecialchars($_SESSION['user_name'] ?? 'Parent'); ?></span> 👏</h1>
                <p class="text-slate-500 font-medium italic">Voici le tableau de bord de votre famille.</p>
            </div>
            
            <a href="/api/auth/logout.php" class="bg-white text-slate-400 font-bold px-6 py-3 rounded-2xl border border-slate-100 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                Déconnexion
            </a>
        </div>

        <!-- Dashboard Widgets Placeholder -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Widget : Progression -->
            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 col-span-2">
                <h3 class="text-xl font-black text-slate-800 mb-6 flex items-center">
                    <span class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </span>
                    Progression de l'enfant
                </h3>
                <div class="h-48 flex items-center justify-center bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200">
                    <p class="text-slate-400 font-bold text-sm">Les graphiques de progression apparaîtront ici.</p>
                </div>
            </div>

            <!-- Widget : Actions Rapides -->
            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 class="text-xl font-black text-slate-800 mb-6">Actions</h3>
                <div class="space-y-4">
                    <button class="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-700 transition shadow-lg shadow-orange-200">
                        + Ajouter un enfant
                    </button>
                    <button class="w-full bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-100 transition border border-slate-100">
                        Voir les programmes
                    </button>
                </div>
            </div>
        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
