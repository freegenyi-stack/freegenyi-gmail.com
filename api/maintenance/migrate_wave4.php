<?php
/**
 * api/maintenance/migrate_wave4.php - Migration pour la Messagerie Elite (Vague 4)
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>🚀 Migration Vague 4 : Messagerie Elite (Mobile First)</h1>";
echo "<ul style='font-family: monospace;'>";

try {
    // 1. Ajouter family_id aux utilisateurs
    $check = DB::fetchOne("SHOW COLUMNS FROM users LIKE 'family_id'");
    if (!$check) {
        DB::execute("ALTER TABLE users ADD COLUMN family_id VARCHAR(50) NULL AFTER role");
        echo "<li>✅ Colonne <b>family_id</b> ajoutée aux utilisateurs.</li>";
    }

    // 2. Table des conversations
    DB::execute("CREATE TABLE IF NOT EXISTS conversations (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        family_id VARCHAR(50) NULL, -- Pour le chat de famille
        type ENUM('direct', 'family', 'group') DEFAULT 'direct',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<li>✅ Table <b>conversations</b> créée.</li>";

    // 3. Table des messages de chat
    DB::execute("CREATE TABLE IF NOT EXISTS chat_messages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT UNSIGNED NOT NULL,
        sender_id INT UNSIGNED NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (conversation_id),
        INDEX (sender_id),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<li>✅ Table <b>chat_messages</b> créée.</li>";

    // 4. Table des membres de conversation (pour le chat multiple)
    DB::execute("CREATE TABLE IF NOT EXISTS conversation_members (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY conv_user (conversation_id, user_id),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<li>✅ Table <b>conversation_members</b> créée.</li>";

    echo "</ul><h2 style='color: green;'>✓ BASE DE DONNÉES PRÊTE POUR LE CHAT !</h2>";

} catch (Exception $e) {
    echo "</ul><h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
