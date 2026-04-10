<?php
/**
 * social_callback.php - Reçoit les données du réseau social et gère la connexion finale
 */

require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/SocialAuthManager.php';

// Initialisation du manager avec la base de données
$authManager = new SocialAuthManager($pdo);

// Ici, on récupèrerait normalement les données via l'API (ex: Google User Info)
// PHP Simulation :
$provider = $_GET['provider'] ?? 'google';
$provider_id = $_GET['id'] ?? null; // ID envoyé par le réseau
$email = $_GET['email'] ?? null;
$full_name = $_GET['name'] ?? 'Utilisateur Social';

if (!$email || !$provider_id) {
    header('Location: ' . APP_URL . '/auth/login?error=auth_failed');
    exit;
}

// UTILISATION DE L'IDENTITÉ UNIFIÉE (POINT 1)
$user_id = $authManager->handleSocialUser($provider, $provider_id, $email, $full_name);

if ($user_id) {
    // Connexion réussie : On crée la session
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_email'] = $email;
    $_SESSION['logged_in'] = true;

    // Redirection vers le dashboard
    header('Location: ' . APP_URL . '/dashboard/parent');
} else {
    header('Location: ' . APP_URL . '/auth/login?error=database_error');
}
exit;
