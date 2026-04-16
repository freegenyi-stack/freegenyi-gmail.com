<?php
/**
 * api/maintenance/init_families.php - Initialiser les IDs de famille pour le chat
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

echo "<h1>👨‍👩‍👧‍👦 Initialisation des Familles</h1>";

try {
    // 1. Trouver les parents liés par des enfants communs
    $links = DB::fetchAll("
        SELECT parent_id, COUNT(*) as children_count 
        FROM children 
        GROUP BY parent_id
    ");

    foreach ($links as $link) {
        $parent_id = $link['parent_id'];
        
        // Si le parent n'a pas encore de family_id
        $user = DB::fetchOne("SELECT family_id FROM users WHERE id = ?", [$parent_id]);
        
        if (!$user['family_id']) {
            $new_family_id = 'FAM-' . bin2hex(random_bytes(4));
            DB::execute("UPDATE users SET family_id = ? WHERE id = ?", [$new_family_id, $parent_id]);
            echo "<li>✅ Famille créée pour le parent ID $parent_id : <b>$new_family_id</b></li>";
        }
    }

    // 2. Lier les parents invités (système d'invitation)
    // Ici on devrait chercher dans la table invitations (si elle existe)
    // Pour l'instant on se base sur les enfants.

    echo "<h3>✓ Familles initialisées !</h3>";

} catch (Exception $e) {
    echo "<h3 style='color: red;'>❌ Erreur : " . $e->getMessage() . "</h3>";
}
