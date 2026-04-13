<?php
/**
 * app.php - Version Élite Stabilisée (Performance & Sécurité)
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. PROTECTION DU SITE (Unlock)
if (!defined('MAINTENANCE_PASSWORD')) define('MAINTENANCE_PASSWORD', 'Yousr4568520&');
$is_legal_page = str_contains($_SERVER['REQUEST_URI'] ?? '', 'privacy') || str_contains($_SERVER['REQUEST_URI'] ?? '', 'terms');

if (empty($_SESSION['site_unlocked']) && !str_contains($_SERVER['REQUEST_URI'] ?? '', 'unlock.php') && !$is_legal_page) {
    header('Location: /unlock.php');
    exit;
}

// 2. CONFIGURATION ERREURS & ENV
error_reporting(E_ALL & ~E_NOTICE); 
ini_set('display_errors', 1);
if (!defined('DEBUG_MODE')) define('DEBUG_MODE', true);

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
foreach ($env as $k => $v) {
    putenv("$k=$v");
    $_ENV[$k] = $v;
}

if (!defined('APP_URL')) define('APP_URL', 'https://freegeny.com');
if (!defined('BCRYPT_COST')) define('BCRYPT_COST', 12);
if (!defined('MAX_LOGIN_ATTEMPTS')) define('MAX_LOGIN_ATTEMPTS', 5);

// 3. SYSTÈME DE RÉGIONS & LANGUES
$supported_regions = [
    'DZ' => ['name' => 'Algeria', 'langs' => ['ar', 'fr']],
    'MA' => ['name' => 'Morocco', 'langs' => ['ar', 'fr']],
    'TN' => ['name' => 'Tunisia', 'langs' => ['ar', 'fr']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgium', 'langs' => ['fr', 'nl']],
    'CH' => ['name' => 'Switzerland', 'langs' => ['fr', 'de']],
    'CA' => ['name' => 'Canada', 'langs' => ['fr', 'en']],
    'US' => ['name' => 'USA', 'langs' => ['en']],
    'GB' => ['name' => 'United Kingdom', 'langs' => ['en']],
];

// Détection pays/langue sans boucle de redirection
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = explode('?', $uri_parts[0] ?? '')[0];

if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    $_SESSION['country_code'] = strtoupper($matches[1]);
    $_SESSION['lang'] = strtolower($matches[2]);
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';
$is_rtl = ($lang === 'ar');

// 4. TRADUCTIONS ET HELPERS
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
