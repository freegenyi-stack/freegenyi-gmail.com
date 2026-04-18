<?php
/**
 * api/auth/heartbeat.php - Mettre à jour le statut "En ligne" sans recharger la page
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';

initSession();

if (isset($_SESSION['user_id'])) {
    DB::execute("UPDATE users SET is_online = 1, last_login_at = NOW() WHERE id = ?", [$_SESSION['user_id']]);
    echo json_encode(['status' => 'online']);
} else {
    echo json_encode(['status' => 'offline']);
}
