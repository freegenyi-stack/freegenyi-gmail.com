<?php
/**
 * status.php - Elite System Pulse
 */
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-slate-50">
    <section class="py-20 md:py-32">
        <div class="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 inline-block">Infrastructure Temps Réel</span>
            <h1 class="text-4xl md:text-7xl font-black text-slate-900 mb-12 md:mb-20 font-title tracking-tighter">Statut Systèmes.</h1>
            
            <div class="bg-white p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-center gap-6">
                <div class="relative flex h-5 w-5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-5 w-5 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"></span>
                </div>
                <p class="text-xl md:text-3xl font-black text-slate-900 font-title tracking-tight">Tous les systèmes sont opérationnels.</p>
            </div>
            
            <p class="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Vérifié il y a moins d'une minute</p>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
