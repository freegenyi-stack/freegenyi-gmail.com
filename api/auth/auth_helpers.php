<?php
/**
 * DB Class and Authentication Helpers
 */

require_once __DIR__ . '/../../config/db.php';

// Wrap PDO into a simple static class for the API
class DB {
    public static function fetchOne($sql, $params = []) {
        global $pdo;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch() ?: null;
    }

    public static function fetchAll($sql, $params = []) {
        global $pdo;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function execute($sql, $params = []) {
        global $pdo;
        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    }

    public static function insert($sql, $params = []) {
        global $pdo;
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute($params)) {
            return $pdo->lastInsertId();
        }
        return false;
    }
}

// Helpers
if (!defined('BCRYPT_COST')) define('BCRYPT_COST', 12);
if (!defined('MAX_LOGIN_ATTEMPTS')) define('MAX_LOGIN_ATTEMPTS', 5);

function initSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function loginUser($user) {
    $_SESSION['logged_in'] = true;
    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_avatar'] = $user['profile_photo'] ?? '';
    $_SESSION['is_parent'] = true; // par défaut
    $_SESSION['user_initials'] = getInitials($user['full_name']);
    $_SESSION['oauth_provider'] = $user['oauth_provider'] ?? null;
    $_SESSION['user_phone'] = $user['phone'] ?? null;
}

function getInitials($name) {
    if (empty($name)) return '?';
    $words = array_values(array_filter(explode(' ', trim($name))));
    if (count($words) >= 2) {
        return mb_strtoupper(mb_substr($words[0], 0, 1) . mb_substr($words[count($words)-1], 0, 1));
    } elseif (count($words) === 1) {
        return mb_strtoupper(mb_substr($words[0], 0, 2));
    }
    return '?';
}

function getAvatarColor($name) {
    $colors = ['#EA580C', '#0EA5E9', '#8B5CF6', '#10B981', '#F43F5E', '#D946EF'];
    $index = ord(substr($name, 0, 1)) % count($colors);
    return $colors[$index];
}

// MIGRATIONS DÉPLACÉES : Les migrations ne doivent plus s'exécuter à chaque requête pour éviter la surcharge DB.
// Utilisez /api/maintenance/migrate.php pour mettre à jour la structure.
?>
