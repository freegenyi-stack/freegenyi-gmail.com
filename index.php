<?php
/**
 * index.php - Page d'accueil Premium V3 (100% Localized)
 */
include_once __DIR__ . '/includes/header.php';
$page_title = __('meta_title');
$page_description = __('meta_desc');
?>

<!-- Section HERO : Titre & Appel à l'action -->
<section class="relative bg-white pt-24 pb-32 overflow-hidden">
    <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full lg:w-1/2 px-4 mb-20 lg:mb-0">
                <span class="inline-block py-2 px-4 mb-6 text-xs font-black bg-orange-100/50 text-orange-600 rounded-2xl uppercase tracking-[0.2em]">
                    <?php echo __('hero_badge'); ?>
                </span>
                <h1 class="text-6xl lg:text-8xl font-black text-slate-900 mb-8 leading-[1.1]">
                    <?php echo __('hero_title'); ?>
                </h1>
                <p class="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl">
                    <?php echo __('hero_desc'); ?>
                </p>
                <div class="flex flex-wrap -mx-2">
                    <div class="w-full sm:w-auto px-2">
                        <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="inline-block w-full py-5 px-10 text-lg font-black text-white bg-orange-600 hover:bg-orange-700 rounded-3xl shadow-2xl shadow-orange-200 transition-all transform hover:-translate-y-1 text-center">
                            <?php echo __('register'); ?>
                        </a>
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-1/2 px-4 text-center">
                <img class="w-full max-w-2xl mx-auto rounded-[3rem] shadow-2xl shadow-slate-200" src="https://img.freepik.com/free-vector/children-learning-online-concept_23-2148524458.jpg" alt="FreeGeny">
            </div>
        </div>
    </div>
</section>

<!-- Section MATIÈRES (Subjects) -->
<section id="subjects" class="py-32 bg-slate-50/50">
    <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center mb-24">
            <h2 class="text-5xl font-black text-slate-900 mb-6"><?php echo __('subjects'); ?></h2>
            <p class="text-xl text-slate-500 font-medium"><?php echo __('hero_desc'); ?></p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Carte ARABE -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-orange-200/40 transition-all duration-500 border border-slate-100">
                <div class="w-20 h-20 mb-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-[2rem] text-4xl font-black">
                    <span>أ</span>
                </div>
                <h3 class="text-3xl font-black text-slate-900 mb-6"><?php echo __('arabic'); ?></h3>
                <p class="text-lg text-slate-500 mb-10 leading-relaxed"><?php echo __('arabic_desc'); ?></p>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-black text-white bg-orange-600 px-4 py-2 rounded-full tracking-widest uppercase">115 <?php echo __('lessons'); ?></span>
                    <a href="#" class="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all text-xl">→</a>
                </div>
            </div>

            <!-- Carte MATHS -->
            <div class="group bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 hover:shadow-blue-200/40 transition-all duration-500 border border-slate-100">
                <div class="w-20 h-20 mb-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-[2rem] text-4xl font-black">
                    <span>+</span>
                </div>
                <h3 class="text-3xl font-black text-slate-900 mb-6"><?php echo __('maths'); ?></h3>
                <p class="text-lg text-slate-500 mb-10 leading-relaxed"><?php echo __('maths_desc'); ?></p>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-black text-white bg-blue-600 px-4 py-2 rounded-full tracking-widest uppercase">95 <?php echo __('lessons'); ?></span>
                    <a href="#" class="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all text-xl">→</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Section STATS -->
<section class="py-24 bg-white">
    <div class="container mx-auto px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4 tracking-tighter">115+</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('lessons'); ?></p>
            </div>
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4 tracking-tighter">333+</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('games'); ?></p>
            </div>
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4 tracking-tighter">10k+</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('students'); ?></p>
            </div>
            <div>
                <h3 class="text-5xl font-black text-orange-600 mb-4 tracking-tighter">4.9/5</h3>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs"><?php echo __('rating'); ?></p>
            </div>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
