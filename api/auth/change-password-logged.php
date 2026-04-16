<?php
/**
 * api/auth/change-password-logged.php - Changement sécurisé (connecté)
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

$old_pass = $_POST['old_password'] ?? '';
$new_pass = $_POST['new_password'] ?? '';
$confirm  = $_POST['confirm_password'] ?? '';

// 1. Validation
if (empty($old_pass) || empty($new_pass) || empty($confirm)) {
    header('Location: /dashboard/profile.php?error=' . urlencode('Tous les champs sont requis.'));
    exit;
}

if ($new_pass !== $confirm) {
    header('Location: /dashboard/profile.php?error=' . urlencode('Les nouveaux mots de passe ne correspondent pas.'));
    exit;
}

if (strlen($new_pass) < 8) {
    header('Location: /dashboard/profile.php?error=' . urlencode('Le nouveau mot de passe doit faire au moins 8 caractères.'));
    exit;
}

// 2. Vérifier l'ancien mot de passe
$user = DB::fetchOne("SELECT password_hash FROM users WHERE id = ?", [$_SESSION['user_id']]);

if (!password_verify($old_pass, $user['password_hash'])) {
    header('Location: /dashboard/profile.php?error=' . urlencode('L\'ancien mot de passe est incorrect.'));
    exit;
}

// 3. Mise à jour
$new_hash = password_hash($new_pass, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);

$updated = DB::execute("
    UPDATE users 
    SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
", [$new_hash, $_SESSION['user_id']]);

if ($updated) {
    // 🛡️ Log de l'événement (Senior Standard)
    error_log("Security Action: Password changed by User ID " . $_SESSION['user_id'] . " from IP " . $_SERVER['REMOTE_ADDR']);
    
    // Pour une sécurité maximale, on pourrait déconnecter toutes les autres sessions ici.
    header('Location: /dashboard/profile.php?success=' . urlencode('Mot de passe mis à jour avec succès.'));
} else {
    header('Location: /dashboard/profile.php?error=' . urlencode('Erreur lors de la mise à jour.'));
}
exit;
