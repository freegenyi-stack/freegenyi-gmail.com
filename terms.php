<?php
/**
 * terms.php - Elite Terms of Service
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-slate-50 py-12 md:py-24">
    <div class="max-w-4xl mx-auto px-6 md:px-12">
        <div class="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-xl border border-slate-100">
            <div class="mb-12 md:mb-16">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-6 inline-block">Engagement de service</span>
                <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-4 font-title tracking-tighter">Conditions générales.</h1>
                <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Dernière mise à jour : 11 Avril 2026</p>
            </div>

            <div class="space-y-12">
                <section>
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">1. Acceptation</h2>
                    <p class="text-slate-500 leading-relaxed font-light">En accédant à FreeGeny, vous acceptez pleinement les présentes conditions d'utilisation destinées à garantir un environnement éducatif sain et sécurisé pour tous les enfants.</p>
                </section>
                <section>
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">2. Propriété Intellectuelle</h2>
                    <p class="text-slate-500 leading-relaxed font-light">Les contenus, exercices et illustrations présents sur la plateforme sont la propriété exclusive de FreeGeny Inc. Toute reproduction ou distribution non autorisée est strictement interdite.</p>
                </section>
                <section>
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">3. Responsabilité</h2>
                    <p class="text-slate-500 leading-relaxed font-light">FreeGeny s'efforce de fournir des contenus de haute qualité validés par des experts. Toutefois, nous ne saurions être tenus responsables d'éventuelles interruptions techniques momentanées.</p>
                </section>
            </div>
        </div>
        
        <div class="mt-12 text-center">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">← Retour à l'accueil</a>
        </div>
    </div>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
