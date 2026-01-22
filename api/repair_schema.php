<?php
// repair_schema.php - Database Architecture Repair Utility
// This script inspects the 'users' table and expands the 'role' column constraints.

require_once 'db_connect.php';

try {
    echo "<h2>🛠️ Database Repair Utility</h2>";

    // 1. Inspect current column definition
    $inspect_sql = "DESCRIBE users";
    $stmt = $conn->prepare($inspect_sql);
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<h3>Current Table Structure:</h3><pre>";
    print_r($columns);
    echo "</pre>";

    // 2. Apply fix: Change 'role' to a flexible VARCHAR or broader ENUM
    // Using VARCHAR(50) for maximum future-proofing
    echo "<p>⚡ Attempting to expand 'role' column...</p>";
    $fix_sql = "ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'parent'";
    $conn->exec($fix_sql);

    echo "<p style='color: green;'>✅ Success! 'role' column has been updated to VARCHAR(50).</p>";
    echo "<p>🚀 You can now run <code>setup_test_accounts.php</code> again.</p>";

} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error during repair: " . $e->getMessage() . "</p>";
}
?>