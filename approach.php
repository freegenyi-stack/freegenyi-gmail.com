<?php
/**
 * approach.php - Elite Pedagogy Page
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero Approach -->
    <section class="py-16 md:py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div class="flex flex-col lg:flex-row items-center gap-16">
                <div class="flex-1 text-center lg:text-left">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6 inline-block">Notre Méthode</span>
                    <h1 class="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 font-title leading-[1.1]">La science au service du <span class="text-blue-600 italic font-caveat capitalize">génie.</span></h1>
                    <p class="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-10">
                        Notre approche pédagogique fusionne les neurosciences cognitives et l'intelligence artificielle pour créer un parcours d'apprentissage adaptatif unique au monde.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="#discover" class="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-600 transition-all text-center">Découvrir les piliers</a>
                    </div>
                </div>
                <div class="flex-1 w-full max-w-lg lg:max-w-none">
                    <div class="bg-white p-4 rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border border-slate-100">
                        <img src="/assets/img/approach_hero.png" alt="Approach Illustration" class="w-full h-auto rounded-[2.5rem]" onerror="this.src='https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800'">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pillars Section -->
    <section id="discover" class="py-20 md:py-32">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
                <!-- Piliers 1 -->
                <div class="space-y-6">
                    <div class="text-6xl font-black text-slate-100 font-title mb-4">01</div>
                    <h2 class="text-3xl font-black text-slate-900 font-title">Adaptativité Absolue</h2>
                    <p class="text-lg text-slate-500 font-light leading-relaxed">
                        Chaque enfant apprend à son propre rythme. Nos algorithmes analysent chaque erreur non pas comme un échec, mais comme un signal précieux pour ajuster la difficulté en temps réel.
                    </p>
                </div>
                <!-- Piliers 2 -->
                <div class="space-y-6">
                    <div class="text-6xl font-black text-slate-100 font-title mb-4">02</div>
                    <h2 class="text-3xl font-black text-slate-900 font-title">Engagement Total</h2>
                    <p class="text-lg text-slate-500 font-light leading-relaxed">
                        En utilisant les mécaniques de la gamification éthique, nous stimulons la dopamine positive liée à la découverte et à l'accomplissement, transformant l'effort en plaisir.
                    </p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
