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
                
                <div class="relative inline-block mb-12">
                    <h1 class="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter">
                        FreeGeny
                    </h1>
                    <span class="absolute -bottom-4 right-0 md:-right-20 text-xl md:text-2xl font-bold text-orange-600 font-[Caveat] whitespace-nowrap -rotate-2">
                        free the genius on your child
                    </span>
                </div>
                
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
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="subjects">0</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Matières</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="countries">0</span>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Pays</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-3xl font-black text-orange-600 tracking-tighter" x-text="langs">0</span>
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
            <div class="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 transform hover:-translate-y-1 transition duration-500 flex flex-col items-center text-center">
                <div class="w-14 h-14 mb-6 flex items-center justify-center bg-white rounded-2xl shadow-sm">
                    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_mission_1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ea580c" /><stop offset="100%" style="stop-color:#f43f5e" /></linearGradient></defs>
                        <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="url(#grad_mission_1)" stroke-width="2"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 000 18M12 3a13.5 13.5 0 010 18" stroke="url(#grad_mission_1)" stroke-width="2"/>
                    </svg>
                </div>
                <p class="text-slate-600 font-medium leading-relaxed italic">
                    <span class="text-slate-900 font-black">Accès Universel :</span> FreeGeny propose des descriptifs de cursus, des cours détaillés et des exercices spécifiques pour chacun des pays supportés.
                </p>
            </div>
            <div class="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 transform hover:-translate-y-1 transition duration-500 flex flex-col items-center text-center">
                <div class="w-14 h-14 mb-6 flex items-center justify-center bg-white rounded-2xl shadow-sm">
                    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_mission_2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#0d9488" /></linearGradient></defs>
                        <path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#grad_mission_2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <p class="text-slate-600 font-medium leading-relaxed italic">
                    <span class="text-slate-900 font-black">Lien Parents-École :</span> Un écosystème où chaque acteur de la formation (parents, enseignants, ONG) collabore pour un accompagnement personnalisé.
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
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-orange-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_about" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ea580c" /><stop offset="100%" style="stop-color:#f43f5e" /></linearGradient></defs>
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="url(#grad_about)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Qui sommes-nous ?</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1 italic">
                    FreeGeny est une plateforme EdTech visionnaire qui repense l'apprentissage pour le cycle primaire. Découvrez notre histoire.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="inline-flex items-center text-sm font-black text-orange-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Nos objectifs -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_goals" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#0d9488" /></linearGradient></defs>
                        <circle cx="12" cy="12" r="10" stroke="url(#grad_goals)" stroke-width="2"/><circle cx="12" cy="12" r="6" stroke="url(#grad_goals)" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="url(#grad_goals)"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Nos objectifs</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1 italic">
                    Nous visons l'excellence académique pour chaque enfant, grâce à des outils technologiques de pointe et un contenu de qualité.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/mission" class="inline-flex items-center text-sm font-black text-blue-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Parents -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-rose-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_parents" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e11d48" /><stop offset="100%" style="stop-color:#ea580c" /></linearGradient></defs>
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 100-8 4 4 0 000 8zM7 7a3 3 0 100-6 3 3 0 000 6zm0 14v-2a4 4 0 00-2-3.465" stroke="url(#grad_parents)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Espace Parents</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1 italic">
                    Suivez la progression de vos enfants en temps réel et accompagnez leur scolarité avec sérénité grâce à notre dashboard.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="inline-flex items-center text-sm font-black text-rose-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Écoles -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_schools" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2563eb" /><stop offset="100%" style="stop-color:#1e40af" /></linearGradient></defs>
                        <path d="M3 21h18M3 10l9-7 9 7v11H3V10zm6 11V14h6v7" stroke="url(#grad_schools)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pour les Écoles</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1 italic">
                    Digitalisez vos supports de cours et offrez à vos élèves une bibliothèque interactive alignée sur les cursus officiels.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="inline-flex items-center text-sm font-black text-blue-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- ONG -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-teal-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_ngos" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0d9488" /><stop offset="100%" style="stop-color:#059669" /></linearGradient></defs>
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="url(#grad_ngos)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pour les ONG</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1 italic">
                    Déployez des solutions éducatives dans les zones reculées et suivez l'impact de vos programmes avec précision.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="inline-flex items-center text-sm font-black text-teal-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>

            <!-- Magasin -->
            <div class="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-rose-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="grad_shop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f43f5e" /><stop offset="100%" style="stop-color:#e11d48" /></linearGradient></defs>
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-10 0a2 2 0 100 4 2 2 0 000-4z" stroke="url(#grad_shop)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Boutique FreeGeny</h3>
                <p class="text-slate-500 leading-relaxed font-medium mb-8 flex-1 italic">
                    Accédez à nos supports physiques et livres d'activités pour enrichir l'apprentissage hors-ligne de vos enfants.
                </p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="inline-flex items-center text-sm font-black text-rose-600 uppercase tracking-widest hover:translate-x-2 transition-transform italic">
                    En savoir plus <span class="ml-2">→</span>
                </a>
            </div>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
