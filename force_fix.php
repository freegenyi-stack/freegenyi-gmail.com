<?php
/**
 * force_fix.php - RÉPARATION UNIVERSELLE
 */
require_once __DIR__ . '/config/db.php';

try {
    echo "<h1>Réparation en cours...</h1>";

    // 1. Essayer d'ajouter first_name proprement
    try {
        DB::execute("ALTER TABLE children ADD COLUMN first_name VARCHAR(100) AFTER parent_id");
        echo "✅ Colonne first_name ajoutée.<br>";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "ℹ️ La colonne first_name existe déjà.<br>";
        } else {
            throw $e;
        }
    }

    // 2. Essayer d'ajouter family_id aux users
    try {
        DB::execute("ALTER TABLE users ADD COLUMN family_id INT UNSIGNED AFTER role");
        echo "✅ Colonne family_id ajoutée.<br>";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "ℹ️ La colonne family_id existe déjà.<br>";
        } else {
            throw $e;
        }
    }

    // 3. Recréer les tables de chat (IF NOT EXISTS est standard pour CREATE)
    DB::execute("CREATE TABLE IF NOT EXISTS conversations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, type VARCHAR(20), family_id INT UNSIGNED, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    DB::execute("CREATE TABLE IF NOT EXISTS conversation_members (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, user_id INT UNSIGNED)");
    DB::execute("CREATE TABLE IF NOT EXISTS chat_messages (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id INT UNSIGNED, sender_id INT UNSIGNED, message TEXT, is_read TINYINT(1) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    echo "✅ Tables de Chat prêtes.<br>";

    echo "<h2>RÉPARÉ TOTALEMENT !</h2>";
    echo "<p>Vous pouvez maintenant fermer cette page et continuer.</p>";

} catch (Exception $e) {
    echo "❌ Erreur Critique : " . $e->getMessage();
}
