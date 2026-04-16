<?php
/**
 * includes/rate-limiter.php - Limitation du débit par IP (Anti-Brute Force)
 */

class RateLimiter {

    /**
     * Vérifie si une IP a dépassé la limite pour un endpoint donné
     * @param string $endpoint Nom de l'action (ex: 'login', 'register')
     * @param int $maxAttempts Nombre d'essais max
     * @param int $seconds Fenêtre de temps en secondes
     */
    public static function check($endpoint, $maxAttempts = 5, $seconds = 60) {
        $ip = self::getIP();
        
        // Initialisation silencieuse de la table si nécessaire
        // Note: Dans un système pro, on ferait ça via une migration, 
        // mais ici on assure la robustesse.
        
        $data = DB::fetchOne("
            SELECT id, last_request_at, request_count 
            FROM api_rate_limits 
            WHERE ip_address = ? AND endpoint = ? 
            LIMIT 1
        ", [$ip, $endpoint]);

        if (!$data) {
            DB::execute("
                INSERT INTO api_rate_limits (ip_address, endpoint, last_request_at, request_count) 
                VALUES (?, ?, CURRENT_TIMESTAMP, 1)
            ", [$ip, $endpoint]);
            return true;
        }

        $lastRequest = strtotime($data['last_request_at']);
        $now = time();

        if (($now - $lastRequest) > $seconds) {
            // La fenêtre est passée, on reset
            DB::execute("
                UPDATE api_rate_limits 
                SET request_count = 1, last_request_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            ", [$data['id']]);
            return true;
        }

        if ($data['request_count'] >= $maxAttempts) {
            return false;
        }

        // On incrémente
        DB::execute("
            UPDATE api_rate_limits 
            SET request_count = request_count + 1 
            WHERE id = ?
        ", [$data['id']]);
        
        return true;
    }

    private static function getIP() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        return $_SERVER['REMOTE_ADDR'] ?: '0.0.0.0';
    }
}
