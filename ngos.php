<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-32 bg-teal-600 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center text-white">
            <div class="relative inline-block mb-8">
                <h1 class="text-5xl md:text-7xl font-black tracking-tighter">FreeGeny ONG</h1>
                <span class="absolute -bottom-4 right-0 text-xl font-bold text-white font-[Caveat] rotate-2">l'éducation sans frontières</span>
            </div>
            <p class="text-xl text-teal-100 max-w-2xl mx-auto font-medium leading-relaxed italic">
                Déployez nos solutions éducatives dans les zones reculées et suivez l'impact social de vos programmes en temps réel.
            </p>
        </div>
    </section>

    <!-- Content -->
    <section class="py-32">
        <div class="max-w-7xl mx-auto px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div class="bg-teal-50 rounded-[4rem] p-16 aspect-video flex items-center justify-center">
                    <i class="fas fa-hand-holding-heart text-8xl text-teal-600"></i>
                </div>
                <div>
                    <h2 class="text-4xl font-black text-slate-900 mb-8 italic">Un Partenaire de Terrain</h2>
                    <p class="text-slate-500 text-lg leading-relaxed mb-10 font-medium italic">
                        Nous collaborons avec les organisations non-gouvernementales pour combattre l'analphabétisme et la fracture numérique éducative.
                    </p>
                    <div class="space-y-6">
                        <div class="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                            <h4 class="text-lg font-black text-slate-900 mb-2">Technologie Hors-Ligne</h4>
                            <p class="text-slate-500 text-sm">Nos solutions s'adaptent aux zones à faible connectivité grâce à des systèmes de mise en cache intelligents.</p>
                        </div>
                        <div class="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                            <h4 class="text-lg font-black text-slate-900 mb-2">Mesure d'Impact</h4>
                            <p class="text-slate-500 text-sm">Fournissez des rapports précis à vos donateurs sur la progression académique des populations aidées.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
