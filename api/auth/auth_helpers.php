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

// Auto-création des tables si elles n'existent pas (Pour la sécurité et la simplicité)
try {
    DB::execute("
        CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(25) NULL,
            email_verified TINYINT(1) DEFAULT 0,
            verification_token VARCHAR(100) NULL,
            oauth_provider VARCHAR(50) NULL,
            profile_photo VARCHAR(255) NULL,
            declared_country VARCHAR(2),
            login_attempts INT DEFAULT 0,
            locked_until DATETIME NULL,
            last_login_at DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Tables additionnelles
    DB::execute("
        CREATE TABLE IF NOT EXISTS children (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            parent_id INT UNSIGNED NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            birth_date DATE,
            grade_level VARCHAR(50),
            avatar_url VARCHAR(255) NULL,
            relationship VARCHAR(50) DEFAULT 'Père/Mère',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    DB::execute("
        CREATE TABLE IF NOT EXISTS notifications (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            type VARCHAR(50),
            title VARCHAR(255),
            message TEXT,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    DB::execute("
        CREATE TABLE IF NOT EXISTS parental_controls (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            child_id INT UNSIGNED NOT NULL,
            screen_time_limit INT DEFAULT 60,
            content_restriction_level VARCHAR(20) DEFAULT 'medium',
            social_enabled TINYINT(1) DEFAULT 1,
            is_supervision_active TINYINT(1) DEFAULT 1,
            FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Table pour la réinitialisation de mot de passe
    DB::execute("
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            token VARCHAR(100) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Migration des préférences users
    $prefs = [
        'preferred_color'                => "VARCHAR(7) DEFAULT '#2563eb'",
        'theme_mode'                     => "VARCHAR(10) DEFAULT 'light'",
        'role'                           => "VARCHAR(20) DEFAULT 'parent'",
        'entity_name'                    => "VARCHAR(255) NULL",
        'phone'                          => "VARCHAR(25) NULL",
        'verification_token'             => "VARCHAR(100) NULL",
        'verification_token_expires_at'  => "DATETIME NULL",
        'oauth_provider'                 => "VARCHAR(50) NULL",
        'profile_photo'                  => "VARCHAR(255) NULL",
        'login_attempts'                 => "INT DEFAULT 0",
        'locked_until'                   => "DATETIME NULL",
        'last_login_at'                  => "DATETIME NULL",
        'email_verified'                 => "TINYINT(1) DEFAULT 0",
    ];
    foreach ($prefs as $col => $def) {
        $check = DB::fetchOne("SHOW COLUMNS FROM users LIKE '$col'");
        if (!$check) DB::execute("ALTER TABLE users ADD $col $def");
    }

    // Migration de la structure children
    $childCols = [
        'last_name' => "VARCHAR(100) NULL",
        'avatar_color' => "VARCHAR(7) DEFAULT '#7c3aed'",
        'pin_code' => "VARCHAR(4) NULL",
        'child_id_alias' => "VARCHAR(50) NULL",
        'is_active' => "TINYINT(1) DEFAULT 1"
    ];
    foreach ($childCols as $col => $def) {
        $check = DB::fetchOne("SHOW COLUMNS FROM children LIKE '$col'");
        if (!$check) DB::execute("ALTER TABLE children ADD $col $def");
    }
} catch (\Exception $e) {
    if (defined('DEBUG_MODE') && DEBUG_MODE) {
        // En cas d'erreur de clé étrangère sur une table existante, on passe
        // car la structure est probablement déjà correcte
    }
}
?>
