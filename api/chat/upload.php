<?php
/**
 * api/chat/upload.php - Moteur d'Upload Multimédia (Vague 5)
 */
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';

initSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé'], 401);
}

// 1. Vérifications de base
if (!isset($_FILES['file'])) {
    jsonResponse(['error' => 'Aucun fichier reçu'], 400);
}

$file = $_FILES['file'];
$conversation_id = (int)($_POST['conversation_id'] ?? 0);
$type = $_POST['type'] ?? 'file'; // image, audio, file
$user_id = $_SESSION['user_id'];

if ($conversation_id === 0) jsonResponse(['error' => 'Conversation manquante'], 400);

// 2. Dossier de destination
$uploadDir = __DIR__ . '/../../uploads/chat/' . $conversation_id . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 3. Sécurisation du nom de fichier
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeName = bin2hex(random_bytes(8)) . '.' . $extension;
$targetPath = $uploadDir . $safeName;
$publicPath = '/uploads/chat/' . $conversation_id . '/' . $safeName;

// 4. Validation des types
$allowedImages = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$allowedAudio = ['mp3', 'wav', 'ogg', 'webm', 'm4a'];

if ($type === 'image' && !in_array(strtolower($extension), $allowedImages)) {
    jsonResponse(['error' => 'Format image non supporté'], 400);
}

// 5. Déplacement et insertion en base
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    try {
        // Auto-add message_type and media_path if missing
        $cols = DB::fetchAll("SHOW COLUMNS FROM chat_messages");
        $colNames = array_column($cols, 'Field');
        if (!in_array('message_type', $colNames)) {
            DB::execute("ALTER TABLE chat_messages ADD message_type VARCHAR(20) DEFAULT 'text' AFTER message");
        }
        if (!in_array('media_path', $colNames)) {
            DB::execute("ALTER TABLE chat_messages ADD media_path VARCHAR(255) DEFAULT NULL AFTER message_type");
        }
        if (!in_array('message_status', $colNames)) {
            DB::execute("ALTER TABLE chat_messages ADD message_status ENUM('sent','delivered','read') DEFAULT 'sent' AFTER is_read");
        }

        $message_id = DB::insert("
            INSERT INTO chat_messages (conversation_id, sender_id, message, message_type, media_path, message_status) 
            VALUES (?, ?, ?, ?, ?, 'sent')
        ", [$conversation_id, $user_id, '', $type, $publicPath]);

        jsonResponse([
            'success' => true,
            'message_id' => $message_id,
            'media_path' => $publicPath,
            'type' => $type
        ]);
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['error' => "Erreur lors de l'enregistrement du fichier"], 500);
}
