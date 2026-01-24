<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

require_once 'db_connect.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['email'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing email']);
    exit();
}

$email = $data['email'];
$name = $data['name'] ?? 'Geny User';
$name_parts = explode(' ', $name, 2);
$first_name = $name_parts[0];
$last_name = $name_parts[1] ?? '';

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        // Create new user (basic columns only)
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, role, created_at) VALUES (?, ?, ?, 'parent', NOW())");
        $stmt->execute([$first_name, $last_name, $email]);

        $userId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
    }

    // Session token
    $token = bin2hex(random_bytes(16));

    echo json_encode([
        'status' => 'success',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>