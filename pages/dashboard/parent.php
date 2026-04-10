<?php
/**
 * pages/dashboard/parent.php - Dashboard Parent Premium V2
 */
$page_title = "Tableau de Bord Parent - FreeGeny";
include_once __DIR__ . '/../../includes/header.php';
// include_once __DIR__ . '/../../includes/auth_guard.php'; // À activer plus tard

// Simulation de données (En attendant les vrais profils en BDD)
$children = [
    ['id' => 1, 'name' => 'Amine', 'grade' => '1AP', 'xp' => 1250, 'avatar' => 'avatar1', 'progress' => 65],
    ['id' => 2, 'name' => 'Sara', 'grade' => '1AP', 'xp' => 850, 'avatar' => 'avatar2', 'progress' => 42],
];
?>

<div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header Dashboard -->
    <header class="bg-blue-900 pt-12 pb-32 px-4 relative overflow-hidden">
        <div class="container mx-auto relative z-10">
            <div class="flex flex-wrap items-center justify-between">
                <div class="w-full lg:w-2/3 text-white">
                    <h1 class="text-3xl lg:text-5xl font-black mb-4">Bonjour, Monsieur Yousr 👋</h1>
                    <p class="text-blue-200 text-lg">Heureux de vous revoir ! Voici où en sont vos petits génies aujourd'hui.</p>
                </div>
                <div class="hidden lg:block">
                    <!-- Placeholder pour Lottie Animation -->
                    <div id="lottie-welcome" class="w-48 h-48 opacity-80"></div>
                </div>
            </div>
        </div>
        <!-- Décoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full -mr-32 -mt-32 blur-3xl opacity-30"></div>
    </header>

    <main class="container mx-auto px-4 -mt-20 relative z-20">
        <!-- Section Profils Enfants -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <?php foreach ($children as $child): ?>
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition duration-300">
                <div class="p-8">
                    <div class="flex items-center space-x-4 mb-6">
                        <div class="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center text-4xl">
                            <img src="<?php echo APP_URL; ?>/assets/img/avatars/<?php echo $child['avatar']; ?>.svg" alt="Avatar" class="w-16 h-16" onerror="this.src='https://www.svgrepo.com/show/446520/avatar.svg'">
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-gray-900"><?php echo $child['name']; ?></h3>
                            <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase"><?php echo $child['grade']; ?></span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm font-bold mb-2">
                                <span class="text-gray-500">Progression Globale</span>
                                <span class="text-orange-600"><?php echo $child['progress']; ?>%</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-3">
                                <div class="bg-orange-600 h-3 rounded-full shadow-sm" style="width: <?php echo $child['progress']; ?>%"></div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center pt-4">
                            <div class="flex items-center space-x-2">
                                <span class="text-xl font-black text-gray-900"><?php echo number_format($child['xp']); ?></span>
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">XP Gagnés</span>
                            </div>
                            <a href="<?php echo APP_URL; ?>/dashboard/child/<?php echo $child['id']; ?>" class="p-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition">
                                Détails →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>

            <!-- Bouton Ajouter un Enfant -->
            <button class="relative group bg-gray-100 rounded-3xl border-4 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center space-y-4 hover:border-orange-300 hover:bg-orange-50 transition duration-300 min-h-[300px]">
                <div class="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl text-gray-400 group-hover:text-orange-600 transition">
                    +
                </div>
                <span class="text-lg font-bold text-gray-500 group-hover:text-orange-600">Ajouter un Enfant</span>
            </button>
        </div>

        <!-- Section Statistiques Globales -->
        <div class="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
            <h2 class="text-2xl font-black text-gray-900 mb-8">Vue d'ensemble de la famille</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="p-6 bg-blue-50 rounded-2xl">
                    <span class="text-blue-900 font-bold block mb-1">Temps étudié</span>
                    <span class="text-3xl font-black text-blue-900">12h 45min</span>
                </div>
                <div class="p-6 bg-orange-50 rounded-2xl">
                    <span class="text-orange-600 font-bold block mb-1">Exercices résolus</span>
                    <span class="text-3xl font-black text-orange-600">458</span>
                </div>
                <div class="p-6 bg-green-50 rounded-2xl">
                    <span class="text-green-600 font-bold block mb-1">Badge du mois</span>
                    <span class="text-3xl font-black text-green-600">Super Parent</span>
                </div>
                <div class="p-6 bg-purple-50 rounded-2xl">
                    <span class="text-purple-600 font-bold block mb-1">Prochain palier</span>
                    <span class="text-3xl font-black text-purple-600">Famille Or</span>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Script Lottie Player -->
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

<?php include_once __DIR__ . '/../../includes/footer.php'; ?>
