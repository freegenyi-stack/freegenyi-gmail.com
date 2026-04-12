<?php
/**
 * api/auth/verify.php — Vérification email PROFESSIONNELLE
 * ✅ Validation du token
 * ✅ Vérification de l'expiration (24h)
 * ✅ Connexion automatique après vérification
 * ✅ Email de bienvenue final
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
require_once __DIR__ . '/../../includes/MailManager.php';

initSession();

$token     = trim($_GET['token'] ?? '');
$country   = strtoupper($_SESSION['country_code'] ?? 'DZ');
$lang_code = $_SESSION['lang'] ?? 'fr';
$base_url  = "/{$country}-{$lang_code}";

// ─── 1. TOKEN PRÉSENT ? ───────────────────────────────────────────────────────
if (empty($token)) {
    header("Location: {$base_url}/auth/login?error=" . urlencode('Lien de vérification invalide.'));
    exit;
}

// ─── 2. RECHERCHE DU TOKEN EN DB ──────────────────────────────────────────────
$user = DB::fetchOne(
    "SELECT * FROM users WHERE verification_token = ? AND email_verified = 0 LIMIT 1",
    [$token]
);

if (!$user) {
    // Token déjà utilisé ou inexistant
    header("Location: {$base_url}/auth/login?info=" . urlencode('Compte déjà vérifié ou lien expiré. Connectez-vous.'));
    exit;
}

// ─── 3. VÉRIFICATION EXPIRATION (24h) ────────────────────────────────────────
$col = DB::fetchOne("SHOW COLUMNS FROM users LIKE 'verification_token_expires_at'");
if ($col && !empty($user['verification_token_expires_at'])) {
    if (strtotime($user['verification_token_expires_at']) < time()) {
        // Token expiré → supprimer le compte non vérifié (ou proposer renvoi)
        DB::execute("UPDATE users SET verification_token = NULL WHERE id = ?", [$user['id']]);
        header("Location: {$base_url}/auth/register?error=" . urlencode('Lien expiré (24h). Veuillez vous réinscrire.'));
        exit;
    }
}

// ─── 4. MARQUER COMME VÉRIFIÉ ────────────────────────────────────────────────
DB::execute(
    "UPDATE users SET email_verified = 1, verification_token = NULL, verification_token_expires_at = NULL WHERE id = ?",
    [$user['id']]
);

// ─── 5. EMAIL DE BIENVENUE FINAL ──────────────────────────────────────────────
MailManager::sendWelcome($user['email'], $user['full_name']);

// ─── 6. CONNEXION AUTOMATIQUE ────────────────────────────────────────────────
loginUser($user);
DB::execute("UPDATE users SET last_login_at = NOW() WHERE id = ?", [$user['id']]);
session_regenerate_id(true);

// ─── 7. REDIRECTION DASHBOARD / ONBOARDING ──────────────────────────────────────
$user_country = strtoupper($user['declared_country'] ?? $country);
header("Location: /{$user_country}-{$lang_code}/dashboard/add_child?welcome=1");
exit;
