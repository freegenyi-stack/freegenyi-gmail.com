<?php
/**
 * social.php - Initialise le flux OAuth pour le réseau choisi
 * Partie du Point 1 (Authentification)
 */

require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../config/auth.php';

$provider = $_GET['provider'] ?? null;

// Vérification de la validité du provider
$allowed_providers = ['google', 'facebook', 'microsoft', 'instagram'];

if (!$provider || !in_array($provider, $allowed_providers)) {
    header('Location: ' . APP_URL . '/auth/login?error=invalid_provider');
    exit;
}

// Ici, nous devrions normalement charger Hybridauth ou notre propre logique OAuth.
// Pour rester "propre et progressif", je prépare les paramètres qui seront envoyés au réseau social.

// 1. Stockage de l'état (sécurité contre les attaques CSRF)
$_SESSION['oauth_state'] = bin2hex(random_bytes(16));

// 2. Redirection simulée (tant que les clés ne sont pas configurées)
// Note : Une fois les clés (ID/Secret) insérées, nous remplacerons ceci par l'appel réel à l'API du provider.

switch ($provider) {
    case 'google':
        // Logique de redirection vers Google Accounts
        $auth_url = "https://accounts.google.com/o/oauth2/auth";
        break;
    case 'facebook':
        // Logique de redirection vers Facebook OAuth
        $auth_url = "https://www.facebook.com/v12.0/dialog/oauth";
        break;
    default:
        header('Location: ' . APP_URL . '/auth/login?error=not_implemented');
        exit;
}

// Message informatif pour le mode développement
$auth_config = include __DIR__ . '/../../config/auth.php';
$provider_key = ucfirst($provider);

if (empty($auth_config['providers'][$provider_key]['keys']['id'])) {
    die("<h3>Configuration requise</h3> 
         <p>Veuillez entrer votre <b>Client ID</b> et <b>Secret</b> dans le fichier <code>config/auth.php</code> pour activer la connexion avec " . ucfirst($provider) . ".</p>
         <a href='" . APP_URL . "/auth/login'>Retour</a>");
}

// Redirection réelle (à activer une fois les clés prêtes)
// header('Location: ' . $auth_url . '?client_id=...');
