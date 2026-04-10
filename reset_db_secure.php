<?php
require_once 'config/db.php';
global $pdo;

try {
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE users;");
    $pdo->exec("TRUNCATE login_attempts;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    
    echo "<div style='font-family: sans-serif; padding: 40px; text-align: center;'>";
    echo "<h1 style='color: #059669;'>✅ Base de données réinitialisée !</h1>";
    echo "<p>Toutes les tables d'utilisateurs ont été vidées proprement.</p>";
    echo "<a href='/DZ-fr/auth/register' style='background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;'>Retour à l'inscription</a>";
    echo "</div>";
} catch (Exception $e) {
    die("Erreur lors du nettoyage : " . $e->getMessage());
}
