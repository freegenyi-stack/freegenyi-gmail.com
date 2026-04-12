<?php
/**
 * about.php - Elite About Page
 */
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white" style="font-family: 'DM Sans', sans-serif;">
    <!-- Section Hero -->
    <section class="py-24 md:py-32 bg-slate-50/50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
            <h1 class="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6" style="font-family: 'Plus Jakarta Sans', sans-serif;">Notre Histoire.</h1>
            <p class="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                Une vision de l'éducation universelle, <br class="hidden md:block">
                devenue un écosystème d'élite.
            </p>
        </div>
    </section>

    <!-- Section Contenu -->
    <section class="py-24 md:py-32">
        <div class="max-w-5xl mx-auto px-6 md:px-12">
            <div class="space-y-32">
                <!-- Vision -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div>
                        <span class="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-5 py-2.5 rounded-full mb-8 inline-block">L'Origine</span>
                        <h2 class="text-4xl font-black text-slate-900 mb-8 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Une éducation sans frontières.</h2>
                        <p class="text-slate-500 leading-relaxed text-lg mb-6 font-light">
                            FreeGeny est née d'un constat simple : l'éducation de qualité est le levier le plus puissant pour changer le monde, mais elle reste encore trop souvent un privilège.
                        </p>
                        <p class="text-slate-500 leading-relaxed text-lg font-light">
                            Nous avons bâti une plateforme qui ignore les barrières financières, pour offrir à chaque enfant les outils de sa réussite.
                        </p>
                    </div>
                    <div class="relative">
                        <div class="absolute inset-0 bg-orange-200 rounded-[4rem] blur-[80px] opacity-20"></div>
                        <div class="bg-white border border-slate-100 rounded-[4rem] p-12 aspect-square flex items-center justify-center shadow-2xl relative z-10">
                            <span class="text-8xl">💡</span>
                        </div>
                    </div>
                </div>

                <!-- Impact -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div class="order-2 md:order-1 relative">
                        <div class="absolute inset-0 bg-blue-200 rounded-[4rem] blur-[80px] opacity-20"></div>
                        <div class="bg-white border border-slate-100 rounded-[4rem] p-12 aspect-square flex items-center justify-center shadow-2xl relative z-10">
                            <span class="text-8xl">🌍</span>
                        </div>
                    </div>
                    <div class="order-1 md:order-2">
                        <span class="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full mb-8 inline-block">Impact Mondial</span>
                        <h2 class="text-4xl font-black text-slate-900 mb-8 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Validation par les experts.</h2>
                        <p class="text-slate-500 leading-relaxed text-lg mb-6 font-light">
                            Aujourd'hui, FreeGeny supporte plus de 60 pays et s'adapte aux cursus nationaux spécifiques. Nous ne nous contentons pas de traduire des cours, nous les contextualisons.
                        </p>
                        <p class="text-slate-500 leading-relaxed text-lg font-light">
                            De l'Algérie au Canada, chaque contenu est scruté par des cliniciens et des pédagogues experts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
