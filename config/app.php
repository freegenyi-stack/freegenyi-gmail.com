<?php
header('Content-Type: text/html; charset=utf-8');
/**
 * app.php - Version Mondiale Finale - 59 COUNTRIES + F5 REDIRECT
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
    'LB' => ['name' => 'Lebanon', 'langs' => ['ar', 'fr']],
    'LY' => ['name' => 'Libya', 'langs' => ['ar']],
    'SY' => ['name' => 'Syria', 'langs' => ['ar']],
    'IQ' => ['name' => 'Iraq', 'langs' => ['ar']],
    'JO' => ['name' => 'Jordan', 'langs' => ['ar']],
    'OM' => ['name' => 'Oman', 'langs' => ['ar']],
    'BH' => ['name' => 'Bahrain', 'langs' => ['ar']],
    'YE' => ['name' => 'Yemen', 'langs' => ['ar']],
    'SD' => ['name' => 'Sudan', 'langs' => ['ar']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgium', 'langs' => ['fr', 'nl']],
    'CH' => ['name' => 'Switzerland', 'langs' => ['fr', 'de']],
    'CA' => ['name' => 'Canada', 'langs' => ['fr', 'en']],
    'US' => ['name' => 'USA', 'langs' => ['en']],
    'GB' => ['name' => 'United Kingdom', 'langs' => ['en']],
    'DE' => ['name' => 'Germany', 'langs' => ['de', 'en']],
    'ES' => ['name' => 'Spain', 'langs' => ['es', 'en']],
    'IT' => ['name' => 'Italy', 'langs' => ['it']],
    'PT' => ['name' => 'Portugal', 'langs' => ['pt']],
    'BR' => ['name' => 'Brazil', 'langs' => ['pt']],
    'TR' => ['name' => 'Turkey', 'langs' => ['tr', 'en']],
    'RU' => ['name' => 'Russia', 'langs' => ['ru']],
    'BY' => ['name' => 'Belarus', 'langs' => ['ru']],
    'UA' => ['name' => 'Ukraine', 'langs' => ['uk']],
    'PL' => ['name' => 'Poland', 'langs' => ['pl']],
    'RO' => ['name' => 'Romania', 'langs' => ['ro']],
    'GR' => ['name' => 'Greece', 'langs' => ['el']],
    'HU' => ['name' => 'Hungary', 'langs' => ['hu']],
    'CZ' => ['name' => 'Czech Republic', 'langs' => ['cs']],
    'DK' => ['name' => 'Denmark', 'langs' => ['da']],
    'NO' => ['name' => 'Norway', 'langs' => ['no']],
    'SE' => ['name' => 'Sweden', 'langs' => ['sv']],
    'FI' => ['name' => 'Finland', 'langs' => ['fi']],
    'NL' => ['name' => 'Netherlands', 'langs' => ['nl']],
    'IE' => ['name' => 'Ireland', 'langs' => ['en']],
    'AT' => ['name' => 'Austria', 'langs' => ['de']],
    'MX' => ['name' => 'Mexico', 'langs' => ['es']],
    'AR' => ['name' => 'Argentina', 'langs' => ['es']],
    'CO' => ['name' => 'Colombia', 'langs' => ['es']],
    'CL' => ['name' => 'Chile', 'langs' => ['es']],
    'PE' => ['name' => 'Peru', 'langs' => ['es']],
    'SN' => ['name' => 'Senegal', 'langs' => ['fr']],
    'AO' => ['name' => 'Angola', 'langs' => ['pt']],
    'ZA' => ['name' => 'South Africa', 'langs' => ['en']],
    'CN' => ['name' => 'China', 'langs' => ['zh']],
    'SG' => ['name' => 'Singapore', 'langs' => ['zh', 'en']],
    'TW' => ['name' => 'Taiwan', 'langs' => ['zh']],
    'JP' => ['name' => 'Japan', 'langs' => ['ja']],
    'KR' => ['name' => 'South Korea', 'langs' => ['ko']],
    'IN' => ['name' => 'India', 'langs' => ['hi', 'en']],
    'AU' => ['name' => 'Australia', 'langs' => ['en']],
    'NZ' => ['name' => 'New Zealand', 'langs' => ['en']],
    'TH' => ['name' => 'Thailand', 'langs' => ['th']],
    'VN' => ['name' => 'Vietnam', 'langs' => ['vi']],
    'ID' => ['name' => 'Indonesia', 'langs' => ['id']],
    'MY' => ['name' => 'Malaysia', 'langs' => ['ms']],
];

uasort($supported_regions, function($a, $b) {
    return strcmp($a['name'], $b['name']);
});

// 1. DÉTECTION DU PAYS "ORIGINE" (Ex: DZ)
if (!isset($_COOKIE['freegeny_home'])) {
    $home_country = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'; 
    if (!isset($supported_regions[$home_country])) $home_country = 'DZ';
    setcookie('freegeny_home', $home_country, time() + (86400 * 30 * 12), "/");
    $_SESSION['home_country'] = $home_country;
} else {
    $home_country = $_COOKIE['freegeny_home'];
}

$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = explode('?', $uri_parts[0] ?? '')[0];

// 2. LOGIQUE RADICALE "ACTUALISATION = RETOUR MAISON"
if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    $browsing_country = strtoupper($matches[1]);
    $browsing_lang = strtolower($matches[2]);

    // Si on est déjà sur cette URL (Actualisation F5) et que ce n'est pas notre pays d'origine
    if (isset($_SESSION['last_uri']) && $_SESSION['last_uri'] === $request_uri && $browsing_country !== $home_country) {
        $target_lang = $supported_regions[$home_country]['langs'][0] ?? 'fr';
        header("Location: /" . strtoupper($home_country) . "-" . $target_lang . "/");
        unset($_SESSION['last_uri']);
        exit;
    }
    
    $_SESSION['last_uri'] = $request_uri;
    $_SESSION['country_code'] = $browsing_country;
    $_SESSION['lang'] = $browsing_lang;
} 
else if (
    !str_contains($request_uri, 'unlock.php') && 
    !str_contains($request_uri, '/assets/') && 
    !str_contains($request_uri, '/api/')
) {
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
