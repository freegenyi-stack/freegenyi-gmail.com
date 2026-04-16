<?php
/**
 * api/maintenance/git_reset.php - Force la mise à jour Git
 */
header('Content-Type: text/plain');

echo "--- RÉINITIALISATION GIT SENIOR ---\n";

// 1. On force l'abandon des modifs locales sur le serveur (Reset)
$output1 = [];
exec("git reset --hard HEAD 2>&1", $output1);
echo implode("\n", $output1) . "\n\n";

// 2. On tente le pull proprement
$output2 = [];
exec("git pull origin main 2>&1", $output2);
echo implode("\n", $output2) . "\n\n";

echo "Terminé. Essayez de rafraîchir votre site.\n";
