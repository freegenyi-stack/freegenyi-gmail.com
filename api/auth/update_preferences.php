<?php
/**
 * api/auth/update_preferences.php - Enregistrer les choix Thème/Avatar
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false], 401);
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];

if (isset($input['type'])) {
    if ($input['type'] === 'theme') {
        $theme_json = json_encode(['id' => $input['id'], 'color' => $input['color']]);
        DB::execute("UPDATE users SET theme_settings = ? WHERE id = ?", [$theme_json, $user_id]);
        $_SESSION['user_theme'] = json_decode($theme_json, true);
    }
    
    if ($input['type'] === 'avatar') {
        $avatar_json = json_encode(['icon' => $input['icon'], 'bg' => $input['bg']]);
        DB::execute("UPDATE users SET avatar_config = ? WHERE id = ?", [$avatar_json, $user_id]);
        $_SESSION['user_avatar_config'] = json_decode($avatar_json, true);
    }
}

jsonResponse(['success' => true]);
