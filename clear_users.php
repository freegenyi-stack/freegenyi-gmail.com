<?php
require_once __DIR__ . '/config/db.php';
try {
    DB::execute('SET FOREIGN_KEY_CHECKS = 0');
    DB::execute('TRUNCATE TABLE children');
    DB::execute('TRUNCATE TABLE parental_controls');
    DB::execute('TRUNCATE TABLE notifications');
    DB::execute('TRUNCATE TABLE users');
    DB::execute('SET FOREIGN_KEY_CHECKS = 1');
    echo "Base de données nettoyée avec succès.\n";
} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
?>
