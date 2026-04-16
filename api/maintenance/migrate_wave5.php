<?php
/**
 * api/maintenance/migrate_wave5.php - Migration pour le Multimédia Elite (Vague 5)
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>🎬 Migration Vague 5 : Multimédia & Emojis</h1>";
echo "<ul style='font-family: monospace;'>";

try {
    // 1. Ajouter le type de message et le path du média
    $check = DB::fetchOne("SHOW COLUMNS FROM chat_messages LIKE 'message_type'");
    if (!$check) {
        DB::execute("ALTER TABLE chat_messages 
            ADD COLUMN message_type ENUM('text', 'image', 'audio', 'video', 'file') DEFAULT 'text' AFTER message,
            ADD COLUMN media_path VARCHAR(255) NULL AFTER message_type
        ");
        echo "<li>✅ Colonnes <b>message_type</b> et <b>media_path</b> ajoutées.</li>";
    }

    echo "</ul><h2 style='color: green;'>✓ BASE DE DONNÉES PRÊTE POUR LE MULTIMÉDIA !</h2>";

} catch (Exception $e) {
    echo "</ul><h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
