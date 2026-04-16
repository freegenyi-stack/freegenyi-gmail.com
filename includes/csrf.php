<?php
/**
 * includes/csrf.php - Protection contre les attaques CSRF
 */

class CSRF {
    
    /**
     * Génère un token CSRF unique s'il n'existe pas
     */
    public static function getToken() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Retourne l'input HTML caché à insérer dans les formulaires
     */
    public static function insertInput() {
        $token = self::getToken();
        echo '<input type="hidden" name="csrf_token" value="' . $token . '">';
    }

    /**
     * Vérifie si le token soumis est valide
     */
    public static function verify($token) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['csrf_token']) || empty($token)) {
            return false;
        }
        // Utilisation de hash_equals pour éviter les attaques temporelles (Timing attacks)
        return hash_equals($_SESSION['csrf_token'], $token);
    }
}
