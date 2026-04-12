<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/config/app.php';

try {
    DB::execute('SET FOREIGN_KEY_CHECKS = 0');
    // On ignore silencieusement si les tables secondaires n'existent pas encore
    try { DB::execute('TRUNCATE TABLE children'); } catch(Exception $e) {}
    try { DB::execute('TRUNCATE TABLE parental_controls'); } catch(Exception $e) {}
    try { DB::execute('TRUNCATE TABLE notifications'); } catch(Exception $e) {}
    
    // Mais on veut vider Users
    DB::execute('TRUNCATE TABLE users');
    DB::execute('SET FOREIGN_KEY_CHECKS = 1');
    echo "<div style='padding:20px; font-family:sans-serif; background:#10b981; color:white;'><h1>✅ Base nettoyée avec succès</h1><p>Tous les utilisateurs, enfants et notifications ont été supprimés.</p></div>";
} catch (Exception $e) {
    echo "<div style='padding:20px; font-family:sans-serif; background:#ef4444; color:white;'><h1>❌ Erreur fatale</h1><p>" . $e->getMessage() . "</p></div>";
}
?>
