<?php
session_start();
// Traitement de la connexion par e-mail
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Simulation de redirection vers le dashboard
header('Location: /dashboard/parent.php');
exit;
?>
