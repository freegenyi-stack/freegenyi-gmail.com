<?php
// ============================================================
// FreeGeny — Configuration Globale de l'Application
// ============================================================

// --- Informations de l'application ---
define('APP_NAME', 'FreeGeny');
define('APP_TAGLINE', "L'éducation du programme officiel, accessible partout");
define('APP_URL', 'https://freegeny.com');
define('APP_VERSION', '2.0.0');
define('APP_YEAR', 2026);

// --- Environnement ---
define('DEBUG', getenv('APP_DEBUG') === 'true');
define('APP_ENV', getenv('APP_ENV') ?: 'production');

// --- Chemins absolus ---
define('ROOT_PATH', dirname(__DIR__));
define('CONFIG_PATH', ROOT_PATH . '/config');
define('INCLUDES_PATH', ROOT_PATH . '/includes');
define('PAGES_PATH', ROOT_PATH . '/pages');
define('DATA_PATH', ROOT_PATH . '/data');
define('LANG_PATH', ROOT_PATH . '/lang');
define('ASSETS_PATH', ROOT_PATH . '/assets');

// --- URLs publiques ---
define('ASSETS_URL', APP_URL . '/assets');
define('DATA_URL', APP_URL . '/data');

// --- Session ---
define('SESSION_LIFETIME', 86400 * 30); // 30 jours
define('SESSION_NAME', 'fg_session');
define('CSRF_TOKEN_NAME', 'fg_csrf_token');

// --- Pagination ---
define('ITEMS_PER_PAGE', 20);

// --- Langues supportées ---
define('SUPPORTED_LANGS', ['fr', 'ar', 'en']);
define('DEFAULT_LANG', 'fr');
define('RTL_LANGS', ['ar']);

// --- Sécurité ---
define('BCRYPT_COST', 12);
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_DURATION', 900); // 15 minutes

// --- Initialisation des sessions sécurisées ---
function initSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        $isSecure = APP_ENV === 'production';
        session_set_cookie_params([
            'lifetime' => SESSION_LIFETIME,
            'path'     => '/',
            'domain'   => 'freegeny.com',
            'secure'   => $isSecure,
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        session_name(SESSION_NAME);
        session_start();

        // Régénérer l'ID de session périodiquement (anti-fixation)
        if (!isset($_SESSION['created'])) {
            $_SESSION['created'] = time();
        } elseif (time() - $_SESSION['created'] > 1800) {
            session_regenerate_id(true);
            $_SESSION['created'] = time();
        }
    }
}

// --- Génération / Vérification CSRF ---
function generateCsrfToken(): string {
    if (empty($_SESSION[CSRF_TOKEN_NAME])) {
        $_SESSION[CSRF_TOKEN_NAME] = bin2hex(random_bytes(32));
    }
    return $_SESSION[CSRF_TOKEN_NAME];
}

function verifyCsrfToken(string $token): bool {
    return isset($_SESSION[CSRF_TOKEN_NAME])
        && hash_equals($_SESSION[CSRF_TOKEN_NAME], $token);
}

// --- Détection langue via URL ou session ---
function detectLang(): string {
    $lang = $_GET['lang'] ?? $_SESSION['lang'] ?? DEFAULT_LANG;
    if (!in_array($lang, SUPPORTED_LANGS)) {
        $lang = DEFAULT_LANG;
    }
    $_SESSION['lang'] = $lang;
    return $lang;
}

// --- Chargement des traductions ---
function loadLang(string $lang): array {
    $file = LANG_PATH . '/' . $lang . '.php';
    if (file_exists($file)) {
        return require $file;
    }
    return require LANG_PATH . '/fr.php';
}

// --- Traduction helper ---
function t(string $key, array $replace = []): string {
    global $translations;
    $text = $translations[$key] ?? $key;
    foreach ($replace as $k => $v) {
        $text = str_replace(":$k", $v, $text);
    }
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

// --- Sanitize output ---
function e(mixed $value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

// --- Redirect helper ---
function redirect(string $url, int $code = 302): never {
    header("Location: $url", true, $code);
    exit;
}

// --- JSON Response helper ---
function jsonResponse(array $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// --- Error reporting ---
if (DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
}

// --- Autoload config ---
require_once CONFIG_PATH . '/db.php';
require_once CONFIG_PATH . '/monetization.php';
