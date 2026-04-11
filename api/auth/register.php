<?php
session_start();

// Simulation d'inscription réussie
$full_name = $_POST['full_name'] ?? 'Nouveau Parent';
$role = $_POST['role'] ?? 'parent';

$_SESSION['logged_in'] = true;
$_SESSION['user_id'] = rand(100, 999);
$_SESSION['user_name'] = $full_name;
$_SESSION['user_role'] = $role;

// On dirige vers le magic wizard d'ajout d'enfant
header('Location: /dashboard/add_child.php');
exit;
?>
