<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-32 bg-slate-50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center">
            <h1 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 italic">Centre d'aide</h1>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed italic">
                Tout ce que vous devez savoir sur l'utilisation de FreeGeny pour vos enfants.
            </p>
        </div>
    </section>

    <!-- FAQ -->
    <section class="py-32">
        <div class="max-w-3xl mx-auto px-12">
            <div x-data="{ active: null }" class="space-y-6">
                
                <!-- Q1 -->
                <div class="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <button @click="active = (active === 1 ? null : 1)" class="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50 transition-colors">
                        <span class="text-lg font-black text-slate-900 italic">Comment s'inscrire sur FreeGeny ?</span>
                        <i class="fas fa-chevron-down text-slate-300 transition-transform" :class="active === 1 ? 'rotate-180' : ''"></i>
                    </button>
                    <div x-show="active === 1" x-cloak class="p-8 pt-0 text-slate-500 font-medium italic leading-relaxed border-t border-slate-50">
                        C'est gratuit et illimité ! Cliquez sur "S'inscrire" dans le menu, choisissez si vous êtes un parent, une école ou une ONG, et validez votre compte via votre e-mail ou Gmail.
                    </div>
                </div>

                <!-- Q2 -->
                <div class="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <button @click="active = (active === 2 ? null : 2)" class="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50 transition-colors">
                        <span class="text-lg font-black text-slate-900 italic">Quels sont les pays supportés ?</span>
                        <i class="fas fa-chevron-down text-slate-300 transition-transform" :class="active === 2 ? 'rotate-180' : ''"></i>
                    </button>
                    <div x-show="active === 2" x-cloak class="p-8 pt-0 text-slate-500 font-medium italic leading-relaxed border-t border-slate-50">
                        Nous supportons actuellement plus de 60 pays. Vous pouvez changer de région via le sélecteur de pays en haut à gauche de chaque page.
                    </div>
                </div>

                <!-- Q3 -->
                <div class="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <button @click="active = (active === 3 ? null : 3)" class="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50 transition-colors">
                        <span class="text-lg font-black text-slate-900 italic">Mes données sont-elles protégées ?</span>
                        <i class="fas fa-chevron-down text-slate-300 transition-transform" :class="active === 3 ? 'rotate-180' : ''"></i>
                    </button>
                    <div x-show="active === 3" x-cloak class="p-8 pt-0 text-slate-500 font-medium italic leading-relaxed border-t border-slate-50">
                        Absolument. Nous appliquons les standards RGPD et Google Cloud pour garantir que les informations de vos enfants restent strictement privées et sécurisées.
                    </div>
                </div>

            </div>

            <div class="mt-24 text-center p-12 bg-orange-50 rounded-[3rem]">
                <p class="text-orange-600 font-black italic mb-6">Vous n'avez pas trouvé votre réponse ?</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/contact" class="inline-block py-4 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs italic">Nous contacter</a>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
