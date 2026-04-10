<?php
header('Content-Type: text/html; charset=utf-8');
/**
 * app.php - Version Mondiale Finale avec Protection & RTL
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// PROTECTION CONSTRUCTION
define('MAINTENANCE_PASSWORD', 'Yousr4568520&');
if (!isset($_SESSION['site_unlocked']) && !str_contains($_SERVER['REQUEST_URI'], 'unlock.php')) {
    header('Location: /unlock.php');
    exit;
}

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

// LISTE EN ANGLAIS (Sorted)
$supported_regions = [
    'DZ' => ['name' => 'Algeria', 'langs' => ['ar', 'fr']],
    'MA' => ['name' => 'Morocco', 'langs' => ['ar', 'fr']],
    'TN' => ['name' => 'Tunisia', 'langs' => ['ar', 'fr']],
    'LY' => ['name' => 'Libya', 'langs' => ['ar']],
    'SA' => ['name' => 'Saudi Arabia', 'langs' => ['ar']],
    'AE' => ['name' => 'United Arab Emirates', 'langs' => ['ar']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgium', 'langs' => ['fr']],
    'CH' => ['name' => 'Switzerland', 'langs' => ['fr']],
    'CA' => ['name' => 'Canada', 'langs' => ['fr']],
    'US' => ['name' => 'USA', 'langs' => ['en']],
    'GB' => ['name' => 'United Kingdom', 'langs' => ['en']],
    // ... Simplified for the example, we can add more later
];

uasort($supported_regions, function($a, $b) {
    return strcmp($a['name'], $b['name']);
});

$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = explode('?', $uri_parts[0] ?? '')[0];

if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    $_SESSION['country_code'] = strtoupper($matches[1]);
    $_SESSION['lang'] = strtolower($matches[2]);
} 

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';
$rtl_languages = ['ar'];
$is_rtl = in_array($lang, $rtl_languages);

// Chargement des traductions
$GLOBALS['translations'] = [];
$lang_file = __DIR__ . "/../lang/{$lang}.php";
if (file_exists($lang_file)) {
    $GLOBALS['translations'] = include $lang_file;
}

if (!function_exists('__')) {
    function __($key, $fallback = '') {
        $val = $GLOBALS['translations'][$key] ?? null;
        return $val ?: ($fallback ?: $key);
    }
}
?>
