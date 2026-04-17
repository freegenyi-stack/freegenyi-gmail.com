<?php
/**
 * api/maintenance/reset_test_db.php - Reset complet pour tests elite
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>🧹 Nettoyage complet de la base de données (TESTS)</h1>";
echo "<ul style='font-family: monospace;'>";

try {
    // 1. Désactiver les contraintes de clés étrangères temporairement pour vider sans erreur
    DB::execute("SET FOREIGN_KEY_CHECKS = 0");

    $tables = [
        'chat_messages',
        'conversation_members',
        'conversations',
        'activity_logs',
        'notifications',
        'children',
        'users',
        'invitations'
    ];

    foreach ($tables as $table) {
        // On vérifie si la table existe avant de vider
        $exists = DB::fetchOne("SHOW TABLES LIKE ?", [$table]);
        if ($exists) {
            DB::execute("TRUNCATE TABLE $table");
            echo "<li>✅ Table <b>$table</b> vidée.</li>";
        }
    }

    // 2. Réactiver les contraintes
    DB::execute("SET FOREIGN_KEY_CHECKS = 1");

    // 3. Détruire la session actuelle pour forcer la reconnexion
    initSession();
    $_SESSION = [];
    session_destroy();

    echo "</ul><h2 style='color: green;'>✓ VOTRE BASE EST 100% PROPRE !</h2>";
    echo "<p>Vous pouvez maintenant aller sur la <a href='/'>page d'accueil</a> et vous réinscrire pour tester le nouveau Cockpit Elite.</p>";

} catch (Exception $e) {
    DB::execute("SET FOREIGN_KEY_CHECKS = 1");
    echo "</ul><h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
