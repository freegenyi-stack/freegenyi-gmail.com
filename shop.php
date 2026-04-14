<?php
/**
 * shop.php - Elite Learning Resources
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero Shop -->
    <section class="py-16 md:py-24 bg-white border-b border-slate-50">
        <div class="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h1 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 font-title">La Boutique Élite.</h1>
            <p class="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Matériel & Ressources d'exception</p>
        </div>
    </section>

    <!-- Product Grid -->
    <section class="py-20 bg-slate-50/30">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <!-- Produit 1 -->
                <div class="group">
                    <div class="aspect-[4/5] bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-6 relative hover:shadow-2xl transition-all duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
                        <img src="https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800" alt="Cahier de génie" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    </div>
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-slate-900 font-title mb-1">Cahier de Génie Articulé</h3>
                        <p class="text-slate-400 text-sm mb-4">L'outil physique pour le rappel actif.</p>
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-black text-slate-900">29.00€</span>
                            <button class="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors">Ajouter</button>
                        </div>
                    </div>
                </div>
                <!-- Produit 2 -->
                <div class="group">
                    <div class="aspect-[4/5] bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-6 relative hover:shadow-2xl transition-all duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
                        <img src="https://images.unsplash.com/photo-1512418490979-92798ccc1380?auto=format&fit=crop&q=80&w=800" alt="Plume Elite" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    </div>
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-slate-900 font-title mb-1">Pack Révision PDF</h3>
                        <p class="text-slate-400 text-sm mb-4">Généré sur mesure par l'IA.</p>
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-black text-slate-900">12.00€</span>
                            <button class="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors">Acheter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
