<?php
/**
 * app.php - Version Mondiale Exhaustive
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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

// LISTE MONDIALE DES RÉGIONS FREEGENY
$supported_regions = [
    // Maghreb
    'DZ' => ['name' => 'Algérie', 'langs' => ['ar', 'fr']],
    'MA' => ['name' => 'Maroc', 'langs' => ['ar', 'fr']],
    'TN' => ['name' => 'Tunisie', 'langs' => ['ar', 'fr']],
    'LY' => ['name' => 'Libye', 'langs' => ['ar']],
    
    // Moyen-Orient
    'SA' => ['name' => 'Arabie Saoudite', 'langs' => ['ar']],
    'AE' => ['name' => 'Émirats', 'langs' => ['ar']],
    'QA' => ['name' => 'Qatar', 'langs' => ['ar']],
    'KW' => ['name' => 'Koweït', 'langs' => ['ar']],
    'BH' => ['name' => 'Bahreïn', 'langs' => ['ar']],
    'OM' => ['name' => 'Oman', 'langs' => ['ar']],
    'EG' => ['name' => 'Égypte', 'langs' => ['ar']],
    'JO' => ['name' => 'Jordanie', 'langs' => ['ar']],
    'LB' => ['name' => 'Liban', 'langs' => ['ar', 'fr']],
    'PS' => ['name' => 'Palestine', 'langs' => ['ar']],
    'IQ' => ['name' => 'Irak', 'langs' => ['ar']],

    // Europe
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgique', 'langs' => ['fr']],
    'CH' => ['name' => 'Suisse', 'langs' => ['fr']],
    'DE' => ['name' => 'Allemagne', 'langs' => ['fr']], // Pour la diaspora
    'ES' => ['name' => 'Espagne', 'langs' => ['fr']],
    'IT' => ['name' => 'Italie', 'langs' => ['fr']],
    'TR' => ['name' => 'Turquie', 'langs' => ['ar', 'fr']],

    // Amérique
    'CA' => ['name' => 'Canada', 'langs' => ['fr']],
    'US' => ['name' => 'USA', 'langs' => ['fr']],
];

/**
 * LOGIQUE DE ROUTAGE GÉOGRAPHIQUE
 */
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = explode('?', $uri_parts[0] ?? '')[0];

if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    $_SESSION['country_code'] = strtoupper($matches[1]);
    $_SESSION['lang'] = strtolower($matches[2]);
} 
else if (!str_contains($request_uri, '/api/') && !str_contains($request_uri, '/assets/')) {
    $detected_country = $_SESSION['country_code'] ?? ($_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'); 
    $detected_lang = $_SESSION['lang'] ?? (in_array($detected_country, ['DZ', 'MA', 'TN', 'LY', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'EG', 'JO', 'LB', 'PS', 'IQ']) ? 'ar' : 'fr');
    
    $path = ($request_uri === '/') ? '' : ltrim($request_uri, '/');
    $redirect_url = APP_URL . '/' . strtoupper($detected_country) . '-' . $detected_lang . '/' . $path;
    
    header("Location: $redirect_url");
    exit;
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'ar';
?>
