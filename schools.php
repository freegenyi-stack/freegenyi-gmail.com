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
                        <i class="fas fa-school text-7xl text-blue-600"></i>
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
                        <i class="fas fa-laptop-code text-7xl text-blue-600"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
