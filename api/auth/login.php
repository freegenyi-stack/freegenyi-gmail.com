<?php
// ============================================================
// API — POST /api/auth/login
// ============================================================
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
initSession();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée.'], 405);
}

// Vérifier le header AJAX
if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'XMLHttpRequest') {
    jsonResponse(['error' => 'Requête invalide.'], 400);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$email    = trim($body['email']    ?? '');
$password = trim($body['password'] ?? '');

// Validation basique
if (!$email || !$password) {
    jsonResponse(['error' => 'Email et mot de passe requis.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Adresse email invalide.'], 422);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// Vérifier si IP ou email est bloqué (brute-force)
$attempts = DB::fetchOne(
    "SELECT COUNT(*) as cnt FROM login_attempts 
     WHERE (email = ? OR ip_address = ?) 
       AND success = 0 
       AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)",
    [$email, $ip]
);

if (($attempts['cnt'] ?? 0) >= MAX_LOGIN_ATTEMPTS) {
    jsonResponse(['error' => 'Trop de tentatives. Réessayez dans 15 minutes.'], 429);
}

// Récupérer l'utilisateur
$user = DB::fetchOne(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [$email]
);

// Log de la tentative (réussie ou non)
DB::insert(
    "INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, ?)",
    [$email, $ip, ($user && password_verify($password, $user['password_hash'])) ? 1 : 0]
);

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonResponse(['error' => 'Email ou mot de passe incorrect.'], 401);
}

// Vérifier si le compte est verrouillé
if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
    jsonResponse(['error' => 'Compte temporairement verrouillé.'], 403);
}

// Mettre à jour last_login
DB::execute("UPDATE users SET last_login_at = NOW(), login_attempts = 0 WHERE id = ?", [$user['id']]);

// Créer la session
loginUser($user);

jsonResponse([
    'success' => true,
    'user' => [
        'id'        => $user['id'],
        'full_name' => $user['full_name'],
        'email'     => $user['email'],
    ],
    'redirect' => APP_URL . '/dashboard/parent',
]);
