<?php
/**
 * legal.php - Elite Legal Notice
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-slate-50 py-12 md:py-24">
    <div class="max-w-4xl mx-auto px-6 md:px-12">
        <div class="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-xl border border-slate-100">
            <div class="mb-12">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 inline-block tracking-[0.2em]">Identification</span>
                <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-8 font-title tracking-tighter">Mentions Légales.</h1>
            </div>
            
            <div class="space-y-10">
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-slate-50 pb-8">
                    <span class="text-[10px] font-black uppercase text-slate-400 w-32 tracking-widest mt-1">Éditeur</span>
                    <p class="text-slate-900 font-bold font-title">FreeGeny Inc.<br><span class="text-slate-500 font-light font-sans text-sm">San Francisco, CA & Paris, France</span></p>
                </div>
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-slate-50 pb-8">
                    <span class="text-[10px] font-black uppercase text-slate-400 w-32 tracking-widest mt-1">Hébergement</span>
                    <p class="text-slate-900 font-bold font-title">Google Cloud Platform<br><span class="text-slate-500 font-light font-sans text-sm">Global CDN Infrastructure</span></p>
                </div>
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-6">
                    <span class="text-[10px] font-black uppercase text-slate-400 w-32 tracking-widest mt-1">Contact</span>
                    <p class="text-orange-600 font-bold font-title underline decoration-orange-600/30">hello@freegeny.com</p>
                </div>
            </div>
        </div>
        
        <div class="mt-12 text-center">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">← Retour à l'accueil</a>
        </div>
    </div>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
