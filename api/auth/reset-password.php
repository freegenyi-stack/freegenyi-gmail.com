<?php
/**
 * api/auth/reset-password.php - Mise à jour effective du mot de passe
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';

initSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /auth/login');
    exit;
}

$token    = $_POST['token'] ?? '';
$password = $_POST['password'] ?? '';
$confirm  = $_POST['confirm_password'] ?? '';
$country  = strtoupper($_GET['country'] ?? $country ?? 'DZ');
$lang     = $_GET['lang'] ?? $lang ?? 'fr';
$base_url = "/{$country}-{$lang}";

// 1. Validation basique
if (empty($token) || empty($password) || empty($confirm)) {
    header("Location: {$base_url}/auth/reset-password?token={$token}&error=" . urlencode('Tous les champs sont requis.'));
    exit;
}

if ($password !== $confirm) {
    header("Location: {$base_url}/auth/reset-password?token={$token}&error=" . urlencode('Les mots de passe ne correspondent pas.'));
    exit;
}

if (strlen($password) < 8) {
    header("Location: {$base_url}/auth/reset-password?token={$token}&error=" . urlencode('Le mot de passe doit faire au moins 8 caractères.'));
    exit;
}

// 2. Vérifier le Token
$tokenData = DB::fetchOne("
    SELECT * FROM password_reset_tokens 
    WHERE token = ? AND expires_at > NOW() 
    LIMIT 1
", [$token]);

if (!$tokenData) {
    header("Location: {$base_url}/auth/forgot-password?error=" . urlencode('Lien invalide ou expiré. Réeffectuez une demande.'));
    exit;
}

// 3. Mise à jour du mot de passe
$password_hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);

$updated = DB::execute("
    UPDATE users 
    SET password_hash = ?, login_attempts = 0, locked_until = NULL 
    WHERE id = ?
", [$password_hash, $tokenData['user_id']]);

if ($updated) {
    // 4. Détruire le token utilisé
    DB::execute("DELETE FROM password_reset_tokens WHERE id = ?", [$tokenData['id']]);
    
    header("Location: {$base_url}/auth/login?success=" . urlencode('Votre mot de passe a été mis à jour avec succès. Connectez-vous maintenant.'));
} else {
    header("Location: {$base_url}/auth/reset-password?token={$token}&error=" . urlencode('Une erreur serveur est survenue. Veuillez réessayer.'));
}
exit;
