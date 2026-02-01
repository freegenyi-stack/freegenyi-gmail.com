<?php
// diag_users.php - Database Diagnostics
// This script allows the developer to verify the total count of registered users.
// It is used exclusively for debugging the authentication flow.

require_once 'db_connect.php';

try {
    $sql = "SELECT COUNT(*) as total FROM users";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo "<h2>📋 Database Diagnostic Report</h2>";
    echo "<p><strong>Total Users Found:</strong> " . $row['total'] . "</p>";

    if ($row['total'] > 0) {
        echo "<h3>List of registered emails:</h3><ul>";
        $list_sql = "SELECT email, role FROM users";
        $list_stmt = $conn->prepare($list_sql);
        $list_stmt->execute();
        while ($user = $list_stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<li>" . $user['email'] . " (" . $user['role'] . ")</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>⚠️ No users found in the database. Please run setup_test_accounts.php again.</p>";
    }

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>