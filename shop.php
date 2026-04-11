<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-slate-50">
    <!-- Hero -->
    <section class="py-32 bg-rose-500 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center text-white">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">Boutique FreeGeny</h1>
            <p class="text-xl text-rose-100 max-w-2xl mx-auto font-medium leading-relaxed italic">
                Retrouvez nos supports physiques et ressources pédagogiques tangibles pour l'apprentissage hors-écran.
            </p>
        </div>
    </section>

    <section class="py-32">
        <div class="max-w-7xl mx-auto px-12">
            <div class="bg-white p-20 rounded-[4rem] shadow-xl text-center border border-slate-100">
                <div class="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner">
                    <svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="g_shop_hero" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f43f5e" /><stop offset="100%" style="stop-color:#e11d48" /></linearGradient></defs>
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="url(#g_shop_hero)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="text-4xl font-black text-slate-900 mb-6 italic tracking-tight">Ouverture Prochaine</h3>
                <p class="text-slate-400 text-lg max-w-xl mx-auto font-medium mb-12 italic">
                    Nous préparons actuellement une sélection exclusive de cahiers d'activités, de livres de lecture et de kits pédagogiques FreeGeny.
                </p>
                <button class="bg-slate-950 text-white px-12 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200">
                    Être informé du lancement
                </button>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
