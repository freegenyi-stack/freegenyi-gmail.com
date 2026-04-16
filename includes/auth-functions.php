<?php
/**
 * includes/auth-functions.php - Logique Senior Authentification
 */

class Auth {
    public static function setRememberMe($user_id) { return false; }
    public static function checkRememberMe() { return; }
    public static function clearRememberMe($user_id) {
        setcookie('remember_me', '', time() - 3600, '/');
    }
}
