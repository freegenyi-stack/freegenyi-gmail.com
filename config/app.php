<?php
/**
 * app.php - Version avec REDIRECTION FORCÉE et liste élargie de pays
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

// Liste élargie des régions FreeGeny
$supported_regions = [
    'DZ' => ['name' => 'Algérie', 'langs' => ['ar', 'fr']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'MA' => ['name' => 'Maroc', 'langs' => ['ar', 'fr']],
    'TN' => ['name' => 'Tunisie', 'langs' => ['ar', 'fr']],
    'SA' => ['name' => 'Arabie S.', 'langs' => ['ar']],
    'AE' => ['name' => 'Émirats', 'langs' => ['ar']],
    'QA' => ['name' => 'Qatar', 'langs' => ['ar']],
    'EG' => ['name' => 'Égypte', 'langs' => ['ar']],
    'BE' => ['name' => 'Belgique', 'langs' => ['fr', 'nl']],
    'CH' => ['name' => 'Suisse', 'langs' => ['fr', 'de']],
    'CA' => ['name' => 'Canada', 'langs' => ['fr', 'en']],
];

/**
 * LOGIQUE DE ROUTAGE GÉOGRAPHIQUE
 */
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = explode('?', $uri_parts[0] ?? '')[0];

// 1. Si on a le slug dans l'URL, on l'utilise
if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    $_SESSION['country_code'] = strtoupper($matches[1]);
    $_SESSION['lang'] = strtolower($matches[2]);
} 
// 2. SINON : REDIRECTION FORCÉE (Si on est sur une page .php ou à la racine)
else if (!str_contains($request_uri, '/api/') && !str_contains($request_uri, '/assets/')) {
    $detected_country = $_SESSION['country_code'] ?? ($_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'); 
    $detected_lang = $_SESSION['lang'] ?? (in_array($detected_country, ['FR', 'BE', 'CH', 'CA']) ? 'fr' : 'ar');
    
    // On construit l'URL avec le prefixe obligatoire
    $path = ($request_uri === '/') ? '' : ltrim($request_uri, '/');
    $redirect_url = APP_URL . '/' . strtoupper($detected_country) . '-' . $detected_lang . '/' . $path;
    
    header("Location: $redirect_url");
    exit;
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'ar';
?>
