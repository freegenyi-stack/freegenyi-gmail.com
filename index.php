<?php
/**
 * index.php - Version Épurée Finalisée
 */
include_once __DIR__ . '/includes/header.php';
?>

<!-- Section HERO : Le Pont de l'Excellence -->
<section class="relative bg-white pt-32 pb-28 overflow-hidden">
    <div class="max-w-7xl mx-auto px-12 relative z-10 text-center lg:text-left">
        <div class="flex flex-wrap items-center -mx-4">
            
            <div class="w-full lg:w-1/2 px-4 mb-20 lg:mb-0">
                <div class="inline-flex items-center space-x-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full mb-8">
                    <span class="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-orange-600">Le Pont de l'Excellence est Ouvert</span>
                </div>
                
                <h1 class="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-10">
                    Libérez le <span class="text-orange-600">Génie</span><br>de votre enfant.
                </h1>
                
                <p class="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
                    FreeGeny érige un pont technologique entre <span class="text-slate-900 font-black italic">Parents</span>, <span class="text-slate-900 font-black italic">Écoles</span> et <span class="text-slate-900 font-black italic">Enfants</span> pour un accompagnement holistique vers l'élite mondiale.
                </p>
                
                <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-slate-900 text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">
                        Commencer l'aventure
                    </a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/approach" class="flex items-center justify-center space-x-3 px-10 py-6 bg-white border-2 border-slate-100 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all">
                        <span>Notre approche</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="2.5"/></svg>
                    </a>
                </div>
            </div>

            <div class="w-full lg:w-1/2 px-4 flex justify-center lg:justify-end">
                <div class="relative">
                    <div class="absolute -top-10 -right-10 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-50"></div>
                    <img class="w-full max-w-md relative z-10 transform hover:rotate-2 transition duration-700" src="https://img.freepik.com/free-vector/children-learning-online-concept_23-2148524458.jpg" alt="FreeGeny Elite">
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Section 3 UNIVERS : Scolaire, Monde, Magique -->
<section class="py-32 bg-slate-50">
    <div class="max-w-7xl mx-auto px-12">
        <div class="text-center mb-20">
            <h2 class="text-4xl font-black text-slate-900 mb-4 tracking-tight">Trois Portails, Une Destination.</h2>
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">L'immersion totale FreeGeny</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-12 rounded-[4rem] shadow-xl border border-white group hover:-translate-y-2 transition-all duration-500">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2.5"/></svg>
                </div>
                <h3 class="text-2xl font-black mb-4">Univers Local</h3>
                <p class="text-slate-500 text-sm leading-relaxed mb-8 italic">Maîtrise chirurgicale du programme national officiel (Algérie 1AP, 2AP...).</p>
            </div>
            <div class="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white group hover:-translate-y-2 transition-all duration-500">
                <div class="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke-width="2.5"/></svg>
                </div>
                <h3 class="text-2xl font-black mb-4">Portail Mondial</h3>
                <p class="text-slate-400 text-sm leading-relaxed mb-8 italic">Accès aux standards d'élite : Maths de Singapour, Anglais Oxford et plus.</p>
            </div>
            <div class="bg-white p-12 rounded-[4rem] shadow-xl border border-white group hover:-translate-y-2 transition-all duration-500">
                <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2.5"/></svg>
                </div>
                <h3 class="text-2xl font-black mb-4">Arène Magique</h3>
                <p class="text-slate-500 text-sm leading-relaxed mb-8 italic">Des défis ludiques qui s'adaptent dynamiquement aux leçons de la semaine.</p>
            </div>
        </div>
    </div>
</section>

<!-- Section OUTILS EXCEPTION : Boost, Pont, Print -->
<section class="py-32 overflow-hidden">
    <div class="max-w-7xl mx-auto px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div class="relative">
                <div class="bg-orange-100 rounded-[5rem] w-full aspect-square relative z-10 flex items-center justify-center p-12">
                    <div class="bg-white p-10 rounded-[3rem] shadow-2xl w-full transform rotate-2">
                        <div class="flex items-center space-x-6 mb-8">
                            <div class="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" stroke-width="2.5"/></svg>
                            </div>
                            <span class="text-xl font-black text-slate-900 tracking-tight">Boost Émotionnel</span>
                        </div>
                        <div class="space-y-4">
                            <div class="h-3 w-full bg-slate-50 rounded-full"></div>
                            <div class="h-3 w-5/6 bg-slate-50 rounded-full"></div>
                            <div class="flex justify-end pt-4">
                                <span class="text-[9px] font-black uppercase text-orange-600 tracking-widest bg-orange-50 px-4 py-2 rounded-full italic">La voix de papa</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-100 rounded-full blur-[80px] opacity-40"></div>
            </div>
            
            <div>
                <h2 class="text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-none">Des outils de pilotage <br><span class="text-orange-600">sans précédent.</span></h2>
                <ul class="space-y-12">
                    <li class="group">
                        <div class="flex items-start space-x-6">
                            <div class="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all">✨</div>
                            <div>
                                <h4 class="text-2xl font-black mb-3">Le Boost Émotionnel</h4>
                                <p class="text-slate-500 text-sm leading-relaxed italic font-medium">Motivez votre enfant avec votre propre voix. Une gratification humaine immédiate après chaque victoire difficile.</p>
                            </div>
                        </div>
                    </li>
                    <li class="group">
                        <div class="flex items-start space-x-6">
                            <div class="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">🤝</div>
                            <div>
                                <h4 class="text-2xl font-black mb-3">Le Pont de Récompenses</h4>
                                <p class="text-slate-500 text-sm leading-relaxed italic font-medium">FreeGeny suggère le "cadeau réel" idéal basé sur les efforts. Le parent valide, l'enfant s'épanouit.</p>
                            </div>
                        </div>
                    </li>
                    <li class="group">
                        <div class="flex items-start space-x-6">
                            <div class="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all">🖨️</div>
                            <div>
                                <h4 class="text-2xl font-black mb-3">Printable Factory</h4>
                                <p class="text-slate-500 text-sm leading-relaxed italic font-medium">Générez des cahiers de révision personnalisés (PDF, Image, HTML) sur les thèmes préférés de votre génie.</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Section EXPERTS : Caution Scientifique -->
<section class="py-32 bg-slate-900 text-white rounded-[5rem] mb-32 mx-6">
    <div class="max-w-6xl mx-auto px-12 text-center">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-orange-500 mb-8">Caution Scientifique & Humaine</h2>
        <h3 class="text-5xl font-black mb-10 tracking-tight italic">Une vision partagée par les meilleurs.</h3>
        <p class="text-slate-400 text-xl font-medium mb-20 max-w-3xl mx-auto leading-relaxed">
            FreeGeny intègre des cliniciens, des pédagogues et des experts EdTech pour créer un écosystème d'apprentissage sain, gratuit et ultra-performant.
        </p>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div class="p-8 bg-white/5 rounded-[3rem] border border-white/5">
                <span class="block text-4xl font-black mb-3 italic">Diagnostic</span>
                <p class="text-[9px] font-black uppercase tracking-widest text-orange-500">IA de calibrage initiale</p>
            </div>
            <div class="p-8 bg-white/5 rounded-[3rem] border border-white/5">
                <span class="block text-4xl font-black mb-3 italic">Expertise</span>
                <p class="text-[9px] font-black uppercase tracking-widest text-orange-500">Appui clinique gratuit</p>
            </div>
            <div class="p-8 bg-white/5 rounded-[3rem] border border-white/5">
                <span class="block text-4xl font-black mb-3 italic">Sync</span>
                <p class="text-[9px] font-black uppercase tracking-widest text-orange-500">Lien Maison / École</p>
            </div>
            <div class="p-8 bg-white/5 rounded-[3rem] border border-white/5">
                <span class="block text-4xl font-black mb-3 italic">Global</span>
                <p class="text-[9px] font-black uppercase tracking-widest text-orange-500">Maths de Singapour</p>
            </div>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
