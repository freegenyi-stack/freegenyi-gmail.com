<?php
/**
 * api/maintenance/test_notification.php - Envoyer une notification de test
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

if (!isset($_SESSION['user_id'])) die("Non connecté.");

$user_id = $_SESSION['user_id'];

try {
    DB::execute("
        INSERT INTO notifications (user_id, type, title, message) 
        VALUES (?, 'info', 'Bienvenue sur la Vague 2 ! 🚀', 'Votre système de notifications et d\'historique est désormais actif.')
    ", [$user_id]);
    
    echo "✅ Notification envoyée !";
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
