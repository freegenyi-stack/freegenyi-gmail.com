<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
require_once __DIR__ . '/../../includes/MailManager.php';
initSession();

$token = $_GET['token'] ?? '';

if (empty($token)) {
    die("Lien de vérification invalide.");
}

// Trouver l'utilisateur avec ce token
$user = DB::fetchOne("SELECT * FROM users WHERE verification_token = ? LIMIT 1", [$token]);

if (!$user) {
    die("Lien expiré ou déjà utilisé.");
}

// Marquer comme vérifié et supprimer le token
DB::execute("UPDATE users SET email_verified = 1, verification_token = NULL WHERE id = ?", [$user['id']]);

// Bonus : Envoyer l'email de bienvenue final (le vrai !)
MailManager::sendWelcome($user['email'], $user['full_name']);

// Connecter l'utilisateur automatiquement
loginUser($user);

// Rediriger vers le dashboard
$country = $user['declared_country'] ?: 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';
header("Location: /" . strtoupper($country) . "-" . $lang . "/dashboard/parent?verified=1");
exit;
