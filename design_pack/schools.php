<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-32 bg-blue-600 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center text-white">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">FreeGeny Écoles</h1>
            <p class="text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed italic">
                Digitalisez votre établissement et offrez à vos élèves une bibliothèque d'exercices interactifs alignés sur les cursus officiels.
            </p>
        </div>
    </section>

    <!-- School Service -->
    <section class="py-32">
        <div class="max-w-5xl mx-auto px-12">
            <div class="space-y-32">
                <div class="flex flex-col md:flex-row gap-20 items-center">
                    <div class="flex-1">
                        <h2 class="text-3xl font-black text-slate-900 mb-8 italic">Gestion de Classe Simplifiée</h2>
                        <p class="text-slate-500 italic leading-relaxed mb-6 font-medium">
                            Créez des classes virtuelles, assignez des devoirs en un clic et suivez les résultats de chaque élève grâce à notre tableau de bord administrateur.
                        </p>
                        <ul class="space-y-4">
                            <li class="flex items-center text-slate-700 font-bold italic"><i class="fas fa-check-circle text-blue-600 mr-3"></i> Suivi individuel des progrès</li>
                            <li class="flex items-center text-slate-700 font-bold italic"><i class="fas fa-check-circle text-blue-600 mr-3"></i> Génération automatique de bilans</li>
                            <li class="flex items-center text-slate-700 font-bold italic"><i class="fas fa-check-circle text-blue-600 mr-3"></i> Supports de cours imprimables</li>
                        </ul>
                    </div>
                    <div class="flex-1 bg-slate-50 rounded-[3rem] p-12 flex items-center justify-center">
                        <svg class="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_sch_1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#1e40af" /></linearGradient></defs>
                            <path d="M3 21h18M3 10l9-7 9 7v11H3V10zm6 11V14h6v7" stroke="url(#g_sch_1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row-reverse gap-20 items-center">
                    <div class="flex-1">
                        <h2 class="text-3xl font-black text-slate-900 mb-8 italic">Accompagnement Pédagogique</h2>
                        <p class="text-slate-500 italic leading-relaxed mb-6 font-medium">
                            Nous formons vos enseignants à l'utilisation des outils EdTech pour transformer l'apprentissage en classe.
                        </p>
                        <a href="#" class="inline-block py-4 px-8 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl transition-all italic">Prendre rendez-vous</a>
                    </div>
                    <div class="flex-1 bg-slate-50 rounded-[3rem] p-12 flex items-center justify-center">
                        <svg class="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs><linearGradient id="g_sch_2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#0d9488" /></linearGradient></defs>
                            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="url(#g_sch_2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
