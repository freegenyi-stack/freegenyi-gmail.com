<?php
/**
 * api/maintenance/migrate_wave1.php - Migration pour le Cockpit Avatar (Vague 1)
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>🚀 Migration Vague 1 : Cockpit Avatar</h1>";
echo "<ul style='font-family: monospace;'>";

try {
    $cols = [
        'profile_completion_pct' => "INT DEFAULT 0 AFTER role",
        'avatar_config' => "JSON NULL AFTER profile_completion_pct",
        'theme_settings' => "JSON NULL AFTER avatar_config",
        'is_online' => "TINYINT(1) DEFAULT 1 AFTER last_login_at"
    ];

    foreach ($cols as $col => $def) {
        $check = DB::fetchOne("SHOW COLUMNS FROM users LIKE '$col'");
        if (!$check) {
            DB::execute("ALTER TABLE users ADD COLUMN $col $def");
            echo "<li>✅ Colonne <b>$col</b> ajoutée.</li>";
        } else {
            echo "<li>ℹ️ Colonne <b>$col</b> déjà présente.</li>";
        }
    }

    echo "</ul><h2 style='color: green;'>✓ BASE DE DONNÉES PRÊTE !</h2>";
    echo "<p>Rendez-vous sur <a href='/'>l'accueil</a> pour voir les changements (une fois le code mis à jour).</p>";

} catch (Exception $e) {
    echo "</ul><h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
