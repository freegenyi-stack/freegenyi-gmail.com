<?php
/**
 * api/chat/send_message.php - Envoyer un message
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

// Support JSON et FormData
$conversation_id = (int)($_POST['conversation_id'] ?? 0);
$message = trim($_POST['message'] ?? '');

if (!$conversation_id || !$message) {
    $input = json_decode(file_get_contents('php://input'), true);
    $conversation_id = (int)($input['conversation_id'] ?? 0);
    $message = trim($input['message'] ?? '');
}

$user_id = $_SESSION['user_id'];

if (empty($message) || $conversation_id === 0) {
    jsonResponse(['error' => 'Message ou conversation invalide'], 400);
}

try {
    // 1. Vérifier que l'utilisateur est membre
    $isMember = DB::fetchOne("SELECT id FROM conversation_members WHERE conversation_id = ? AND user_id = ?", [$conversation_id, $user_id]);
    if (!$isMember) {
        jsonResponse(['error' => 'Interdit - vous n\'êtes pas membre de cette conversation'], 403);
    }

    // 2. Auto-add message_status column if missing
    $col = DB::fetchAll("SHOW COLUMNS FROM chat_messages LIKE 'message_status'");
    if (empty($col)) {
        DB::execute("ALTER TABLE chat_messages ADD message_status ENUM('sent','delivered','read') DEFAULT 'sent' AFTER is_read");
    }

    // 3. Insérer le message
    $message_id = DB::insert("
        INSERT INTO chat_messages (conversation_id, sender_id, message, message_status) 
        VALUES (?, ?, ?, 'sent')
    ", [$conversation_id, $user_id, $message]);

    if (!$message_id) {
        jsonResponse(['error' => 'Impossible d\'insérer le message en base'], 500);
    }

    // 4. Détecter si conversation IA → déclencher Geny
    $conv = DB::fetchOne("SELECT type FROM conversations WHERE id = ?", [$conversation_id]);
    
    if ($conv && $conv['type'] === 'ai') {
        require_once __DIR__ . '/geny_ai.php';
        $ai_reply = GenyAI::getResponse($message);
        DB::insert("
            INSERT INTO chat_messages (conversation_id, sender_id, message, message_status) 
            VALUES (?, 999, ?, 'read')
        ", [$conversation_id, $ai_reply]);
    }

    jsonResponse(['success' => true, 'message_id' => $message_id]);

} catch (Exception $e) {
    error_log("send_message.php error: " . $e->getMessage());
    jsonResponse(['error' => $e->getMessage()], 500);
}
