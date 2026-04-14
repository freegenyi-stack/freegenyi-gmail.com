<?php
/**
 * faq.php - Elite Help Center
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero FAQ -->
    <section class="py-16 md:py-32 bg-slate-50 relative overflow-hidden text-center">
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 inline-block">Support Client</span>
            <h1 class="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 font-title">Centre d'aide.</h1>
            <p class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                Tout ce que vous devez savoir pour offrir une expérience d'élite à vos enfants.
            </p>
        </div>
    </section>

    <!-- FAQ Accordion -->
    <section class="py-20 md:py-32">
        <div class="max-w-3xl mx-auto px-6 md:px-12">
            <div x-data="{ active: null }" class="space-y-4">
                
                <!-- Q1 -->
                <div class="border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button @click="active = (active === 1 ? null : 1)" class="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-slate-50 transition-colors outline-none">
                        <span class="text-base md:text-lg font-bold text-slate-900 font-title">Comment s'inscrire sur FreeGeny ?</span>
                        <svg class="w-5 h-5 text-slate-300 transition-transform duration-300" :class="active === 1 ? 'rotate-180 mb-1' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                    </button>
                    <div x-show="active === 1" x-cloak x-transition class="p-6 md:p-8 pt-0 text-slate-500 font-light leading-relaxed border-t border-slate-50">
                        C'est gratuit et illimité ! Cliquez sur "Rejoindre" dans le menu, choisissez votre profil et validez votre compte via votre e-mail ou Gmail.
                    </div>
                </div>

                <!-- Q2 -->
                <div class="border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button @click="active = (active === 2 ? null : 2)" class="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-slate-50 transition-colors outline-none">
                        <span class="text-base md:text-lg font-bold text-slate-900 font-title">Quels sont les pays supportés ?</span>
                        <svg class="w-5 h-5 text-slate-300 transition-transform duration-300" :class="active === 2 ? 'rotate-180 mb-1' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                    </button>
                    <div x-show="active === 2" x-cloak x-transition class="p-6 md:p-8 pt-0 text-slate-500 font-light leading-relaxed border-t border-slate-50">
                        Nous supportons actuellement plus de 60 pays. Vous pouvez changer de région via le sélecteur situé dans le header.
                    </div>
                </div>

                <!-- Q3 -->
                <div class="border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button @click="active = (active === 3 ? null : 3)" class="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-slate-50 transition-colors outline-none">
                        <span class="text-base md:text-lg font-bold text-slate-900 font-title">Mes données sont-elles protégées ?</span>
                        <svg class="w-5 h-5 text-slate-300 transition-transform duration-300" :class="active === 3 ? 'rotate-180 mb-1' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                    </button>
                    <div x-show="active === 3" x-cloak x-transition class="p-6 md:p-8 pt-0 text-slate-500 font-light leading-relaxed border-t border-slate-50">
                        Absolument. Nous appliquons les standards RGPD les plus stricts pour garantir la confidentialité totale des informations de votre famille.
                    </div>
                </div>

            </div>

            <div class="mt-20 text-center p-10 bg-orange-50 rounded-[2.5rem]">
                <p class="text-orange-600 font-bold mb-6 font-title tracking-tight text-lg">Une question spécifique ?</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/contact" class="inline-block py-4 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-orange-600 transition-all">Nous contacter</a>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
