<?php
/**
 * db.php - Connexion PDO robuste à la base de données (DZHoster)
 */

// Chargement robuste du fichier .env
if (!function_exists('loadEnv')) {
    function loadEnv($path) {
        if (!file_exists($path)) return [];
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $data = [];
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0 || !strpos($line, '=')) continue;
            $parts = explode('=', $line, 2);
            $data[trim($parts[0])] = trim($parts[1], " \t\n\r\0\x0B\"");
        }
        return $data;
    }
}

$env = loadEnv(__DIR__ . '/../.env');

$host = $env['DB_HOST'] ?? 'localhost';
$db   = $env['DB_NAME'] ?? '';
$user = $env['DB_USER'] ?? '';
$pass = $env['DB_PASS'] ?? '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     error_log($e->getMessage());
     // Petit indicatif pour vous aider à débugger (enlevez-le une fois que ça marche)
     die("Erreur de connexion : " . $e->getMessage());
}
