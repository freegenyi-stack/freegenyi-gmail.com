<?php
/**
 * includes/rate-limiter.php - Protection anti-brute force (Zéro-Crash)
 */

class RateLimiter {
    
    public static function check($endpoint, $maxAttempts = 5, $seconds = 60) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        
        try {
            // On vérifie si la table existe avant de faire quoi que ce soit
            $data = DB::fetchOne("
                SELECT id, last_request_at, request_count 
                FROM api_rate_limits 
                WHERE ip_address = ? AND endpoint = ? 
                LIMIT 1
            ", [$ip, $endpoint]);

            if (!$data) {
                DB::execute("
                    INSERT INTO api_rate_limits (ip_address, endpoint, request_count) 
                    VALUES (?, ?, 1)
                ", [$ip, $endpoint]);
                return true;
            }

            $lastRequest = strtotime($data['last_request_at']);
            $now = time();

            if (($now - $lastRequest) > $seconds) {
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

            DB::execute("
                UPDATE api_rate_limits 
                SET request_count = request_count + 1 
                WHERE id = ?
            ", [$data['id']]);

            return true;
            
        } catch (Throwable $e) {
            // En cas d'erreur DB (table manquante, etc.), on autorise l'accès.
            // La sécurité est secondaire par rapport à la disponibilité du site.
            return true;
        }
    }
}
