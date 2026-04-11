<?php
/**
 * index.php - Version Épurée Finalisée
 */
include_once __DIR__ . '/includes/header.php';
?>

<!-- Section HERO : Style Affiné & Compteurs Animés -->
<section class="relative bg-white pt-20 pb-28 overflow-hidden">
    <div class="max-w-7xl mx-auto px-12 relative z-10 text-center lg:text-left">
        <div class="flex flex-wrap items-center -mx-4">
            
            <div class="w-full lg:w-1/2 px-4 mb-20 lg:mb-0" 
                 x-data="{ 
                    users: 0, 
                    subjects: 0, 
                    countries: 0, 
                    langs: 0, 
                    exercises: 0,
                    animate(target, duration, key) {
                        let start = 0;
                        let increment = target / (duration / 16);
                        let timer = setInterval(() => {
                            start += increment;
                            if (start >= target) {
                                this[key] = target;
                                clearInterval(timer);
                            } else {
                                this[key] = Math.floor(start);
                            }
                        }, 16);
                    }
                 }" 
                 x-init="animate(15, 5000, 'users'); animate(48, 5000, 'subjects'); animate(64, 5000, 'countries'); animate(28, 5000, 'langs'); animate(8500, 5000, 'exercises');">
                
                <h1 class="text-5xl md:text-7xl font-black text-slate-900 leading-none mb-6 tracking-tighter">
                    FreeGeny
                </h1>
                
                <p class="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
                    <span class="text-orange-600 font-bold">FreeGeny</span> est une plateforme EdTech dédiée à la réussite scolaire des enfants du cycle primaire partout dans le monde.
                </p>
                
                <!-- Ligne de Compteurs (Horizontale) -->
                <div class="flex flex-wrap gap-x-10 gap-y-6 justify-center lg:justify-start pt-4 border-t border-slate-50">
                    <div class="flex flex-col">
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="users + 'K+'">0</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Utilisateurs</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="subjects + '+'">0</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Matières</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="countries + '+'">0</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Pays</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="langs + '+'">0</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Langues</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="exercises.toLocaleString() + '+'">0</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Exercices</span>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-1/2 px-4">
                <img class="w-full max-w-lg mx-auto transform hover:scale-105 transition duration-700" src="https://img.freepik.com/free-vector/children-learning-online-concept_23-2148524458.jpg" alt="FreeGeny Original">
            </div>
        </div>
    </div>
</section>

<!-- MISSION SECTION (Validation Google & Confiance) -->
<section class="py-32 bg-white">
    <div class="max-w-5xl mx-auto px-12 text-center">
        <h2 class="text-xs font-black uppercase tracking-[0.3em] text-orange-600 mb-6">Notre Mission EdTech</h2>
        <h3 class="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">Accompagner chaque enfant vers la réussite scolaire prématurée.</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div class="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 transform hover:-translate-y-1 transition duration-500">
                <p class="text-slate-600 font-medium leading-relaxed">
                    <span class="text-slate-900 font-black">Accès Universel :</span> FreeGeny propose des descriptifs de cursus, des cours détaillés et des exercices spécifiques pour chacun des pays supportés.
                </p>
            </div>
            <div class="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 transform hover:-translate-y-1 transition duration-500">
                <p class="text-slate-600 font-medium leading-relaxed">
                    <span class="text-slate-900 font-black">Outils de Suivi :</span> Un tableau de bord complet permet aux parents et ONG de suivre l'historique et la progression des enfants en temps réel.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Section SERVICES : Les 6 Piliers FreeGeny -->
<section id="subjects" class="py-32 bg-slate-50/50">
    <div class="max-w-7xl mx-auto px-12">
        <div class="max-w-3xl mx-auto text-center mb-24">
            <h2 class="text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-6 italic">Découvrez notre univers</h2>
            <h3 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Tout savoir sur FreeGeny</h3>
            <p class="text-lg text-slate-400 font-medium italic">Explorez nos missions et les outils que nous mettons à votre disposition pour la réussite éducative.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <!-- Qui sommes-nous -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-orange-50 text-orange-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">📖</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Qui sommes-nous ?</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                    FreeGeny est une plateforme EdTech visionnaire qui repense l'apprentissage pour le cycle primaire. Découvrez notre histoire et notre équipe de passionnés.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="inline-flex items-center text-sm font-black text-orange-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Nos objectifs -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">🎯</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Nos objectifs</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                    Nous visons l'excellence académique pour chaque enfant, peu importe sa localisation, grâce à des outils technologiques de pointe et un contenu de qualité.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/goals" class="inline-flex items-center text-sm font-black text-blue-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Parents -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-purple-50 text-purple-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">👨‍👩‍👧‍👦</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Espace Parents</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                    Suivez la progression de vos enfants en temps réel, gérez les exercices et accompagnez leur scolarité avec sérénité grâce à notre dashboard parent.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="inline-flex items-center text-sm font-black text-purple-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Écoles -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-green-50 text-green-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">🏫</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pour les Écoles</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                    Digitalisez vos supports de cours et offrez à vos élèves une bibliothèque d'exercices interactifs alignés sur les cursus officiels internationaux.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="inline-flex items-center text-sm font-black text-green-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- ONG -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-teal-50 text-teal-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">🤝</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pour les ONG</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                    Déployez des solutions éducatives dans les zones reculées et suivez l'impact de vos programmes grâce à des analyses de données précises.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="inline-flex items-center text-sm font-black text-teal-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Magasin -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-14 h-14 mb-8 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl text-xl group-hover:scale-110 transition-transform">🛒</div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Boutique FreeGeny</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                    Accédez à nos supports physiques, livres d'activités et ressources complémentaires pour enrichir l'apprentissage hors-ligne.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="inline-flex items-center text-sm font-black text-rose-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
