<?php
/**
 * goals.php - Elite Learning Goals
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero Goals -->
    <section class="py-16 md:py-32 bg-slate-50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-6 inline-block">Objectifs 2026</span>
            <h1 class="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 font-title leading-tight">Viser l'Excellence, <br class="hidden md:block"> Atteindre le Génie.</h1>
            <p class="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
                Nos objectifs sont clairs : transformer chaque session d'apprentissage en une victoire concrète pour l'avenir de votre enfant.
            </p>
        </div>
    </section>

    <!-- Content Grid -->
    <section class="py-20">
        <div class="max-w-5xl mx-auto px-6 md:px-12">
            <div class="space-y-12">
                <div class="p-8 md:p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight"><?php echo __('maths'); ?></h2>
                    <p class="text-slate-500 leading-relaxed font-light"><?php echo __('maths_desc'); ?></p>
                </div>
                <div class="p-8 md:p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight"><?php echo __('arabic'); ?></h2>
                    <p class="text-slate-500 leading-relaxed font-light"><?php echo __('arabic_desc'); ?></p>
                </div>
            </div>
            <div class="mt-16 text-center">
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 font-black uppercase tracking-widest text-[10px] transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 12H5m0 0l7-7m-7 7l7 7" stroke-width="2.5"/></svg>
                    Retour à l'accueil
                </a>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
