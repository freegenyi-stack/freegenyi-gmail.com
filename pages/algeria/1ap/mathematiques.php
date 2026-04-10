<?php
/**
 * pages/algeria/1ap/mathematiques.php - Programme Maths 1AP Premium V2
 */
$page_title = "Programme Mathématiques 1AP - Soutien Scolaire Algérie";
$page_description = "Nombres, Calcul, Géométrie et Logique pour les élèves de 1AP en Algérie. 95 leçons interactives et amusantes.";
include_once __DIR__ . '/../../../includes/header.php';
?>

<div class="bg-blue-50 min-h-screen pb-20">
    <!-- Hero Matière -->
    <header class="bg-gradient-to-r from-blue-900 to-blue-700 py-16 text-white text-center px-4">
        <div class="container mx-auto">
            <span class="inline-block px-4 py-1 bg-white bg-opacity-20 text-blue-100 rounded-full font-bold text-xs uppercase mb-4 tracking-tighter">Matière officielle Algérienne</span>
            <h1 class="text-4xl lg:text-6xl font-black mb-4">Mathématiques - 1AP</h1>
            <p class="text-blue-200 text-lg max-w-2xl mx-auto">Apprendre à compter, comparer et explorer les formes géométriques en s’amusant avec les chiffres.</p>
        </div>
    </header>

    <main class="container mx-auto px-4 -mt-10">
        <!-- Barre de filtre Rapide -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
            <button class="px-6 py-3 bg-white text-blue-900 rounded-2xl shadow-md font-bold hover:bg-blue-900 hover:text-white transition">Trimestre 1</button>
            <button class="px-6 py-3 bg-white text-gray-400 rounded-2xl shadow-sm font-bold opacity-50 cursor-not-allowed">Trimestre 2</button>
            <button class="px-6 py-3 bg-white text-gray-400 rounded-2xl shadow-sm font-bold opacity-50 cursor-not-allowed">Trimestre 3</button>
        </div>

        <!-- Liste des Leçons -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <?php
            // Simulation de chargement des leçons depuis le JSON
            $mock_lessons = [
                ['id' => 'math-l1', 'title' => 'Les nombres de 1 à 5', 'type' => 'nombres', 'status' => 'completed'],
                ['id' => 'math-l2', 'title' => 'Plus grand, plus petit', 'type' => 'logique', 'status' => 'available'],
                ['id' => 'math-l3', 'title' => 'Le Carré et le Triangle', 'type' => 'géométrie', 'status' => 'locked'],
                ['id' => 'math-l4', 'title' => 'L\'addition simple', 'type' => 'calcul', 'status' => 'locked'],
            ];

            foreach ($mock_lessons as $lesson):
            ?>
            <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 group hover:shadow-blue-200 transition duration-300 relative <?php echo ($lesson['status'] == 'locked' ? 'opacity-70' : ''); ?>">
                
                <?php if ($lesson['status'] == 'locked'): ?>
                    <div class="absolute inset-0 bg-white bg-opacity-40 rounded-3xl flex items-center justify-center z-10 pointer-events-none">
                        <img src="https://www.svgrepo.com/show/512441/lock-2.svg" class="w-10 opacity-30" alt="Blocké">
                    </div>
                <?php endif; ?>

                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-black uppercase tracking-widest text-blue-400"><?php echo $lesson['type']; ?></span>
                    <?php if ($lesson['status'] == 'completed'): ?>
                        <span class="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                    <?php endif; ?>
                </div>

                <h3 class="text-xl font-bold text-gray-900 mb-6 group-hover:text-blue-700 transition"><?php echo $lesson['title']; ?></h3>

                <div class="flex items-center justify-between mt-auto">
                    <span class="text-xs font-bold text-gray-400">10 Exercices</span>
                    <a href="<?php echo ($lesson['status'] != 'locked' ? APP_URL.'/cours?id='.$lesson['id'] : '#'); ?>" 
                       class="px-5 py-2 <?php echo ($lesson['status'] != 'locked' ? 'bg-blue-900 text-white shadow-blue-200' : 'bg-gray-200 text-gray-500'); ?> rounded-xl font-bold text-sm shadow-lg hover:translate-x-1 transition">
                        Commencer
                    </a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </main>
</div>

<?php include_once __DIR__ . '/../../../includes/footer.php'; ?>
