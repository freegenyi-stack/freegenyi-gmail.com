<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-32 bg-orange-600 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center text-white">
            <div class="relative inline-block mb-8">
                <h1 class="text-5xl md:text-7xl font-black tracking-tighter">Notre Mission</h1>
                <span class="absolute -bottom-4 right-0 text-xl font-bold text-white font-[Caveat] rotate-2">l'éducation pour tous</span>
            </div>
            <p class="text-xl text-orange-100 max-w-2xl mx-auto font-medium italic leading-relaxed">
                Rendre l'éducation primaire d'élite accessible à chaque enfant, sans exception, partout sur la planète.
            </p>
        </div>
    </section>

    <!-- Mission Pillars -->
    <section class="py-32">
        <div class="max-w-7xl mx-auto px-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div class="p-12 bg-white rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl">🔓</div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Gratuité Totale</h3>
                    <p class="text-slate-500 leading-relaxed font-medium">
                        Le savoir ne doit pas avoir de prix. Tout le contenu de FreeGeny est et restera gratuit pour les enfants et les parents.
                    </p>
                </div>
                <div class="p-12 bg-white rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl">🌍</div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Adaptation Locale</h3>
                    <p class="text-slate-500 leading-relaxed font-medium">
                        Nous respectons les identités culturelles et les programmes officiels de chaque pays pour une pertinence maximale.
                    </p>
                </div>
                <div class="p-12 bg-white rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl">🚀</div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Excellence EdTech</h3>
                    <p class="text-slate-500 leading-relaxed font-medium">
                        Utiliser le meilleur de la technologie et de l'intelligence artificielle pour personnaliser l'apprentissage de chaque enfant.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to action -->
    <section class="py-32 bg-slate-900 text-white rounded-t-[5rem]">
        <div class="max-w-5xl mx-auto px-12 text-center">
            <h2 class="text-4xl font-black mb-10 italic">Prêt à libérer le génie de votre enfant ?</h2>
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="inline-block bg-orange-600 text-white px-12 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-[0_20px_50px_rgba(234,88,12,0.3)]">
                Commencer gratuitement
            </a>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
