<?php
/**
 * rescue.php - SCRIPT DE SAUVETAGE SANS DÉPENDANCES
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🛠️ Opération Sauvetage FreeGeny</h1>";

$git = "/usr/local/cpanel/3rdparty/bin/git";

echo "<pre>";
echo "Étape 1 : Restauration de config/app.php...\n";
system("$git checkout config/app.php 2>&1");

echo "\nÉtape 2 : Pull final...\n";
system("$git pull 2>&1");
echo "</pre>";

echo "<h2 style='color:green;'>✅ Opération terminée. Vérifiez votre site !</h2>";
echo "<p>Vous pouvez maintenant supprimer ce fichier rescue.php par sécurité.</p>";
