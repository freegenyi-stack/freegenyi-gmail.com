<?php
/**
 * science.php - Elite Clinical & Pedagogy Data
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero Science -->
    <section class="py-16 md:py-32 bg-slate-50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 inline-block">Recherche & Développement</span>
            <h1 class="text-4xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 font-title leading-none">La Preuve par la <span class="text-orange-600">Donnée.</span></h1>
            <p class="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-3xl mx-auto">
                Chaque algorithme FreeGeny est validé par des tests cliniques et des études de terrain pour garantir un impact réel sur la neuroplasticité de l'enfant.
            </p>
        </div>
    </section>

    <!-- Pillars grid -->
    <section class="py-20">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                <!-- Data Point 1 -->
                <div class="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <h3 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">Neuroplasticité</h3>
                    <p class="text-slate-500 leading-relaxed font-light">En stimulant la curiosité naturelle et en alternant les phases de rappel actif et de répétition espacée, nous optimisons l'encodage des connaissances dans la mémoire à long terme.</p>
                </div>
                <!-- Data Point 2 -->
                <div class="p-12 bg-slate-950 text-white rounded-[3rem] shadow-2xl">
                    <h3 class="text-2xl font-black mb-6 font-title tracking-tight">Adaptive Testing</h3>
                    <p class="text-slate-300 leading-relaxed font-light">Notre moteur IRT (Item Response Theory) évalue le niveau de compétence réel de l'élève en moins de 10 questions, permettant de lui proposer le défi optimal immédiatement.</p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
