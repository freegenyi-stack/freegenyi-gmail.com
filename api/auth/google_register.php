<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../includes/SocialAuthManager.php';

$role = $_GET['role'] ?? 'parent';
$_SESSION['pending_role'] = $role;

$auth = new SocialAuthManager();
header('Location: ' . $auth->getAuthUrl('register'));
exit;
?>
