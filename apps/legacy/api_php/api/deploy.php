<?php
/**
 * 🚀 FreeGeny One-Click Deployer
 * Ce script force la synchronisation entre GitHub et votre cPanel
 */

// --- CONFIGURATION ---
$github_token = "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";
$repo_url = "https://$github_token@github.com/freegenyi-stack/freegenyi-gmail.com.git";
$target_dir = realpath(__DIR__ . "/../"); // Remonte d'un cran (vers public_html)

echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>FreeGeny Deployer</title>
    <style>
        body { font-family: monospace; background: #1a1a1a; color: #00ff00; padding: 20px; line-height: 1.5; }
        .header { border-bottom: 2px solid #00ff00; padding-bottom: 10px; margin-bottom: 20px; }
        .cmd { color: #fff; font-weight: bold; }
        .success { color: #00ff00; }
        .error { color: #ff5555; }
        .warning { color: #ffff55; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>🚀 FreeGeny - Synchronisation GitHub</h1>
        <p>Répertoire cible : $target_dir</p>
    </div>";

function run_command($cmd)
{
    echo "<span class='cmd'>> $cmd</span>\n";
    $output = [];
    $return_var = 0;
    exec($cmd . " 2>&1", $output, $return_var);
    foreach ($output as $line) {
        echo htmlspecialchars($line) . "\n";
    }
    return $return_var === 0;
}

// 0. Vérifier si Git est disponible
echo "<h3>1. Vérification du système</h3>";
if (!run_command("git --version")) {
    echo "<p class='error'>❌ Git n'est pas installé sur ce serveur.</p>";
    exit;
}

// 1. Initialiser Git si nécessaire
echo "<h3>2. Initialisation du dépôt</h3>";
chdir($target_dir);
if (!is_dir(".git")) {
    echo "<p class='warning'>⚠️ Dépôt non trouvé. Initialisation...</p>";
    run_command("git init");
}

// 2. Configurer le Remote Clean
echo "<h3>3. Configuration de GitHub</h3>";
run_command("git remote remove origin");
run_command("git remote add origin $repo_url");

// 3. Récupérer les fichiers (Force Pull)
echo "<h3>4. Synchronisation des fichiers</h3>";
echo "<p>Ceci va mettre à jour le site avec les dernières traductions...</p>";

// On utilise fetch + reset hard pour éviter les conflits
run_command("git fetch --all");
if (run_command("git reset --hard origin/master")) {
    echo "<p class='success'>✅ SYNCHRONISATION RÉUSSIE !</p>";
    echo "<p>Votre site est maintenant à jour avec GitHub.</p>";
} else {
    echo "<p class='error'>❌ Échec de la synchronisation.</p>";
    echo "<p class='warning'>Astuce : Si l'erreur est 'Access Denied', vérifiez si le token GitHub est toujours valide.</p>";
}

echo "<h3>5. Nettoyage</h3>";
if (file_exists("api/config.example.php") && !file_exists("api/config.php")) {
    echo "<p class='warning'>⚠️ Fichier config.php manquant. Création depuis le template...</p>";
    copy("api/config.example.php", "api/config.php");
}

echo "
    <hr>
    <p>🚀 **Action terminée.** Vérifiez votre site sur <a href='https://freegeny.com' style='color:#00ff00'>freegeny.com</a></p>
    <p class='warning'>⚠️ Pensez à supprimer ce fichier (api/deploy.php) après usage pour la sécurité.</p>
</body>
</html>";
?>