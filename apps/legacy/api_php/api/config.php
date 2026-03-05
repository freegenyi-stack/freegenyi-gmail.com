<?php
/**
 * Configuration de la base de données FreeGeny
 * IMPORTANT : Ne partagez jamais ce fichier !
 */

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'freegen1_freegeny_content');
define('DB_USER', 'freegen1_user');
define('DB_PASS', 'Yousr4568520&');

// Connexion à la base de données
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed',
            'details' => $e->getMessage() // Temporaire pour debug
        ]);
        exit;
    }
}
?>
