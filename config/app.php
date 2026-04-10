<?php
header('Content-Type: text/html; charset=utf-8');
/**
 * app.php - Version Mondiale avec Persistance d'Origine
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
    // ... (les autres pays restent identiques à ma liste précédente)
    'SY' => ['name' => 'Syria', 'langs' => ['ar']],
    'IQ' => ['name' => 'Iraq', 'langs' => ['ar']],
    'LB' => ['name' => 'Lebanon', 'langs' => ['ar', 'fr']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgium', 'langs' => ['fr', 'nl']],
    'CH' => ['name' => 'Switzerland', 'langs' => ['fr', 'de']],
    'CA' => ['name' => 'Canada', 'langs' => ['fr', 'en']],
    'US' => ['name' => 'USA', 'langs' => ['en']],
];

// 1. DÉTECTION DU PAYS "MAISON" (Sticky Home)
// On stocke le pays d'origine dans un cookie longue durée
if (!isset($_COOKIE['freegeny_home'])) {
    $home_country = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'; 
    if (!isset($supported_regions[$home_country])) $home_country = 'DZ';
    setcookie('freegeny_home', $home_country, time() + (86400 * 30 * 12), "/"); // 1 an
    $_SESSION['home_country'] = $home_country;
} else {
    $home_country = $_COOKIE['freegeny_home'];
}

$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = explode('?', $uri_parts[0] ?? '')[0];

// 2. LOGIQUE DE NAVIGATION
if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    // L'utilisateur navigue explicitement dans un pays (ex: /FR-fr/)
    $_SESSION['country_code'] = strtoupper($matches[1]);
    $_SESSION['lang'] = strtolower($matches[2]);
} 
else if (!str_contains($request_uri, 'unlock.php') && !str_contains($request_uri, '/assets/')) {
    // Si on arrive sur la racine ou qu'on actualise sans slug pays : RETOUR AU PAYS D'ORIGINE
    $target_country = $home_country;
    $target_lang = $supported_regions[$target_country]['langs'][0] ?? 'fr';
    header("Location: /" . strtoupper($target_country) . "-" . $target_lang . "/");
    exit;
}

$country = $_SESSION['country_code'] ?? $home_country;
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
