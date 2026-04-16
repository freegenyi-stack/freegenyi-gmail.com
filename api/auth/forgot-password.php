<?php
/**
 * api/auth/forgot-password.php - Demande de réinitialisation
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
require_once __DIR__ . '/../../includes/MailManager.php';

initSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /auth/forgot-password');
    exit;
}

// 🛡️ Protection CSRF
if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
    header("Location: /DZ-fr/auth/forgot-password?error=" . urlencode('Session expirée ou invalide.'));
    exit;
}

// 🛡️ Protection Rate Limiting (Relâchée pour les tests)
if (!RateLimiter::check('forgot-password', 10, 60)) {
    header("Location: /DZ-fr/auth/forgot-password?error=" . urlencode('Trop de demandes. Veuillez patienter.'));
    exit;
}

$email = strtolower(trim($_POST['email'] ?? ''));

// Détection propre du pays/langue pour la redirection (via référent ou session)
$country_code = $_SESSION['country_code'] ?? 'DZ';
$lang_code = $_SESSION['lang'] ?? 'fr';
$base_url = "/{$country_code}-{$lang_code}";

// 1. Validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: {$base_url}/auth/forgot-password?error=" . urlencode('Veuillez entrer un email valide.'));
    exit;
}

// 2. Vérifier si l'utilisateur existe
$user = DB::fetchOne("SELECT id, full_name, email FROM users WHERE email = ? LIMIT 1", [$email]);

if (!$user) {
    header("Location: {$base_url}/auth/forgot-password?error=" . urlencode("Cette adresse email n'existe pas dans notre base de données."));
    exit;
}

// 3. Générer un Token
$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

// 4. Stocker le Token (supprimer les anciens d'abord)
DB::execute("DELETE FROM password_reset_tokens WHERE user_id = ?", [$user['id']]);
DB::execute("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [
    $user['id'],
    $token,
    $expires_at
]);

// 5. Envoyer l'Email
$mailSent = MailManager::sendPasswordReset($user['email'], $user['full_name'], $token, $lang_code);

if ($mailSent) {
    header("Location: {$base_url}/auth/forgot-password?success=" . urlencode('Un lien de réinitialisation a été envoyé à votre adresse email.'));
} else {
    header("Location: {$base_url}/auth/forgot-password?error=" . urlencode("Erreur lors de l'envoi de l'email. Veuillez réessayer."));
}
exit;
