<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../../includes/SocialAuthManager.php';

$code = $_GET['code'] ?? null;
$state = $_GET['state'] ?? 'login';

if (!$code) {
    header('Location: /index.php?error=no_code');
    exit;
}

$auth = new SocialAuthManager();
$userInfo = $auth->handleCallback($code);

if ($userInfo) {
    // Succès ! On définit la session active
    $_SESSION['logged_in'] = true;
    $_SESSION['user_email'] = $userInfo['email'];
    $_SESSION['user_name'] = $userInfo['name'];
    $_SESSION['user_avatar'] = $userInfo['picture'];
    
    // Si c'était une inscription, on récupère le rôle stocké
    if ($state === 'register') {
        $_SESSION['user_role'] = $_SESSION['pending_role'] ?? 'parent';
        header('Location: /dashboard/add_child.php');
    } else {
        $_SESSION['user_role'] = 'parent'; // Par défaut
        header('Location: /dashboard/parent.php');
    }
} else {
    header('Location: /index.php?error=auth_failed');
}
exit;
?>
