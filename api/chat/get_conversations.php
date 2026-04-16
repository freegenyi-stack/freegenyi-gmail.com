<?php
/**
 * api/chat/get_conversations.php - Récupérer les discussions de l'utilisateur
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

$user_id = $_SESSION['user_id'];
$family_id = DB::fetchOne("SELECT family_id FROM users WHERE id = ?", [$user_id])['family_id'] ?? null;

try {
    // 1. Lister les conversations directes (via membership)
    $conversations = DB::fetchAll("
        SELECT conv.*, 
               (SELECT message FROM chat_messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM chat_messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
               (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = conv.id AND is_read = 0 AND sender_id != ?) as unread_count
        FROM conversations conv
        JOIN conversation_members mem ON conv.id = mem.conversation_id
        WHERE mem.user_id = ?
        ORDER BY last_message_at DESC
    ", [$user_id, $user_id]);

    // 2. Si l'utilisateur a une famille mais pas encore de conversation de famille, on peut la suggérer ou l'auto-créer.
    // Pour l'instant, on renvoie simplement la liste.

    jsonResponse(['conversations' => $conversations]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
