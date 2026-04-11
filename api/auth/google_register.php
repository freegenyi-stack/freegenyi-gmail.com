<?php
session_start();

// Simulateur Inscription Google
$role = $_GET['role'] ?? 'parent';

$_SESSION['logged_in'] = true;
$_SESSION['user_id'] = 999;
$_SESSION['user_name'] = 'Génie Google';
$_SESSION['user_role'] = $role;

header('Location: /dashboard/add_child.php');
exit;
?>
