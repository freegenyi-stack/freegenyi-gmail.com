<?php
/**
 * app.php - Version Mondiale TOTALE basée sur la documentation
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

// LISTE MONDIALE EXHAUSTIVE (Basée sur Documentation_Programs_Contry)
$supported_regions = [
    // Maghreb & Afrique
    'DZ' => ['name' => 'Algérie', 'langs' => ['ar', 'fr']],
    'MA' => ['name' => 'Maroc', 'langs' => ['ar', 'fr']],
    'TN' => ['name' => 'Tunisie', 'langs' => ['ar', 'fr']],
    'LY' => ['name' => 'Libye', 'langs' => ['ar']],
    'SN' => ['name' => 'Sénégal', 'langs' => ['fr']],
    'AO' => ['name' => 'Angola', 'langs' => ['pt']],
    'ZA' => ['name' => 'Afrique du Sud', 'langs' => ['en']],

    // Moyen-Orient
    'SA' => ['name' => 'Arabie Saoudite', 'langs' => ['ar']],
    'AE' => ['name' => 'Émirats', 'langs' => ['ar']],
    'QA' => ['name' => 'Qatar', 'langs' => ['ar']],
    'KW' => ['name' => 'Koweït', 'langs' => ['ar']],
    'EG' => ['name' => 'Égypte', 'langs' => ['ar']],
    'LB' => ['name' => 'Liban', 'langs' => ['ar', 'fr']],
    'PS' => ['name' => 'Palestine', 'langs' => ['ar']],
    'IQ' => ['name' => 'Irak', 'langs' => ['ar']],

    // Europe
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'BE' => ['name' => 'Belgique', 'langs' => ['fr', 'nl']],
    'CH' => ['name' => 'Suisse', 'langs' => ['fr', 'de', 'it']],
    'DE' => ['name' => 'Allemagne', 'langs' => ['de']],
    'ES' => ['name' => 'Espagne', 'langs' => ['es']],
    'IT' => ['name' => 'Italie', 'langs' => ['it']],
    'GB' => ['name' => 'Royaume-Uni', 'langs' => ['en']],
    'PT' => ['name' => 'Portugal', 'langs' => ['pt']],
    'RU' => ['name' => 'Russie', 'langs' => ['ru']],
    'UA' => ['name' => 'Ukraine', 'langs' => ['uk']],
    'TR' => ['name' => 'Turquie', 'langs' => ['tr', 'ar']],
    'PL' => ['name' => 'Pologne', 'langs' => ['pl']],
    'NL' => ['name' => 'Pays-Bas', 'langs' => ['nl']],
    'SE' => ['name' => 'Suède', 'langs' => ['sv']],
    'NO' => ['name' => 'Norvège', 'langs' => ['no']],
    'FI' => ['name' => 'Finlande', 'langs' => ['fi']],
    'GR' => ['name' => 'Grèce', 'langs' => ['el']],

    // Amérique
    'CA' => ['name' => 'Canada', 'langs' => ['fr', 'en']],
    'US' => ['name' => 'USA', 'langs' => ['en', 'es']],
    'MX' => ['name' => 'Mexique', 'langs' => ['es']],
    'BR' => ['name' => 'Brésil', 'langs' => ['pt']],
    'AR' => ['name' => 'Argentine', 'langs' => ['es']],
    'CL' => ['name' => 'Chili', 'langs' => ['es']],
    'CO' => ['name' => 'Colombie', 'langs' => ['es']],

    // Asie & Océanie
    'CN' => ['name' => 'Chine', 'langs' => ['zh']],
    'JP' => ['name' => 'Japon', 'langs' => ['ja']],
    'KR' => ['name' => 'Corée du Sud', 'langs' => ['ko']],
    'IN' => ['name' => 'Inde', 'langs' => ['hi', 'en']],
    'ID' => ['name' => 'Indonésie', 'langs' => ['id']],
    'MY' => ['name' => 'Malaisie', 'langs' => ['ms']],
    'VN' => ['name' => 'Vietnam', 'langs' => ['vi']],
    'AU' => ['name' => 'Australie', 'langs' => ['en']],
    'NZ' => ['name' => 'Nvelle Zélande', 'langs' => ['en']],
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
    
    // Fallback de langue intelligent
    if (isset($supported_regions[$detected_country])) {
        $detected_lang = $supported_regions[$detected_country]['langs'][0];
    } else {
        $detected_lang = 'fr';
    }
    
    $path = ($request_uri === '/') ? '' : ltrim($request_uri, '/');
    $redirect_url = APP_URL . '/' . strtoupper($detected_country) . '-' . $detected_lang . '/' . $path;
    
    header("Location: $redirect_url");
    exit;
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'ar';
?>
