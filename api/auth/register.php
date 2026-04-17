<?php
/**
 * api/auth/register.php — Logique d'inscription PROFESSIONNELLE
 * ✅ Validation côté serveur
 * ✅ Hash bcrypt
 * ✅ Token vérification email (expire dans 24h)
 * ✅ Email de confirmation envoyé
 * ✅ Anti-doublons
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
require_once __DIR__ . '/../../includes/MailManager.php';

initSession();

// Sécurité : POST uniquement
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /auth/register');
    exit;
}

// 🛡️ Protection CSRF
if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
    header('Location: /auth/register?error=' . urlencode('Session expirée ou invalide. Veuillez réessayer.'));
    exit;
}

// 🛡️ Protection Rate Limiting
if (!RateLimiter::check('register', 3, 60)) {
    header('Location: /auth/register?error=' . urlencode('Trop d\'inscriptions. Veuillez patienter.'));
    exit;
}

$first_name = trim($_POST['first_name'] ?? '');
$last_name  = trim($_POST['last_name'] ?? '');
$full_name  = trim($first_name . ' ' . $last_name);
$email     = strtolower(trim($_POST['email'] ?? ''));
$password  = $_POST['password'] ?? '';
$phone     = trim($_POST['phone'] ?? '');
$role      = in_array($_POST['role'] ?? '', ['parent', 'school', 'ngo']) ? $_POST['role'] : 'parent';
$country   = strtoupper($country ?? 'DZ');
$lang_code = $lang ?? 'fr';

$base_url  = "/{$country}-{$lang_code}";

// ─── 1. VALIDATION ────────────────────────────────────────────────────────────
$errors = [];

if (empty($first_name) || empty($last_name)) {
    $errors[] = 'Le prénom et le nom sont requis.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Adresse email invalide.';
}

if (mb_strlen($password) < 8) {
    $errors[] = 'Le mot de passe doit contenir au moins 8 caractères.';
}

if (!preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
    $errors[] = 'Le mot de passe doit contenir au moins une majuscule et un chiffre.';
}

if (!empty($errors)) {
    $errorStr = urlencode(implode('|', $errors));
    header("Location: {$base_url}/auth/register?error=" . $errorStr);
    exit;
}

// ─── 2. VÉRIFICATION DOUBLON ──────────────────────────────────────────────────
$existing = DB::fetchOne("SELECT id FROM users WHERE email = ? LIMIT 1", [$email]);
if ($existing) {
    header("Location: {$base_url}/auth/register?error=" . urlencode('Cette adresse email est déjà utilisée.'));
    exit;
}

// ─── 3. CRÉATION DU COMPTE ───────────────────────────────────────────────────
$password_hash        = password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
$verification_token   = bin2hex(random_bytes(32));
$token_expires_at     = date('Y-m-d H:i:s', strtotime('+24 hours'));

// Ajouter la colonne d'expiration si elle n'existe pas (migration douce)
$col = DB::fetchOne("SHOW COLUMNS FROM users LIKE 'verification_token_expires_at'");
if (!$col) {
    DB::execute("ALTER TABLE users ADD verification_token_expires_at DATETIME NULL AFTER verification_token");
}

// Ajouter la colonne role si elle n'existe pas
$colRole = DB::fetchOne("SHOW COLUMNS FROM users LIKE 'role'");
if (!$colRole) {
    DB::execute("ALTER TABLE users ADD role VARCHAR(20) DEFAULT 'parent' AFTER email_verified");
}

$user_id = DB::insert(
    "INSERT INTO users (email, password_hash, full_name, phone, role, declared_country, email_verified, verification_token, verification_token_expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, NOW())",
    [$email, $password_hash, $full_name, $phone ?: null, $role, $country, $verification_token, $token_expires_at]
);

if (!$user_id) {
    header("Location: {$base_url}/auth/register?error=" . urlencode('Erreur lors de la création du compte. Réessayez.'));
    exit;
}

// ─── 4. LIAISON PARENTALE (SI INVITATION) ───────────────────────────────────
$invite_parent_id = (int)($_POST['invite_parent'] ?? 0);
if ($invite_parent_id > 0) {
    // 1. On récupère le family_id du parent qui a invité
    $inviter = DB::fetchOne("SELECT family_id FROM users WHERE id = ?", [$invite_parent_id]);
    if ($inviter && $inviter['family_id']) {
        // 2. On lie le nouvel utilisateur à la même famille et on saute l'onboarding
        DB::execute("UPDATE users SET family_id = ?, onboarding_step = 4 WHERE id = ?", [$inviter['family_id'], $user_id]);
        
        // 3. On lie l'enfant à ce nouveau parent secondaire
        DB::execute("UPDATE children SET secondary_parent_id = ? WHERE parent_id = ? AND secondary_parent_id IS NULL", [$user_id, $invite_parent_id]);
    }
}

// ─── 5. ENVOI EMAIL VÉRIFICATION ─────────────────────────────────────────────
MailManager::sendVerification($email, $full_name, $verification_token, $lang_code);

// ─── 5. SESSION TEMPORAIRE (pendant la vérification) ─────────────────────────
$_SESSION['pending_email']   = $email;
$_SESSION['pending_name']    = $full_name;
$_SESSION['pending_role']    = $role;

// Redirection vers la page "Vérifiez votre boîte mail"
header("Location: {$base_url}/auth/verify-pending");
exit;
