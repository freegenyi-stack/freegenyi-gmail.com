<?php
require_once __DIR__ . '/../../config/app.php';
session_start();
session_unset();
session_destroy();

// Redirection intelligente selon la cookie ou DZ-fr par défaut
$loc = $_COOKIE['freegeny_home'] ?? 'DZ';
$lang = $_COOKIE['freegeny_lang'] ?? 'fr';

header("Location: /" . strtoupper($loc) . "-" . strtolower($lang) . "/auth/login");
exit;
