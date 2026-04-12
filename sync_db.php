<?php
/**
 * sync_db.php - ELITE SCHEMA SYNC
 * This script runs the schema.sql file to ensure all tables exist.
 */
require_once 'config/db.php';
global $pdo;

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Elite Sync | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    <style>body { font-family: 'DM Sans', sans-serif; } .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-xl bg-white rounded-[3rem] p-12 shadow-2xl text-center">
        <?php
        try {
            $sqlFile = __DIR__ . '/install/schema.sql';
            if (!file_exists($sqlFile)) {
                throw new Exception("Fichier schema.sql introuvable dans /install/");
            }

            $sql = file_get_contents($sqlFile);
            
            // On désactive les clés étrangères pour le sync
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            
            // Exécution du schéma (multi-requêtes)
            $pdo->exec($sql);
            
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

            echo '<div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl">🏗️</div>';
            echo '<h1 class="text-3xl font-black text-slate-900 mb-4 font-title">Synchronisation Réussie.</h1>';
            echo '<p class="text-slate-500 font-light mb-10">Toutes les tables (y compris child_rewards) ont été créées ou mises à jour.</p>';
            echo '<a href="/super_reset.php" class="inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl">Vider la base maintenant</a>';

        } catch (Exception $e) {
            echo '<div class="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl">❌</div>';
            echo '<h1 class="text-3xl font-black text-red-900 mb-4 font-title">Échec de Sync.</h1>';
            echo '<pre class="bg-red-50 p-6 rounded-2xl text-left text-xs text-red-700 overflow-x-auto">' . $e->getMessage() . '</pre>';
        }
        ?>
    </div>
</body>
</html>
