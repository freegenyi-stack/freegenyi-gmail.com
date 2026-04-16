<?php
/**
 * api/auth/update-profile.php - Mise à jour des infos personnelles
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';

initSession();

if (empty($_SESSION['logged_in'])) {
    header('Location: /');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /dashboard/profile.php');
    exit;
}

// 🛡️ Protection CSRF
if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
    header('Location: /dashboard/profile.php?error=' . urlencode('Session expirée ou invalide.'));
    exit;
}

$full_name = trim($_POST['full_name'] ?? '');
$phone = trim($_POST['phone'] ?? '');

if (empty($full_name)) {
    header('Location: /dashboard/profile.php?error=' . urlencode('Le nom est requis.'));
    exit;
}

$updated = DB::execute("
    UPDATE users 
    SET full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
", [$full_name, $phone, $_SESSION['user_id']]);

if ($updated) {
    // Mettre à jour la session
    $_SESSION['user_name'] = $full_name;
    $_SESSION['user_phone'] = $phone;
    header('Location: /dashboard/profile.php?success=' . urlencode('Profil mis à jour avec succès.'));
} else {
    header('Location: /dashboard/profile.php?error=' . urlencode('Aucune modification détectée ou erreur serveur.'));
}
exit;
