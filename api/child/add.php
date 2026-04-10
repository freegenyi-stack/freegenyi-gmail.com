<?php
// ============================================================
// API — POST /api/child/add
// Ajoute un enfant au compte parent connecté
// ============================================================
require_once __DIR__ . '/../../config/app.php';
initSession();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['error' => 'Méthode non autorisée.'], 405);
if (!isLoggedIn()) jsonResponse(['error' => 'Non authentifié.'], 401);

$body  = json_decode(file_get_contents('php://input'), true) ?? [];
$name  = trim($body['name']  ?? '');
$age   = (int)($body['age']  ?? 6);
$grade = trim($body['grade'] ?? '1AP');
$lang  = trim($body['language'] ?? 'ar');

if (!$name) jsonResponse(['error' => 'Le prénom de l\'enfant est requis.'], 422);
if ($age < 3 || $age > 18) $age = 6;

$allowedGrades = ['1AP','2AP','3AP','4AP','5AP','6AP'];
if (!in_array($grade, $allowedGrades)) $grade = '1AP';

$parentId = currentUser()['id'];

// Limite : max 5 enfants par compte (gratuit)
$count = DB::fetchOne("SELECT COUNT(*) as cnt FROM children WHERE parent_id = ?", [$parentId]);
if (($count['cnt'] ?? 0) >= 5) {
    jsonResponse(['error' => 'Limite de 5 enfants atteinte.'], 403);
}

$childId = DB::insert(
    "INSERT INTO children (parent_id, name, age, grade, language, country) VALUES (?, ?, ?, ?, ?, ?)",
    [$parentId, $name, $age, $grade, $lang, currentUser()['declared_country'] ?? 'DZ']
);

if (!$childId) jsonResponse(['error' => 'Erreur lors de l\'ajout.'], 500);

$_SESSION['active_child_id'] = $childId;

jsonResponse(['success' => true, 'child_id' => $childId]);
