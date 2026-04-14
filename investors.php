<?php
/**
 * investors.php - Elite Investors Relations
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero Investors -->
    <section class="py-16 md:py-32 bg-slate-900 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-1/2 h-full bg-orange-600 opacity-10 blur-[120px] translate-x-1/2"></div>
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
            <h1 class="text-4xl md:text-7xl font-black tracking-tighter mb-8 font-title leading-tight">Bâtir le leader <br class="hidden md:block"> de l'EdTech mondiale.</h1>
            <p class="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Rejoignez une aventure technologique et sociale à haute scalabilité. FreeGeny redéfinit l'accès à l'excellence éducative.
            </p>
        </div>
    </section>

    <!-- Strategy Section -->
    <section class="py-20 md:py-32">
        <div class="max-w-5xl mx-auto px-6 md:px-12">
            <div class="p-10 md:p-16 border-l-8 border-orange-600 bg-slate-50 rounded-r-[3rem] shadow-xl">
                <h3 class="text-3xl font-black text-slate-900 mb-8 font-title tracking-tight">Visions & Scalabilité</h3>
                <p class="text-slate-500 text-lg leading-relaxed mb-10 font-light">
                    FreeGeny n'est pas seulement une plateforme éducative, c'est une infrastructure logicielle conçue pour une expansion mondiale avec des coûts opérationnels optimisés par l'IA.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600"><i class="fas fa-chart-line"></i></div>
                        <span class="text-xs font-bold text-slate-700 uppercase tracking-widest">+30% croissance mensuelle</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600"><i class="fas fa-users-cog"></i></div>
                        <span class="text-xs font-bold text-slate-700 uppercase tracking-widest">Tech-Stack propriétaire</span>
                    </div>
                </div>
            </div>

            <div class="mt-24 text-center">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Relations Investisseurs</p>
                <a href="mailto:invest@freegeny.com" class="text-2xl md:text-4xl font-black text-slate-900 hover:text-orange-600 transition-colors font-title break-all underline underline-offset-8 decoration-orange-600/30 hover:decoration-orange-600">invest@freegeny.com</a>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
