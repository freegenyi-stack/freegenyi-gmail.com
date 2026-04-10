<?php
/**
 * index.php - Version Épurée Finalisée
 */
include_once __DIR__ . '/includes/header.php';
?>

<!-- Section HERO : Look d'Origine & Pureté -->
<section class="relative bg-white pt-20 pb-28 overflow-hidden">
    <div class="container mx-auto px-6 relative z-10 text-center lg:text-left">
        <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
                <span class="inline-block py-1.5 px-4 mb-6 text-[10px] font-black bg-slate-100 text-slate-500 rounded-xl uppercase tracking-[0.2em]">
                    <?php echo __('hero_badge'); ?>
                </span>
                <h1 class="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
                    <?php echo __('hero_title'); ?>
                </h1>
                <p class="text-xl text-slate-500 mb-10 leading-relaxed max-w-xl">
                    <?php echo __('hero_desc'); ?>
                </p>
                <div class="flex flex-wrap justify-center lg:justify-start gap-4">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="py-3.5 px-8 text-sm font-black text-white bg-orange-600 hover:bg-orange-700 rounded-2xl shadow-xl shadow-orange-100 transition-all transform hover:-translate-y-0.5">
                        <?php echo __('register'); ?>
                    </a>
                    <a href="#subjects" class="py-3.5 px-8 text-sm font-black text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                        Nos Programmes
                    </a>
                </div>
            </div>
            <div class="w-full lg:w-1/2 px-4">
                <img class="w-full max-w-lg mx-auto transform hover:scale-105 transition duration-700" src="https://img.freepik.com/free-vector/children-learning-online-concept_23-2148524458.jpg" alt="FreeGeny Original">
            </div>
        </div>
    </div>
</section>

<!-- Section SERVICES -->
<section id="subjects" class="py-24 bg-slate-50/50">
    <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center mb-20">
            <h2 class="text-4xl font-black text-slate-900 mb-4"><?php echo __('innovation_title'); ?></h2>
            <p class="text-lg text-slate-400 font-medium"><?php echo __('innovation_desc'); ?></p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Cursus Nationaux -->
            <div class="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                <div class="w-14 h-14 mb-6 flex items-center justify-center bg-orange-50 text-orange-600 rounded-2xl text-xl">🌍</div>
                <h3 class="text-xl font-black text-slate-900 mb-3">Matières & Cursus</h3>
                <p class="text-sm text-slate-500 leading-relaxed">Cours détaillés et exercices pour le cycle primaire.</p>
            </div>

            <!-- Standards Internationaux -->
            <div class="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                <div class="w-14 h-14 mb-6 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl text-xl">♾️</div>
                <h3 class="text-xl font-black text-slate-900 mb-3"><?php echo __('singapore_math'); ?></h3>
                <p class="text-sm text-slate-500 leading-relaxed">Mathématiques Méthode Singapour et Langues.</p>
            </div>

            <!-- Dashboard Adults -->
            <div class="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                <div class="w-14 h-14 mb-6 flex items-center justify-center bg-green-50 text-green-600 rounded-2xl text-xl">📊</div>
                <h3 class="text-xl font-black text-slate-900 mb-3">Dashboard Pro</h3>
                <p class="text-sm text-slate-500 leading-relaxed">Suivi en temps réel pour Parents, Écoles et ONG.</p>
            </div>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
