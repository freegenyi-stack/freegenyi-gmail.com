<?php
// ============================================================
// API — GET /api/auth/logout
// ============================================================
require_once __DIR__ . '/../../config/app.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';

// Destroy all session data
$_SESSION = [];
session_destroy();

// Redirect safely backwards
header("Location: /" . strtoupper($country) . "-" . strtolower($lang) . "/auth/login");
exit;
