<?php
/**
 * app.php - Version améliorée avec sélecteur de pays et langue par défaut Arabe pour DZ
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
define('APP_URL', $env['APP_URL'] ?? 'https://freegeny.com');

// Liste des pays/langues supportés (pour le sélecteur)
$supported_regions = [
    'DZ' => ['name' => 'Algérie', 'langs' => ['ar', 'fr']],
    'FR' => ['name' => 'France', 'langs' => ['fr']],
    'MA' => ['name' => 'Maroc', 'langs' => ['ar', 'fr']],
    'SA' => ['name' => 'Arabe S.', 'langs' => ['ar']],
    'AE' => ['name' => 'Émirats', 'langs' => ['ar']],
];

/**
 * LOGIQUE DE DÉTECTION
 */
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri_parts = explode('/', trim($request_uri, '/'));
$slug = $uri_parts[0] ?? '';
$slug = explode('?', $slug)[0]; // Nettoyage query params

// Détection du format XX-yy (Indifférent à la casse)
if (preg_match('/^([A-Z]{2})-([a-z]{2})$/i', $slug, $matches)) {
    $_SESSION['country_code'] = strtoupper($matches[1]);
    $_SESSION['lang'] = strtolower($matches[2]);
} 
// Si pas de slug dans l'URL, on détecte par IP
else if (!isset($_SESSION['country_code'])) {
    $detected_country = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? 'DZ'; 
    // Choix de la langue par défaut (Arabe pour DZ, MA, SA, etc. Français pour FR)
    $detected_lang = in_array($detected_country, ['DZ', 'MA', 'TN', 'SA', 'AE']) ? 'ar' : 'fr';
    
    $redirect_url = rtrim(APP_URL, '/') . '/' . strtoupper($detected_country) . '-' . $detected_lang . '/';
    header("Location: $redirect_url");
    exit;
}

$country = $_SESSION['country_code'] ?? 'DZ';
$lang = $_SESSION['lang'] ?? 'ar';
?>
