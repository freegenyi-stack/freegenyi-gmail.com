<?php
/**
 * api/maintenance/migrate.php - Elite Database Migration Center
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>Centre de Migration FreeGeny Élite</h1>";
echo "<ul style='font-family: monospace; font-size: 14px; line-height: 1.6;'>";

function log_mig($msg) { echo "<li>[INFO] $msg</li>"; }
function log_err($msg) { echo "<li style='color: red;'>[ERR] $msg</li>"; }

try {
    // 1. TABLES DE BASE
    log_mig("Vérification des tables de base...");
    DB::execute("CREATE TABLE IF NOT EXISTS users (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    DB::execute("CREATE TABLE IF NOT EXISTS children (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        parent_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INT NULL,
        country VARCHAR(2) DEFAULT 'DZ',
        grade VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 2. MIGRATIONS DES COLONNES (L'ESSENTIEL)
    log_mig("Vérification des colonnes critiques...");
    
    $migrations = [
        // Table Users
        'users' => [
            'onboarding_step' => "INT DEFAULT 1 AFTER role",
            'role' => "VARCHAR(20) DEFAULT 'parent' AFTER email_verified",
            'verification_token_expires_at' => "DATETIME NULL AFTER verification_token"
        ],
        // Table Children
        'children' => [
            'school_name' => "VARCHAR(255) NULL AFTER grade",
            'secondary_parent_id' => "INT UNSIGNED NULL AFTER parent_id"
        ]
    ];

    foreach ($migrations as $table => $cols) {
        foreach ($cols as $col => $def) {
            $check = DB::fetchOne("SHOW COLUMNS FROM $table LIKE '$col'");
            if (!$check) {
                DB::execute("ALTER TABLE $table ADD COLUMN $col $def");
                log_mig("Table <b>$table</b> : Colonne <b>$col</b> ajoutée.");
            } else {
                log_mig("Table <b>$table</b> : Colonne <b>$col</b> déjà présente.");
            }
        }
    }

    echo "</ul><h2 style='color: green;'>✓ MIGRATION RÉUSSIE !</h2>";
    echo "<p>Votre base de données est maintenant 100% compatible avec le nouveau système de synchronisation et de liaison parentale.</p>";
    echo "<a href='/'>Retour à l'accueil</a>";

} catch (Exception $e) {
    log_err("Erreur lors de la migration : " . $e->getMessage());
    echo "</ul>";
}
