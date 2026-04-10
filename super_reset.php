<?php
require_once 'config/db.php';
global $pdo;

header('Content-Type: text/html; charset=utf-8');
echo "<div style='font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);'>";

try {
    // 1. Vidage forcé
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE users;");
    $pdo->exec("TRUNCATE login_attempts;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    
    echo "<h1 style='color: #059669;'>✅ Nettoyage terminé !</h1>";
    
    // 2. Vérification immédiate
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $count = $stmt->fetchColumn();
    
    echo "<p style='padding: 15px; background: #f0fdf4; border-radius: 10px; color: #166534;'>Nombre d'utilisateurs en base : <strong>$count</strong></p>";
    
    if ($count == 0) {
        echo "<p>C'est parfait ! La base est totalement vide.</p>";
        echo "<p><strong>Vous pouvez maintenant retenter l'inscription.</strong></p>";
    } else {
        echo "<p style='color: #dc2626;'>🚨 Erreur : La base n'est pas vide malgré le nettoyage !</p>";
    }

    echo "<div style='margin-top: 30px;'>";
    echo "<a href='/DZ-fr/auth/register' style='background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;'>Tester l'inscription</a>";
    echo "</div>";

} catch (Exception $e) {
    echo "<h1 style='color: #dc2626;'>❌ Erreur critique</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}

echo "</div>";
