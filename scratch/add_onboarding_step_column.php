<?php
/**
 * scratch/add_onboarding_step_column.php - Database Migration
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

try {
    DB::execute("ALTER TABLE users ADD COLUMN onboarding_step INT DEFAULT 1");
    echo "<h1>CHAMP onboarding_step AJOUTÉ !</h1>";
    echo "<p>La synchronisation entre appareils est maintenant possible.</p>";
} catch (Exception $e) {
    echo "<h1>ERREUR OU DÉJÀ EXISTANT : " . $e->getMessage() . "</h1>";
}
