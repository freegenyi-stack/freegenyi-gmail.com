<?php
/**
 * api/maintenance/migrate_wave2.php - Migration pour l'Historique et les Notifications (Vague 2)
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>🚀 Migration Vague 2 : Historique & Logs</h1>";
echo "<ul style='font-family: monospace;'>";

try {
    // 1. Table des logs d'activité
    DB::execute("CREATE TABLE IF NOT EXISTS activity_logs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        category VARCHAR(50) NOT NULL, -- 'exercise', 'course', 'search', 'login', etc.
        action VARCHAR(255) NOT NULL,
        metadata JSON NULL, -- Détails (ID du cours, terme de recherche, etc.)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<li>✅ Table <b>activity_logs</b> créée.</li>";

    // 2. S'assurer que les notifications existent
    DB::execute("CREATE TABLE IF NOT EXISTS notifications (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "<li>✅ Table <b>notifications</b> vérifiée.</li>";

    echo "</ul><h2 style='color: green;'>✓ MIGRATION VAGUE 2 RÉUSSIE !</h2>";

} catch (Exception $e) {
    echo "</ul><h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
