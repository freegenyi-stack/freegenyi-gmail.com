<?php
require_once 'config/db.php';
global $pdo;

header('Content-Type: text/html; charset=utf-8');
echo "<div style='font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 20px;'>";

try {
    // Désactiver les clés pour pouvoir modifier
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    
    // 1. Convertir la table users en UNSIGNED (Crucial pour les Foreign Keys)
    $pdo->exec("ALTER TABLE users MODIFY id INT UNSIGNED AUTO_INCREMENT;");
    
    // 2. Supprimer les tables dépendantes pour les recréer proprement
    $pdo->exec("DROP TABLE IF EXISTS parental_controls;");
    $pdo->exec("DROP TABLE IF EXISTS notifications;");
    $pdo->exec("DROP TABLE IF EXISTS children;");
    
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    echo "<h1 style='color: #059669;'>✅ Schéma SQL Réparé !</h1>";
    echo "<p>La table <strong>users</strong> a été convertie en UNSIGNED et les tables de suivi ont été réinitialisées.</p>";
    echo "<p>Veuillez rafraîchir votre <strong>Dashboard</strong> pour qu'il recrée les tables automatiquement avec le bon format.</p>";
    echo "<a href='/DZ-fr/dashboard/parent' style='display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;'>Retour au Dashboard</a>";

} catch (Exception $e) {
    echo "<h1 style='color: #dc2626;'>❌ Erreur critique</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
echo "</div>";
