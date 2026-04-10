<?php
/**
 * index.php - Version EdTech Mondiale Colossale
 */
include_once __DIR__ . '/includes/header.php';
?>

<!-- Section HERO : Vision EdTech -->
<section class="relative bg-white pt-24 pb-32 overflow-hidden">
    <div class="container mx-auto px-6 relative z-10 text-center lg:text-left">
        <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full lg:w-3/5 px-4 mb-20 lg:mb-0">
                <span class="inline-block py-2 px-4 mb-6 text-xs font-black bg-orange-100 text-orange-600 rounded-2xl uppercase tracking-[0.2em]">
                    <?php echo __('hero_badge'); ?>
                </span>
                <h1 class="text-6xl lg:text-8xl font-black text-slate-900 mb-8 leading-[1.05]">
                    <?php echo __('hero_title'); ?>
                </h1>
                <p class="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl">
                    <?php echo __('hero_desc'); ?> - <span class="text-orange-600 font-bold"><?php echo __('ads_model'); ?></span>
                </p>
                <div class="flex flex-wrap justify-center lg:justify-start gap-4">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="py-5 px-10 text-lg font-black text-white bg-orange-600 hover:bg-orange-700 rounded-3xl shadow-2xl shadow-orange-200 transition-all transform hover:-translate-y-1">
                        <?php echo __('register'); ?> (100% Free)
                    </a>
                    <a href="#matrix" class="py-5 px-10 text-lg font-black text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-3xl transition-all">
                        Explorer les Cursus 🌎
                    </a>
                </div>
            </div>
            <div class="w-full lg:w-2/5 px-4">
                <div class="relative">
                    <img class="w-full rounded-[4rem] shadow-2xl shadow-slate-200 border-8 border-white" src="https://img.freepik.com/free-photo/side-view-boy-learning-with-laptop_23-2148753140.jpg" alt="FreeGeny Learning">
                    <div class="absolute -bottom-10 -left-10 bg-white p-8 rounded-[3rem] shadow-2xl hidden md:block border border-slate-50">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">✓</div>
                            <div>
                                <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Dashboard Parents</p>
                                <p class="text-lg font-black text-slate-900">Suivi en temps réel</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- INNOVATION : The Global Learning Matrix -->
<section id="matrix" class="py-32 bg-slate-900 text-white rounded-[5rem] mx-4 my-10 overflow-hidden relative">
    <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-4xl mx-auto text-center mb-24">
            <h2 class="text-5xl lg:text-7xl font-black mb-8"><?php echo __('innovation_title'); ?></h2>
            <p class="text-xl text-slate-400 leading-relaxed"><?php echo __('innovation_desc'); ?></p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div class="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
                <div class="text-3xl mb-8">🗺️</div>
                <h3 class="text-2xl font-black mb-4">Cursus Nationaux</h3>
                <p class="text-slate-400">Accédez au programme officiel de l'Algérie, France, Canada... Cours, exercices et examens détaillés.</p>
            </div>
            <div class="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
                <div class="text-3xl mb-8">♾️</div>
                <h3 class="text-2xl font-black mb-4"><?php echo __('intl_standards'); ?></h3>
                <p class="text-slate-400">Apprenez avec les meilleures méthodes : Maths Singapour, Anglais Oxford, et bien plus encore.</p>
            </div>
            <div class="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
                <div class="text-3xl mb-8">📊</div>
                <h3 class="text-2xl font-black mb-4">Tracking Adulte</h3>
                <p class="text-slate-400">Parents, Écoles, et ONG disposent d'un tableau de bord ultra-complet pour suivre chaque enfant.</p>
            </div>
        </div>
    </div>
    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
</section>

<!-- Section TOOLS : PDF & Games -->
<section class="py-32 bg-white">
    <div class="container mx-auto px-6">
        <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
                <img src="https://img.freepik.com/free-vector/video-game-developer-concept-illustration_114360-6043.jpg" class="w-full max-w-lg mx-auto" alt="Education Tools">
            </div>
            <div class="w-full lg:w-1/2 px-4">
                <h2 class="text-5xl font-black text-slate-900 mb-10 leading-tight">Outils Premium, Accessibilité Totale</h2>
                <div class="space-y-10">
                    <div class="flex items-start space-x-6">
                        <div class="w-14 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">📄</div>
                        <div>
                            <h4 class="text-xl font-black text-slate-900 mb-2"><?php echo __('pdf_export'); ?></h4>
                            <p class="text-slate-500 italic">Vente et génération de supports de cours et d'exercices en format PDF haute qualité.</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-6">
                        <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">🎮</div>
                        <div>
                            <h4 class="text-xl font-black text-slate-900 mb-2"><?php echo __('games'); ?></h4>
                            <p class="text-slate-500 italic">Des centaines de jeux interactifs pour apprendre sans s'en rendre compte (Gamification).</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-6">
                        <div class="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">⚡</div>
                        <div>
                            <h4 class="text-xl font-black text-slate-900 mb-2">Matières du Cycle Primaire</h4>
                            <p class="text-slate-500 italic">Arabe, Maths, Langues, Sciences... tout ce qu'un enfant doit maîtriser pour réussir tôt.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
