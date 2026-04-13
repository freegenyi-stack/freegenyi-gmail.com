<?php
/**
 * scratch/add_school_column.php - Database Migration to add school_name column
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

try {
    DB::execute("ALTER TABLE children ADD COLUMN school_name VARCHAR(255) DEFAULT NULL AFTER grade");
    echo "<h1>CHAMP ÉCOLE AJOUTÉ AVEC SUCCÈS !</h1>";
    echo "<p>Vous pouvez maintenant valider l'onboarding sans erreur.</p>";
    echo "<a href='/DZ-fr/dashboard/onboarding'>Retourner à l'inscription</a>";
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "<h1>LE CHAMP EXISTE DÉJÀ.</h1>";
    } else {
        echo "<h1>ERREUR : " . $e->getMessage() . "</h1>";
    }
}
