<?php
/**
 * index.php - Version Elite Design System
 */
include_once __DIR__ . '/includes/header.php';
?>

<!-- ========== SECTION HERO ========== -->
<section class="relative bg-gradient-to-b from-white to-slate-50/40 pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <!-- Texte (DM Sans / Plus Jakarta) -->
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

<!-- ========== SECTION 3 UNIVERS (Solid Icons) ========== -->
<section class="py-24 md:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="text-center max-w-3xl mx-auto mb-20">
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-5 py-2.5 rounded-full">3 univers, 1 destination</span>
            <h2 class="text-4xl md:text-6xl font-black text-slate-900 mt-8 mb-6 tracking-tight">Une immersion totale.</h2>
            <p class="text-slate-500 text-lg md:text-xl leading-relaxed font-light" style="font-family: 'DM Sans', sans-serif;">Chaque enfant trouve son rythme, ses passions et sa voie vers l’excellence à travers nos portails dédiés.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
            <!-- Carte 1 : Local -->
            <div class="group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-colors duration-300">
                    <svg class="w-8 h-8 text-blue-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.58 2.387a.75.75 0 01.84 0l8.25 5.25a.75.75 0 010 1.252l-8.25 5.25a.75.75 0 01-.84 0l-8.25-5.25a.75.75 0 010-1.252l8.25-5.25zM22 11.75a.75.75 0 00-.75-.75H2.75a.75.75 0 000 1.5h18.5a.75.75 0 00.75-.75zM2.75 14.75a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75zM2.75 18.5a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Univers Local</h3>
                <p class="text-slate-500 leading-relaxed font-light" style="font-family: 'DM Sans', sans-serif;">Maîtrise chirurgicale du programme officiel algérien (1AP, 2AP, 3AP). Vos fondations scolaires renforcées par l’IA.</p>
            </div>

            <!-- Carte 2 : Monde (Style Dark Elite) -->
            <div class="group bg-slate-900 text-white rounded-[2.5rem] p-10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-slate-800 shadow-2xl">
                <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-orange-600 transition-colors duration-300">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM3.5 12c0-1.03.2-1.99.55-2.88l3.12 3.12c.1.1.25.14.38.1l2.5-1c.21-.08.31-.33.22-.53l-1-2.25a.38.38 0 01.12-.46l1.75-1.25c.16-.11.23-.33.16-.51L10.5 4.1a8.55 8.55 0 011.5-.1 8.5 8.5 0 018.5 8.5c0 .38-.03.74-.08 1.1l-2.07-.35a.38.38 0 01-.3-.26l-.75-2.5a.38.38 0 00-.7-.04l-1.5 3a.38.38 0 01-.13.15l-3 2c-.15.1-.22.28-.18.45l.75 2.5c.03.1.11.17.2.2l.5.15c-.24.03-.5.05-.75.05a8.5 8.5 0 01-8.5-8.5z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black mb-4 tracking-tight">Portail Mondial</h3>
                <p class="text-slate-300 leading-relaxed font-light" style="font-family: 'DM Sans', sans-serif;">Maths de Singapour, Anglais Oxford et défis internationaux pour une ambition sans frontières.</p>
            </div>

            <!-- Carte 3 : Arène Magique -->
            <div class="group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div class="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-teal-600 transition-colors duration-300">
                    <svg class="w-8 h-8 text-teal-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Arène Magique</h3>
                <p class="text-slate-500 leading-relaxed font-light" style="font-family: 'DM Sans', sans-serif;">Défis ludiques adaptés dynamiquement aux leçons de l'enfant pour ancrer chaque compétence par le jeu.</p>
            </div>
        </div>
    </div>
</section>

<!-- ========== SECTION OUTILS (Vercel Grid) ========== -->
<section class="py-24 md:py-32 bg-slate-50/50">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col lg:flex-row gap-20 items-center">
            <!-- Mockup Visuel -->
            <div class="flex-1 relative order-2 lg:order-1">
                <div class="bg-white rounded-[2.5rem] shadow-3xl p-8 border border-slate-100 relative z-10 hover:rotate-2 transition-transform duration-500">
                    <div class="flex items-center gap-5 mb-8">
                        <div class="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                            <svg class="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                            </svg>
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
                <div class="absolute -bottom-8 -right-8 w-60 h-60 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl p-6 z-20">
                    <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22.5 12.75a.75.75 0 00-.75-.75H13.5v7.5h8.25a.75.75 0 00.75-.75v-6zM12 19.5v-7.5H2.25a.75.75 0 00-.75.75v6a.75.75 0 00.75.75H12z"/>
                        </svg>
                    </div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Printable</p>
                    <p class="text-xs font-bold text-slate-800">Cahier 1AP Généré ✓</p>
                </div>
            </div>

            <!-- Texte Explicatif -->
            <div class="flex-1 order-1 lg:order-2">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-5 py-2.5 rounded-full">Pilotage Élite</span>
                <h2 class="text-4xl md:text-6xl font-black text-slate-900 mt-8 mb-10 tracking-tight leading-[1.1]">Des outils d’exception.</h2>
                
                <div class="space-y-10">
                    <div class="group flex gap-6">
                        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-slate-900 mb-2">Boost Émotionnel</h4>
                            <p class="text-slate-500 font-light leading-relaxed" style="font-family: 'DM Sans', sans-serif;">Motivez votre enfant avec votre propre voix enregistrée. Une gratification humaine immédiate après chaque victoire.</p>
                        </div>
                    </div>
                    <div class="group flex gap-6">
                        <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25zM22.5 12.75a.75.75 0 00-.75-.75H13.5v7.5h8.25a.75.75 0 00.75-.75v-6zM12 19.5v-7.5H2.25a.75.75 0 00-.75.75v6a.75.75 0 00.75.75H12z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-slate-900 mb-2">Printable Factory</h4>
                            <p class="text-slate-500 font-light leading-relaxed" style="font-family: 'DM Sans', sans-serif;">Générez des cahiers de révision personnalisés (PDF, Image, HTML) sur les thèmes préférés de votre génie.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ========== CTAs & FOOTER (DM Sans) ========== -->
<section class="py-24 bg-slate-900 text-white rounded-t-[4rem]">
    <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Prêt à libérer le génie ?</h2>
        <p class="text-slate-400 text-lg md:text-xl font-light mb-12" style="font-family: 'DM Sans', sans-serif;">Rejoignez la révolution éducative. Excellence mondiale, impact local.</p>
        <div class="flex flex-col sm:flex-row gap-5 justify-center">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="bg-orange-600 px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-orange-700 transition shadow-2xl shadow-orange-900/40">S'inscrire gratuitement</a>
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/contact" class="bg-white/10 backdrop-blur-md px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition">Contacter un expert</a>
        </div>
    </div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
