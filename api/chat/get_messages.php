<?php
/**
 * api/chat/get_messages.php - Récupérer les messages avec statut de lecture
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

    // 2. Ajouter colonne message_status si elle n'existe pas
    $col = DB::fetchAll("SHOW COLUMNS FROM chat_messages LIKE 'message_status'");
    if (empty($col)) {
        DB::execute("ALTER TABLE chat_messages ADD message_status ENUM('sent','delivered','read') DEFAULT 'sent' AFTER is_read");
    }

    // 3. Marquer comme lus (status = read) les messages des autres
    DB::execute("UPDATE chat_messages SET is_read = 1, message_status = 'read' WHERE conversation_id = ? AND sender_id != ?", [$conversation_id, $user_id]);
    
    // 4. Marquer comme livrés les messages de l'utilisateur non encore lus par l'autre
    DB::execute("UPDATE chat_messages SET message_status = 'delivered' WHERE conversation_id = ? AND sender_id = ? AND message_status = 'sent'", [$conversation_id, $user_id]);

    // 5. Récupérer les 100 derniers messages
    $messages = DB::fetchAll("
        SELECT m.*, u.full_name as sender_name
        FROM chat_messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
        LIMIT 100
    ", [$conversation_id]);

    jsonResponse(['messages' => $messages ?: []]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
