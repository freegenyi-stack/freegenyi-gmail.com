<?php
/**
 * press.php - Elite Press Room
 */
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero Press -->
    <section class="py-16 md:py-32 bg-slate-50/50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 inline-block">Média & Relations</span>
            <h1 class="text-4xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 font-title leading-none">Salle de Presse.</h1>
            <p class="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-xl mx-auto">
                Accédez à nos actualités officielles, kits média et ressources pour les journalistes du monde entier.
            </p>
        </div>
    </section>

    <!-- Content Placeholder -->
    <section class="py-20 md:py-32">
        <div class="max-w-4xl mx-auto px-6 md:px-12">
            <div class="p-10 md:p-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] md:rounded-[4rem] flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-8 text-slate-400">
                    <i class="fas fa-newspaper"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 font-title">Kits Média en préparation</h3>
                <p class="text-slate-500 font-light mb-10 max-w-sm">Pour toute demande urgente de presse ou interview, notre équipe dédiée vous répond directement.</p>
                <a href="mailto:press@freegeny.com" class="text-orange-600 font-black text-xl md:text-2xl underline underline-offset-8 decoration-orange-600/20 hover:decoration-orange-600 transition-all font-title">press@freegeny.com</a>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
