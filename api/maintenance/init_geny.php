<?php
/**
 * api/maintenance/init_geny.php - Installation de l'IA Geny Expert
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>🤖 Initialisation de Geny Expert</h1>";

try {
    // 1. Ajouter le type 'ai' aux conversations
    DB::execute("ALTER TABLE conversations MODIFY COLUMN type ENUM('direct', 'family', 'group', 'ai') DEFAULT 'direct'");
    echo "<li>✅ Type de conversation <b>'ai'</b> ajouté.</li>";

    // 2. Créer l'utilisateur Geny Expert (ID 999)
    $exists = DB::fetchOne("SELECT id FROM users WHERE id = 999");
    if (!$exists) {
        DB::execute("
            INSERT INTO users (id, full_name, email, password_hash, role, is_online) 
            VALUES (999, 'Geny Expert', 'geny@freegeny.com', 'SYSTEM_BOT', 'expert', 1)
        ");
        echo "<li>✅ Utilisateur <b>Geny Expert</b> créé (ID 999).</li>";
    }

    echo "<h2 style='color: green;'>✓ GENY EXPERT EST PRÊTE À RÉPONDRE !</h2>";

} catch (Exception $e) {
    echo "<h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
