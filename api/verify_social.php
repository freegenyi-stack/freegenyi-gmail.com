<?php
// CRITICAL FIX: Ensure no text/HTML is output before JSON
error_reporting(E_ALL);
ini_set('display_errors', 0); // Hide PHP errors from output
ini_set('log_errors', 1);

// Log to .txt file so user can read it via browser
$logFile = __DIR__ . '/social_debug.txt';
function logStep($msg)
{
    global $logFile;
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - " . $msg . "\n", FILE_APPEND);
}

logStep("Starting request");

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

try {
    // 1. Validate DB file existence
    if (!file_exists('db_connect.php')) {
        throw new Exception("Database configuration file missing (db_connect.php)");
    }

    logStep("Loading database...");
    require_once 'db_connect.php';
    logStep("Database loaded.");

    // 2. Get Input
    $json = file_get_contents('php://input');
    logStep("Input received: " . substr($json, 0, 100) . "...");

    if (!$json) {
        throw new Exception("No input received (Empty Body)");
    }

    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input: " . json_last_error_msg());
    }

    if (!isset($data['email'])) {
        throw new Exception("Missing email field");
    }

    $email = $data['email'];
    $name = $data['name'] ?? 'Geny User';
    $name_parts = explode(' ', $name, 2);
    $first_name = $name_parts[0];
    $last_name = $name_parts[1] ?? '';
    $provider = $data['provider'] ?? 'social';
    $photo = $data['photo'] ?? '';

    // 3. Database Logic
    logStep("Checking user: $email");

    // Check if $conn exists (it comes from db_connect.php)
    if (!isset($conn)) {
        throw new Exception("Database connection variable \$conn is not set in db_connect.php");
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        logStep("User not found, creating new.");

        // Safe Insert - handle missing columns gracefully
        try {
            $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, role, provider, avatar_url, created_at) VALUES (?, ?, ?, 'parent', ?, ?, NOW())");
            $stmt->execute([$first_name, $last_name, $email, $provider, $photo]);
        } catch (Exception $e) {
            logStep("Insert with extra columns failed, trying basic insert: " . $e->getMessage());
            // Fallback for older schema
            $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, role, created_at) VALUES (?, ?, ?, 'parent', NOW())");
            $stmt->execute([$first_name, $last_name, $email]);
        }

        $userId = $conn->lastInsertId();

        // Re-fetch
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$user) {
        throw new Exception("Failed to retrieve user after creation or identification");
    }

    logStep("User identified: ID " . $user['id']);

    // 4. Send Success Response
    $response = [
        'status' => 'success',
        'token' => bin2hex(random_bytes(16)),
        'user' => [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'avatar' => isset($user['avatar_url']) ? $user['avatar_url'] : ''
        ]
    ];

    echo json_encode($response);
    logStep("Success response sent.");

} catch (Exception $e) {
    logStep("ERROR: " . $e->getMessage());
    // Return JSON error
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
exit();
?>