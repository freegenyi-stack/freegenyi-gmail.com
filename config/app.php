<?php
/**
 * app.php - Version corrigée pour éviter l'erreur 500
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Chargement sécurisé du .env
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
define('APP_URL', $env['APP_URL'] ?? 'https://freegeny.com');

/**
 * LOGIQUE DE DÉTECTION INTERNATIONALE
 */
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = $uri_parts[0] ?? '';

// On nettoie le slug (ex: DZ-fr?query -> DZ-fr)
$slug = explode('?', $slug)[0];

if (preg_match('/^([A-Z]{2})-([a-z]{2})$/', $slug, $matches)) {
    $_SESSION['country_code'] = $matches[1];
    $_SESSION['lang'] = $matches[2];
} 
else if (!isset($_SESSION['country_code']) && !str_contains($request_uri, '.php')) {
    $detected_country = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'; 
    $detected_lang = in_array($detected_country, ['FR', 'DZ', 'MA', 'TN', 'BE', 'CH']) ? 'fr' : 'ar';
    
    $redirect_url = rtrim(APP_URL, '/') . '/' . strtoupper($detected_country) . '-' . $detected_lang . '/';
    header("Location: $redirect_url");
    exit;
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'fr';
?>
