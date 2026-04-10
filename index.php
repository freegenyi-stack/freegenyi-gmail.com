<?php
/**
 * index.php - Restauration Design Pur + Nouveaux Textes EdTech
 */
include_once __DIR__ . '/includes/header.php';
?>

<!-- Section HERO : Pureté & Vision -->
<section class="relative bg-white pt-24 pb-32 overflow-hidden">
    <div class="container mx-auto px-6 relative z-10 text-center lg:text-left">
        <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full lg:w-3/5 px-4 mb-20 lg:mb-0">
                <span class="inline-block py-2 px-4 mb-6 text-xs font-black bg-orange-100/50 text-orange-600 rounded-2xl uppercase tracking-[0.2em]">
                    <?php echo __('hero_badge'); ?>
                </span>
                <h1 class="text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
                    <?php echo __('hero_title'); ?>
                </h1>
                <p class="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl">
                    <?php echo __('hero_desc'); ?> - <span class="text-orange-600 font-bold"><?php echo __('ads_model'); ?></span>
                </p>
                <div class="flex flex-wrap justify-center lg:justify-start gap-4">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="py-5 px-10 text-lg font-black text-white bg-orange-600 hover:bg-orange-700 rounded-3xl shadow-2xl shadow-orange-200 transition-all transform hover:-translate-y-1">
                        <?php echo __('register'); ?>
                    </a>
                    <a href="#subjects" class="py-5 px-10 text-lg font-black text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-3xl transition-all">
                        Nos Programmes 🌎
                    </a>
                </div>
            </div>
            <div class="w-full lg:w-2/5 px-4">
                <img class="w-full rounded-[4rem] shadow-2xl shadow-slate-100 border-8 border-white transform rotate-2" src="https://img.freepik.com/free-photo/side-view-boy-learning-with-laptop_23-2148753140.jpg" alt="FreeGeny">
            </div>
        </div>
    </div>
</section>

<!-- Section SERVICES : Cartes Premium sur Fond Blanc -->
<section id="subjects" class="py-32 bg-slate-50/50">
    <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center mb-24">
            <h2 class="text-5xl font-black text-slate-900 mb-6"><?php echo __('innovation_title'); ?></h2>
            <p class="text-xl text-slate-500 font-medium italic"><?php echo __('innovation_desc'); ?></p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <!-- Cursus Nationaux -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-orange-200/40 transition-all duration-500 border border-slate-100">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-2xl text-2xl">🌍</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4">Matières & Cursus</h3>
                <p class="text-slate-500 mb-8 leading-relaxed">Cours détaillés, exercices et préparation aux examens pour le cycle primaire de chaque pays.</p>
                <span class="text-xs font-black text-orange-600 uppercase tracking-widest">100% Inclus ↓</span>
            </div>

            <!-- Standards Internationaux -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-blue-200/40 transition-all duration-500 border border-slate-100">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl text-2xl">♾️</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4"><?php echo __('singapore_math'); ?></h3>
                <p class="text-slate-500 mb-8 leading-relaxed">Accédez aux grands standards mondiaux : Langues et Méthode Singapour pour une réussite prématurée.</p>
                <span class="text-xs font-black text-blue-600 uppercase tracking-widest">Global Standards ↓</span>
            </div>

            <!-- Dashboard Adults -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-green-200/40 transition-all duration-500 border border-slate-100">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-green-100 text-green-600 rounded-2xl text-2xl">📊</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4">Dashboard Pro</h3>
                <p class="text-slate-500 mb-8 leading-relaxed">Suivi en temps réel et historique complet pour les Parents, Écoles et ONG.</p>
                <span class="text-xs font-black text-green-600 uppercase tracking-widest">Monitoring ↓</span>
            </div>

            <!-- PDF Exports -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-slate-200 transition-all duration-500 border border-slate-100">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-2xl text-2xl">📄</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4"><?php echo __('pdf_export'); ?></h3>
                <p class="text-slate-500 mb-8 leading-relaxed">Téléchargez et vendez vos supports de cours et exercices en format PDF haute définition.</p>
                <span class="text-xs font-black text-slate-600 uppercase tracking-widest">Offline Learning ↓</span>
            </div>

            <!-- Educational Games -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-purple-200/40 transition-all duration-500 border border-slate-100">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-2xl text-2xl">🎮</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4"><?php echo __('games'); ?></h3>
                <p class="text-slate-500 mb-8 leading-relaxed">Une ludothèque complète de jeux éducatifs pour apprendre en s'amusant à chaque session.</p>
                <span class="text-xs font-black text-purple-600 uppercase tracking-widest">Gamification ↓</span>
            </div>

            <!-- World Access -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-indigo-200/40 transition-all duration-500 border border-slate-100">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-2xl text-2xl">📍</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4">56+ Pays Ciblés</h3>
                <p class="text-slate-500 mb-8 leading-relaxed">Consultez et comparez les programmes de tous les pays pour une vision mondiale de l'éducation.</p>
                <span class="text-xs font-black text-indigo-600 uppercase tracking-widest">Universal Access ↓</span>
            </div>
        </div>
    </div>
</section>

<!-- STATS -->
<section class="py-24 bg-white">
    <div class="container mx-auto px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4">115+</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('lessons'); ?></p>
            </div>
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4">333+</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('games'); ?></p>
            </div>
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4">10k+</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('students'); ?></p>
            </div>
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4">4.9/5</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('rating'); ?></p>
            </div>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
