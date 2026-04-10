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
define('BCRYPT_COST', 12);
define('MAX_LOGIN_ATTEMPTS', 5);

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
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['logged_in'] = true;
    $_SESSION['user_initials'] = getInitials($user['full_name']);
}

function getInitials($name) {
    $words = explode(' ', $name);
    if (count($words) >= 2) {
        return strtoupper(substr($words[0], 0, 1) . substr($words[count($words)-1], 0, 1));
    }
    return strtoupper(substr($name, 0, 2));
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
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(25) NULL,
            email_verified TINYINT(1) DEFAULT 0,
            verification_token VARCHAR(100) NULL,
            oauth_provider VARCHAR(50) NULL, -- 'google', 'facebook', etc.
            oauth_id VARCHAR(100) NULL,
            declared_country VARCHAR(2),
            login_attempts INT DEFAULT 0,
            locked_until DATETIME NULL,
            last_login_at DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Correction : Forcer l'ajout de la colonne phone si elle manque
    try {
        $check = DB::fetchOne("SHOW COLUMNS FROM users LIKE 'phone'");
        if (!$check) {
            DB::execute("ALTER TABLE users ADD phone VARCHAR(25) NULL AFTER full_name");
        }
        
        // Ajout des colonnes de vérification, OAuth et Profile
        $cols = [
            'email_verified' => "TINYINT(1) DEFAULT 0", 
            'verification_token' => "VARCHAR(100) NULL", 
            'oauth_provider' => "VARCHAR(50) NULL",
            'profile_photo' => "VARCHAR(255) NULL"
        ];
        foreach ($cols as $col => $def) {
            $check = DB::fetchOne("SHOW COLUMNS FROM users LIKE '$col'");
            if (!$check) DB::execute("ALTER TABLE users ADD $col $def");
        }
    } catch (\Exception $e) {
        // La colonne existe probablement déjà
    }

    DB::execute("
        CREATE TABLE IF NOT EXISTS login_attempts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            success TINYINT(1) DEFAULT 0,
            attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // --- ELITE COMMAND CENTER TABLES ---
    
    // 2. Table des Enfants
    DB::execute("
        CREATE TABLE IF NOT EXISTS children (
            id INT AUTO_INCREMENT PRIMARY KEY,
            parent_id INT NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            birth_date DATE,
            grade_level VARCHAR(50),
            avatar_url VARCHAR(255) NULL,
            relationship VARCHAR(50) DEFAULT 'Père/Mère',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 3. Table des Notifications
    DB::execute("
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            type VARCHAR(50), -- 'activity', 'alert', 'reward', 'reminder'
            title VARCHAR(255),
            message TEXT,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 4. Table des Contrôles Parentaux
    DB::execute("
        CREATE TABLE IF NOT EXISTS parental_controls (
            id INT AUTO_INCREMENT PRIMARY KEY,
            child_id INT NOT NULL,
            screen_time_limit INT DEFAULT 60, -- en minutes
            content_restriction_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
            social_enabled TINYINT(1) DEFAULT 1,
            is_supervision_active TINYINT(1) DEFAULT 1,
            FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch (\Exception $e) {
    // Si l'utilisateur n'a pas les droits de création, on ignore l'erreur
}
?>
