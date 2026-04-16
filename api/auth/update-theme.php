<?php
/**
 * api/auth/update-theme.php - Mettre à jour les préférences visuelles (Vague 3)
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

$input = json_decode(file_get_contents('php://input'), true);
$theme = $input['theme'] ?? [];
$avatar = $input['avatar'] ?? null;

try {
    // 1. Mise à jour de la Base de Données
    $user_id = $_SESSION['user_id'];
    
    if (!empty($theme)) {
        $json_theme = json_encode($theme);
        DB::execute("UPDATE users SET theme_settings = ? WHERE id = ?", [$json_theme, $user_id]);
        $_SESSION['user_theme'] = $theme;
    }

    if ($avatar) {
        $json_avatar = json_encode($avatar);
        DB::execute("UPDATE users SET avatar_config = ? WHERE id = ?", [$json_avatar, $user_id]);
        $_SESSION['user_avatar_config'] = $avatar;
    }

    jsonResponse(['success' => true, 'message' => 'Préférences mises à jour !']);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
