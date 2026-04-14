<?php
/**
 * mission.php - Elite Mission Page
 */
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-16 md:py-32 bg-orange-600 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center text-white">
            <div class="relative inline-block mb-8">
                <h1 class="text-4xl md:text-7xl font-black tracking-tighter font-title">Notre Mission</h1>
                <span class="absolute -bottom-4 right-0 text-lg md:text-xl font-bold text-white font-caveat rotate-2">l'éducation pour tous</span>
            </div>
            <p class="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto font-medium italic leading-relaxed">
                Rendre l'éducation primaire d'élite accessible à chaque enfant, sans exception, partout sur la planète.
            </p>
        </div>
    </section>

    <!-- Mission Pillars -->
    <section class="py-16 md:py-32">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <div class="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_miss_1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ea580c" /><stop offset="100%" style="stop-color:#f43f5e" /></linearGradient></defs>
                            <path d="M8 11V7a4 4 0 118 0v4m-8 0a3 3 0 00-3 3v3a3 3 0 003 3h8a3 3 0 003-3v-3a3 3 0 00-3-3m-8 0h8" stroke="url(#g_miss_1)" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 font-title">Gratuité Totale</h3>
                    <p class="text-slate-500 leading-relaxed font-light">
                        Le savoir ne doit pas avoir de prix. Tout le contenu de FreeGeny est et restera gratuit pour tous.
                    </p>
                </div>
                <!-- ... Repeat for other pillars if needed, but keeping the core structure ... -->
                <div class="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_miss_2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#0d9488" /></linearGradient></defs>
                            <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="url(#g_miss_2)" stroke-width="2"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 000 18M12 3a13.5 13.5 0 010 18" stroke="url(#g_miss_2)" stroke-width="2"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 font-title">Adaptation Locale</h3>
                    <p class="text-slate-500 leading-relaxed font-light">
                        Nous respectons les identités culturelles et les programmes officiels de chaque pays supporté.
                    </p>
                </div>
                <div class="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_miss_3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#10b981" /><stop offset="100%" style="stop-color:#059669" /></linearGradient></defs>
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="url(#g_miss_3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 font-title">Excellence EdTech</h3>
                    <p class="text-slate-500 leading-relaxed font-light">
                        Le meilleur de la technologie pour personnaliser l'apprentissage de chaque enfant.
                    </p>
                </div>
            </div>

            <!-- The Bridge Section -->
            <div class="mt-20 md:mt-32 p-8 md:p-16 bg-slate-900 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden text-center lg:text-left">
                <div class="absolute inset-0 opacity-10">
                    <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 50 Q 25 0 50 50 T 100 50" stroke="white" stroke-width="0.5" fill="none"/>
                    </svg>
                </div>
                <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                        <h2 class="text-3xl md:text-5xl font-black text-white mb-8 font-title tracking-tight">Le Pont de l'Excellence</h2>
                        <p class="text-slate-300 text-lg leading-relaxed font-light mb-10">
                            Nous créons un pont technologique et humain entre les acteurs fondamentaux de la réussite : Parents, Écoles et l'Enfant.
                        </p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                            <div class="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <span class="block text-xl font-bold text-white mb-2">Visibilité</span>
                                <span class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Suivi en temps réel</span>
                            </div>
                            <div class="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <span class="block text-xl font-bold text-white mb-2">Unisson</span>
                                <span class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Dialogue parents-écoles</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white/5 rounded-[2.5rem] p-10 border border-white/10">
                        <div class="text-center">
                            <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-6 shadow-2xl">
                                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <h3 class="text-xl font-bold text-white mb-4 font-title">Récompenses Intelligentes</h3>
                            <p class="text-slate-400 text-sm leading-relaxed font-light">
                                Notre IA suggère des gratifications sur-mesure au parent pour transformer l'effort numérique en joie réelle.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to action -->
    <section class="py-20 md:py-32 bg-slate-900 text-white rounded-t-[3rem] md:rounded-t-[5rem]">
        <div class="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <h2 class="text-3xl md:text-5xl font-black mb-10 font-title">Prêt à libérer le génie de votre enfant ?</h2>
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="inline-block bg-orange-600 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl">
                Commencer gratuitement
            </a>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
