<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-slate-50">
    <!-- Hero -->
    <section class="py-32 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center">
            <h1 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 italic">Science & Efficacité</h1>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Appuyés par les neurosciences, nos contenus sont conçus pour maximiser la mémorisation et l'engagement des jeunes apprenants.
            </p>
        </div>
    </section>

    <!-- Lab -->
    <section class="py-32">
        <div class="max-w-5xl mx-auto px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500">
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_sci_1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#4f46e5" /></linearGradient></defs>
                            <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="url(#g_sci_1)" stroke-width="2"/><path d="M12 7v5l3 3" stroke="url(#g_sci_1)" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Neurosciences</h3>
                    <p class="text-slate-500 leading-relaxed font-medium italic">
                        Nous utilisons la répétition espacée et le micro-learning pour aider les enfants à ancrer les savoirs dans leur mémoire à long terme.
                    </p>
                </div>
                <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500">
                    <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_sci_2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ea580c" /><stop offset="100%" style="stop-color:#f59e0b" /></linearGradient></defs>
                            <path d="M12 6v12m-6-6h12" stroke="url(#g_sci_2)" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="url(#g_sci_2)" stroke-width="2"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Gamification</h3>
                    <p class="text-slate-500 leading-relaxed font-medium italic">
                        Le plaisir libère de la dopamine. En transformant les exercices en défis positifs, nous stimulons la motivation.
                    </p>
                </div>
                <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500">
                    <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_sci_3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#10b981" /><stop offset="100%" style="stop-color:#059669" /></linearGradient></defs>
                            <path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#g_sci_3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Data au service de l'élève</h3>
                    <p class="text-slate-500 leading-relaxed font-medium italic">
                        L'analyse en temps réel des erreurs permet d'ajuster dynamiquement la difficulté pour chaque profil.
                    </p>
                </div>
                <div class="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500">
                    <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_sci_4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8b5cf6" /><stop offset="100%" style="stop-color:#d946ef" /></linearGradient></defs>
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="url(#g_sci_4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 italic">Résultats Prouvés</h3>
                    <p class="text-slate-500 leading-relaxed font-medium italic">
                        Nos études montrent une progression de 30% des scores académiques après seulement 15 minutes de pratique.
                    </p>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
