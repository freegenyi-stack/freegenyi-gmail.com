<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../includes/SocialAuthManager.php';

$auth = new SocialAuthManager();
$url = $auth->getAuthUrl('login');

// DEBUG VISUEL : On affiche l'URL au lieu de rediriger pour voir le client_id
echo "<h1>Diagnostic Connexion Google</h1>";
echo "<p>URL Générée : <br><code>" . htmlspecialchars($url) . "</code></p>";
echo "<hr>";
echo "<a href='$url' style='padding:10px 20px; background:orange; color:white; text-decoration:none; border-radius:10px;'>Tester le lien manuellement</a>";

// header('Location: ' . $url); // Temps de pause pour vérification
exit;
?>
