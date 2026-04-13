<?php
/**
 * api/dashboard/update_onboarding_step.php - Saves the current progress to DB for multi-device sync
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (empty($_SESSION['logged_in'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$step = (int)($_POST['step'] ?? 1);

if ($step >= 1 && $step <= 4) {
    DB::execute("UPDATE users SET onboarding_step = ? WHERE id = ?", [$step, $user_id]);
    echo json_encode(['success' => true, 'step' => $step]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid step']);
}
