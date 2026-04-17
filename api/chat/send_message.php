<?php
/**
 * api/chat/send_message.php - Envoyer un message et déclencher l'IA Geny Expert
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';
require_once __DIR__ . '/../../includes/activity.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

// Support pour FormData ET JSON
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
        jsonResponse(['error' => 'Interdit'], 403);
    }

    // 2. Insérer le message de l'utilisateur
    $message_id = DB::insert("
        INSERT INTO chat_messages (conversation_id, sender_id, message) 
        VALUES (?, ?, ?)
    ", [$conversation_id, $user_id, $message]);

    // 3. Détecter si c'est une conversation IA
    $conv = DB::fetchOne("SELECT type FROM conversations WHERE id = ?", [$conversation_id]);
    
    if ($conv && $conv['type'] === 'ai') {
        // --- LOGIQUE IA GÉNIE EXPERT RÉELLE (GEMINI) ---
        require_once __DIR__ . '/geny_ai.php';
        
        $ai_reply = GenyAI::getResponse($message);
        
        // Insérer la réponse réelle de l'IA
        DB::insert("
            INSERT INTO chat_messages (conversation_id, sender_id, message) 
            VALUES (?, ?, ?)
        ", [$conversation_id, 999, $ai_reply]); // ID 999 = Geny Expert
    }

    // 4. Log
    Activity::log('chat', 'Message envoyé', ['conv_id' => $conversation_id]);

    jsonResponse(['success' => true, 'message_id' => $message_id]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
