<?php
/**
 * api/auth/login.php — Logique de connexion PROFESSIONNELLE
 * ✅ Vérification en base de données
 * ✅ Comparaison bcrypt sécurisée
 * ✅ Anti-brute-force (5 tentatives → verrouillage 15 min)
 * ✅ Email vérifié obligatoire
 * ✅ Mise à jour last_login_at
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';

initSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /auth/login');
    exit;
}

$email    = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';
$country  = strtoupper($country ?? 'DZ');
$lang_code = $lang ?? 'fr';
$base_url = "/{$country}-{$lang_code}";

// ─── 1. VALIDATION BASIQUE ────────────────────────────────────────────────────
if (empty($email) || empty($password)) {
    header("Location: {$base_url}/auth/login?error=" . urlencode('Email et mot de passe requis.'));
    exit;
}

// ─── 2. RECHERCHE UTILISATEUR ─────────────────────────────────────────────────
$user = DB::fetchOne("SELECT * FROM users WHERE email = ? LIMIT 1", [$email]);

if (!$user) {
    // Message volontairement vague (sécurité)
    header("Location: {$base_url}/auth/login?error=" . urlencode('Identifiants incorrects.'));
    exit;
}

// ─── 3. ANTI-BRUTE-FORCE ──────────────────────────────────────────────────────
if (!empty($user['locked_until']) && strtotime($user['locked_until']) > time()) {
    $minutes = ceil((strtotime($user['locked_until']) - time()) / 60);
    header("Location: {$base_url}/auth/login?error=" . urlencode("Compte temporairement verrouillé. Réessayez dans {$minutes} minute(s)."));
    exit;
}

// ─── 4. VÉRIFICATION MOT DE PASSE ────────────────────────────────────────────
if (!password_verify($password, $user['password_hash'])) {
    // Incrémenter les tentatives
    $attempts = (int)$user['login_attempts'] + 1;

    if ($attempts >= MAX_LOGIN_ATTEMPTS) {
        $lockedUntil = date('Y-m-d H:i:s', strtotime('+15 minutes'));
        DB::execute("UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?", [$attempts, $lockedUntil, $user['id']]);
        header("Location: {$base_url}/auth/login?error=" . urlencode('Trop de tentatives. Compte verrouillé 15 minutes.'));
    } else {
        DB::execute("UPDATE users SET login_attempts = ? WHERE id = ?", [$attempts, $user['id']]);
        $remaining = MAX_LOGIN_ATTEMPTS - $attempts;
        header("Location: {$base_url}/auth/login?error=" . urlencode("Identifiants incorrects. {$remaining} tentative(s) restante(s)."));
    }
    exit;
}

// ─── 5. EMAIL VÉRIFIÉ ? ───────────────────────────────────────────────────────
if (!(int)$user['email_verified']) {
    $_SESSION['pending_email'] = $user['email'];
    $_SESSION['pending_name']  = $user['full_name'];
    header("Location: {$base_url}/auth/verify-pending?resend=1");
    exit;
}

// ─── 6. CONNEXION RÉUSSIE ────────────────────────────────────────────────────
// Réinitialiser les tentatives et enregistrer la connexion
DB::execute("UPDATE users SET login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?", [$user['id']]);

loginUser($user);

// Régénérer l'ID de session pour prévenir la fixation de session
session_regenerate_id(true);

// ─── 7. REDIRECTION INTELLIGENTE ───────────────────────────────────────────────
$role = $user['role'] ?? 'parent';
$user_country = strtoupper($user['declared_country'] ?? $country);

if ($role === 'parent') {
    // Vérifier si au moins un enfant a été ajouté (Onboarding complété)
    $hasChild = DB::fetchOne("SELECT id FROM children WHERE parent_id = ? LIMIT 1", [$user['id']]);
    if (!$hasChild) {
        header("Location: /{$user_country}-{$lang_code}/dashboard/onboarding");
    } else {
        header("Location: /{$user_country}-{$lang_code}/dashboard/parent");
    }
} else {
    // Redirection par défaut pour les autres rôles
    header("Location: /{$user_country}-{$lang_code}/dashboard/parent");
}
exit;
