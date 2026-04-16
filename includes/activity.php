<?php
/**
 * includes/activity.php - Moteur de traçabilité FreeGeny Elite
 */

class Activity {
    
    /**
     * Enregistre une activité dans la base de données
     */
    public static function log($category, $action, $metadata = null) {
        if (!isset($_SESSION['user_id'])) return;

        try {
            DB::execute("
                INSERT INTO activity_logs (user_id, category, action, metadata) 
                VALUES (?, ?, ?, ?)
            ", [
                $_SESSION['user_id'],
                $category,
                $action,
                $metadata ? json_encode($metadata) : null
            ]);
        } catch (Throwable $e) {
            // Silencieux pour ne pas bloquer l'expérience utilisateur
        }
    }

    /**
     * Récupère l'historique récent de l'utilisateur
     */
    public static function getRecent($limit = 20) {
        if (!isset($_SESSION['user_id'])) return [];
        
        return DB::fetchAll("
            SELECT * FROM activity_logs 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        ", [$_SESSION['user_id'], $limit]);
    }
}
