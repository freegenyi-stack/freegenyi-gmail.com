<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../includes/SocialAuthManager.php';

$auth = new SocialAuthManager();
header('Location: ' . $auth->getAuthUrl('login'));
exit;
?>
