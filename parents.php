<?php
/**
 * parents.php - Elite Parents Page
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Section Hero -->
    <section class="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div class="text-center max-w-3xl mx-auto">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-6 inline-block">Pour la Famille</span>
                <h1 class="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 font-title">Le cockpit de leur réussite.</h1>
                <p class="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
                    Suivez, accompagnez et célébrez chaque progrès de vos enfants avec des outils de monitoring pensés par des experts.
                </p>
            </div>
        </div>
    </section>

    <!-- Section Features -->
    <section class="py-20 md:py-32">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <!-- Feature 1 -->
                <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300">
                    <div class="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-8">📊</div>
                    <h3 class="text-xl font-bold text-slate-900 mb-4 font-title">Suivi en Temps Réel</h3>
                    <p class="text-slate-500 leading-relaxed font-light">Visualisez instantanément les scores, le temps passé et les concepts maîtrisés par chaque enfant.</p>
                </div>
                <!-- Feature 2 -->
                <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300">
                    <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-8">🎙️</div>
                    <h3 class="text-xl font-bold text-slate-900 mb-4 font-title">Booster Émotionnel</h3>
                    <p class="text-slate-500 leading-relaxed font-light">Envoyez des messages vocaux de motivation qui se déclencheront au moment clé de leurs exercices.</p>
                </div>
                <!-- Feature 3 -->
                <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300">
                    <div class="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center text-2xl mb-8">🛠️</div>
                    <h3 class="text-xl font-bold text-slate-900 mb-4 font-title">Printable Factory</h3>
                    <p class="text-slate-500 leading-relaxed font-light">Générez des cahiers de révision personnalisés en PDF basés sur les points faibles de l'enfant.</p>
                </div>
            </div>
            
            <div class="mt-20 text-center">
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="inline-flex items-center justify-center bg-slate-900 text-white px-10 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all">S'inscrire comme Parent</a>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
