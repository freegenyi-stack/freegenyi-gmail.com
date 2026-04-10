<?php
// ============================================================
// API — POST /api/auth/register
// ============================================================
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
require_once __DIR__ . '/../../includes/MailManager.php';
initSession();

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée.'], 405);
}

if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'XMLHttpRequest') {
    jsonResponse(['error' => 'Requête invalide.'], 400);
}

$body    = json_decode(file_get_contents('php://input'), true) ?? [];
$name    = trim($body['full_name'] ?? '');
$phone   = trim($body['phone']     ?? '');
$email   = trim($body['email']    ?? '');
$pass    = $body['password']       ?? '';
$confirm = $body['confirm']        ?? '';
$country = strtoupper(trim($body['country'] ?? 'DZ'));

// Validation
$errors = [];
if (strlen($name) < 2)  $errors[] = 'Le nom doit contenir au moins 2 caractères.';
if (strlen($phone) < 8) $errors[] = 'Numéro de téléphone invalide.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Adresse email invalide.';
if (strlen($pass) < 8)  $errors[] = 'Le mot de passe doit contenir au moins 8 caractères.';
if ($pass !== $confirm) $errors[] = 'Les mots de passe ne correspondent pas.';
if (strlen($country) !== 2) $country = 'DZ';

if ($errors) {
    jsonResponse(['error' => implode(' ', $errors)], 422);
}

// Vérifier si email déjà pris
$existing = DB::fetchOne("SELECT id FROM users WHERE email = ? LIMIT 1", [$email]);
if ($existing) {
    jsonResponse(['error' => 'Un compte existe déjà avec cette adresse email.'], 409);
}

try {
    // Créer l'utilisateur
    $hash   = password_hash($pass, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
    $userId = DB::insert(
        "INSERT INTO users (email, password_hash, full_name, phone, declared_country) VALUES (?, ?, ?, ?, ?)",
        [$email, $hash, $name, $phone, $country]
    );

    if (!$userId) {
        jsonResponse(['error' => 'Erreur lors de la création du compte. Réessayez.'], 500);
    }

    // Charger l'utilisateur créé et initialiser la session
    $user = DB::fetchOne("SELECT * FROM users WHERE id = ? LIMIT 1", [$userId]);
    loginUser($user);

    // Envoyer l'email de bienvenue (ne doit pas bloquer si ça échoue)
    try {
        MailManager::sendWelcome($email, $name);
    } catch (\Exception $e) {
        // Log error silently
    }

    jsonResponse([
        'success' => true,
        'redirect' => '/' . strtolower($country) . '-' . strtolower($_SESSION['lang'] ?? 'fr') . '/dashboard/parent',
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email
        ]
    ]);

} catch (\Exception $e) {
    jsonResponse(['error' => 'Erreur critique : ' . $e->getMessage()], 500);
}
