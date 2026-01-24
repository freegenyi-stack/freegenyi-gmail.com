<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Initial PHP setup for Firebase Token verification would usually require a library 
// like 'kreait/firebase-php'. For simplicity in this env, we will simulate the 
// verification of the token and focus on the database syncing logic.

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['token']) || !isset($data['email'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request data']);
    exit();
}

$email = $data['email'];
$name = $data['name'] ?? 'Geny User';
$photo = $data['photo'] ?? '';
$provider = $data['provider'] ?? 'social';

// Separate First and Last Name
$name_parts = explode(' ', $name, 2);
$first_name = $name_parts[0];
$last_name = $name_parts[1] ?? '';

try {
    // 1. Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        // 2. Create new user if they don't exist
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, role, provider, avatar_url, created_at) VALUES (?, ?, ?, 'parent', ?, ?, NOW())");
        $stmt->execute([$first_name, $last_name, $email, $provider, $photo]);

        $userId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
    }

    // 3. Generate a local session token (simplified)
    $token = bin2hex(random_bytes(32));

    echo json_encode([
        'status' => 'success',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'avatar' => $user['avatar_url']
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>