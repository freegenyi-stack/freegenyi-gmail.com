<?php include_once __DIR__ . '/includes/header.php'; ?>
<main class="py-32 bg-white">
    <div class="container mx-auto px-6 text-center">
        <h1 class="text-6xl font-black text-slate-900 mb-8"><?php echo __('ngos'); ?></h1>
        <p class="text-2xl text-slate-400 italic max-w-3xl mx-auto leading-relaxed">
            Partenariats avec les organisations non-gouvernementales.
        </p>
        <div class="mt-16"><a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">← <?php echo __('home'); ?></a></div>
    </div>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
