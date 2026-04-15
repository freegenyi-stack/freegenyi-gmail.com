<?php
/**
 * api/maintenance/git_fix.php - RÉPARATION AUTOMATIQUE GIT
 */
header('Content-Type: text/plain');

echo "--- RÉPARATION GIT FREEGENY ---\n\n";

$git = "/usr/local/cpanel/3rdparty/bin/git";

echo "1. Nettoyage des fichiers locaux conflictuels...\n";
$output1 = shell_exec("$git reset --hard HEAD 2>&1");
echo $output1 . "\n";

echo "2. Téléchargement des dernières corrections (Pull)...\n";
$output2 = shell_exec("$git pull 2>&1");
echo $output2 . "\n";

echo "\n--- TERMINÉ. TESTEZ VOTRE LIEN DE RÉINITIALISATION MAINTENANT ! ---";
