<?php
/**
 * api/chat/send_message.php - Envoyer un message en temps réel
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

$input = json_decode(file_get_contents('php://input'), true);
$conversation_id = (int)($input['conversation_id'] ?? 0);
$message = trim($input['message'] ?? '');
$user_id = $_SESSION['user_id'];

if (empty($message) || $conversation_id === 0) {
    jsonResponse(['error' => 'Message ou conversation invalide'], 400);
}

try {
    // 1. Vérifier que l'utilisateur est membre de la conversation
    $isMember = DB::fetchOne("SELECT id FROM conversation_members WHERE conversation_id = ? AND user_id = ?", [$conversation_id, $user_id]);
    
    if (!$isMember) {
        jsonResponse(['error' => 'Vous ne faites pas partie de cette discussion'], 403);
    }

    // 2. Insérer le message
    $message_id = DB::insert("
        INSERT INTO chat_messages (conversation_id, sender_id, message) 
        VALUES (?, ?, ?)
    ", [$conversation_id, $user_id, $message]);

    // 3. Log d'activité
    Activity::log('chat', 'Message envoyé', ['conv_id' => $conversation_id]);

    jsonResponse([
        'success' => true, 
        'message_id' => $message_id,
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
