<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';
initSession();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé.'], 401);
}

$userId = $_SESSION['user_id'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

$action = $body['action'] ?? '';

// ACTION : CHANGER L'AVATAR (Icône ou Photo)
if ($action === 'update_avatar') {
    $avatar = trim($body['avatar'] ?? '');
    if ($avatar) {
        DB::execute("UPDATE users SET profile_photo = ? WHERE id = ?", [$avatar, $userId]);
        $_SESSION['profile_photo'] = $avatar;
        jsonResponse(['success' => true]);
    }
}

// ACTION : MODIFIER LES INFOS DE BASE
if ($action === 'update_info') {
    $name  = trim($body['full_name'] ?? '');
    $phone = trim($body['phone'] ?? '');

    if ($name) {
        DB::execute("UPDATE users SET full_name = ?, phone = ? WHERE id = ?", [$name, $phone, $userId]);
        $_SESSION['user_name'] = $name;
        $_SESSION['user_initials'] = getInitials($name);
        jsonResponse(['success' => true]);
    }
}

jsonResponse(['error' => 'Action invalide.'], 400);
