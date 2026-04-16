<?php
/**
 * includes/auth-functions.php - Logique Senior Authentification
 */

class Auth {

    /**
     * Gère le système "Se souvenir de moi"
     */
    public static function setRememberMe($user_id) {
        $selector = bin2hex(random_bytes(8));
        $validator = random_bytes(32);
        $token_hash = hash('sha256', $validator);
        $expires = date('Y-m-d H:i:s', strtotime('+30 days'));

        // Enregistrement en base
        DB::execute("
            INSERT INTO remember_tokens (user_id, selector, token_hash, expires_at) 
            VALUES (?, ?, ?, ?)
        ", [$user_id, $selector, $token_hash, $expires]);

        // Création du cookie (Selector:Validator)
        $cookieValue = $selector . ':' . bin2hex($validator);
        setcookie('remember_me', $cookieValue, time() + (86400 * 30), "/", "", true, true);
    }

    /**
     * Vérifie et restaure une session via le cookie Remember Me
     */
    public static function checkRememberMe() {
        if (!empty($_SESSION['logged_in'])) return;
        if (empty($_COOKIE['remember_me'])) return;

        $parts = explode(':', $_COOKIE['remember_me']);
        if (count($parts) !== 2) return;

        $selector = $parts[0];
        $validator = hex2bin($parts[1]);

        $token = DB::fetchOne("
            SELECT * FROM remember_tokens 
            WHERE selector = ? AND expires_at > NOW() 
            LIMIT 1
        ", [$selector]);

        if ($token && hash_equals($token['token_hash'], hash('sha256', $validator))) {
            // Token valide ! On restaure l'utilisateur
            $user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$token['user_id']]);
            if ($user) {
                $_SESSION['logged_in'] = true;
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['full_name'];
                $_SESSION['user_role'] = $user['role'];
                // Régénérer le token pour éviter le vol de session (Sécurité Senior)
                self::setRememberMe($user['id']);
            }
        }
    }

    /**
     * Supprime les tokens remember me
     */
    public static function clearRememberMe($user_id) {
        DB::execute("DELETE FROM remember_tokens WHERE user_id = ?", [$user_id]);
        setcookie('remember_me', '', time() - 3600, "/");
    }
}
