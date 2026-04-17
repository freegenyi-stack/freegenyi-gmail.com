<?php
/**
 * HARD_RESET.php - LA SOLUTION FINALE
 */
$host = "localhost";
$dbname = "freegen1_freegeny_db";
$user = "freegen1_admin";
$pass = "Yousr4568520&";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h1>💣 Destruction et Reconstruction en cours...</h1>";

    // 0. Désactiver les contraintes pour pouvoir tout raser
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    // 1. On rase tout
    $pdo->exec("DROP TABLE IF EXISTS children, chat_messages, conversation_members, conversations, notifications, users, invitations, parental_controls");
    echo "✅ Tables existantes (et parental_controls) supprimées.<br>";

    // 2. On recrée USERS proprement
    $pdo->exec("
        CREATE TABLE users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(150),
            email VARCHAR(150) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(50) DEFAULT 'parent',
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
    echo "✅ Table USERS reconstruite.<br>";

    // 3. On recrée CHILDREN proprement
    $pdo->exec("
        CREATE TABLE children (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            parent_id INT UNSIGNED NOT NULL,
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
    echo "✅ Table CHILDREN reconstruite (avec grade_level).<br>";

    // 4. On recrée le CHAT
    $pdo->exec("CREATE TABLE conversations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, type VARCHAR(20), family_id INT UNSIGNED, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    $pdo->exec("CREATE TABLE conversation_members (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, user_id INT UNSIGNED)");
    $pdo->exec("CREATE TABLE chat_messages (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, sender_id INT UNSIGNED, message TEXT, is_read TINYINT(1) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    echo "✅ Tables CHAT reconstruites.<br>";

    echo "<h2>🚀 SYSTÈME RÉINITIALISÉ !</h2>";
    echo "<p>Vous pouvez maintenant créer votre compte et enregistrer votre enfant. Zéro erreur garantie.</p>";

} catch (PDOException $e) {
    echo "❌ Erreur Fatale : " . $e->getMessage();
}
