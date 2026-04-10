<?php
$page_title = "Qui sommes-nous";
include_once __DIR__ . '/includes/header.php';
?>
<main class="py-32">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-black mb-6"><?php echo __('about'); ?></h1>
        <p class="text-xl text-gray-500 italic">"FreeGeny est une aventure humaine et technologique pour l'avenir de nos enfants."</p>
        <div class="mt-12">
            <a href="/" class="text-orange-600 font-bold hover:underline">← Retour à l'accueil</a>
        </div>
    </div>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
