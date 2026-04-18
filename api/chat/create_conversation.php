<?php
/**
 * api/chat/create_conversation.php - Créer une discussion directe entre deux membres
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

$input = json_decode(file_get_contents('php://input'), true);
$target_user_id = (int)($input['target_user_id'] ?? 0);
$user_id = $_SESSION['user_id'];

if ($target_user_id === 0 || $target_user_id === $user_id) {
    jsonResponse(['error' => 'Cible invalide'], 400);
}

try {
    // 1. Vérifier si une discussion existe déjà
    $existing = DB::fetchOne("
        SELECT c.id FROM conversations c
        JOIN conversation_members m1 ON c.id = m1.conversation_id
        JOIN conversation_members m2 ON c.id = m2.conversation_id
        WHERE c.type = 'direct' AND m1.user_id = ? AND m2.user_id = ?
    ", [$user_id, $target_user_id]);

    if ($existing) {
        jsonResponse(['id' => $existing['id']]);
    }

    // 2. Créer la conversation
    $conv_id = DB::insert("INSERT INTO conversations (type) VALUES ('direct')");
    
    // 3. Ajouter les membres
    DB::execute("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)", [$conv_id, $user_id]);
    DB::execute("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)", [$conv_id, $target_user_id]);

    jsonResponse(['id' => $conv_id]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
