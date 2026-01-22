// setup_test_accounts.php - Database Seeding Utility
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Define the standard test password
$test_password = "password123";
$hashed_password = password_hash($test_password, PASSWORD_BCRYPT);

// Array of diverse test profiles for each platform segment
$test_users = [
[
'email' => 'parent@test.com',
'first_name' => 'John',
'last_name' => 'Parent',
'role' => 'parent'
],
[
'email' => 'school@test.com',
'first_name' => 'Alice',
'last_name' => 'Principal',
'role' => 'school'
],
[
'email' => 'institution@test.com',
'first_name' => 'Global',
'last_name' => 'Admin',
'role' => 'institution'
],
[
'email' => 'child@test.com',
'first_name' => 'Felix',
'last_name' => 'Spark',
'role' => 'child'
]
];

echo "<h2>⚙️ FreeGeny Test Account Setup</h2>";
echo "<ul>";

    foreach ($test_users as $user) {
    // Check if user already exists to avoid duplication
    $check_sql = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->execute([':email' => $user['email']]);

    if ($check_stmt->rowCount() == 0) {
    $sql = "INSERT INTO users (email, password, first_name, last_name, role, provider)
    VALUES (:email, :password, :first_name, :last_name, :role, 'local')";

    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([
    ':email' => $user['email'],
    ':password' => $hashed_password,
    ':first_name' => $user['first_name'],
    ':last_name' => $user['last_name'],
    ':role' => $user['role']
    ]);

    if ($result) {
    echo "<li style='color: green;'>✅ Created: " . $user['email'] . " (Role: " . $user['role'] . ")</li>";
    } else {
    echo "<li style='color: red;'>❌ Failed: " . $user['email'] . "</li>";
    }
    } else {
    echo "<li style='color: orange;'>ℹ️ Skipped: " . $user['email'] . " already exists.</li>";
    }
    }

    echo "</ul>";
echo "<p>🚀 <strong>Status:</strong> Ready for testing. You can now log in at <code>/login.html</code> using password:
    <code>password123</code></p>";
?>