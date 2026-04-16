<?php
/**
 * api/auth/logout.php - Déconnexion PRO
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';

initSession();

// 1. Vider la session
$_SESSION = [];

// 2. Détruire le cookie de session
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Détruire la session
session_destroy();

// 4. Redirection vers l'accueil
$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';
header("Location: /{$country}-{$lang}/");
exit;
