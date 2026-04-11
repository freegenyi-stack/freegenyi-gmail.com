<?php
require_once __DIR__ . '/../../includes/SocialAuthManager.php';
// Récupération du rôle choisi (parent, school, ngo)
$role = $_GET['role'] ?? 'parent';

// Stockage du rôle en session pour le callback Google
session_start();
$_SESSION['pending_role'] = $role;

header('Location: /index.php?error=google_auth_not_configured');
exit;
?>
