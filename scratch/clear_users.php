<?php
/**
 * scratch/clear_users.php - Vidange complète de la base utilisateurs
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

// Sécurité : On demande un code secret dans l'URL pour éviter les accidents
$secret = $_GET['confirm'] ?? '';
if ($secret !== 'delete_all') {
    die("<h1>🚨 ATTENTION</h1><p>Pour vider TOUTE la base utilisateurs, ajoutez <b>?confirm=delete_all</b> à l'URL.</p>");
}

try {
    // Désactiver les contraintes pour le truncate
    DB::execute("SET FOREIGN_KEY_CHECKS = 0");
    DB::execute("TRUNCATE TABLE users");
    DB::execute("TRUNCATE TABLE children");
    DB::execute("TRUNCATE TABLE password_reset_tokens");
    DB::execute("TRUNCATE TABLE api_rate_limits");
    DB::execute("SET FOREIGN_KEY_CHECKS = 1");

    echo "<h1 style='color: green;'>✅ BASE DE DONNÉES VIDÉE !</h1>";
    echo "<p>Tous les utilisateurs, enfants et tokens ont été supprimés.</p>";
    echo "<a href='/'>Retour à l'accueil</a>";
} catch (Exception $e) {
    echo "<h1 style='color: red;'>❌ ERREUR</h1><p>" . $e->getMessage() . "</p>";
}
