<?php
/**
 * social_callback.php - Reçoit le code du réseau social, l'échange contre un token, et connecte l'utilisateur.
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../includes/MailManager.php';
require_once __DIR__ . '/auth_helpers.php'; // DB connection & auth functions

$provider = $_SESSION['oauth_provider'] ?? '';
$code = $_GET['code'] ?? null;
$state = $_GET['state'] ?? null;
$error = $_GET['error'] ?? null;

if ($error || !$code || !$state || $state !== ($_SESSION['oauth_state'] ?? '')) {
    header('Location: /auth/login?error=auth_failed_state');
    exit;
}

$auth_config = include __DIR__ . '/../../config/auth.php';
$provider_key = ucfirst($provider);

if (empty($auth_config['providers'][$provider_key]['keys']['id'])) {
    header('Location: /auth/login?error=not_configured');
    exit;
}

$client_id = $auth_config['providers'][$provider_key]['keys']['id'];
$client_secret = $auth_config['providers'][$provider_key]['keys']['secret'];

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$redirect_uri = $protocol . $host . '/api/auth/social_callback.php';

$email = null;
$full_name = null;
$social_id = null;

if ($provider === 'google') {
    // 1. Echanger le CODE contre un Access Token
    $token_url = 'https://oauth2.googleapis.com/token';
    $post_data = http_build_query([
        'code' => $code,
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code'
    ]);

    $ch = curl_init($token_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    
    $response = curl_exec($ch);
    $token_data = json_decode($response, true);

    if (empty($token_data['access_token'])) {
        error_log("Google OAuth Error: " . json_encode($token_data));
        header('Location: /auth/login?error=token_exchange_failed');
        exit;
    }

    // 2. Fetch User Info
    $user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    $ch = curl_init($user_info_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $token_data['access_token']]);
    
    $response = curl_exec($ch);
    $user_info = json_decode($response, true);

    if (empty($user_info['email'])) {
        header('Location: /auth/login?error=no_email_provided');
        exit;
    }

    $email = $user_info['email'];
    $full_name = $user_info['name'] ?? 'Google User';
    $social_id = $user_info['id'];
} else if ($provider === 'facebook') {
    // 1. Échanger le CODE contre un Access Token Facebook
    $token_url = 'https://graph.facebook.com/v12.0/oauth/access_token?' . http_build_query([
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'code' => $code
    ]);

    $response = file_get_contents($token_url);
    $token_data = json_decode($response, true);

    if (empty($token_data['access_token'])) {
        header('Location: /auth/login?error=facebook_token_failed');
        exit;
    }

    // 2. Fetch User Info via Graph API
    $user_info_url = 'https://graph.facebook.com/me?' . http_build_query([
        'fields' => 'id,name,email',
        'access_token' => $token_data['access_token']
    ]);
    
    $response = file_get_contents($user_info_url);
    $user_info = json_decode($response, true);

    if (empty($user_info['email'])) {
        header('Location: /auth/login?error=no_email_provided');
        exit;
    }

    $email = $user_info['email'];
    $full_name = $user_info['name'] ?? 'Facebook User';
    $social_id = $user_info['id'];
} else {
    // Autres providers (Facebook, Microsoft) à implémenter de la même manière par la suite
    header('Location: /auth/login?error=provider_not_implemented');
    exit;
}


// --- 3. Intégration à la Base de données (Identité Unifiée) ---
if ($email && $full_name) {
    // On vérifie si l'utilisateur existe déjà
    $user = DB::fetchOne("SELECT * FROM users WHERE email = ? LIMIT 1", [$email]);
    
    $country_code = strtoupper($_SESSION['country_code'] ?? 'DZ');
    $lang_code = strtolower($_SESSION['lang'] ?? 'fr');
    $is_new = false;

    if ($user) {
        // Mise à jour date connexion
        DB::execute("UPDATE users SET last_login_at = NOW(), login_attempts = 0 WHERE id = ?", [$user['id']]);
    } else {
        $is_new = true;
        // Création du compte via Social Login
        $random_password = bin2hex(random_bytes(16)); // Sécurité
        $hash = password_hash($random_password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
        $detected_country = $_SESSION['home_country'] ?? 'DZ';
        $role = $_SESSION['pending_role'] ?? 'parent';

        $user_id = DB::insert(
            "INSERT INTO users (email, password_hash, full_name, declared_country, role, email_verified, oauth_provider, last_login_at) VALUES (?, ?, ?, ?, ?, 1, 'Google', NOW())",
            [$email, $hash, $full_name, $detected_country, $role]
        );

        if (!$user_id) {
            header("Location: /{$country_code}-{$lang_code}/auth/login?error=account_creation_failed");
            exit;
        }
        
        // Bienvenue !
        MailManager::sendWelcome($email, $full_name);
        
        $user = DB::fetchOne("SELECT * FROM users WHERE id = ? LIMIT 1", [$user_id]);
    }

    // Connecter l'utilisateur
    loginUser($user);
    session_regenerate_id(true);

    // Rediriger
    if ($is_new) {
        header("Location: /{$country_code}-{$lang_code}/dashboard/add_child?welcome=google");
    } else {
        header("Location: /{$country_code}-{$lang_code}/dashboard/parent");
    }
    exit;
}

header("Location: /auth/login?error=unknown_error");
exit;
