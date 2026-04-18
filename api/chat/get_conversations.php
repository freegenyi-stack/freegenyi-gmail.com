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
$user_row = DB::fetchOne("SELECT family_id FROM users WHERE id = ?", [$user_id]);
$family_id = $user_row ? $user_row['family_id'] : null;

try {
    // 2. Vérifier/créer la conversation avec Geny Expert (ID 999)
    $geny_conv = DB::fetchOne("
        SELECT c.id FROM conversations c
        JOIN conversation_members m ON c.id = m.conversation_id
        WHERE c.type = 'ai' AND m.user_id = ?
    ", [$user_id]);

    if (!$geny_conv) {
        $conv_id = DB::insert("INSERT INTO conversations (type) VALUES ('ai')");
        DB::execute("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)", [$conv_id, $user_id]);
        DB::execute("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, 999)", [$conv_id]);
    }

    // 3. Lister les conversations existantes
    $conversations = DB::fetchAll("
        SELECT conv.*, 
               (SELECT message FROM chat_messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM chat_messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
               (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = conv.id AND is_read = 0 AND sender_id != ?) as unread_count,
               (SELECT is_online FROM users u 
                JOIN conversation_members m ON u.id = m.user_id 
                WHERE m.conversation_id = conv.id AND u.id != ? LIMIT 1) as is_online
        FROM conversations conv
        JOIN conversation_members mem ON conv.id = mem.conversation_id
        WHERE mem.user_id = ?
        ORDER BY last_message_at DESC
    ", [$user_id, $user_id, $user_id]);

    foreach ($conversations as &$conv) {
        if ($conv['type'] === 'ai') {
            $conv['name'] = "Geny Expert 🤖";
        } else {
            $other = DB::fetchOne("
                SELECT u.full_name, u.role FROM users u
                JOIN conversation_members m ON u.id = m.user_id
                WHERE m.conversation_id = ? AND u.id != ? LIMIT 1
            ", [$conv['id'], $user_id]);
            
            $conv['name'] = $other ? $other['full_name'] : "Ma Famille";
            $conv['role'] = $other ? $other['role'] : "";
        }
    }

    // 4. Si on demande les contacts : Ajouter les membres de la famille avec qui on n'a pas de discussion
    if (isset($_GET['type']) && $_GET['type'] === 'contacts') {
        $family_members = DB::fetchAll("
            SELECT id, full_name, role, is_online FROM users 
            WHERE family_id = ? AND id != ?
        ", [$family_id, $user_id]);

        $contacts = [];
        foreach ($family_members as $mem) {
            // Chercher une discussion existante (directe) entre les deux
            $existing = DB::fetchOne("
                SELECT c.id FROM conversations c
                JOIN conversation_members m1 ON c.id = m1.conversation_id
                JOIN conversation_members m2 ON c.id = m2.conversation_id
                WHERE c.type = 'direct' AND m1.user_id = ? AND m2.user_id = ?
            ", [$user_id, $mem['id']]);

            if (!$existing) {
                $contacts[] = [
                    'id' => 'new_' . $mem['id'], // ID virtuel pour déclencher la création
                    'user_id' => $mem['id'],
                    'name' => $mem['full_name'],
                    'role' => $mem['role'],
                    'is_online' => $mem['is_online'],
                    'type' => 'contact_only'
                ];
            }
        }
        // Pour simplifier, on renvoie tout le monde comme des "contacts" potentiels
        jsonResponse(array_merge($conversations, $contacts));
    }

    jsonResponse($conversations);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
