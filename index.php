<?php
/**
 * index.php - Version Elite Design System (Full Ecosystem)
 */
include_once __DIR__ . '/includes/header.php';
?>

<!-- ========== SECTION HERO ========== -->
<section class="relative bg-gradient-to-b from-white to-slate-50/40 pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <!-- Texte -->
            <div class="flex-1 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 bg-orange-50/80 backdrop-blur-sm border border-orange-100 px-4 py-2 rounded-full mb-8">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                    </span>
                    <span class="text-[11px] font-black uppercase tracking-wider text-orange-600">Le Pont de l’Excellence est ouvert</span>
                </div>
                
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-8" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                    Libérez le <span class="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">génie</span><br>
                    de votre enfant.
                </h1>
                
                <p class="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12" style="font-family: 'DM Sans', sans-serif; font-weight: 300;">
                    FreeGeny érige un pont technologique entre <span class="font-bold text-slate-900">Parents</span>, 
                    <span class="font-bold text-slate-900">Écoles</span> et <span class="font-bold text-slate-900">Enfants</span> 
                    pour un accompagnement holistique vers l’excellence mondiale.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl hover:shadow-orange-200 hover:-translate-y-1">
                        Commencer l’aventure
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"/></svg>
                    </a>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/approach" class="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all">
                        Notre approche
                    </a>
                </div>
            </div>
            
            <!-- Illustration Image (Elite Spirit) -->
            <div class="flex-1 relative w-full">
                <div class="absolute -top-20 -right-20 w-80 h-80 bg-orange-200 rounded-full blur-[120px] opacity-40"></div>
                <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
                <div class="relative z-10 transition-transform duration-1000 hover:scale-[1.02]">
                    <img src="/assets/img/hero_elite.png" alt="FreeGeny Spirit" class="w-full max-w-xl mx-auto rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-8 border-white ring-1 ring-slate-100">
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ========== SECTION 3 UNIVERS ========== -->
<section class="py-24 md:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="text-center max-w-3xl mx-auto mb-20">
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-5 py-2.5 rounded-full">Explorez les Portails</span>
            <h2 class="text-4xl md:text-6xl font-black text-slate-900 mt-8 mb-6 tracking-tight">Une immersion totale.</h2>
            <p class="text-slate-500 text-lg md:text-xl leading-relaxed font-light">Trois univers interconnectés pour une progression sans limites.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
            <!-- École Locale -->
            <div class="group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-colors duration-300 text-blue-600 group-hover:text-white">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22.5 12.75a.75.75 0 00-.75-.75H13.5v7.5h8.25a.75.75 0 00.75-.75v-6zM12 19.5v-7.5H2.25a.75.75 0 00-.75.75v6a.75.75 0 00.75.75H12z"/></svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Portail Local</h3>
                <p class="text-slate-500 leading-relaxed font-light mb-8">Maîtrise du programme officiel algérien. Vos fondations scolaires renforcées par l’IA.</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/portal-local" class="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Découvrir l'univers →</a>
            </div>

            <!-- Portail Mondial -->
            <div class="group bg-slate-900 text-white rounded-[2.5rem] p-10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-slate-800 shadow-2xl">
                <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-orange-600 transition-colors duration-300">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM3.5 12c0-1.03.2-1.99.55-2.88l3.12 3.12c.1.1.25.14.38.1l2.5-1c.21-.08.31-.33.22-.53l-1-2.25a.38.38 0 01.12-.46l1.75-1.25c.16-.11.23-.33.16-.51L10.5 4.1a8.55 8.55 0 011.5-.1 8.5 8.5 0 018.5 8.5c0 .38-.03.74-.08 1.1l-2.07-.35a.38.38 0 01-.3-.26l-.75-2.5a.38.38 0 00-.7-.04l-1.5 3a.38.38 0 01-.13.15l-3 2c-.15.1-.22.28-.18.45l.75 2.5c.03.1.11.17.2l.5.15c-.24.03-.5.05-.75.05a8.5 8.5 0 01-8.5-8.5z"/></svg>
                </div>
                <h3 class="text-2xl font-black mb-4 tracking-tight">Portail Mondial</h3>
                <p class="text-slate-300 leading-relaxed font-light mb-8">Maths de Singapour et Anglais Oxford pour une ambition sans frontières.</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/portal-world" class="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-500 transition-colors">Explorer le monde →</a>
            </div>

            <!-- Arène Magique -->
            <div class="group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div class="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-teal-600 transition-colors duration-300 text-teal-600 group-hover:text-white">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Arène Magique</h3>
                <p class="text-slate-500 leading-relaxed font-light mb-8">Défis ludiques adaptés dynamiquement pour ancrer chaque compétence par le jeu.</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/portal-magic" class="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors">Entrer dans l'arène →</a>
            </div>
        </div>
    </div>
</section>

<!-- ========== SECTION SOLUTIONS ÉCOSYSTÈME (Parents, Écoles, ONG, Boutique) ========== -->
<section class="py-24 md:py-32 bg-slate-50/50">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="text-center max-w-3xl mx-auto mb-20">
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full">L’Écosystème FreeGeny</span>
            <h2 class="text-4xl md:text-6xl font-black text-slate-900 mt-8 mb-6 tracking-tight">Des solutions pour chacun.</h2>
            <p class="text-slate-500 text-lg leading-relaxed font-light">Parce que l’excellence nécessite une synergie parfaite entre tous les acteurs.</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-10">
            <!-- PARENTS -->
            <div class="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                <div class="flex items-center gap-6 mb-8">
                    <div class="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/></svg>
                    </div>
                    <h3 class="text-3xl font-black text-slate-900 tracking-tight">Espace Parents</h3>
                </div>
                <p class="text-slate-500 leading-relaxed font-light text-lg mb-10">Pilotage précis de la réussite. Suivez les progrès, envoyez des boosts émotionnels vocaux et gérez les récompenses pour transformer l’effort en plaisir.</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/parents" class="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">En savoir plus →</a>
            </div>

            <!-- ÉCOLES -->
            <div class="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                <div class="flex items-center gap-6 mb-8">
                    <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M11.58 2.387a.75.75 0 01.84 0l8.25 5.25a.75.75 0 010 1.32l-8.25 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22 11.75a.75.75 0 00-.75-.75H2.75a.75.75 0 000 1.5h18.5a.75.75 0 00.75-.75zM2.75 14.75a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75zM2.75 18.5a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75z"/></svg>
                    </div>
                    <h3 class="text-3xl font-black text-slate-900 tracking-tight">FreeGeny Écoles</h3>
                </div>
                <p class="text-slate-500 leading-relaxed font-light text-lg mb-10">Transformation numérique complète. Outils de suivi pédagogique, gestion de classe hybride et contenus validés par des experts cliniciens pour chaque enseignant.</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/schools" class="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">En savoir plus →</a>
            </div>

            <!-- ONG -->
            <div class="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                <div class="flex items-center gap-6 mb-8">
                    <div class="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.716 3.99 1.933A5.485 5.485 0 0115 3c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>
                    </div>
                    <h3 class="text-3xl font-black text-slate-900 tracking-tight">FreeGeny ONG</h3>
                </div>
                <p class="text-slate-500 leading-relaxed font-light text-lg mb-10">L’éducation sans frontières. Des solutions spécialisées pour les zones reculées avec technologie hors-ligne et mesure précise de l’impact social.</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/ngos" class="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all">En savoir plus →</a>
            </div>

            <!-- BOUTIQUE -->
            <div class="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                <div class="flex items-center gap-6 mb-8">
                    <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M2.25 2.25a.75.75 0 000 1.5h1.386l.17 1.113-1.148 2.296A.75.75 0 003 8.25h15a.75.75 0 00.662-1.106l-1.148-2.296.17-1.113h1.386a.75.75 0 000-1.5h-2.103a.75.75 0 00-.735.617l-.27 1.765H5.435L5.165 2.867a.75.75 0 00-.735-.617H2.25zM16.5 20.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6 20.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>
                    </div>
                    <h3 class="text-3xl font-black text-slate-900 tracking-tight">Boutique Élite</h3>
                </div>
                <p class="text-slate-500 leading-relaxed font-light text-lg mb-10">Équipez votre génie. Accédez aux meilleurs outils physiques et numériques, cahiers de vacances premium et ressources exclusives Singapour/Oxford.</p>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Découvrir le shop →</a>
            </div>
        </div>
    </div>
</section>

<!-- ========== SECTION OUTILS (Vercel Style) ========== -->
<section class="py-24 md:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col lg:flex-row gap-20 items-center">
            <!-- Mockup Visuel -->
            <div class="flex-1 relative">
                <div class="bg-white rounded-[2.5rem] shadow-3xl p-8 border border-slate-100 relative z-10 hover:rotate-2 transition-transform duration-500">
                    <div class="flex items-center gap-5 mb-8">
                        <div class="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                            <svg class="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Boost Émotionnel</p>
                            <p class="text-sm font-bold text-slate-900 leading-none">Vocal de maman enregistré</p>
                        </div>
                    </div>
                    <div class="h-3 w-full bg-slate-100 rounded-full mb-6 relative overflow-hidden">
                        <div class="absolute inset-0 bg-orange-600 w-3/4 animate-pulse"></div>
                    </div>
                    <div class="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                        <span>Félicitations Amine !</span>
                        <span class="text-orange-600">+50 XP</span>
                    </div>
                </div>
                <div class="absolute -bottom-12 -right-12 w-64 h-64 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl p-8 z-20">
                    <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22.5 12.75a.75.75 0 00-.75-.75H13.5v7.5h8.25a.75.75 0 00.75-.75v-6zM12 19.5v-7.5H2.25a.75.75 0 00-.75.75v6a.75.75 0 00.75.75H12z"/></svg>
                    </div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Printable</p>
                    <p class="text-xs font-bold text-slate-800">Cahier 1AP Généré ✓</p>
                </div>
            </div>

            <!-- Texte -->
            <div class="flex-1">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-5 py-2.5 rounded-full">Innovation</span>
                <h2 class="text-4xl md:text-5xl font-black text-slate-900 mt-8 mb-10 tracking-tight leading-[1.1]">Un pilotage d'exception.</h2>
                
                <div class="space-y-10">
                    <div class="group flex gap-6">
                        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-slate-900 mb-2">Boost Émotionnel</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Motivez votre enfant avec votre propre voix. Une gratification humaine immédiate après chaque victoire.</p>
                        </div>
                    </div>
                    <div class="group flex gap-6">
                        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22.5 12.75a.75.75 0 00-.75-.75H13.5v7.5h8.25a.75.75 0 00.75-.75v-6zM12 19.5v-7.5H2.25a.75.75 0 00-.75.75v6a.75.75 0 00.75.75H12z"/></svg>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-slate-900 mb-2">Printable Factory</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Générez des cahiers de révision personnalisés (PDF) sur les thèmes préférés de votre génieux.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ========== CTAs & FOOTER ========== -->
<section class="py-24 bg-slate-900 text-white rounded-t-[4rem]">
    <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Prêt à libérer le génie ?</h2>
        <p class="text-slate-400 text-lg md:text-xl font-light mb-12">Rejoignez la révolution éducative. Excellence mondiale, impact local.</p>
        <div class="flex flex-col sm:flex-row gap-5 justify-center">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-orange-600 px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-orange-700 transition shadow-2xl shadow-orange-900/40">S'inscrire gratuitement</a>
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/contact" class="bg-white/10 backdrop-blur-md px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition">Contacter un expert</a>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
