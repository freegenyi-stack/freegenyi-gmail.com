<?php
$client_id = "252196226558-3shiffsloocl5vvhn7etjvur3ooejm82.apps.googleusercontent.com";
$redirect_uri = "https://freegeny.com/api/auth/google_callback.php";

$params = [
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'access_type' => 'offline',
    'prompt' => 'select_account',
    'state' => 'login'
];

$url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

echo "<h1>Lien de Test Google</h1>";
echo "<a href='$url'>Cliquez ici pour tester la connexion Google en DIRECT</a>";
echo "<br><br>URL envoyée : <br><code>$url</code>";
?>
