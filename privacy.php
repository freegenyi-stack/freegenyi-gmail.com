<?php
/**
 * privacy.php - Elite Privacy Policy
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-slate-50 py-12 md:py-24">
    <div class="max-w-4xl mx-auto px-6 md:px-12">
        <div class="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-xl border border-slate-100">
            <div class="mb-12 md:mb-16">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-4 py-2 rounded-full mb-6 inline-block">Protection des données</span>
                <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-4 font-title tracking-tighter">Confidentialité.</h1>
                <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Dernière mise à jour : 11 Avril 2026</p>
            </div>

            <div class="space-y-12">
                <section>
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">1. Collecte des données</h2>
                    <p class="text-slate-500 leading-relaxed font-light">
                        FreeGeny s'engage à protéger la vie privée de ses utilisateurs, en particulier celle des mineurs. Nous collectons uniquement les données nécessaires à la personnalisation pédagogique : nom, prénom, âge et progression scolaire.
                    </p>
                </section>

                <section>
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">2. Utilisation des informations</h2>
                    <p class="text-slate-500 leading-relaxed font-light mb-4">
                        Vos données sont utilisées exclusivement pour :
                    </p>
                    <ul class="list-disc pl-6 space-y-3 text-slate-500 font-light">
                        <li>Adapter les exercices au niveau de l'enfant.</li>
                        <li>Fournir des rapports de progression aux parents.</li>
                        <li>Améliorer nos algorithmes d'apprentissage (données anonymisées).</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">3. Partage des données</h2>
                    <p class="text-slate-500 leading-relaxed font-light">
                        <span class="text-slate-900 font-bold">Nous ne vendons aucune donnée personnelle à des tiers.</span> Les informations peuvent être partagées uniquement avec votre école ou ONG si vous avez lié votre compte à l'une de ces entités.
                    </p>
                </section>

                <section>
                    <h2 class="text-2xl font-black text-slate-900 mb-6 font-title tracking-tight">4. Sécurité</h2>
                    <p class="text-slate-500 leading-relaxed font-light">
                        Toutes les informations sont cryptées (AES-256) et stockées sur des serveurs sécurisés conformes aux normes RGPD.
                    </p>
                </section>
            </div>
        </div>
        
        <div class="mt-12 text-center">
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">← Retour à l'accueil</a>
        </div>
    </div>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
