<?php
/**
 * force_fix.php - RÉPARATION MANUELLE DE LA BASE
 */
require_once __DIR__ . '/config/db.php';

try {
    echo "<h1>Réparation de la structure...</h1>";

    // Ajouter first_name si elle n'existe pas
    DB::execute("ALTER TABLE children ADD COLUMN IF NOT EXISTS first_name VARCHAR(100) AFTER parent_id");
    echo "✅ Colonne first_name ajoutée.<br>";

    // Ajouter family_id aux users si manquant
    DB::execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS family_id INT UNSIGNED AFTER role");
    echo "✅ Colonne family_id ajoutée.<br>";

    // S'assurer que les tables de chat sont là
    DB::execute("CREATE TABLE IF NOT EXISTS conversations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, type VARCHAR(20), family_id INT UNSIGNED, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    DB::execute("CREATE TABLE IF NOT EXISTS conversation_members (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, user_id INT UNSIGNED)");
    DB::execute("CREATE TABLE IF NOT EXISTS chat_messages (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, sender_id INT UNSIGNED, message TEXT, is_read TINYINT(1) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    echo "✅ Tables de Chat vérifiées.<br>";

    echo "<h2>RÉPARÉ !</h2>";
    echo "<p>Retournez sur l'Onboarding, tout va fonctionner.</p>";

} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
