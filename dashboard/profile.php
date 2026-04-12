<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();
if (empty($_SESSION['logged_in'])) {
    header('Location: /');
    exit;
}

// Cette page sera développée ultérieurement pour permettre au parent
// de finir de configurer son numéro de téléphone, avatar, informations, etc.

$loc = strtoupper($_SESSION['country_code'] ?? 'DZ');
$lang = strtolower($_SESSION['lang'] ?? 'fr');

include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen py-10 px-6 bg-[#fafafa]">
    <div class="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center mt-10">
        <div class="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h1 class="text-3xl font-black text-slate-900 font-title mb-4">Compléter votre profil</h1>
        <p class="text-slate-500 font-medium leading-relaxed mb-8">
            Très bientôt, vous pourrez ajouter votre numéro de téléphone et peaufiner vos paramètres personnels ici.
            <br>Merci de patienter le temps que notre équipe technique finalise cette section !
        </p>
        <a href="/<?php echo $loc; ?>-<?php echo $lang; ?>/dashboard/parent" class="inline-block bg-slate-900 text-white rounded-xl px-8 py-3 text-sm font-bold shadow hover:bg-orange-600 transition">
            Retour au tableau de bord
        </a>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
