<?php
/**
 * blog.php - Elite Pedagogy Blog
 */
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero Blog -->
    <section class="py-16 md:py-32 bg-slate-50/50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-6 inline-block">Perspectives</span>
            <h1 class="text-4xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 font-title leading-none">Journal d'Excellence.</h1>
            <p class="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-xl mx-auto">
                Conseils experts, actualités pédagogiques et réflexions sur l'avenir de l'éducation primaire mondiale.
            </p>
        </div>
    </section>

    <!-- Content Placeholder -->
    <section class="py-20 md:py-32">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="p-12 md:p-24 border-4 border-dashed border-slate-100 rounded-[2.5rem] md:rounded-[4rem] flex flex-col items-center justify-center text-center">
                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-8">🖋️</div>
                <p class="text-slate-300 text-xl md:text-2xl font-black uppercase tracking-[0.2em] font-title">Les articles arrivent prochainement</p>
                <p class="text-slate-400 mt-4 font-light">Nos experts rédigent actuellement le futur de l'éducation.</p>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
