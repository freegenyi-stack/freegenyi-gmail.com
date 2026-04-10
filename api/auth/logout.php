<?php
// ============================================================
// API — GET/POST /api/auth/logout
// ============================================================
require_once __DIR__ . '/../../config/app.php';
initSession();

logoutUser();
redirect(APP_URL . '/auth/login');
