<?php
require_once __DIR__ . '/../../includes/SocialAuthManager.php';
// Logique de redirection vers le portail Google
// Note : Les clés API devront être configurées dans config/app.php
header('Location: /index.php?error=google_auth_not_configured');
exit;
?>
