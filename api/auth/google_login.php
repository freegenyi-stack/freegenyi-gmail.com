<?php
session_start();

// Simulateur Google Auth (Phase de Développement)
// Dès que vous aurez vos clés, nous intégrerons la vraie bibliothèque Google.
$_SESSION['logged_in'] = true;
$_SESSION['user_id'] = 99;
$_SESSION['user_name'] = 'Génie Google';
$_SESSION['user_role'] = 'parent';

header('Location: /dashboard/parent.php');
exit;
?>
