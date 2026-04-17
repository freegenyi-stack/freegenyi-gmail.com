<?php
/**
 * HARD_RESET.php - VERSION ULTIME (FORCE BRUTE)
 */
$host = "localhost";
$dbname = "freegen1_freegeny_db";
$user = "freegen1_admin";
$pass = "Yousr4568520&";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h1>💣 Nettoyage Profond...</h1>";

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    $tables = ['children', 'chat_messages', 'conversation_members', 'conversations', 'notifications', 'users', 'invitations', 'parental_controls', 'activities'];
    
    foreach ($tables as $t) {
        try {
            $pdo->exec("DROP TABLE IF EXISTS $t");
            echo "✅ Table $t supprimée.<br>";
        } catch (Exception $e) {
            echo "❌ Échec sur $t : " . $e->getMessage() . "<br>";
        }
    }

    // 1. USERS
    $pdo->exec("
        CREATE TABLE users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(150),
            email VARCHAR(150) UNIQUE,
            password_hash VARCHAR(255),
            role VARCHAR(50) DEFAULT 'parent',
            phone VARCHAR(50) DEFAULT NULL,
            declared_country VARCHAR(10) DEFAULT 'DZ',
            email_verified TINYINT(1) DEFAULT 0,
            oauth_provider VARCHAR(50) DEFAULT 'Direct',
            login_attempts INT DEFAULT 0,
            family_id INT UNSIGNED DEFAULT NULL,
            onboarding_step INT DEFAULT 1,
            profile_completion_pct INT DEFAULT 0,
            theme_settings TEXT,
            avatar_config TEXT,
            is_online TINYINT(1) DEFAULT 0,
            last_login_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Table USERS créée.<br>";

    // 2. CHILDREN
    $pdo->exec("
        CREATE TABLE children (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            parent_id INT UNSIGNED NOT NULL,
            secondary_parent_id INT UNSIGNED DEFAULT NULL,
            first_name VARCHAR(100) NOT NULL,
            age INT NOT NULL,
            country VARCHAR(10),
            grade_level VARCHAR(50),
            school_name VARCHAR(150),
            xp_total INT DEFAULT 0,
            progress_percent INT DEFAULT 0,
            field_of_interest VARCHAR(100) DEFAULT 'Exploration',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Table CHILDREN créée.<br>";

    // 3. INVITATIONS
    $pdo->exec("
        CREATE TABLE invitations (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            parent_id INT UNSIGNED NOT NULL,
            invited_email VARCHAR(150) NOT NULL,
            role VARCHAR(50) DEFAULT 'Parent',
            status VARCHAR(20) DEFAULT 'pending',
            token VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Table INVITATIONS créée.<br>";

    // 4. CHAT
    $pdo->exec("CREATE TABLE conversations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, type VARCHAR(20), family_id INT UNSIGNED, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    $pdo->exec("CREATE TABLE conversation_members (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, user_id INT UNSIGNED)");
    $pdo->exec("CREATE TABLE chat_messages (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, sender_id INT UNSIGNED, message TEXT, is_read TINYINT(1) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    echo "✅ Système de Chat créé.<br>";

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo "<h2>🚀 SYSTÈME TOTALEMENT NEUF !</h2>";
    echo "<p>Tout est parfaitement aligné. Vous pouvez continuer.</p>";

} catch (PDOException $e) {
    echo "❌ Erreur Critique : " . $e->getMessage();
}
