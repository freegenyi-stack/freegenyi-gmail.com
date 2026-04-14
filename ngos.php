<?php
/**
 * ngos.php - Elite Philanthropic Page
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero NGO -->
    <section class="py-16 md:py-32 bg-teal-50 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-1/3 h-full bg-teal-100/50 skew-x-12 translate-x-1/2"></div>
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
            <div class="flex flex-col lg:flex-row items-center gap-16">
                <div class="flex-1">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 bg-white border border-teal-100 px-5 py-2 rounded-full mb-8 inline-block shadow-sm">Impact Social</span>
                    <h1 class="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 font-title leading-[1.05]">Égalité des chances, <br class="hidden lg:block"> sans compromis.</h1>
                    <p class="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-xl">
                        Nous offrons notre technologie aux ONG et fondations pour apporter une éducation d'élite là où elle est le plus nécessaire.
                    </p>
                    <a href="mailto:impact@freegeny.com" class="inline-flex items-center gap-2 bg-teal-600 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20">
                        Devenir partenaire
                    </a>
                </div>
                <div class="flex-1 w-full">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="aspect-square bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl border border-teal-50">💙</div>
                        <div class="aspect-square bg-teal-600 rounded-3xl shadow-xl flex items-center justify-center text-4xl text-white mt-12">📚</div>
                        <div class="aspect-square bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl border border-teal-50 -mt-12">🏡</div>
                        <div class="aspect-square bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center text-4xl">🌍</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
