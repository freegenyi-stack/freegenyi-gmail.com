<?php
/**
 * super_reset.php - NETTOYAGE TOTAL POUR REPARTIR PROPRE
 */
require_once __DIR__ . '/config/db.php';

try {
    echo "<h1>Nettoyage de Printemps FreeGeny...</h1>";

    // 1. Suppression des tables pour recréer proprement
    DB::execute("DROP TABLE IF EXISTS children, chat_messages, conversation_members, conversations, notifications, users, invitations");
    echo "✅ Tables supprimées.<br>";

    // 2. Recréation de la table USERS
    DB::execute("
        CREATE TABLE users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(150),
            email VARCHAR(150) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(50) DEFAULT 'parent',
            family_id INT UNSIGNED DEFAULT NULL,
            phone VARCHAR(50),
            onboarding_step INT DEFAULT 1,
            profile_completion_pct INT DEFAULT 0,
            theme_settings TEXT,
            avatar_config TEXT,
            is_online TINYINT(1) DEFAULT 0,
            last_login_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Table Users créée (avec family_id).<br>";

    // 3. Recréation de la table CHILDREN
    DB::execute("
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
    echo "✅ Table Children créée (avec first_name).<br>";

    // 4. Recréation des tables de CHAT
    DB::execute("CREATE TABLE conversations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, type VARCHAR(20), family_id INT UNSIGNED, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    DB::execute("CREATE TABLE conversation_members (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, user_id INT UNSIGNED)");
    DB::execute("CREATE TABLE chat_messages (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, sender_id INT UNSIGNED, message TEXT, is_read TINYINT(1) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    echo "✅ Tables Chat créées.<br>";

    echo "<h2>TERMINÉ ! Tout est propre.</h2>";
    echo "<p>Veuillez maintenant supprimer ce fichier et recommencer votre enregistrement.</p>";
    echo "<a href='/auth/register' style='padding:10px 20px; background:black; color:white; text-decoration:none; border-radius:10px;'>S'enregistrer à nouveau</a>";

} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
