<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-32 bg-slate-50/50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center">
            <div class="relative inline-block mb-8">
                <h1 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">À Propos</h1>
                <span class="absolute -bottom-4 right-0 text-xl font-bold text-orange-600 font-[Caveat] rotate-2">l'histoire de FreeGeny</span>
            </div>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium italic leading-relaxed">
                Découvrez comment une vision de l'éducation gratuite et universelle est devenue une plateforme mondiale.
            </p>
        </div>
    </section>

    <!-- Content -->
    <section class="py-32">
        <div class="max-w-5xl mx-auto px-12">
            <div class="space-y-24">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 mb-8 italic">Notre Vision</h2>
                        <p class="text-slate-500 leading-relaxed text-lg mb-6">
                            FreeGeny est née d'un constat simple : l'éducation de qualité est le levier le plus puissant pour changer le monde, mais elle reste encore trop souvent un privilège.
                        </p>
                        <p class="text-slate-500 leading-relaxed text-lg">
                            Nous avons bâti une plateforme qui ignore les frontières et les barrières financières, pour offrir à chaque enfant les outils de sa réussite.
                        </p>
                    </div>
                    <div class="bg-orange-50 rounded-[3rem] p-12 aspect-square flex items-center justify-center">
                        <i class="fas fa-lightbulb text-7xl text-orange-600"></i>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div class="order-2 md:order-1 bg-blue-50 rounded-[3rem] p-12 aspect-square flex items-center justify-center">
                        <i class="fas fa-globe-africa text-7xl text-blue-600"></i>
                    </div>
                    <div class="order-1 md:order-2">
                        <h2 class="text-3xl font-black text-slate-900 mb-8 italic">Impact Mondial</h2>
                        <p class="text-slate-500 leading-relaxed text-lg mb-6">
                            Aujourd'hui, FreeGeny supporte plus de 60 pays et s'adapte aux cursus nationaux spécifiques. Nous ne nous contentons pas de traduire des cours, nous les contextualisons.
                        </p>
                        <p class="text-slate-500 leading-relaxed text-lg">
                            De l'Algérie au Canada, du Vietnam à la France, nos contenus sont validés par des experts pédagogiques locaux.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
