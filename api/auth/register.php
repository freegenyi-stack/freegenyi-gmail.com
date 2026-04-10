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

// Diagnostic : Log l'email testé
$existing = DB::fetchOne("SELECT id, oauth_provider FROM users WHERE email = ? LIMIT 1", [$email]);
error_log("Tentative d'inscription pour $email. Résultat DB : " . ($existing ? 'TROUVÉ (id:'.$existing['id'].')' : 'VIDE'));

if ($existing) {
    if ($existing['oauth_provider'] === 'Google') {
        jsonResponse(['error' => 'Ce compte est lié à Google. Connectez-vous avec le bouton Google.'], 409);
    }
    jsonResponse(['error' => 'Un compte existe déjà. Connectez-vous avec votre mot de passe.'], 409);
}

// Générer un Token de vérification
$token = bin2hex(random_bytes(32));

try {
    // Créer l'utilisateur (Non vérifié par défaut)
    $hash   = password_hash($pass, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
    $userId = DB::insert(
        "INSERT INTO users (email, password_hash, full_name, phone, declared_country, verification_token, email_verified) VALUES (?, ?, ?, ?, ?, ?, 0)",
        [$email, $hash, $name, $phone, $country, $token]
    );

    if (!$userId) {
        jsonResponse(['error' => 'Erreur lors de la création du compte. Réessayez.'], 500);
    }

    // Envoyer l'email de vérification obligatoire (Checklist Elite)
    try {
        MailManager::sendVerification($email, $name, $token);
    } catch (\Exception $e) {}

    jsonResponse([
        'success' => true,
        'message' => 'Lien de confirmation envoyé !',
        'redirect' => '/' . strtoupper($country) . '-' . strtolower($_SESSION['lang'] ?? 'fr') . '/auth/verify-pending'
    ]);

} catch (\Exception $e) {
    jsonResponse(['error' => 'Erreur critique : ' . $e->getMessage()], 500);
}
