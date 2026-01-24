<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test 1: Check if file is accessible
echo json_encode(['test' => 'verify_social is accessible', 'timestamp' => time()]);
?>