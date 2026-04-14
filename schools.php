<?php
/**
 * schools.php - Elite School Partnership Page
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero Schools -->
    <section class="py-16 md:py-32 bg-slate-950 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-blue-600 opacity-10 blur-[150px] -translate-x-1/2"></div>
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
            <div class="flex flex-col lg:flex-row items-center gap-12">
                <div class="flex-1">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-900/30 px-5 py-2 rounded-full mb-8 inline-block border border-blue-500/20">Partenaires Éducation</span>
                    <h1 class="text-4xl md:text-7xl font-black tracking-tighter mb-8 font-title leading-tight">Propulsez votre école dans <br class="hidden lg:block"> l'ère de l'IA.</h1>
                    <p class="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-10 max-w-2xl">
                        Offrez à vos enseignants et à vos élèves la puissance de la personnalisation massive. Un outil complet de gestion et de pédagogie adaptative.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-2xl shadow-blue-600/20">Demander un devis</a>
                    </div>
                </div>
                <div class="flex-1 w-full lg:max-w-md">
                    <div class="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-3xl">
                        <div class="space-y-6">
                            <div class="flex items-center gap-4 border-b border-slate-800 pb-4">
                                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dashboard Institutionnel Actif</span>
                            </div>
                            <div class="h-4 w-3/4 bg-slate-800 rounded-full"></div>
                            <div class="h-4 w-full bg-slate-800 rounded-full opacity-50"></div>
                            <div class="h-4 w-1/2 bg-slate-800 rounded-full opacity-30"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div>
                    <p class="text-3xl md:text-5xl font-black text-slate-900 font-title mb-2">300+</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Établissements</p>
                </div>
                <div>
                    <p class="text-3xl md:text-5xl font-black text-slate-900 font-title mb-2">15K+</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Élèves Suivis</p>
                </div>
                <div>
                    <p class="text-3xl md:text-5xl font-black text-slate-900 font-title mb-2">98%</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taux de Rétention</p>
                </div>
                <div>
                    <p class="text-3xl md:text-5xl font-black text-slate-900 font-title mb-2">x2.4</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progression Moyenne</p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
