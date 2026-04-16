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

    // 1. Si l'utilisateur a un family_id, vérifier/créer la conversation de famille
    if ($family_id) {
        $fam_conv = DB::fetchOne("SELECT id FROM conversations WHERE family_id = ? AND type = 'family'", [$family_id]);
        if (!$fam_conv) {
            $conv_id = DB::insert("INSERT INTO conversations (family_id, type) VALUES (?, 'family')", [$family_id]);
            // Ajouter l'utilisateur actuel comme membre
            DB::execute("INSERT IGNORE INTO conversation_members (conversation_id, user_id) VALUES (?, ?)", [$conv_id, $user_id]);
        } else {
            // S'assurer qu'il est membre
            DB::execute("INSERT IGNORE INTO conversation_members (conversation_id, user_id) VALUES (?, ?)", [$fam_conv['id'], $user_id]);
        }
    }

    // 2. Lister les conversations avec le statut des autres membres (pour le point vert)
    $conversations = DB::fetchAll("
        SELECT conv.*, 
               (SELECT message FROM chat_messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM chat_messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
               (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = conv.id AND is_read = 0 AND sender_id != ?) as unread_count,
               -- Statut en ligne du dernier autre membre actif (pour démo)
               (SELECT is_online FROM users u 
                JOIN conversation_members m ON u.id = m.user_id 
                WHERE m.conversation_id = conv.id AND u.id != ? LIMIT 1) as is_online
        FROM conversations conv
        JOIN conversation_members mem ON conv.id = mem.conversation_id
        WHERE mem.user_id = ?
        ORDER BY last_message_at DESC
    ", [$user_id, $user_id, $user_id]);

    jsonResponse(['conversations' => $conversations]);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
