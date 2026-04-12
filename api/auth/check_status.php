<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
initSession();

header('Content-Type: application/json');

$email = $_SESSION['pending_email'] ?? '';
if (!$email) {
    echo json_encode(['verified' => false]);
    exit;
}

$user = DB::fetchOne("SELECT email_verified FROM users WHERE email = ? LIMIT 1", [$email]);

if ($user && $user['email_verified'] == 1) {
    // Si vérifié, il faut reconnecter la session sur l'appareil actuel !
    // Car l'autre appareil a fait le "loginUser", mais CE navigateur (le PC) ne l'est pas encore.
    $full_user = DB::fetchOne("SELECT * FROM users WHERE email = ? LIMIT 1", [$email]);
    loginUser($full_user);
    echo json_encode(['verified' => true]);
} else {
    echo json_encode(['verified' => false]);
}
