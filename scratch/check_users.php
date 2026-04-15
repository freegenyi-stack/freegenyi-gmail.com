<?php
require_once __DIR__ . '/../api/auth/auth_helpers.php';

$users = DB::fetchAll("SELECT id, email, full_name, created_at FROM users ORDER BY created_at DESC LIMIT 10");

echo "--- LISTE DES 10 DERNIERS UTILISATEURS ---\n";
if (empty($users)) {
    echo "AUCUN UTILISATEUR TROUVÉ EN BASE DE DONNÉES.\n";
} else {
    foreach ($users as $u) {
        echo "ID: {$u['id']} | Email: [{$u['email']}] | Nom: {$u['full_name']} | Créé le: {$u['created_at']}\n";
    }
}
echo "------------------------------------------\n";
