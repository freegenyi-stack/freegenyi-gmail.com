<?php
session_start();

// Simulation de validation (En production, on vérifiera via la DB)
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!empty($email)) {
    $_SESSION['logged_in'] = true;
    $_SESSION['user_id'] = 1;
    $_SESSION['user_name'] = 'Parent Test';
    $_SESSION['user_role'] = 'parent';
    
    // Direction le Cockpit !
    header('Location: /dashboard/parent.php');
} else {
    header('Location: /auth/login.php?error=empty_fields');
}
exit;
?>
