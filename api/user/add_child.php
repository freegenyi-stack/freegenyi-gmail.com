<?php
require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../auth/auth_helpers.php';
initSession();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['error' => 'Non autorisé.'], 401);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$firstName = trim($body['first_name'] ?? '');
$birthDate = trim($body['birth_date'] ?? '');
$grade      = trim($body['grade_level'] ?? '');
$relation   = trim($body['relationship'] ?? 'Père/Mère');

if (!$firstName || !$grade) {
    jsonResponse(['error' => 'Veuillez remplir les champs obligatoires (Prénom et Niveau scolaire).'], 422);
}

try {
    $childId = DB::insert(
        "INSERT INTO children (parent_id, first_name, birth_date, grade_level, relationship) VALUES (?, ?, ?, ?, ?)",
        [$_SESSION['user_id'], $firstName, $birthDate, $grade, $relation]
    );

    if ($childId) {
        // Initialiser les contrôles parentaux par défaut (Point 5)
        DB::execute("INSERT INTO parental_controls (child_id) VALUES (?)", [$childId]);
        
        // Notification automatique (Point 4)
        DB::execute(
            "INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)",
            [$_SESSION['user_id'], 'activity', 'Nouveau membre !', "Le profil de $firstName a bien été créé."]
        );

        jsonResponse(['success' => true, 'child_id' => $childId]);
    } else {
        jsonResponse(['error' => 'Erreur lors de la création du profil enfant.'], 500);
    }
} catch (\Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
