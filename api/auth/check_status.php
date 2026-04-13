<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';
initSession();

header('Content-Type: application/json');

$email = $_SESSION['pending_email'] ?? $_SESSION['user_email'] ?? '';
if (!$email) {
    echo json_encode(['verified' => false]);
    exit;
}

$user = DB::fetchOne("SELECT email_verified, onboarding_step FROM users WHERE email = ? LIMIT 1", [$email]);

if ($user && $user['email_verified'] == 1) {
    if (empty($_SESSION['logged_in'])) {
        $full_user = DB::fetchOne("SELECT * FROM users WHERE email = ? LIMIT 1", [$email]);
        if ($full_user) loginUser($full_user);
    }
    echo json_encode([
        'verified' => true,
        'step' => (int)$user['onboarding_step']
    ]);
} else {
    echo json_encode(['verified' => false]);
}
