<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center">
            <div class="relative inline-block mb-8">
                <h1 class="text-5xl md:text-7xl font-black tracking-tighter">Notre Approche</h1>
                <span class="absolute -bottom-4 right-0 text-xl font-bold text-orange-500 font-[Caveat] rotate-2">l'apprentissage réinventé</span>
            </div>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium italic leading-relaxed">
                Apprendre n'est pas une corvée, c'est une aventure. Découvrez comment nous marions plaisir et rigueur académique.
            </p>
        </div>
    </section>

    <!-- Methodology -->
    <section class="py-32">
        <div class="max-w-7xl mx-auto px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-32">
                <div>
                    <h2 class="text-xs font-black uppercase text-orange-600 tracking-[0.4em] mb-6">Le Cycle FreeGeny</h2>
                    <h3 class="text-4xl font-black text-slate-900 mb-10 tracking-tight italic">Comprendre, Pratiquer, Réussir.</h3>
                    <div class="space-y-12">
                        <div class="flex gap-8">
                            <div class="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs><linearGradient id="g_app_1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ea580c" /><stop offset="100%" style="stop-color:#f43f5e" /></linearGradient></defs>
                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" stroke="url(#g_app_1)" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-xl font-black text-slate-900 mb-2 italic">Cours Interactifs</h4>
                                <p class="text-slate-500 font-medium italic">Des cours dynamiques qui captent l'attention en expliquant les concepts par l'action et l'image.</p>
                            </div>
                        </div>
                        <div class="flex gap-8">
                            <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs><linearGradient id="g_app_2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#0d9488" /></linearGradient></defs>
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="url(#g_app_2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-xl font-black text-slate-900 mb-2 italic">Séries d'Exercices</h4>
                                <p class="text-slate-500 font-medium italic">Des milliers d'exercices calibrés par niveaux, avec correction immédiate pour ne jamais rester bloqué.</p>
                            </div>
                        </div>
                        <div class="flex gap-8">
                            <div class="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs><linearGradient id="g_app_3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0d9488" /><stop offset="100%" style="stop-color:#059669" /></linearGradient></defs>
                                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="url(#g_app_3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-xl font-black text-slate-900 mb-2 italic">Suivi Intelligent</h4>
                                <p class="text-slate-500 font-medium italic">Un algorithme qui identifie les forces et les faiblesses pour proposer des révisions ciblées.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <img src="https://img.freepik.com/free-vector/gradient-creativity-concept_23-2148810756.jpg" class="rounded-[4rem] shadow-2xl skew-x-1" alt="Approche">
                    <div class="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 max-w-xs">
                        <p class="text-sm font-black text-slate-900 italic mb-2 tracking-tight">"L'enfant n'est pas un vase qu'on remplit, mais un feu qu'on allume."</p>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">— Montaigne</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
