<?php
/**
 * api/auth/auth_helpers.php - Fonctions d'aide à l'authentification (Elite)
 * ✅ Optimisé pour éviter les erreurs 500
 */

// On s'assure que la session est initialisée proprement
function initSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

// Réponse JSON standardisée pour les APIs
function jsonResponse($data, $statusCode = 200) {
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
    }
    echo json_encode($data);
    exit;
}

// Connecte l'utilisateur et initialise les variables de session Elite
function loginUser($user) {
    if (!$user) return;
    
    $_SESSION['logged_in'] = true;
    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role']   = $user['role'] ?? 'parent';
    $_SESSION['is_parent']   = ($_SESSION['user_role'] === 'parent');
    
    // Variables pour le cockpit (Vague 1-3)
    $_SESSION['user_profile_pct'] = (int)($user['profile_completion_pct'] ?? 0);
    $_SESSION['user_theme'] = json_decode($user['theme_settings'] ?? '{}', true);
    $_SESSION['user_avatar_config'] = json_decode($user['avatar_config'] ?? '{}', true);
    
    $_SESSION['user_initials'] = getInitials($user['full_name']);
}

// Pour l'affichage dans le header
if (!function_exists('getInitials')) {
    function getInitials($name) {
        if (empty($name)) return 'U';
        $words = array_values(array_filter(explode(' ', trim($name))));
        if (count($words) >= 2) {
            return mb_strtoupper(mb_substr($words[0], 0, 1) . mb_substr($words[count($words)-1], 0, 1));
        }
        return mb_strtoupper(mb_substr($words[0] ?? 'U', 0, 2));
    }
}
