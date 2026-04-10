<?php
// ============================================================
// API — GET /api/progress/get?child_id=X
// Retourne les stats de progression d'un enfant
// ============================================================
require_once __DIR__ . '/../../config/app.php';
initSession();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Méthode non autorisée.'], 405);
}
if (!isLoggedIn()) {
    jsonResponse(['error' => 'Non authentifié.'], 401);
}

$childId = (int)($_GET['child_id'] ?? 0);
if (!$childId) {
    jsonResponse(['error' => 'child_id requis.'], 422);
}

// Vérifier proprieté de l'enfant
$child = DB::fetchOne(
    "SELECT * FROM children WHERE id = ? AND parent_id = ? LIMIT 1",
    [$childId, currentUser()['id']]
);
if (!$child) {
    jsonResponse(['error' => 'Enfant non trouvé.'], 404);
}

// Stats globales via la vue
$stats = DB::fetchOne("SELECT * FROM v_child_stats WHERE child_id = ?", [$childId]);

// Progression détaillée par matière
$bySubject = DB::fetchAll(
    "SELECT subject,
        COUNT(*) as total,
        SUM(status = 'completed') as completed,
        ROUND(AVG(CASE WHEN status = 'completed' THEN score END), 1) as avg_score
     FROM child_progress WHERE child_id = ?
     GROUP BY subject",
    [$childId]
);

// 7 derniers jours d'activité
$last7days = DB::fetchAll(
    "SELECT DATE(created_at) as day, COUNT(*) as exercises, SUM(is_correct) as correct
     FROM exercise_attempts
     WHERE child_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
     GROUP BY DATE(created_at)
     ORDER BY day ASC",
    [$childId]
);

// Derniers achievements
$achievements = DB::fetchAll(
    "SELECT badge_type, badge_level, earned_at FROM achievements WHERE child_id = ? ORDER BY earned_at DESC LIMIT 5",
    [$childId]
);

jsonResponse([
    'success'     => true,
    'child'       => $child,
    'stats'       => $stats,
    'by_subject'  => $bySubject,
    'last_7_days' => $last7days,
    'achievements'=> $achievements,
]);
