<?php
/**
 * app.php - Cœur de l'application avec détection Pays/Langue et Routage International
 */
session_start();

// Chargement des variables .env
function loadEnv($path) {
    if (!file_exists($path)) return [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $data = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $data[trim($name)] = trim($value, " \t\n\r\0\x0B\"");
    }
    return $data;
}

$env = loadEnv(__DIR__ . '/../.env');

// Constantes globales
define('APP_URL', $env['APP_URL'] ?? 'https://freegeny.com');
define('APP_NAME', $env['APP_NAME'] ?? 'FreeGeny');

/**
 * LOGIQUE DE DÉTECTION INTERNATIONALE (POINT 1)
 */

// 1. Analyse de l'URL pour le format /CC-lg/ (ex: FR-fr)
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = $uri_parts[0] ?? '';

// Format attendu : XX-yy (2 lettres pays, tiret, 2 lettres langue)
if (preg_match('/^([A-Z]{2})-([a-z]{2})$/', $slug, $matches)) {
    $_SESSION['country_code'] = $matches[1];
    $_SESSION['lang'] = $matches[2];
} 
// 2. Si non présent dans l'URL, détection par IP et redirection
else if (!isset($_SESSION['country_code'])) {
    // Détection via Cloudflare ou une IP par défaut (à coupler avec une API IP plus tard pour 100% de précision)
    $detected_country = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'; 
    $detected_lang = ($detected_country === 'FR' || $detected_country === 'DZ' || $detected_country === 'MA') ? 'fr' : 'ar';
    
    // On force la redirection vers le format pro : /CC-lg/
    $redirect_url = APP_URL . '/' . strtoupper($detected_country) . '-' . $detected_lang . '/';
    header("Location: $redirect_url");
    exit;
}

// Variables globales de langue et pays
$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';

// Helper pour traduire
function __($key, $placeholders = []) {
    global $lang;
    static $translations = null;
    if ($translations === null) {
        $file = __DIR__ . "/../lang/{$lang}.php";
        $translations = file_exists($file) ? include($file) : [];
    }
    $text = $translations[$key] ?? $key;
    foreach ($placeholders as $k => $v) {
        $text = str_replace(":$k", $v, $text);
    }
    return $text;
}
