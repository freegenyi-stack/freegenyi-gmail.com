<?php
/**
 * app.php - Version Mondiale Optimisée & Sécurisée (UTF-8)
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Forcer l'encodage UTF-8
header('Content-Type: text/html; charset=utf-8');

// Empêcher tout affichage d'erreur intempestif qui briserait le header
error_reporting(E_ALL & ~E_NOTICE); 
ini_set('display_errors', 0);

if (!function_exists('loadEnv')) {
    function loadEnv($path) {
        if (!file_exists($path)) return [];
        $data = [];
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0 || !strpos($line, '=')) continue;
            $parts = explode('=', $line, 2);
            $data[trim($parts[0])] = trim($parts[1], " \t\n\r\0\x0B\"");
        }
        return $data;
    }
}

$env = loadEnv(__DIR__ . '/../.env');
define('APP_URL', rtrim($env['APP_URL'] ?? 'https://freegeny.com', '/'));

$supported_regions = [
    'DZ' => ['name' => 'Algérie', 'langs' => ['ar', 'fr']],
    'MA' => ['name' => 'Maroc', 'langs' => ['ar', 'fr']],
    'TN' => ['name' => 'Tunisie', 'langs' => ['ar', 'fr']],
    'LY' => ['name' => 'Libye', 'langs' => ['ar']],
    'SA' => ['name' => 'Arabie Saoudite', 'langs' => ['ar']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgique', 'langs' => ['fr']],
    'CH' => ['name' => 'Suisse', 'langs' => ['fr']],
    'CA' => ['name' => 'Canada', 'langs' => ['fr']],
    'US' => ['name' => 'USA', 'langs' => ['en']],
];

$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = explode('?', $uri_parts[0] ?? '')[0];

if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    $_SESSION['country_code'] = strtoupper($matches[1]);
    $_SESSION['lang'] = strtolower($matches[2]);
} 
else if (!str_contains($request_uri, '/api/') && !str_contains($request_uri, '/assets/')) {
    $detected_country = $_SESSION['country_code'] ?? ($_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'); 
    $detected_lang = $_SESSION['lang'] ?? 'fr';
    $redirect_url = APP_URL . '/' . strtoupper($detected_country) . '-' . $detected_lang . '/';
    header("Location: $redirect_url");
    exit;
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';

// Chargement unique des traductions
$GLOBALS['translations'] = [];
$lang_file = __DIR__ . "/../lang/{$lang}.php";
if (file_exists($lang_file)) {
    $GLOBALS['translations'] = include $lang_file;
}

if (!function_exists('__')) {
    function __($key, $fallback = '') {
        $val = $GLOBALS['translations'][$key] ?? null;
        if ($val) return $val;
        return $fallback ?: $key;
    }
}
