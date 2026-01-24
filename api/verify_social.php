<?php
// Log everything to understand what's happening
$logFile = __DIR__ . '/social_debug.log';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Request received\n", FILE_APPEND);

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    file_put_contents($logFile, "Step 1: Loading db_connect\n", FILE_APPEND);
    require_once 'db_connect.php';
    file_put_contents($logFile, "Step 2: DB connected\n", FILE_APPEND);

    $json = file_get_contents('php://input');
    file_put_contents($logFile, "Step 3: JSON received: " . $json . "\n", FILE_APPEND);

    $data = json_decode($json, true);
    file_put_contents($logFile, "Step 4: JSON decoded\n", FILE_APPEND);

    if (!$data || !isset($data['email'])) {
        file_put_contents($logFile, "Step 5: Missing email\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Missing email', 'debug' => 'No email in request']);
        exit();
    }

    $email = $data['email'];
    $name = $data['name'] ?? 'Geny User';
    file_put_contents($logFile, "Step 6: Email = $email, Name = $name\n", FILE_APPEND);

    $name_parts = explode(' ', $name, 2);
    $first_name = $name_parts[0];
    $last_name = isset($name_parts[1]) ? $name_parts[1] : '';

    file_put_contents($logFile, "Step 7: Checking if user exists\n", FILE_APPEND);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    file_put_contents($logFile, "Step 8: User " . ($user ? "found" : "not found") . "\n", FILE_APPEND);

    if (!$user) {
        file_put_contents($logFile, "Step 9: Creating new user\n", FILE_APPEND);
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, role, created_at) VALUES (?, ?, ?, 'parent', NOW())");
        $stmt->execute([$first_name, $last_name, $email]);

        $userId = $pdo->lastInsertId();
        file_put_contents($logFile, "Step 10: User created with ID $userId\n", FILE_APPEND);

        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$user) {
        file_put_contents($logFile, "Step 11: FAILED to fetch user\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Failed to create or fetch user']);
        exit();
    }

    $token = bin2hex(random_bytes(16));
    file_put_contents($logFile, "Step 12: Token generated\n", FILE_APPEND);

    $response = [
        'status' => 'success',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ];

    file_put_contents($logFile, "Step 13: Sending response\n", FILE_APPEND);
    echo json_encode($response);
    file_put_contents($logFile, "Step 14: Response sent successfully\n", FILE_APPEND);

} catch (Exception $e) {
    file_put_contents($logFile, "ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}
exit();
?>