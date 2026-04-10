<?php
header('Content-Type: text/html; charset=utf-8');
/**
 * app.php - Version Mondiale Finale - FULL COUNTRIES
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

$supported_regions = [
    'DZ' => ['name' => 'Algeria', 'langs' => ['ar', 'fr']],
    'MA' => ['name' => 'Morocco', 'langs' => ['ar', 'fr']],
    'TN' => ['name' => 'Tunisia', 'langs' => ['ar', 'fr']],
    'EG' => ['name' => 'Egypt', 'langs' => ['ar']],
    'SA' => ['name' => 'Saudi Arabia', 'langs' => ['ar']],
    'AE' => ['name' => 'United Arab Emirates', 'langs' => ['ar']],
    'QA' => ['name' => 'Qatar', 'langs' => ['ar']],
    'KW' => ['name' => 'Kuwait', 'langs' => ['ar']],
    'JO' => ['name' => 'Jordan', 'langs' => ['ar']],
    'LB' => ['name' => 'Lebanon', 'langs' => ['ar', 'fr']],
    'OM' => ['name' => 'Oman', 'langs' => ['ar']],
    'BH' => ['name' => 'Bahrain', 'langs' => ['ar']],
    'PS' => ['name' => 'Palestine', 'langs' => ['ar']],
    'LY' => ['name' => 'Libya', 'langs' => ['ar']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgium', 'langs' => ['fr']],
    'CH' => ['name' => 'Switzerland', 'langs' => ['fr', 'en']],
    'CA' => ['name' => 'Canada', 'langs' => ['fr', 'en']],
    'US' => ['name' => 'USA', 'langs' => ['en']],
    'GB' => ['name' => 'United Kingdom', 'langs' => ['en']],
    'DE' => ['name' => 'Germany', 'langs' => ['en']],
    'ES' => ['name' => 'Spain', 'langs' => ['en']],
    'IT' => ['name' => 'Italy', 'langs' => ['en']],
    'TR' => ['name' => 'Turkey', 'langs' => ['en']],
    'SE' => ['name' => 'Sweden', 'langs' => ['en']],
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
else if (!str_contains($request_uri, 'unlock.php') && !str_contains($request_uri, '/assets/')) {
    $detected_country = $_SESSION['country_code'] ?? ($_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'); 
    $detected_lang = $_SESSION['lang'] ?? ($supported_regions[$detected_country]['langs'][0] ?? 'fr');
    header("Location: /" . strtoupper($detected_country) . "-" . $detected_lang . "/");
    exit;
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';
$is_rtl = in_array($lang, ['ar']);

$GLOBALS['translations'] = [];
$lang_file = __DIR__ . "/../lang/{$lang}.php";
if (file_exists($lang_file)) {
    $GLOBALS['translations'] = include $lang_file;
}

if (!function_exists('__')) {
    function __($key, $fallback = '') {
        $val = $GLOBALS['translations'][$key] ?? null;
        if ($val) return $val;
        return $fallback ?: (ucfirst(str_replace('_', ' ', $key)));
    }
}
?>
