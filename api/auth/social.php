<?php
/**
 * social.php - Initialise le flux OAuth pour le réseau choisi
 * Partie du Point 1 (Authentification)
 */

require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../config/auth.php';

$provider_raw = $_GET['provider'] ?? '';
$provider = strtolower($provider_raw);

// Vérification de la validité du provider
$allowed_providers = ['google', 'facebook', 'microsoft', 'instagram', 'linkedin'];

if (!$provider || !in_array($provider, $allowed_providers)) {
    header('Location: /auth/login?error=invalid_provider');
    exit;
}

// Ici, nous devrions normalement charger Hybridauth ou notre propre logique OAuth.
// Pour rester "propre et progressif", je prépare les paramètres qui seront envoyés au réseau social.

// 1. Stockage de l'état et du provider en session
$_SESSION['oauth_state'] = bin2hex(random_bytes(16));
$_SESSION['oauth_provider'] = $provider;
if (!empty($_GET['invite_parent'])) {
    $_SESSION['invite_parent'] = (int)$_GET['invite_parent'];
}

// 2. Redirection réelle vers le provider
$auth_config = include __DIR__ . '/../../config/auth.php';
$provider_key = ucfirst($provider);

if (empty($auth_config['providers'][$provider_key]['keys']['id'])) {
    die("<h3>Configuration requise</h3> 
         <p>Veuillez entrer votre <b>Client ID</b> et <b>Secret</b> dans le fichier <code>config/auth.php</code> pour activer la connexion avec " . ucfirst($provider) . ".</p>
         <a href='/auth/login'>Retour</a>");
}

$client_id = $auth_config['providers'][$provider_key]['keys']['id'];

// Calcul dynamique du domaine pour éviter l'erreur "redirect_uri mismatch" si l'utilisateur est sur www. ou http/https différent.
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$redirect_uri = $protocol . $host . '/api/auth/social_callback.php';

switch ($provider) {
    case 'google':
        $auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
            'client_id' => $client_id,
            'redirect_uri' => $redirect_uri,
            'response_type' => 'code',
            'scope' => 'email profile',
            'state' => $_SESSION['oauth_state'],
            'access_type' => 'online',
            'prompt' => 'select_account'
        ]);
        header("Location: $auth_url");
        exit;
        
    case 'facebook':
        $auth_url = 'https://www.facebook.com/v12.0/dialog/oauth?' . http_build_query([
            'client_id' => $client_id,
            'redirect_uri' => $redirect_uri,
            'state' => $_SESSION['oauth_state'],
            'scope' => 'email'
        ]);
        header("Location: $auth_url");
        exit;
        
    default:
        header('Location: /auth/login?error=not_implemented');
        exit;
}
