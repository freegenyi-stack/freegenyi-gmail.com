<?php
/**
 * cookies.php - Elite Cookie Transparency
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-slate-50 py-12 md:py-24">
    <div class="max-w-4xl mx-auto px-6 md:px-12">
        <div class="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-xl border border-slate-100">
            <div class="mb-12">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6 inline-block">Transparence</span>
                <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-4 font-title tracking-tighter">Politique de Cookies.</h1>
                <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Version 2026</p>
            </div>
            
            <div class="space-y-8 text-slate-500 font-light leading-relaxed">
                <p>FreeGeny utilise exclusivement des cookies fonctionnels essentiels au bon fonctionnement et à la personnalisation de votre expérience éducative (gestion des sessions, mémorisation du pays et de la langue).</p>
                <p class="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-medium">Nous n'utilisons aucun cookie de pistage publicitaire (tracking) ou de ciblage commercial tiers.</p>
            </div>
        </div>
        
        <div class="mt-12 text-center">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">← Retour à l'accueil</a>
        </div>
    </div>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
