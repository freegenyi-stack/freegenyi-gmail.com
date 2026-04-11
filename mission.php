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
                    <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_miss_1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ea580c" /><stop offset="100%" style="stop-color:#f43f5e" /></linearGradient></defs>
                            <path d="M8 11V7a4 4 0 118 0v4m-8 0a3 3 0 00-3 3v3a3 3 0 003 3h8a3 3 0 003-3v-3a3 3 0 00-3-3m-8 0h8" stroke="url(#g_miss_1)" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Gratuité Totale</h3>
                    <p class="text-slate-500 leading-relaxed font-medium italic">
                        Le savoir ne doit pas avoir de prix. Tout le contenu de FreeGeny est et restera gratuit pour tous.
                    </p>
                </div>
                <div class="p-12 bg-white rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_miss_2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#0d9488" /></linearGradient></defs>
                            <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="url(#g_miss_2)" stroke-width="2"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 000 18M12 3a13.5 13.5 0 010 18" stroke="url(#g_miss_2)" stroke-width="2"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Adaptation Locale</h3>
                    <p class="text-slate-500 leading-relaxed font-medium italic">
                        Nous respectons les identités culturelles et les programmes officiels de chaque pays supporté.
                    </p>
                </div>
                <div class="p-12 bg-white rounded-[3rem] shadow-xl border border-slate-50 text-center">
                    <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_miss_3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#10b981" /><stop offset="100%" style="stop-color:#059669" /></linearGradient></defs>
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="url(#g_miss_3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Excellence EdTech</h3>
                    <p class="text-slate-500 leading-relaxed font-medium italic">
                        Le meilleur de la technologie pour personnaliser l'apprentissage de chaque enfant.
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
