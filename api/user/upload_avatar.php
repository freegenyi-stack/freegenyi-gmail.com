<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';
initSession();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé.'], 401);
}

// 1. Gérer l'upload si c'est un fichier
if (!empty($_FILES['avatar_file'])) {
    $file = $_FILES['avatar_file'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!in_array($file['type'], $allowedTypes)) {
        jsonResponse(['error' => 'Format non supporté (JPG, PNG, WEBP uniquement).'], 422);
    }

    if ($file['size'] > 2 * 1024 * 1024) {
        jsonResponse(['error' => 'Fichier trop lourd (Max 2Mo).'], 422);
    }

    // Créer le dossier s'il n'existe pas
    $uploadDir = __DIR__ . '/../../uploads/avatars/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = 'u' . $_SESSION['user_id'] . '_' . time() . '.' . $ext;
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $photoUrl = '/uploads/avatars/' . $fileName;
        DB::execute("UPDATE users SET profile_photo = ? WHERE id = ?", [$photoUrl, $_SESSION['user_id']]);
        jsonResponse(['success' => true, 'photo_url' => $photoUrl]);
    } else {
        jsonResponse(['error' => 'Erreur lors du transfert du fichier.'], 500);
    }
}

// 2. Gérer si c'est un choix dans la bibliothèque
$body = json_decode(file_get_contents('php://input'), true);
if (isset($body['avatar_choice'])) {
    $choice = trim($body['avatar_choice']);
    DB::execute("UPDATE users SET profile_photo = ? WHERE id = ?", [$choice, $_SESSION['user_id']]);
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Aucune donnée reçue.'], 400);
