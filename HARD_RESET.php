<?php
/**
 * HARD_RESET.php - LA SOLUTION FINALE ET COMPLÈTE
 */
$host = "localhost";
$dbname = "freegen1_freegeny_db";
$user = "freegen1_admin";
$pass = "Yousr4568520&";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h1>💣 Reset Système Total (Identité Unifiée)...</h1>";

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("DROP TABLE IF EXISTS children, chat_messages, conversation_members, conversations, notifications, users, invitations, parental_controls");
    echo "✅ Tables nettoyées.<br>";

    // TABLE USERS (Version complète pour Social Login)
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
    echo "✅ Table USERS reconstruite (Social Login Prêt).<br>";

    // TABLE CHILDREN (Version alignée Cockpit)
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
    echo "✅ Table CHILDREN reconstruite.<br>";

    // TABLES DE CHAT
    $pdo->exec("CREATE TABLE conversations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, type VARCHAR(20), family_id INT UNSIGNED, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    $pdo->exec("CREATE TABLE conversation_members (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, user_id INT UNSIGNED)");
    $pdo->exec("CREATE TABLE chat_messages (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, sender_id INT UNSIGNED, message TEXT, is_read TINYINT(1) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    echo "✅ Système de Chat prêt.<br>";

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo "<h2>🚀 SYSTÈME ALIGNÉ ET PRÊT !</h2>";
    echo "<p>C'est la version finale. Faites le PULL, lancez ce reset, et l'entrée dans le cockpit sera fluide.</p>";

} catch (PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
