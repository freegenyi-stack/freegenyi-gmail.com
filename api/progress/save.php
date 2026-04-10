<?php
// ============================================================
// API — POST /api/progress/save
// Sauvegarde la progression d'un enfant sur une leçon
// ============================================================
require_once __DIR__ . '/../../config/app.php';
initSession();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non autorisée.'], 405);
}
if (!isLoggedIn()) {
    jsonResponse(['error' => 'Non authentifié.'], 401);
}

$body      = json_decode(file_get_contents('php://input'), true) ?? [];
$childId   = (int)($body['child_id']   ?? 0);
$lessonId  = trim($body['lesson_id']   ?? '');
$subject   = trim($body['subject']     ?? 'arabe');
$status    = trim($body['status']      ?? 'in_progress');
$score     = isset($body['score'])     ? (float)$body['score'] : null;
$timeSec   = (int)($body['time_sec']  ?? 0);

if (!$childId || !$lessonId) {
    jsonResponse(['error' => 'Paramètres manquants.'], 422);
}

// Vérifier que l'enfant appartient bien à l'utilisateur connecté
$child = DB::fetchOne(
    "SELECT id FROM children WHERE id = ? AND parent_id = ? LIMIT 1",
    [$childId, currentUser()['id']]
);
if (!$child) {
    jsonResponse(['error' => 'Enfant non trouvé.'], 404);
}

// Valider le statut
$allowedStatuses = ['not_started', 'in_progress', 'completed'];
if (!in_array($status, $allowedStatuses)) {
    $status = 'in_progress';
}

// Upsert la progression (INSERT ... ON DUPLICATE KEY UPDATE)
DB::execute(
    "INSERT INTO child_progress 
        (child_id, lesson_id, subject, `status`, score, time_spent_sec, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
        `status`       = VALUES(`status`),
        score          = COALESCE(VALUES(score), score),
        time_spent_sec = time_spent_sec + VALUES(time_spent_sec),
        completed_at   = IF(VALUES(`status`) = 'completed', NOW(), completed_at),
        updated_at     = NOW()",
    [
        $childId, $lessonId, $subject, $status,
        $score, $timeSec,
        $status === 'completed' ? date('Y-m-d H:i:s') : null
    ]
);

// Calculer et mettre à jour le streak si leçon complétée
if ($status === 'completed') {
    updateStreak($childId);
    $xpGained = 10 + ($score !== null ? (int)($score * 2) : 0);
    DB::execute("UPDATE children SET xp_total = xp_total + ? WHERE id = ?", [$xpGained, $childId]);
}

jsonResponse(['success' => true, 'status' => $status]);

function updateStreak(int $childId): void {
    $child = DB::fetchOne(
        "SELECT streak_days, longest_streak, last_active_date FROM children WHERE id = ?",
        [$childId]
    );
    if (!$child) return;

    $today     = date('Y-m-d');
    $yesterday = date('Y-m-d', strtotime('-1 day'));
    $last      = $child['last_active_date'];

    if ($last === $today) return; // Déjà mis à jour aujourd'hui

    $newStreak = ($last === $yesterday)
        ? $child['streak_days'] + 1
        : 1; // Rupture du streak

    $longest = max($child['longest_streak'], $newStreak);

    DB::execute(
        "UPDATE children SET streak_days = ?, longest_streak = ?, last_active_date = ? WHERE id = ?",
        [$newStreak, $longest, $today, $childId]
    );
}
