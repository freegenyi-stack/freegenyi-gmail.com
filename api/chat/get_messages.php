<?php
/**
 * api/chat/get_messages.php - Récupérer les messages d'une conversation
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

$conversation_id = (int)($_GET['conversation_id'] ?? 0);
$user_id = $_SESSION['user_id'];

if ($conversation_id === 0) {
    jsonResponse(['error' => 'Conversation invalide'], 400);
}

try {
    // 1. Vérifier l'appartenance
    $isMember = DB::fetchOne("SELECT id FROM conversation_members WHERE conversation_id = ? AND user_id = ?", [$conversation_id, $user_id]);
    if (!$isMember) jsonResponse(['error' => 'Accès refusé'], 403);

    // 2. Marquer comme lus
    DB::execute("UPDATE chat_messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?", [$conversation_id, $user_id]);

    // 3. Récupérer les 50 derniers messages
    $messages = DB::fetchAll("
        SELECT m.*, u.full_name as sender_name, u.profile_photo as sender_avatar
        FROM chat_messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
        LIMIT 100
    ", [$conversation_id]);

    jsonResponse(['messages' => $messages]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
