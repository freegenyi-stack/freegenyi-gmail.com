<?php
session_start();
// Traitement de l'inscription
$full_name = $_POST['full_name'] ?? '';
$email = $_POST['email'] ?? '';
$role = $_POST['role'] ?? 'parent';

// Simulation de succès et redirection vers l'ajout d'enfant
header('Location: /dashboard/add_child.php');
exit;
?>
