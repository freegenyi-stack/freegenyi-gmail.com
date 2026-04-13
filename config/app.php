<?php
/**
 * app.php - Version de Secours (Simplifiée pour rétablir l'accès)
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Désactivation temporaire du verrouillage site pour test
$_SESSION['site_unlocked'] = true; 

error_reporting(E_ALL); 
ini_set('display_errors', 1);

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

// Valeurs par défaut sécurisées
$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';
$home_country = $country;

$supported_regions = [
    'DZ' => ['name' => 'Algeria', 'langs' => ['ar', 'fr']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
];

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
