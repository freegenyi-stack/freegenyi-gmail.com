<?php
require_once __DIR__ . '/../../config/app.php';

if (($_GET['pw'] ?? '') !== MAINTENANCE_PASSWORD) {
    die("Accès refusé.");
}

try {
    echo "<h1>Migration de la base de données...</h1><ul>";

    $cols = [
        "role" => "VARCHAR(20) DEFAULT 'parent'",
        "is_online" => "TINYINT(1) DEFAULT 0",
        "last_login_at" => "TIMESTAMP NULL",
        "onboarding_step" => "INT DEFAULT 1",
        "family_id" => "INT UNSIGNED NULL",
        "profile_completion_pct" => "INT DEFAULT 0",
        "declared_country" => "VARCHAR(5) DEFAULT 'DZ'",
        "verification_token" => "VARCHAR(100) NULL",
        "verification_token_expires_at" => "DATETIME NULL",
        "oauth_provider" => "VARCHAR(50) NULL",
        "social_id" => "VARCHAR(255) NULL"
    ];

    foreach ($cols as $col => $definition) {
        try {
            $exists = DB::fetchAll("SHOW COLUMNS FROM users LIKE '$col'");
            if (empty($exists)) {
                DB::execute("ALTER TABLE users ADD $col $definition");
                echo "<li>✅ Colonne <b>$col</b> ajoutée.</li>";
            } else {
                echo "<li>ℹ️ Colonne <b>$col</b> déjà présente.</li>";
            }
        } catch (Exception $e) {
            echo "<li>❌ Erreur sur $col : " . $e->getMessage() . "</li>";
        }
    }

    // 2. Table INVITATIONS
    $inv_cols = [
        "invited_email" => "VARCHAR(150) NOT NULL",
        "status" => "VARCHAR(20) DEFAULT 'pending'"
    ];
    foreach ($inv_cols as $col => $definition) {
        $exists = DB::fetchAll("SHOW COLUMNS FROM invitations LIKE '$col'");
        if (empty($exists)) {
            DB::execute("ALTER TABLE invitations ADD $col $definition");
            echo "<li>✅ Colonne <b>$col</b> ajoutée à <b>invitations</b>.</li>";
        }
    }

    echo "</ul><p style='color:green;'>Migration terminée avec succès !</p>";
} catch (Exception $e) {
    echo "<p style='color:red;'>Erreur lors de la migration : " . $e->getMessage() . "</p>";
}
