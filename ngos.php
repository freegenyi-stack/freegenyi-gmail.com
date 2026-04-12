<?php
/**
 * ngos.php - Elite NGOs Page
 */
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white" style="font-family: 'DM Sans', sans-serif;">
    <!-- Section Hero (Teal Elite) -->
    <section class="py-24 md:py-32 bg-teal-900 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-teal-400 bg-white/5 px-5 py-2.5 rounded-full mb-8 inline-block">Impact Social</span>
            <h1 class="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8" style="font-family: 'Plus Jakarta Sans', sans-serif;">L'Éducation Universelle.</h1>
            <p class="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto font-light leading-relaxed">
                Déployez nos solutions éducatives dans les zones reculées <br class="hidden md:block">
                et suivez votre impact social en temps réel.
            </p>
        </div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-teal-600 blur-[150px] opacity-20"></div>
    </section>

    <!-- Content -->
    <section class="py-24 md:py-32">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div class="relative">
                    <div class="absolute inset-0 bg-teal-200 rounded-[4rem] blur-[80px] opacity-20"></div>
                    <div class="bg-white border border-slate-100 rounded-[4rem] p-16 aspect-video flex items-center justify-center shadow-2xl relative z-10">
                        <span class="text-9xl">🤝</span>
                    </div>
                </div>
                <div>
                    <h2 class="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Un Partenaire de Terrain.</h2>
                    <p class="text-slate-500 text-lg leading-relaxed mb-10 font-light">
                        Nous collaborons avec les organisations non-gouvernementales pour combattre l'analphabétisme et la fracture numérique éducative.
                    </p>
                    <div class="space-y-6">
                        <div class="p-8 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group">
                            <h4 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">Technologie Hors-Ligne</h4>
                            <p class="text-slate-500 text-sm font-light">Nos solutions s'adaptent aux zones à faible connectivité grâce à des systèmes de mise en cache intelligents et une architecture légère.</p>
                        </div>
                        <div class="p-8 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group">
                            <h4 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">Mesure d'Impact</h4>
                            <p class="text-slate-500 text-sm font-light">Fournissez des rapports précis et granulaires à vos donateurs sur la progression académique réelle des populations aidées.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
