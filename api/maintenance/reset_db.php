<?php
/**
 * api/maintenance/reset_db.php - Nettoyer proprement la base de données pour repartir de zéro
 * ATTENTION : Commande destructive.
 */
require_once __DIR__ . '/../../config/app.php';

// Sécurité : Uniquement si autorisé par Antigravity ou via mot de passe technique
if (($_GET['pw'] ?? '') !== MAINTENANCE_PASSWORD) {
    die("Accès refusé. Utilisez ?pw=" . MAINTENANCE_PASSWORD);
}

try {
    echo "<h1>Réinitialisation de FreeGeny...</h1><ul>";

    // 1. Désactiver les contraintes de clés étrangères temporairement
    DB::execute("SET FOREIGN_KEY_CHECKS = 0");

    // 2. Vider les tables
    $tables = ['chat_messages', 'conversation_members', 'conversations', 'children', 'invitations', 'users'];
    foreach ($tables as $table) {
        DB::execute("TRUNCATE TABLE $table");
        echo "<li>✅ Table <b>$table</b> vidée.</li>";
    }

    // 3. Recréer l'utilisateur Geny Expert (ID 999)
    DB::execute("
        INSERT INTO users (id, full_name, email, password_hash, role, email_verified, created_at)
        VALUES (999, 'Geny Expert', 'geny@freegeny.com', 'SYSTEM_BOT', 'expert', 1, NOW())
    ");
    echo "<li>✅ Utilisateur <b>Geny Expert</b> recréé (ID 999).</li>";

    // 4. Réactiver les contraintes
    DB::execute("SET FOREIGN_KEY_CHECKS = 1");

    echo "</ul><p style='color:green; font-weight:bold;'>Réinitialisation terminée avec succès ! Vous pouvez vous réinscrire.</p>";
} catch (Exception $e) {
    echo "<p style='color:red;'>Erreur : " . $e->getMessage() . "</p>";
}
